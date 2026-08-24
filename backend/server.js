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

const isPg = !!process.env.DATABASE_URL;

app.post('/api/webhooks/stripe', express.raw({ type: 'application/json' }), async (req, res) => {
  if (!stripe) return res.status(400).json({ error: 'Stripe not configured' });
  let event;
  try {
    const sig = req.headers['stripe-signature'];
    event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET || '');
  } catch (e) {
    return res.status(400).send('Webhook error: ' + e.message);
  }
  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;
    const userId = Number(session.metadata.userId);
    const courseId = Number(session.metadata.courseId);
    const q = isPg
      ? 'INSERT INTO enrollments (user_id, course_id, stripe_payment_id, price_paid) VALUES ($1,$2,$3,$4) ON CONFLICT (user_id, course_id) DO NOTHING'
      : 'INSERT OR IGNORE INTO enrollments (user_id, course_id, stripe_payment_id, price_paid) VALUES (?,?,?,?)';
    await db.prepare(q).run(userId, courseId, session.payment_intent || session.id, (session.amount_total || 0) / 100);
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

async function isEnrolled(userId, courseId) {
  if (!userId) return false;
  return !!(await db.prepare('SELECT id FROM enrollments WHERE user_id = ? AND course_id = ?').get(userId, courseId));
}

async function canAccessCourse(userId, course) {
  if (!course) return false;
  if (!course.price || course.price <= 0) return true;
  if (!userId) return false;
  return await isEnrolled(userId, course.id);
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

async function courseForLesson(lesson) {
  return db.prepare(
    'SELECT c.* FROM courses c JOIN topics t ON t.course_id = c.id WHERE t.id = ?'
  ).get(lesson.topic_id);
}

async function courseForQuiz(quiz) {
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

async function courseWithStructure(course) {
  const topics = await db.prepare(
    'SELECT id, title, order_no FROM topics WHERE course_id = ? ORDER BY order_no'
  ).all(course.id);
  for (const topic of topics) {
    topic.lessons = await db.prepare(
      'SELECT id, title, order_no FROM lessons WHERE topic_id = ? ORDER BY order_no'
    ).all(topic.id);
    topic.quizzes = await db.prepare(
      'SELECT id, title, order_no FROM quizzes WHERE topic_id = ? ORDER BY order_no'
    ).all(topic.id);
  }
  return { ...course, topics };
}

const LANGUAGES = ['en', 'ur', 'ru', 'ar', 'hi'];
const LANG_NAMES = { en: 'English', ur: 'Urdu', ru: 'Roman Urdu', ar: 'Arabic', hi: 'Hindi' };

app.get('/api/languages', async (req, res) => {
  const langs = (await db.prepare('SELECT DISTINCT language FROM courses WHERE published = 1').all()).map(r => r.language);
  res.json(langs.map(l => ({ code: l, name: LANG_NAMES[l] || l })));
});

app.get('/api/courses', async (req, res) => {
  const user = optionalUser(req);
  const lang = req.query.lang || null;
  let query = 'SELECT c.*, ' +
    '(SELECT COUNT(*) FROM lessons l JOIN topics t ON l.topic_id = t.id WHERE t.course_id = c.id) AS lesson_count, ' +
    '(SELECT COUNT(*) FROM topics t WHERE t.course_id = c.id) AS topic_count ' +
    'FROM courses c WHERE c.published = 1';
  const params = [];
  if (lang) { query += ' AND c.language = ?'; params.push(lang); }
  query += ' ORDER BY c.order_no';
  const courses = await db.prepare(query).all(...params);
  const owned = user
    ? new Set((await db.prepare('SELECT course_id FROM enrollments WHERE user_id = ?').all(user.id)).map(r => r.course_id))
    : new Set();
  res.json(courses.map(c => ({ ...c, purchased: owned.has(c.id) })));
});

app.get('/api/courses/:slug', async (req, res) => {
  const course = await db.prepare('SELECT * FROM courses WHERE slug = ?').get(req.params.slug);
  if (!course) return res.status(404).json({ error: 'Course not found' });
  const user = optionalUser(req);
  const enrolled = user ? await isEnrolled(user.id, course.id) : false;
  const structure = await courseWithStructure(course);
  res.json({ ...structure, purchased: enrolled, accessible: await canAccessCourse(user && user.id, course) });
});

app.get('/api/lessons/:id', async (req, res) => {
  const lesson = await db.prepare('SELECT * FROM lessons WHERE id = ?').get(req.params.id);
  if (!lesson) return res.status(404).json({ error: 'Lesson not found' });
  const user = optionalUser(req);
  const course = await courseForLesson(lesson);
  if (!(await canAccessCourse(user && user.id, course))) {
    return res.status(lockedError(course).status).json(lockedError(course).json);
  }
  res.json(lesson);
});
// Auto-seed on first run
async function autoSeed() {
  const row = await db.prepare('SELECT COUNT(*) as c FROM courses').get();
  const count = row ? (row.c || row.count || 0) : 0;
  if (count === 0) {
    console.log('Empty database detected, seeding...');
    try { require('./seed'); console.log('Seed complete!'); }
    catch (e) { console.error('Seed failed:', e.message); }
  }
}
autoSeed().catch(e => console.error('AutoSeed error:', e));

// ---------------- CHECKOUT (Stripe) ----------------
app.post('/api/checkout/:courseId', auth, async (req, res) => {
  if (!stripe) return res.status(400).json({ error: 'Payments are not configured on this server yet.' });
  const course = await db.prepare('SELECT * FROM courses WHERE id = ?').get(req.params.courseId);
  if (!course) return res.status(404).json({ error: 'Course not found' });
  if (!course.price || course.price <= 0) return res.status(400).json({ error: 'This course is free' });
  if (await isEnrolled(req.user.id, course.id)) return res.status(400).json({ error: 'You already own this course' });
  const user = await db.prepare('SELECT id, email FROM users WHERE id = ?').get(req.user.id);
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
      success_url: FRONTEND_URL + '/course/' + course.slug + '?purchase=success',
      cancel_url: FRONTEND_URL + '/course/' + course.slug + '?purchase=cancelled'
    });
    res.json({ url: session.url });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Could not create checkout session' });
  }
});

