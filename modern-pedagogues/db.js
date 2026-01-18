const fs = require('fs');
const path = require('path');
const bcrypt = require('bcrypt');
const sqlite3 = require('sqlite3');
const { Pool } = require('pg');

const isPostgres = Boolean(process.env.DATABASE_URL);
let pool;
let sqliteDb;

const toSqlite = (sql) => sql.replace(/\$\d+/g, '?');

const query = async (sql, params = []) => {
  if (isPostgres) {
    const result = await pool.query(sql, params);
    return result.rows;
  }
  return new Promise((resolve, reject) => {
    const adapted = toSqlite(sql);
    sqliteDb.all(adapted, params, (err, rows) => {
      if (err) return reject(err);
      resolve(rows);
    });
  });
};

const run = async (sql, params = []) => {
  if (isPostgres) {
    return pool.query(sql, params);
  }
  return new Promise((resolve, reject) => {
    const adapted = toSqlite(sql);
    sqliteDb.run(adapted, params, function runCallback(err) {
      if (err) return reject(err);
      resolve({ lastID: this.lastID, changes: this.changes });
    });
  });
};

const initDb = async () => {
  if (isPostgres) {
    pool = new Pool({
      connectionString: process.env.DATABASE_URL,
      ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
    });
    const schema = fs.readFileSync(path.join(__dirname, 'db', 'schema.pg.sql'), 'utf8');
    await pool.query(schema);
  } else {
    const sqlitePath = process.env.SQLITE_PATH || path.join(__dirname, 'data', 'dev.sqlite');
    fs.mkdirSync(path.dirname(sqlitePath), { recursive: true });
    sqliteDb = new sqlite3.Database(sqlitePath);
    const schema = fs.readFileSync(path.join(__dirname, 'db', 'schema.sqlite.sql'), 'utf8');
    await new Promise((resolve, reject) => {
      sqliteDb.exec(schema, (err) => {
        if (err) return reject(err);
        return resolve();
      });
    });
  }

  const shouldSeed =
    (process.env.NODE_ENV !== 'production' && process.env.SEED_ADMIN !== 'false') ||
    (process.env.NODE_ENV === 'production' && process.env.SEED_ADMIN === 'true');

  if (shouldSeed) {
    const existing = await query('SELECT id FROM users WHERE email = $1', ['admin@local.test']);
    if (!existing.length) {
      const hash = await bcrypt.hash('password', 10);
      await run(
        'INSERT INTO users (name, email, password_hash, role) VALUES ($1, $2, $3, $4)',
        ['Admin', 'admin@local.test', hash, 'admin']
      );
    }
  }
};

const getDb = () => ({ query, run, isPostgres });

module.exports = { initDb, getDb };
