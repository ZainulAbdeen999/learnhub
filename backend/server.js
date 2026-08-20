const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const path = require('path');
const fs = require('fs');
const db = require('./db');

const stripe = process.env.STRIPE_SECRET_KEY
  ? require('stripe')(process.env.STRIPE_SECRET_KEY)
  : null;

const app = express();
const PORT = process.env.PORT || 5000;
const JWT_SECRET = process.env.JWT_SECRET || 'learn-hub-dev-secret';
const ADMIN_KEY = process.env.ADMIN_KEY || 'admin-key-123';
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:5173';

// Stripe webhook needs the raw body, register BEFORE the JSON parser
app.post('/api/webhooks/stripe', express.raw({ type: 'application/json' }), (req, res) => {
  if (!stripe) return res.status(400).json({ error: 'Stripe not configured' });
  let event;
  try {
    const sig = req.headers['stripe-signature'];
    event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET || '');
  } catch (e) {
    return res.status(400).send(`Webhook error: ${e.message}`);
  }
  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;
    const userId = Number(session.metadata.userId);
    const courseId = Number(session.metadata.courseId);
    db.prepare('INSERT OR IGNORE INTO enrollments (user_id, course_id, stripe_payment_id, price_paid) VALUES (?,?,?,?)')
      .run(userId, courseId, session.payment_intent || session.id, (session.amount_total || 0) / 100);
    console.log(`Enrollment created for user ${userId} course ${courseId}`);
  }
  res.json({ received: true });
});

app.use(cors());
app.use(express.json({ limit: '2mb' }));

function optionalUser(req) {
  const header = req.headers.authorization || '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : null;
  if (!token) return null;
  try { return jwt.verify(token, JWT_SECRET); } catch { return null; }
}

function isEnrolled(userId, courseId) {
  if (!userId) return false;
  return !!db.prepare('SELECT id FROM enrollments WHERE user_id = ? AND course_id = ?').get(userId, courseId);
}

function canAccessCourse(userId, course) {
  if (!course) return false;
  if (!course.price || course.price <= 0) return true;
  if (!userId) return false;
  return isEnrolled(userId, course.id);
}

function lockedError(course) {
  return {
    status: 403,
    json: {
      error: 'This is a paid course. Purchase it to get full access.',
      locked: true,
      courseSlug: course.slug,
      courseTitle: course.title,
      price: course.price
    }
  };
}

function courseForLesson(lesson) {
  return db.prepare(
    'SELECT c.* FROM courses c JOIN topics t ON t.course_id = c.id WHERE t.id = ?'
  ).get(lesson.topic_id);
}

function courseForQuiz(quiz) {
  return db.prepare(
    'SELECT c.* FROM courses c JOIN topics t ON t.course_id = c.id WHERE t.id = ?'
  ).get(quiz.topic_id);
}

function auth(req, res, next) {
  const header = req.headers.authorization || '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : null;
  if (!token) return res.status(401).json({ error: 'Not authenticated' });
  try {
    req.user = jwt.verify(token, JWT_SECRET);
    next();
  } catch {
    return res.status(401).json({ error: 'Invalid token' });
  }
}

function adminOnly(req, res, next) {
  if (req.user && req.user.role === 'admin') return next();
  return res.status(403).json({ error: 'Admin access required' });
}

function courseWithStructure(course) {
  const topics = db.prepare(
    `SELECT id, title, order_no FROM topics WHERE course_id = ? ORDER BY order_no`
  ).all(course.id);
  for (const topic of topics) {
    topic.lessons = db.prepare(
      `SELECT id, title, order_no FROM lessons WHERE topic_id = ? ORDER BY order_no`
    ).all(topic.id);
    topic.quizzes = db.prepare(
      `SELECT id, title, order_no FROM quizzes WHERE topic_id = ? ORDER BY order_no`
    ).all(topic.id);
  }
  return { ...course, topics };
}