app.get('/api/enrollments', auth, async (req, res) => {
  const rows = await db.prepare(
    'SELECT c.id, c.title, c.slug, c.color, c.icon, e.price_paid, e.created_at ' +
    'FROM enrollments e JOIN courses c ON c.id = e.course_id ' +
    'WHERE e.user_id = ? ORDER BY e.created_at DESC'
  ).all(req.user.id);
  res.json(rows);
});

// ---------------- QUIZZES ----------------
app.get('/api/quizzes/:id', async (req, res) => {
  const quiz = await db.prepare('SELECT * FROM quizzes WHERE id = ?').get(req.params.id);
  if (!quiz) return res.status(404).json({ error: 'Quiz not found' });
  const user = optionalUser(req);
  const course = await courseForQuiz(quiz);
  if (!(await canAccessCourse(user && user.id, course))) {
    return res.status(lockedError(course).status).json(lockedError(course).json);
  }
  const questions = await db.prepare('SELECT id, question, options, correct_index, explanation FROM questions WHERE quiz_id = ?').all(quiz.id);
  res.json({ ...quiz, questions });
});

app.post('/api/quizzes/:id/submit', auth, async (req, res) => {
  const { answers } = req.body || {};
  if (!Array.isArray(answers)) return res.status(400).json({ error: 'answers array required' });
  const quiz = await db.prepare('SELECT * FROM quizzes WHERE id = ?').get(req.params.id);
  if (!quiz) return res.status(404).json({ error: 'Quiz not found' });
  const course = await courseForQuiz(quiz);
  if (!(await canAccessCourse(req.user.id, course))) {
    return res.status(lockedError(course).status).json(lockedError(course).json);
  }
  const questions = await db.prepare('SELECT id, correct_index FROM questions WHERE quiz_id = ?').all(quiz.id);
  let score = 0;
  questions.forEach((qq, i) => {
    if (answers[i] === qq.correct_index) score++;
  });
  const total = questions.length;
  const passed = total > 0 && score / total >= 0.6;
  await db.prepare('INSERT INTO quiz_attempts (user_id, quiz_id, score, total, passed) VALUES (?,?,?,?,?)')
    .run(req.user.id, quiz.id, score, total, passed ? 1 : 0);
  res.json({ score, total, passed });
});

