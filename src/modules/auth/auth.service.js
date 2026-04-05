const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../../config/db');

const register = (name, email, password, role = 'viewer') => {
  // Check if user exists
  const existing = db.prepare('SELECT id FROM users WHERE email = ?').get(email);
  if (existing) {
    const err = new Error('User with this email already exists.');
    err.statusCode = 409;
    throw err;
  }

  const hashedPassword = bcrypt.hashSync(password, 10);
  const stmt = db.prepare(
    'INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)'
  );
  const result = stmt.run(name, email, hashedPassword, role);

  // Return user without password
  const user = db.prepare('SELECT id, name, email, role, is_active, created_at FROM users WHERE id = ?').get(result.lastInsertRowid);
  return user;
};

const login = (email, password) => {
  const user = db.prepare('SELECT * FROM users WHERE email = ?').get(email);
  if (!user) {
    const err = new Error('Invalid email or password.');
    err.statusCode = 401;
    throw err;
  }

  if (!user.is_active) {
    const err = new Error('Your account is inactive. Please contact admin.');
    err.statusCode = 403;
    throw err;
  }

  const validPassword = bcrypt.compareSync(password, user.password);
  if (!validPassword) {
    const err = new Error('Invalid email or password.');
    err.statusCode = 401;
    throw err;
  }

  const token = jwt.sign(
    { id: user.id, email: user.email, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: '24h' }
  );

  const { password: _, ...safeUser } = user;
  return { token, user: safeUser };
};

module.exports = { register, login };