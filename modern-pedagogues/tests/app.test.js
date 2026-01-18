const request = require('supertest');
const { initDb, getDb } = require('../db');
const { app, registerRoutes } = require('../server');

beforeAll(async () => {
  process.env.NODE_ENV = 'test';
  process.env.SEED_ADMIN = 'false';
  process.env.SQLITE_PATH = ':memory:';
  await initDb();
  const db = getDb();
  registerRoutes(db);
});

test('GET /marketplace returns marketplace page', async () => {
  const res = await request(app).get('/marketplace');
  expect(res.statusCode).toBe(200);
  expect(res.text).toContain('Marketplace');
});

test('GET /marketplace/upload requires creator', async () => {
  const res = await request(app).get('/marketplace/upload');
  expect(res.statusCode).toBe(403);
});

test('SQLite schema initializes users table', async () => {
  const db = getDb();
  const rows = await db.query("SELECT name FROM sqlite_master WHERE type='table' AND name='users'");
  expect(rows.length).toBe(1);
});