// ---------------- PROGRESS ----------------
app.get('/api/progress', auth, async (req, res) => {
  const lessons = (await db.prepare('SELECT lesson_id FROM progress WHERE user_id = ?').all(req.user.id))
    .map(p => p.lesson_id);
  const attempts = await db.prepare(
    'SELECT q.id, q.title, a.score, a.total, a.passed, a.taken_at ' +
    'FROM quiz_attempts a JOIN quizzes q ON a.quiz_id = q.id ' +
    'WHERE a.user_id = ? ORDER BY a.taken_at DESC'
  ).all(req.user.id);
  res.json({ completedLessons: lessons, attempts });
});

app.post('/api/progress', auth, async (req, res) => {
  const { lessonId, completed } = req.body || {};
  const lesson = await db.prepare('SELECT id, topic_id FROM lessons WHERE id = ?').get(lessonId);
  if (!lesson) return res.status(404).json({ error: 'Lesson not found' });
  const course = await courseForLesson(lesson);
  if (!(await canAccessCourse(req.user.id, course))) {
    return res.status(lockedError(course).status).json(lockedError(course).json);
  }
  if (completed === false) {
    await db.prepare('DELETE FROM progress WHERE user_id = ? AND lesson_id = ?').run(req.user.id, lessonId);
  } else {
    const q = isPg
      ? 'INSERT INTO progress (user_id, lesson_id) VALUES ($1,$2) ON CONFLICT (user_id, lesson_id) DO NOTHING'
      : 'INSERT OR IGNORE INTO progress (user_id, lesson_id) VALUES (?,?)';
    await db.prepare(q).run(req.user.id, lessonId);
  }
  res.json({ ok: true });
});

// ---------------- AUTH ----------------
app.post('/api/auth/register', async (req, res) => {
  const { name, email, password, adminKey } = req.body || {};
  if (!name || !email || !password) return res.status(400).json({ error: 'Name, email and password are required' });
  if (password.length < 6) return res.status(400).json({ error: 'Password must be at least 6 characters' });
  const exists = await db.prepare('SELECT id FROM users WHERE email = ?').get(email.toLowerCase());
  if (exists) return res.status(400).json({ error: 'Email already registered' });
  const role = adminKey === ADMIN_KEY ? 'admin' : 'student';
  const hash = bcrypt.hashSync(password, 10);
  const r = await db.prepare('INSERT INTO users (name, email, password_hash, role) VALUES (?,?,?,?)')
    .run(name, email.toLowerCase(), hash, role);
  const user = await db.prepare('SELECT id, name, email, role FROM users WHERE id = ?').get(r.lastInsertRowid);
  const token = jwt.sign({ id: user.id, name: user.name, email: user.email, role: user.role }, JWT_SECRET, { expiresIn: '30d' });
  res.json({ token, user });
});

app.post('/api/auth/login', async (req, res) => {
  const { email, password } = req.body || {};
  if (!email || !password) return res.status(400).json({ error: 'Email and password are required' });
  const user = await db.prepare('SELECT * FROM users WHERE email = ?').get(email.toLowerCase());
  if (!user || !bcrypt.compareSync(password, user.password_hash)) {
    return res.status(401).json({ error: 'Invalid email or password' });
  }
  const token = jwt.sign({ id: user.id, name: user.name, email: user.email, role: user.role }, JWT_SECRET, { expiresIn: '30d' });
  res.json({ token, user: { id: user.id, name: user.name, email: user.email, role: user.role } });
});

app.get('/api/auth/me', auth, async (req, res) => {
  const user = await db.prepare('SELECT id, name, email, role FROM users WHERE id = ?').get(req.user.id);
  if (!user) return res.status(404).json({ error: 'User not found' });
  res.json(user);
});

