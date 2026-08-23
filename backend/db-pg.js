const { neon } = require('@neondatabase/serverless');

const sql = neon(process.env.DATABASE_URL);

const PG_SCHEMA = `
CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'student',
  created_at TEXT NOT NULL DEFAULT NOW()
);
CREATE TABLE IF NOT EXISTS courses (
  id SERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT NOT NULL DEFAULT '',
  icon TEXT NOT NULL DEFAULT 'code',
  color TEXT NOT NULL DEFAULT '#04aa6d',
  language TEXT NOT NULL DEFAULT 'en',
  published INTEGER NOT NULL DEFAULT 1,
  price REAL NOT NULL DEFAULT 0,
  order_no INTEGER NOT NULL DEFAULT 0
);
CREATE TABLE IF NOT EXISTS topics (
  id SERIAL PRIMARY KEY,
  course_id INTEGER NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  order_no INTEGER NOT NULL DEFAULT 0
);
CREATE TABLE IF NOT EXISTS lessons (
  id SERIAL PRIMARY KEY,
  topic_id INTEGER NOT NULL REFERENCES topics(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  content TEXT NOT NULL DEFAULT '',
  code TEXT NOT NULL DEFAULT '',
  video_url TEXT NOT NULL DEFAULT '',
  challenge TEXT NOT NULL DEFAULT '',
  order_no INTEGER NOT NULL DEFAULT 0
);
CREATE TABLE IF NOT EXISTS quizzes (
  id SERIAL PRIMARY KEY,
  topic_id INTEGER NOT NULL REFERENCES topics(id) ON DELETE CASCADE,
  title TEXT NOT NULL DEFAULT 'Quiz',
  order_no INTEGER NOT NULL DEFAULT 0
);
CREATE TABLE IF NOT EXISTS questions (
  id SERIAL PRIMARY KEY,
  quiz_id INTEGER NOT NULL REFERENCES quizzes(id) ON DELETE CASCADE,
  question TEXT NOT NULL,
  options TEXT NOT NULL,
  correct_index INTEGER NOT NULL,
  explanation TEXT NOT NULL DEFAULT ''
);
CREATE TABLE IF NOT EXISTS progress (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  lesson_id INTEGER NOT NULL REFERENCES lessons(id) ON DELETE CASCADE,
  completed_at TEXT NOT NULL DEFAULT NOW(),
  UNIQUE(user_id, lesson_id)
);
CREATE TABLE IF NOT EXISTS quiz_attempts (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  quiz_id INTEGER NOT NULL REFERENCES quizzes(id) ON DELETE CASCADE,
  score INTEGER NOT NULL,
  total INTEGER NOT NULL,
  passed INTEGER NOT NULL DEFAULT 0,
  taken_at TEXT NOT NULL DEFAULT NOW()
);
CREATE TABLE IF NOT EXISTS enrollments (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  course_id INTEGER NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
  stripe_payment_id TEXT NOT NULL DEFAULT '',
  price_paid REAL NOT NULL DEFAULT 0,
  created_at TEXT NOT NULL DEFAULT NOW(),
  UNIQUE(user_id, course_id)
);
CREATE INDEX IF NOT EXISTS idx_lessons_topic ON lessons(topic_id);
CREATE INDEX IF NOT EXISTS idx_topics_course ON topics(course_id);
CREATE INDEX IF NOT EXISTS idx_quizzes_topic ON quizzes(topic_id);
CREATE INDEX IF NOT EXISTS idx_questions_quiz ON questions(quiz_id);
CREATE INDEX IF NOT EXISTS idx_progress_user ON progress(user_id);
CREATE INDEX IF NOT EXISTS idx_attempts_user ON quiz_attempts(user_id);
CREATE INDEX IF NOT EXISTS idx_enrollments_user ON enrollments(user_id);
`;

let schemaReady = false;

function convertPlaceholders(query) {
  let i = 0;
  return query.replace(/\?/g, () => `$${++i}`);
}

function convertInsertIgnore(query) {
  return query.replace(/INSERT OR IGNORE INTO/gi, 'INSERT INTO')
    .replace(/INSERT OR REPLACE INTO/gi, 'INSERT INTO');
}

class PgQuery {
  constructor(rawSql) {
    this.rawSql = rawSql;
    this.pgSql = convertInsertIgnore(convertPlaceholders(rawSql));
  }

  async get(...params) {
    const rows = await sql(this.pgSql, params);
    return rows[0];
  }

  async all(...params) {
    const rows = await sql(this.pgSql, params);
    return rows;
  }

  async run(...params) {
    const isInsert = /^\s*INSERT/i.test(this.rawSql);
    const isUpdate = /^\s*UPDATE/i.test(this.rawSql);
    const isDelete = /^\s*DELETE/i.test(this.rawSql);

    if (isInsert) {
      const rows = await sql(this.pgSql + ' RETURNING id', params);
      return { changes: rows.length, lastInsertRowid: rows[0]?.id || 0 };
    }
    const result = await sql(this.pgSql, params);
    return { changes: result.rowCount || 0, lastInsertRowid: 0 };
  }
}

class PgDatabase {
  async ensureSchema() {
    if (schemaReady) return;
    await sql(PG_SCHEMA);
    schemaReady = true;
  }

  prepare(rawSql) {
    return new PgQuery(rawSql);
  }

  async exec(rawSql) {
    const converted = convertInsertIgnore(convertPlaceholders(rawSql));
    if (converted.trim()) await sql(converted);
  }

  pragma() {}
}

const db = new PgDatabase();
module.exports = db;