// ---------------- AUTH ----------------
app.post('/api/auth/register', (req, res) => {
  const { name, email, password, adminKey } = req.body || {};
  if (!name || !email || !password) return res.status(400).json({ error: 'Name, email and password are required' });
  if (password.length < 6) return res.status(400).json({ error: 'Password must be at least 6 characters' });
  const exists = db.prepare('SELECT id FROM users WHERE email = ?').get(email.toLowerCase());
  if (exists) return res.status(400).json({ error: 'Email already registered' });
  const role = adminKey === ADMIN_KEY ? 'admin' : 'student';
  const hash = bcrypt.hashSync(password, 10);
  const r = db.prepare('INSERT INTO users (name, email, password_hash, role) VALUES (?,?,?,?)')
    .run(name, email.toLowerCase(), hash, role);
  const user = db.prepare('SELECT id, name, email, role FROM users WHERE id = ?').get(r.lastInsertRowid);
  const token = jwt.sign({ id: user.id, name: user.name, email: user.email, role: user.role }, JWT_SECRET, { expiresIn: '30d' });
  res.json({ token, user });
});

app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body || {};
  if (!email || !password) return res.status(400).json({ error: 'Email and password are required' });
  const user = db.prepare('SELECT * FROM users WHERE email = ?').get(email.toLowerCase());
  if (!user || !bcrypt.compareSync(password, user.password_hash)) {
    return res.status(401).json({ error: 'Invalid email or password' });
  }
  const token = jwt.sign({ id: user.id, name: user.name, email: user.email, role: user.role }, JWT_SECRET, { expiresIn: '30d' });
  res.json({ token, user: { id: user.id, name: user.name, email: user.email, role: user.role } });
});

app.get('/api/auth/me', auth, (req, res) => {
  const user = db.prepare('SELECT id, name, email, role FROM users WHERE id = ?').get(req.user.id);
  if (!user) return res.status(404).json({ error: 'User not found' });
  res.json(user);
});

const LANGUAGES = ['en', 'ur', 'ru', 'ar', 'hi'];
const LANG_NAMES = { en: 'English', ur: 'Urdu', ru: 'Roman Urdu', ar: 'Arabic', hi: 'Hindi' };

// ---------------- COURSES ----------------
app.get('/api/languages', (req, res) => {
  const langs = db.prepare('SELECT DISTINCT language FROM courses WHERE published = 1').all().map(r => r.language);
  res.json(langs.map(l => ({ code: l, name: LANG_NAMES[l] || l })));
});

app.get('/api/courses', (req, res) => {
  const user = optionalUser(req);
  const lang = req.query.lang || null;
  let query = `SELECT c.*,
      (SELECT COUNT(*) FROM lessons l JOIN topics t ON l.topic_id = t.id WHERE t.course_id = c.id) AS lesson_count,
      (SELECT COUNT(*) FROM topics t WHERE t.course_id = c.id) AS topic_count
     FROM courses c WHERE c.published = 1`;
  const params = [];
  if (lang) { query += ' AND c.language = ?'; params.push(lang); }
  query += ' ORDER BY c.order_no';
  const courses = db.prepare(query).all(...params);
  const owned = user
    ? new Set(db.prepare('SELECT course_id FROM enrollments WHERE user_id = ?').all(user.id).map(r => r.course_id))
    : new Set();
  res.json(courses.map(c => ({ ...c, purchased: owned.has(c.id) })));
});

app.get('/api/courses/:slug', (req, res) => {
  const course = db.prepare('SELECT * FROM courses WHERE slug = ?').get(req.params.slug);
  if (!course) return res.status(404).json({ error: 'Course not found' });
  const user = optionalUser(req);
  const purchased = isEnrolled(user && user.id, course.id);
  res.json({ ...courseWithStructure(course), purchased, accessible: canAccessCourse(user && user.id, course) });
});

app.get('/api/lessons/:id', (req, res) => {
  const lesson = db.prepare('SELECT * FROM lessons WHERE id = ?').get(req.params.id);
  if (!lesson) return res.status(404).json({ error: 'Lesson not found' });
  const user = optionalUser(req);
  const course = courseForLesson(lesson);
  if (!canAccessCourse(user && user.id, course)) {
    return res.status(lockedError(course).status).json(lockedError(course).json);
  }
  res.json(lesson);
});

// Auto-seed on first run
const courseCount = db.prepare('SELECT COUNT(*) as c FROM courses').get().c;
if (courseCount === 0) {
  console.log('Empty database detected, seeding...');
  try { require('./seed'); console.log('Seed complete!'); }
  catch (e) { console.error('Seed failed:', e.message); }
}

