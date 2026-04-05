const db = require('../../config/db');

const getAllUsers = () => {
  return db.prepare(`
    SELECT id, name, email, role, is_active, created_at, updated_at
    FROM users
    ORDER BY created_at DESC
  `).all();
};

const getUserById = (id) => {
  const user = db.prepare(`
    SELECT id, name, email, role, is_active, created_at, updated_at
    FROM users WHERE id = ?
  `).get(id);
  if (!user) {
    const err = new Error('User not found.');
    err.statusCode = 404;
    throw err;
  }
  return user;
};

const updateUserRole = (id, role) => {
  const user = db.prepare('SELECT id FROM users WHERE id = ?').get(id);
  if (!user) {
    const err = new Error('User not found.');
    err.statusCode = 404;
    throw err;
  }
  db.prepare(`UPDATE users SET role = ?, updated_at = datetime('now') WHERE id = ?`).run(role, id);
  return getUserById(id);
};

const setUserStatus = (id, is_active) => {
  const user = db.prepare('SELECT id FROM users WHERE id = ?').get(id);
  if (!user) {
    const err = new Error('User not found.');
    err.statusCode = 404;
    throw err;
  }
  db.prepare(`UPDATE users SET is_active = ?, updated_at = datetime('now') WHERE id = ?`).run(is_active ? 1 : 0, id);
  return getUserById(id);
};

const getMe = (id) => getUserById(id);

module.exports = { getAllUsers, getUserById, updateUserRole, setUserStatus, getMe };