// ---------------- ADMIN: CONTENT ----------------
app.post('/api/admin/courses', auth, adminOnly, async (req, res) => {
  const { title, slug, description, icon, color, price, language } = req.body || {};
  if (!title || !slug) return res.status(400).json({ error: 'Title and slug required' });
  const maxRow = await db.prepare('SELECT MAX(order_no) m FROM courses').get();
  const max = (maxRow && maxRow.m) || 0;
  const lang = (language && LANGUAGES.includes(language)) ? language : 'en';
  const r = await db.prepare('INSERT INTO courses (title, slug, description, icon, color, price, language, order_no) VALUES (?,?,?,?,?,?,?,?)')
    .run(title, slug, description || '', icon || 'code', color || '#04aa6d', Number(price) || 0, lang, max + 1);
  res.json(await db.prepare('SELECT * FROM courses WHERE id = ?').get(r.lastInsertRowid));
});

app.put('/api/admin/courses/:id', auth, adminOnly, async (req, res) => {
  const c = await db.prepare('SELECT * FROM courses WHERE id = ?').get(req.params.id);
  if (!c) return res.status(404).json({ error: 'Course not found' });
  const { title, slug, description, icon, color, published, price, language } = req.body || {};
  const lang = (language && LANGUAGES.includes(language)) ? language : c.language;
  await db.prepare('UPDATE courses SET title=?, slug=?, description=?, icon=?, color=?, published=?, price=?, language=? WHERE id=?')
    .run(title ?? c.title, slug ?? c.slug, description ?? c.description, icon ?? c.icon, color ?? c.color,
         published === undefined ? c.published : (published ? 1 : 0),
         price === undefined ? c.price : Number(price) || 0,
         lang, c.id);
  res.json(await db.prepare('SELECT * FROM courses WHERE id = ?').get(c.id));
});

app.delete('/api/admin/courses/:id', auth, adminOnly, async (req, res) => {
  await db.prepare('DELETE FROM courses WHERE id = ?').run(req.params.id);
  res.json({ ok: true });
});

app.post('/api/admin/courses/:id/topics', auth, adminOnly, async (req, res) => {
  const { title } = req.body || {};
  if (!title) return res.status(400).json({ error: 'Title required' });
  const maxRow = await db.prepare('SELECT MAX(order_no) m FROM topics WHERE course_id = ?').get(req.params.id);
  const max = (maxRow && maxRow.m) || 0;
  const r = await db.prepare('INSERT INTO topics (course_id, title, order_no) VALUES (?,?,?)').run(req.params.id, title, max + 1);
  res.json(await db.prepare('SELECT * FROM topics WHERE id = ?').get(r.lastInsertRowid));
});

app.post('/api/admin/topics/:id/lessons', auth, adminOnly, async (req, res) => {
  const { title } = req.body || {};
  if (!title) return res.status(400).json({ error: 'Title required' });
  const maxRow = await db.prepare('SELECT MAX(order_no) m FROM lessons WHERE topic_id = ?').get(req.params.id);
  const max = (maxRow && maxRow.m) || 0;
  const r = await db.prepare('INSERT INTO lessons (topic_id, title, content, order_no) VALUES (?,?,?,?)')
    .run(req.params.id, title, '', max + 1);
  res.json(await db.prepare('SELECT * FROM lessons WHERE id = ?').get(r.lastInsertRowid));
});

app.put('/api/admin/lessons/:id', auth, adminOnly, async (req, res) => {
  const l = await db.prepare('SELECT * FROM lessons WHERE id = ?').get(req.params.id);
  if (!l) return res.status(404).json({ error: 'Lesson not found' });
  const { title, content, code, video_url, challenge } = req.body || {};
  await db.prepare('UPDATE lessons SET title=?, content=?, code=?, video_url=?, challenge=? WHERE id=?')
    .run(title ?? l.title, content ?? l.content, code ?? l.code, video_url ?? l.video_url, challenge ?? l.challenge, l.id);
  res.json(await db.prepare('SELECT * FROM lessons WHERE id = ?').get(l.id));
});

app.delete('/api/admin/lessons/:id', auth, adminOnly, async (req, res) => {
  await db.prepare('DELETE FROM lessons WHERE id = ?').run(req.params.id);
  res.json({ ok: true });
});