// ---------------- CHECKOUT (Stripe) ----------------
app.post('/api/checkout/:courseId', auth, async (req, res) => {
  if (!stripe) return res.status(400).json({ error: 'Payments are not configured on this server yet.' });
  const course = db.prepare('SELECT * FROM courses WHERE id = ?').get(req.params.courseId);
  if (!course) return res.status(404).json({ error: 'Course not found' });
  if (!course.price || course.price <= 0) return res.status(400).json({ error: 'This course is free' });
  if (isEnrolled(req.user.id, course.id)) return res.status(400).json({ error: 'You already own this course' });
  const user = db.prepare('SELECT id, email FROM users WHERE id = ?').get(req.user.id);
  try {
    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      line_items: [{
        price_data: {
          currency: 'usd',
          product_data: { name: course.title, description: 'Lifetime access to all lessons & quizzes' },
          unit_amount: Math.round(course.price * 100)
        },
        quantity: 1
      }],
      metadata: { userId: String(user.id), courseId: String(course.id) },
      customer_email: user.email,
      success_url: `${FRONTEND_URL}/course/${course.slug}?purchase=success`,
      cancel_url: `${FRONTEND_URL}/course/${course.slug}?purchase=cancelled`
    });
    res.json({ url: session.url });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Could not create checkout session' });
  }
});

app.get('/api/enrollments', auth, (req, res) => {
  const rows = db.prepare(
    `SELECT c.id, c.title, c.slug, c.color, c.icon, e.price_paid, e.created_at
     FROM enrollments e JOIN courses c ON c.id = e.course_id
     WHERE e.user_id = ? ORDER BY e.created_at DESC`
  ).all(req.user.id);
  res.json(rows);
});

// ---------------- QUIZZES ----------------
app.get('/api/quizzes/:id', (req, res) => {
  const quiz = db.prepare('SELECT * FROM quizzes WHERE id = ?').get(req.params.id);
  if (!quiz) return res.status(404).json({ error: 'Quiz not found' });
  const user = optionalUser(req);
  const course = courseForQuiz(quiz);
  if (!canAccessCourse(user && user.id, course)) {
    return res.status(lockedError(course).status).json(lockedError(course).json);
  }
  const questions = db.prepare('SELECT id, question, options, correct_index, explanation FROM questions WHERE quiz_id = ?').all(quiz.id);
  res.json({ ...quiz, questions });
});

app.post('/api/quizzes/:id/submit', auth, (req, res) => {
  const { answers } = req.body || {};
  if (!Array.isArray(answers)) return res.status(400).json({ error: 'answers array required' });
  const quiz = db.prepare('SELECT * FROM quizzes WHERE id = ?').get(req.params.id);
  if (!quiz) return res.status(404).json({ error: 'Quiz not found' });
  const course = courseForQuiz(quiz);
  if (!canAccessCourse(req.user.id, course)) {
    return res.status(lockedError(course).status).json(lockedError(course).json);
  }
  const questions = db.prepare('SELECT id, correct_index FROM questions WHERE quiz_id = ?').all(quiz.id);
  let score = 0;
  questions.forEach((qq, i) => {
    if (answers[i] === qq.correct_index) score++;
  });
  const total = questions.length;
  const passed = total > 0 && score / total >= 0.6;
  db.prepare('INSERT INTO quiz_attempts (user_id, quiz_id, score, total, passed) VALUES (?,?,?,?,?)')
    .run(req.user.id, quiz.id, score, total, passed ? 1 : 0);
  res.json({ score, total, passed });
});

// ---------------- PROGRESS ----------------
app.get('/api/progress', auth, (req, res) => {
  const lessons = db.prepare('SELECT lesson_id FROM progress WHERE user_id = ?').all(req.user.id)
    .map(p => p.lesson_id);
  const attempts = db.prepare(
    `SELECT q.id, q.title, a.score, a.total, a.passed, a.taken_at
     FROM quiz_attempts a JOIN quizzes q ON a.quiz_id = q.id
     WHERE a.user_id = ? ORDER BY a.taken_at DESC`
  ).all(req.user.id);
  res.json({ completedLessons: lessons, attempts });
});

app.post('/api/progress', auth, (req, res) => {
  const { lessonId, completed } = req.body || {};
  const lesson = db.prepare('SELECT id, topic_id FROM lessons WHERE id = ?').get(lessonId);
  if (!lesson) return res.status(404).json({ error: 'Lesson not found' });
  const course = courseForLesson(lesson);
  if (!canAccessCourse(req.user.id, course)) {
    return res.status(lockedError(course).status).json(lockedError(course).json);
  }
  if (completed === false) {
    db.prepare('DELETE FROM progress WHERE user_id = ? AND lesson_id = ?').run(req.user.id, lessonId);
  } else {
    db.prepare('INSERT OR IGNORE INTO progress (user_id, lesson_id) VALUES (?,?)').run(req.user.id, lessonId);
  }
  res.json({ ok: true });
});

