const db = require('../../config/db');

const ALIVE = 'deleted_at IS NULL';

const buildFilters = ({ type, category, date_from, date_to, user_id } = {}) => {
  const conditions = [ALIVE];
  const params = [];
  if (user_id) {
    conditions.push('user_id = ?');
    params.push(user_id);
  }
  if (type) {
    conditions.push('type = ?');
    params.push(type);
  }
  if (category) {
    conditions.push('category = ?');
    params.push(category);
  }
  if (date_from) {
    conditions.push('date >= ?');
    params.push(date_from);
  }
  if (date_to) {
    conditions.push('date <= ?');
    params.push(date_to);
  }
  return { where: conditions.join(' AND '), params };
};

const getAllRecords = (filters = {}, page = 1, limit = 20) => {
  const offset = (page - 1) * limit;
  const { where, params } = buildFilters(filters);
  
  const rows = db.prepare(`
    SELECT r.*, u.name as user_name
    FROM records r
    JOIN users u ON r.user_id = u.id
    WHERE ${where}
    ORDER BY r.date DESC, r.created_at DESC
    LIMIT ? OFFSET ?
  `).all(...params, limit, offset);
  
  const { total } = db.prepare(`SELECT COUNT(*) as total FROM records r WHERE ${where}`).get(...params);
  
  return {
    records: rows,
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit)
  };
};

const getRecordById = (id) => {
  const record = db.prepare(`
    SELECT r.*, u.name as user_name
    FROM records r
    JOIN users u ON r.user_id = u.id
    WHERE r.id = ? AND ${ALIVE}
  `).get(id);
  if (!record) {
    const err = new Error('Record not found.');
    err.statusCode = 404;
    throw err;
  }
  return record;
};

const createRecord = (user_id, { amount, type, category, date, notes }) => {
  const stmt = db.prepare(`
    INSERT INTO records (user_id, amount, type, category, date, notes)
    VALUES (?, ?, ?, ?, ?, ?)
  `);
  const result = stmt.run(user_id, amount, type, category, date, notes || null);
  return getRecordById(result.lastInsertRowid);
};

const updateRecord = (id, updates) => {
  getRecordById(id); // verify existence
  const fields = Object.keys(updates).map(key => `${key} = ?`).join(', ');
  const values = Object.values(updates);
  db.prepare(`UPDATE records SET ${fields}, updated_at = datetime('now') WHERE id = ? AND ${ALIVE}`).run(...values, id);
  return getRecordById(id);
};

const deleteRecord = (id) => {
  getRecordById(id); // verify existence
  db.prepare(`UPDATE records SET deleted_at = datetime('now') WHERE id = ?`).run(id);
  return { id, deleted: true };
};

module.exports = { getAllRecords, getRecordById, createRecord, updateRecord, deleteRecord };