app.post('/api/admin/topics/:id/quizzes', auth, adminOnly, async (req, res) => {
  const { title } = req.body || {};
  const maxRow = await db.prepare('SELECT MAX(order_no) m FROM quizzes WHERE topic_id = ?').get(req.params.id);
  const max = (maxRow && maxRow.m) || 0;
  const r = await db.prepare('INSERT INTO quizzes (topic_id, title, order_no) VALUES (?,?,?)')
    .run(req.params.id, title || 'Quiz', max + 1);
  res.json(await db.prepare('SELECT * FROM quizzes WHERE id = ?').get(r.lastInsertRowid));
});

app.post('/api/admin/quizzes/:id/questions', auth, adminOnly, async (req, res) => {
  const { question, options, correct_index, explanation } = req.body || {};
  if (!question || !Array.isArray(options) || correct_index === undefined) {
    return res.status(400).json({ error: 'question, options and correct_index required' });
  }
  const r = await db.prepare('INSERT INTO questions (quiz_id, question, options, correct_index, explanation) VALUES (?,?,?,?,?)')
    .run(req.params.id, question, JSON.stringify(options), correct_index, explanation || '');
  res.json(await db.prepare('SELECT * FROM questions WHERE id = ?').get(r.lastInsertRowid));
});

app.delete('/api/admin/questions/:id', auth, adminOnly, async (req, res) => {
  await db.prepare('DELETE FROM questions WHERE id = ?').run(req.params.id);
  res.json({ ok: true });
});

// ---------------- ADMIN: USERS & EARNINGS ----------------
app.get('/api/admin/users', auth, adminOnly, async (req, res) => {
  res.json(await db.prepare('SELECT id, name, email, role, created_at FROM users ORDER BY id').all());
});

app.get('/api/admin/earnings', auth, adminOnly, async (req, res) => {
  const totals = await db.prepare('SELECT COALESCE(SUM(price_paid),0) AS total, COUNT(*) AS sales FROM enrollments').get();
  const recent = await db.prepare(
    'SELECT e.id, u.name, u.email, c.title, e.price_paid, e.created_at ' +
    'FROM enrollments e JOIN users u ON u.id = e.user_id JOIN courses c ON c.id = e.course_id ' +
    'ORDER BY e.created_at DESC LIMIT 50'
  ).all();
  res.json({ total: totals.total, sales: totals.sales, recent });
});

// ---------------- SEARCH ----------------
app.get('/api/search', async (req, res) => {
  const q = (req.query.q || '').trim();
  if (!q) return res.json({ courses: [], lessons: [] });
  const like = '%' + q + '%';
  const courses = await db.prepare(
    'SELECT id, title, slug, description, icon, color, language FROM courses WHERE published = 1 AND (title LIKE ? OR description LIKE ?) ORDER BY order_no LIMIT 20'
  ).all(like, like);
  const lessons = await db.prepare(
    'SELECT l.id, l.title, c.slug AS course_slug, c.title AS course_title, c.color AS course_color, c.language ' +
    'FROM lessons l JOIN topics t ON t.id = l.topic_id JOIN courses c ON c.id = t.course_id ' +
    'WHERE c.published = 1 AND (l.title LIKE ? OR l.content LIKE ?) ORDER BY c.order_no, t.order_no, l.order_no LIMIT 30'
  ).all(like, like);
  res.json({ courses, lessons });
});

