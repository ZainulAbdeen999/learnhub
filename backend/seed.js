const db = require('./db');
const bcrypt = require('bcryptjs');
const { seedAllCourses } = require('./seedData');

function insertCourse(title, slug, description, icon, color, order_no, price = 0, language = 'en') {
  const r = db.prepare('INSERT INTO courses (title, slug, description, icon, color, order_no, price, language, published) VALUES (?,?,?,?,?,?,?,?,1)').run(title, slug, description, icon, color, order_no, price, language);
  return r.lastInsertRowid;
}
function insertTopic(courseId, title, order_no) {
  const r = db.prepare('INSERT INTO topics (course_id, title, order_no) VALUES (?,?,?)').run(courseId, title, order_no);
  return r.lastInsertRowid;
}
function insertLesson(topicId, title, content, code, video_url, order_no, challenge) {
  db.prepare('INSERT INTO lessons (topic_id, title, content, code, video_url, order_no, challenge) VALUES (?,?,?,?,?,?,?)')
    .run(topicId, title, content, code, video_url, order_no, challenge || '');
}
function insertQuiz(topicId, title, order_no) {
  const r = db.prepare('INSERT INTO quizzes (topic_id, title, order_no) VALUES (?,?,?)').run(topicId, title, order_no);
  return r.lastInsertRowid;
}
function insertQuestion(quizId, question, options, correct_index, explanation) {
  db.prepare('INSERT INTO questions (quiz_id, question, options, correct_index, explanation) VALUES (?,?,?,?,?)')
    .run(quizId, question, JSON.stringify(options), correct_index, explanation);
}

db.prepare('DELETE FROM questions').run();
db.prepare('DELETE FROM quiz_attempts').run();
db.prepare('DELETE FROM progress').run();
db.prepare('DELETE FROM quizzes').run();
db.prepare('DELETE FROM lessons').run();
db.prepare('DELETE FROM topics').run();
db.prepare('DELETE FROM courses').run();
db.prepare('DELETE FROM users').run();
db.exec("DELETE FROM sqlite_sequence");

const adminHash = bcrypt.hashSync('admin123', 10);
const studentHash = bcrypt.hashSync('student123', 10);
db.prepare('INSERT INTO users (name, email, password_hash, role) VALUES (?,?,?,?)').run('Admin', 'admin@learnhub.com', adminHash, 'admin');
db.prepare('INSERT INTO users (name, email, password_hash, role) VALUES (?,?,?,?)').run('Student', 'student@learnhub.com', studentHash, 'student');

seedAllCourses(db);

const htmlVid = 'https://www.youtube.com/embed/UB1O30fR-EE';
const cssVid = 'https://www.youtube.com/embed/yfoY53QXEnI';

// ---------------- URDU COURSES ----------------
const urHTML = insertCourse('HTML Seekhein', 'html-ur', 'HTML web pages banane ki zaban hai. Agar aap web development shuru kar rahe hain to pehle HTML seekhein.', 'code', '#04aa6d', 100, 0, 'ur');
let ut = insertTopic(urHTML, 'HTML ki Buniyadi Baatein', 1);
insertLesson(ut, 'HTML kya hai?',
  `## HTML kya hai?
**HTML** ka matlab hai **Hyper Text Markup Language**. Ye Web pages banane ki standard markup language hai.

- HTML Web pages ki **structure** batata hai
- HTML elements browser ko dikhata hai ke content kaise dikhana hai
- HTML elements ko **tags** kehte hain`,
  `<!DOCTYPE html>
<html>
<head>
  <title>Meri Pehli Page</title>
</head>
<body>
  <h1>Assalam o Alaikum!</h1>
  <p>Ye mera pehla HTML page hai.</p>
</body>
</html>`,
  htmlVid, 1);