app.get('/api/progress', auth, (req, res) => {
  const lessons = db.prepare('SELECT lesson_id FROM progress WHERE user_id = ?').all(req.user.id)
    .map(p => p.lesson_id);
  const attempts = db.prepare(
    `SELECT q.id, q.title, a.score, a.total, a.passed, a.taken_at
     FROM quiz_attempts a JOIN quizzes q ON a.quiz_id = q.id
     WHERE a.user_id = ? ORDER BY a.taken_at DESC`
  ).all(req.user.id);
  res.json({ completedLessons: lessons, attempts });
});

// ---------------- ADMIN: CONTENT ----------------
app.post('/api/admin/courses', auth, adminOnly, (req, res) => {
  const { title, slug, description, icon, color, price, language } = req.body || {};
  if (!title || !slug) return res.status(400).json({ error: 'Title and slug required' });
  const max = db.prepare('SELECT MAX(order_no) m FROM courses').get().m || 0;
  const lang = (language && LANGUAGES.includes(language)) ? language : 'en';
  const r = db.prepare('INSERT INTO courses (title, slug, description, icon, color, price, language, order_no) VALUES (?,?,?,?,?,?,?,?)')
    .run(title, slug, description || '', icon || 'code', color || '#04aa6d', Number(price) || 0, lang, max + 1);
  res.json(db.prepare('SELECT * FROM courses WHERE id = ?').get(r.lastInsertRowid));
});

app.put('/api/admin/courses/:id', auth, adminOnly, (req, res) => {
  const c = db.prepare('SELECT * FROM courses WHERE id = ?').get(req.params.id);
  if (!c) return res.status(404).json({ error: 'Course not found' });
  const { title, slug, description, icon, color, published, price, language } = req.body || {};
  const lang = (language && LANGUAGES.includes(language)) ? language : c.language;
  db.prepare('UPDATE courses SET title=?, slug=?, description=?, icon=?, color=?, published=?, price=?, language=? WHERE id=?')
    .run(title ?? c.title, slug ?? c.slug, description ?? c.description, icon ?? c.icon, color ?? c.color,
         published === undefined ? c.published : (published ? 1 : 0),
         price === undefined ? c.price : Number(price) || 0,
         lang, c.id);
  res.json(db.prepare('SELECT * FROM courses WHERE id = ?').get(c.id));
});

app.delete('/api/admin/courses/:id', auth, adminOnly, (req, res) => {
  db.prepare('DELETE FROM courses WHERE id = ?').run(req.params.id);
  res.json({ ok: true });
});

app.post('/api/admin/courses/:id/topics', auth, adminOnly, (req, res) => {
  const { title } = req.body || {};
  if (!title) return res.status(400).json({ error: 'Title required' });
  const max = db.prepare('SELECT MAX(order_no) m FROM topics WHERE course_id = ?').get(req.params.id).m || 0;
  const r = db.prepare('INSERT INTO topics (course_id, title, order_no) VALUES (?,?,?)').run(req.params.id, title, max + 1);
  res.json(db.prepare('SELECT * FROM topics WHERE id = ?').get(r.lastInsertRowid));
});

app.post('/api/admin/topics/:id/lessons', auth, adminOnly, (req, res) => {
  const { title } = req.body || {};
  if (!title) return res.status(400).json({ error: 'Title required' });
  const max = db.prepare('SELECT MAX(order_no) m FROM lessons WHERE topic_id = ?').get(req.params.id).m || 0;
  const r = db.prepare('INSERT INTO lessons (topic_id, title, content, order_no) VALUES (?,?,?,?)')
    .run(req.params.id, title, '', max + 1);
  res.json(db.prepare('SELECT * FROM lessons WHERE id = ?').get(r.lastInsertRowid));
});

app.put('/api/admin/lessons/:id', auth, adminOnly, (req, res) => {
  const l = db.prepare('SELECT * FROM lessons WHERE id = ?').get(req.params.id);
  if (!l) return res.status(404).json({ error: 'Lesson not found' });
  const { title, content, code, video_url, challenge } = req.body || {};
  db.prepare('UPDATE lessons SET title=?, content=?, code=?, video_url=?, challenge=? WHERE id=?')
    .run(title ?? l.title, content ?? l.content, code ?? l.code, video_url ?? l.video_url, challenge ?? l.challenge, l.id);
  res.json(db.prepare('SELECT * FROM lessons WHERE id = ?').get(l.id));
});