// ---------------- CERTIFICATE ----------------
app.get('/api/certificate/:courseSlug', auth, async (req, res) => {
  const course = await db.prepare('SELECT * FROM courses WHERE slug = ?').get(req.params.courseSlug);
  if (!course) return res.status(404).json({ error: 'Course not found' });
  const topics = await db.prepare('SELECT id FROM topics WHERE course_id = ?').all(course.id);
  const topicIds = topics.map(t => t.id);
  if (topicIds.length === 0) return res.status(400).json({ error: 'Course has no content' });
  const placeholders = topicIds.map((_, i) => '$' + (i + 1)).join(',');
  const ph = isPg ? placeholders : topicIds.map(() => '?').join(',');
  const totalLessons = await db.prepare('SELECT COUNT(*) AS cnt FROM lessons WHERE topic_id IN (' + ph + ')').get(...topicIds).cnt;
  const completedLessons = await db.prepare(
    'SELECT COUNT(*) AS cnt FROM progress p JOIN lessons l ON l.id = p.lesson_id WHERE p.user_id = ? AND l.topic_id IN (' + ph + ')'
  ).get(req.user.id, ...topicIds).cnt;
  const quizzes = await db.prepare('SELECT id FROM quizzes WHERE topic_id IN (' + ph + ')').all(...topicIds);
  const quizIds = quizzes.map(q => q.id);
  let quizzesPassed = 0;
  if (quizIds.length > 0) {
    const qph = isPg ? quizIds.map((_, i) => '$' + (i + 1)).join(',') : quizIds.map(() => '?').join(',');
    const qArgs = isPg ? [req.user.id, ...quizIds] : [req.user.id, ...quizIds];
    quizzesPassed = (await db.prepare(
      'SELECT COUNT(DISTINCT quiz_id) AS cnt FROM quiz_attempts WHERE user_id = $1 AND quiz_id IN (' + qph + ') AND passed = 1'
    ).get(...qArgs)).cnt;
  }
  const allDone = completedLessons >= totalLessons && totalLessons > 0;
  if (!allDone) {
    return res.status(400).json({
      error: 'You have completed ' + completedLessons + '/' + totalLessons + ' lessons. Complete all lessons to earn your certificate.',
      completed: completedLessons, total: totalLessons, quizzes_passed: quizzesPassed
    });
  }
  const certId = 'LH-' + course.slug.toUpperCase() + '-' + req.user.id + '-' + Date.now().toString(36).toUpperCase();
  res.json({
    course_title: course.title, course_slug: course.slug, user_name: req.user.name,
    total_lessons: totalLessons, completed_lessons: completedLessons, quizzes_passed: quizzesPassed,
    date: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }),
    certificate_id: certId
  });
});

// ---------------- PAYMENT (Manual) ----------------
app.post('/api/pay/manual', auth, async (req, res) => {
  const { courseId, method, promoCode } = req.body || {};
  const course = await db.prepare('SELECT * FROM courses WHERE id = ?').get(courseId);
  if (!course) return res.status(404).json({ error: 'Course not found' });
  if (!course.price || course.price <= 0) return res.status(400).json({ error: 'This course is free' });
  if (await isEnrolled(req.user.id, course.id)) return res.status(400).json({ error: 'You already own this course' });
  let discount = 0;
  if (promoCode === 'LEARN20') discount = 0.2;
  if (promoCode === 'WELCOME10') discount = 0.1;
  if (promoCode === 'STUDENT50') discount = 0.5;
  const finalPrice = course.price * (1 - discount);
  await db.prepare('INSERT INTO enrollments (user_id, course_id, stripe_payment_id, price_paid) VALUES (?, ?, ?, ?)')
    .run(req.user.id, course.id, 'manual_' + method + '_' + Date.now(), finalPrice);
  res.json({
    success: true,
    message: 'Payment via ' + method + ' is being processed. You will get access within 24 hours.',
    paymentId: 'PAY-' + Date.now().toString(36).toUpperCase(),
    method, amount: finalPrice, originalPrice: course.price,
    discount: discount > 0 ? (discount * 100) + '%' : null,
    promoCode: promoCode || null
  });
});