insertLesson(ut, 'HTML Headings',
  `## Headings (Surwahi)
HTML mein headings ke liye <code>&lt;h1&gt;</code> se <code>&lt;h6&gt;</code> tak istemal hota hai.

- <code>&lt;h1&gt;</code> sabse badi heading hai
- <code>&lt;h6&gt;</code> sabse chhoti heading hai
- Search engines headings ko samajhte hain`,
  `<h1>Ye Badi Heading Hai</h1>
<h2>Ye Chhoti Heading Hai</h2>
<h3>Aur Chhoti</h3>`,
  htmlVid, 2);

let q = insertQuiz(ut, 'HTML Buniyadi Quiz', 1);
insertQuestion(q, 'HTML ka full form kya hai?', ['Home Tool Markup Language', 'Hyper Text Markup Language', 'Hyperlinks Text More Language', 'Hyper Text More Language'], 1, 'HTML = Hyper Text Markup Language');
insertQuestion(q, 'Sabse badi heading kaunsi hai?', ['<h6>', '<h1>', '<head>', '<heading>'], 1, '<h1> sabse badi heading hai.');

// ---------------- ROMAN URDU COURSES ----------------
const ruHTML = insertCourse('HTML Sikhein', 'html-ru', 'HTML web page banane ka zariya hai. Agar tum coding start karna chahte ho to HTML se shuru karo.', 'code', '#04aa6d', 101, 0, 'ru');
let rt = insertTopic(ruHTML, 'HTML Basics', 1);
insertLesson(rt, 'HTML Introduction',
  `## HTML kya hai?
**HTML** yani **Hyper Text Markup Language**. Ye sab websites banane ke liye use hoti hai.

- Ye website ka **structure** banata hai
- Browser ko batata hai content kaise dikhana hai
- Tags ka naam hai HTML elements ko`,
  `<!DOCTYPE html>
<html>
<body>
  <h1>Assalam o Alaikum Duniya!</h1>
  <p>Mera pehla page hai ye.</p>
</body>
</html>`,
  htmlVid, 1);

insertLesson(rt, 'HTML Links aur Images',
  `## Links
<code>&lt;a&gt;</code> tag se link banate hain. Isme <code>href</code> attribute hota hai jisme URL dalta hai.

## Images
<code>&lt;img&gt;</code> tag se tasweer lagate hain. <code>src</code> me path aur <code>alt</code> me text dalta hai agar image na lage.`,
  `<a href="https://google.com">Google pe jao</a>
<img src="meri-tasweer.jpg" alt="Meri Tasweer">`,
  htmlVid, 2);

q = insertQuiz(rt, 'HTML Quiz', 1);
insertQuestion(q, 'Link banane ka tag kaunsa hai?', ['<link>', '<a>', '<href>', '<url>'], 1, '<a> tag se link banate hain.');
insertQuestion(q, 'Image lagane ka tag?', ['<img>', '<picture>', '<image>', '<src>'], 0, '<img> tag se tasweer lagate hain.');

const ruCSS = insertCourse('CSS Sikhein', 'css-ru', 'CSS se websites khubsurat banti hain. HTML ke baad CSS zaroor seekho.', 'palette', '#ff9800', 102, 0, 'ru');
rt = insertTopic(ruCSS, 'CSS Basics', 1);
insertLesson(rt, 'CSS kya hai?',
  `## CSS kya hai?
**CSS** yani **Cascading Style Sheets**. Ye HTML ko style karta hai — rang, size, jagah wagaira.

- CSS se layout control hota hai
- Ek CSS file se bohot saari pages style ho sakti hain`,
  `body {
  background-color: lightblue;
}

h1 {
  color: darkblue;
  text-align: center;
}`,
  cssVid, 1);

q = insertQuiz(rt, 'CSS Quiz', 1);
insertQuestion(q, 'CSS ka full form kya hai?', ['Colorful Style Sheets', 'Creative Style Sheets', 'Cascading Style Sheets', 'Computer Style Sheets'], 2, 'CSS = Cascading Style Sheets');

console.log('Seed complete:');
console.log('  Admin   -> admin@learnhub.com / admin123');
console.log('  Student -> student@learnhub.com / student123');
console.log('  Languages: English, Urdu, Roman Urdu');