app.delete('/api/admin/lessons/:id', auth, adminOnly, (req, res) => {
  db.prepare('DELETE FROM lessons WHERE id = ?').run(req.params.id);
  res.json({ ok: true });
});

app.post('/api/admin/topics/:id/quizzes', auth, adminOnly, (req, res) => {
  const { title } = req.body || {};
  const max = db.prepare('SELECT MAX(order_no) m FROM quizzes WHERE topic_id = ?').get(req.params.id).m || 0;
  const r = db.prepare('INSERT INTO quizzes (topic_id, title, order_no) VALUES (?,?,?)')
    .run(req.params.id, title || 'Quiz', max + 1);
  res.json(db.prepare('SELECT * FROM quizzes WHERE id = ?').get(r.lastInsertRowid));
});

app.post('/api/admin/quizzes/:id/questions', auth, adminOnly, (req, res) => {
  const { question, options, correct_index, explanation } = req.body || {};
  if (!question || !Array.isArray(options) || correct_index === undefined) {
    return res.status(400).json({ error: 'question, options and correct_index required' });
  }
  const r = db.prepare('INSERT INTO questions (quiz_id, question, options, correct_index, explanation) VALUES (?,?,?,?,?)')
    .run(req.params.id, question, JSON.stringify(options), correct_index, explanation || '');
  res.json(db.prepare('SELECT * FROM questions WHERE id = ?').get(r.lastInsertRowid));
});

app.delete('/api/admin/questions/:id', auth, adminOnly, (req, res) => {
  db.prepare('DELETE FROM questions WHERE id = ?').run(req.params.id);
  res.json({ ok: true });
});

// ---------------- ADMIN: USERS & EARNINGS ----------------
app.get('/api/admin/users', auth, adminOnly, (req, res) => {
  res.json(db.prepare('SELECT id, name, email, role, created_at FROM users ORDER BY id').all());
});

app.get('/api/admin/earnings', auth, adminOnly, (req, res) => {
  const totals = db.prepare('SELECT COALESCE(SUM(price_paid),0) AS total, COUNT(*) AS sales FROM enrollments').get();
  const recent = db.prepare(
    `SELECT e.id, u.name, u.email, c.title, e.price_paid, e.created_at
     FROM enrollments e JOIN users u ON u.id = e.user_id JOIN courses c ON c.id = e.course_id
     ORDER BY e.created_at DESC LIMIT 50`
  ).all();
  res.json({ total: totals.total, sales: totals.sales, recent });
});

// ---------------- SEARCH ----------------
app.get('/api/search', (req, res) => {
  const q = (req.query.q || '').trim();
  if (!q) return res.json({ courses: [], lessons: [] });
  const like = `%${q}%`;
  const courses = db.prepare(
    `SELECT id, title, slug, description, icon, color, language FROM courses WHERE published = 1 AND (title LIKE ? OR description LIKE ?) ORDER BY order_no LIMIT 20`
  ).all(like, like);
  const lessons = db.prepare(
    `SELECT l.id, l.title, c.slug AS course_slug, c.title AS course_title, c.color AS course_color, c.language
     FROM lessons l
     JOIN topics t ON t.id = l.topic_id
     JOIN courses c ON c.id = t.course_id
     WHERE c.published = 1 AND (l.title LIKE ? OR l.content LIKE ?)
     ORDER BY c.order_no, t.order_no, l.order_no LIMIT 30`
  ).all(like, like);
  res.json({ courses, lessons });
});