// ---------------- PROMO VALIDATION ----------------
app.post('/api/promo/validate', auth, async (req, res) => {
  const { code, courseId } = req.body || {};
  const course = await db.prepare('SELECT * FROM courses WHERE id = ?').get(courseId);
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

// ─── Code Execution API (Own Executor Server) ──────────
const https = require('https');
const EXECUTOR_URL = process.env.EXECUTOR_URL || 'http://localhost:4000';
const SUPPORTED_LANGS = ['javascript', 'python', 'c', 'cpp', 'java', 'go', 'typescript', 'html'];

function postJSON(url, data) {
  return new Promise((resolve, reject) => {
    const body = JSON.stringify(data);
    const parsed = new URL(url);
    const req = https.request({
      hostname: parsed.hostname,
      port: parsed.port || (parsed.protocol === 'https:' ? 443 : 80),
      path: parsed.pathname + (parsed.search || ''),
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Content-Length': Buffer.byteLength(body) },
      timeout: 20000,
    }, res => {
      let chunks = '';
      res.on('data', c => chunks += c);
      res.on('end', () => resolve({ status: res.statusCode, text: chunks }));
    });
    req.on('error', reject);
    req.on('timeout', () => { req.destroy(); reject(new Error('Execution server timeout')); });
    req.write(body);
    req.end();
  });
}

app.post('/api/execute', async (req, res) => {
  const { language, code, stdin } = req.body || {};
  if (!code) return res.status(400).json({ error: 'No code provided' });

  const lang = (language || '').toLowerCase();
  if (lang === 'html') {
    return res.json({ output: '', stdout: '', stderr: '', exitCode: 0, clientSide: true });
  }
  if (!SUPPORTED_LANGS.includes(lang)) {
    return res.status(400).json({ error: `Unsupported: ${language}. Supported: ${SUPPORTED_LANGS.join(', ')}` });
  }

  try {
    const resp = await postJSON(`${EXECUTOR_URL}/execute`, { language: lang, code, stdin: stdin || '' });
    if (resp.status < 200 || resp.status >= 300) {
      return res.status(502).json({ error: 'Executor error', details: resp.text });
    }
    const result = JSON.parse(resp.text);
    res.json(result);
  } catch (err) {
    console.error('Executor connection error:', err.message);
    res.status(503).json({ error: 'Code execution server is offline. Deploy executor service.', details: err.message });
  }
});

// ---------------- REVIEWS ----------------
app.get('/api/reviews/:courseSlug', async (req, res) => {
  const course = await db.prepare('SELECT id FROM courses WHERE slug = ?').get(req.params.courseSlug);
  if (!course) return res.status(404).json({ error: 'Course not found' });
  const reviews = await db.prepare(
    'SELECT r.*, u.name AS user_name FROM reviews r JOIN users u ON u.id = r.user_id WHERE r.course_id = ? ORDER BY r.created_at DESC'
  ).all(course.id);
  const avg = await db.prepare('SELECT AVG(rating) AS avg_rating, COUNT(*) AS total FROM reviews WHERE course_id = ?').get(course.id);
  res.json({ reviews, avgRating: avg.avg_rating ? Math.round(avg.avg_rating * 10) / 10 : 0, totalReviews: avg.total });
});

app.post('/api/reviews/:courseSlug', auth, async (req, res) => {
  const course = await db.prepare('SELECT id FROM courses WHERE slug = ?').get(req.params.courseSlug);
  if (!course) return res.status(404).json({ error: 'Course not found' });
  const { rating, comment } = req.body || {};
  if (!rating || rating < 1 || rating > 5) return res.status(400).json({ error: 'Rating must be 1-5' });
  try {
    await db.prepare('INSERT INTO reviews (user_id, course_id, rating, comment) VALUES (?, ?, ?, ?)')
      .run(req.user.id, course.id, rating, comment || '');
  } catch (e) {
    await db.prepare('UPDATE reviews SET rating = ?, comment = ? WHERE user_id = ? AND course_id = ?')
      .run(rating, comment || '', req.user.id, course.id);
  }
  const review = await db.prepare('SELECT r.*, u.name AS user_name FROM reviews r JOIN users u ON u.id = r.user_id WHERE r.user_id = ? AND r.course_id = ?')
    .get(req.user.id, course.id);
  res.json(review);
});

app.delete('/api/admin/reviews/:id', auth, adminOnly, async (req, res) => {
  await db.prepare('DELETE FROM reviews WHERE id = ?').run(req.params.id);
  res.json({ ok: true });
});

app.get('/api/admin/reviews', auth, adminOnly, async (req, res) => {
  const reviews = await db.prepare(
    'SELECT r.*, u.name AS user_name, u.email AS user_email, c.title AS course_title, c.slug AS course_slug FROM reviews r JOIN users u ON u.id = r.user_id JOIN courses c ON c.id = r.course_id ORDER BY r.created_at DESC'
  ).all();
  res.json(reviews);
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
  app.listen(PORT, () => console.log('Backend running on http://localhost:' + PORT));
}