// ---------------- CERTIFICATE ----------------
app.get('/api/certificate/:courseSlug', auth, (req, res) => {
  const course = db.prepare('SELECT * FROM courses WHERE slug = ?').get(req.params.courseSlug);
  if (!course) return res.status(404).json({ error: 'Course not found' });
  const topics = db.prepare('SELECT id FROM topics WHERE course_id = ?').all(course.id);
  const topicIds = topics.map(t => t.id);
  if (topicIds.length === 0) return res.status(400).json({ error: 'Course has no content' });
  const placeholders = topicIds.map(() => '?').join(',');
  const totalLessons = db.prepare(`SELECT COUNT(*) AS cnt FROM lessons WHERE topic_id IN (${placeholders})`).get(...topicIds).cnt;
  const completedLessons = db.prepare(
    `SELECT COUNT(*) AS cnt FROM progress p JOIN lessons l ON l.id = p.lesson_id WHERE p.user_id = ? AND l.topic_id IN (${placeholders})`
  ).get(req.user.id, ...topicIds).cnt;
  const quizzes = db.prepare(`SELECT id FROM quizzes WHERE topic_id IN (${placeholders})`).all(...topicIds);
  const quizIds = quizzes.map(q => q.id);
  let quizzesPassed = 0;
  if (quizIds.length > 0) {
    const qph = quizIds.map(() => '?').join(',');
    quizzesPassed = db.prepare(
      `SELECT COUNT(DISTINCT quiz_id) AS cnt FROM quiz_attempts WHERE user_id = ? AND quiz_id IN (${qph}) AND passed = 1`
    ).get(req.user.id, ...quizIds).cnt;
  }
  const allDone = completedLessons >= totalLessons && totalLessons > 0;
  if (!allDone) {
    return res.status(400).json({
      error: `You have completed ${completedLessons}/${totalLessons} lessons. Complete all lessons to earn your certificate.`,
      completed: completedLessons, total: totalLessons, quizzes_passed: quizzesPassed
    });
  }
  const certId = `LH-${course.slug.toUpperCase()}-${req.user.id}-${Date.now().toString(36).toUpperCase()}`;
  res.json({
    course_title: course.title,
    course_slug: course.slug,
    user_name: req.user.name,
    total_lessons: totalLessons,
    completed_lessons: completedLessons,
    quizzes_passed: quizzesPassed,
    date: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }),
    certificate_id: certId
  });
});

// ---------------- PAYMENT (Manual) ----------------
app.post('/api/pay/manual', auth, (req, res) => {
  const { courseId, method, promoCode } = req.body || {};
  const course = db.prepare('SELECT * FROM courses WHERE id = ?').get(courseId);
  if (!course) return res.status(404).json({ error: 'Course not found' });
  if (!course.price || course.price <= 0) return res.status(400).json({ error: 'This course is free' });
  if (isEnrolled(req.user.id, course.id)) return res.status(400).json({ error: 'You already own this course' });

  let discount = 0;
  if (promoCode === 'LEARN20') discount = 0.2;
  if (promoCode === 'WELCOME10') discount = 0.1;
  if (promoCode === 'STUDENT50') discount = 0.5;
  const finalPrice = course.price * (1 - discount);

  db.prepare('INSERT INTO enrollments (user_id, course_id, stripe_payment_id, price_paid) VALUES (?, ?, ?, ?)')
    .run(req.user.id, course.id, `manual_${method}_${Date.now()}`, finalPrice);

  res.json({
    success: true,
    message: `Payment via ${method} is being processed. You will get access within 24 hours.`,
    paymentId: `PAY-${Date.now().toString(36).toUpperCase()}`,
    method,
    amount: finalPrice,
    originalPrice: course.price,
    discount: discount > 0 ? `${discount * 100}%` : null,
    promoCode: promoCode || null
  });
});

// ---------------- PROMO VALIDATION ----------------
app.post('/api/promo/validate', auth, (req, res) => {
  const { code, courseId } = req.body || {};
  const course = db.prepare('SELECT * FROM courses WHERE id = ?').get(courseId);
  if (!course) return res.status(404).json({ error: 'Course not found' });

  const promos = {
    'LEARN20': { discount: 0.2, description: '20% off' },
    'WELCOME10': { discount: 0.1, description: '10% off' },
    'STUDENT50': { discount: 0.5, description: '50% off - Student Discount' }
  };

  const promo = promos[(code || '').toUpperCase()];
  if (!promo) return res.status(400).json({ error: 'Invalid promo code' });

  const finalPrice = course.price * (1 - promo.discount);
  res.json({ valid: true, discount: promo.discount, description: promo.description, finalPrice, originalPrice: course.price });
});

// Serve built frontend in production
const distPath = path.join(__dirname, '..', 'frontend', 'dist');
if (fs.existsSync(distPath)) {
  app.use(express.static(distPath));
  app.use((req, res, next) => {
    if (req.path.startsWith('/api')) return next();
    res.sendFile(path.join(distPath, 'index.html'));
  });
}

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: 'Server error' });
});

module.exports = app;

if (!process.env.VERCEL) {
  app.listen(PORT, () => console.log(`Backend running on http://localhost:${PORT}`));
}
