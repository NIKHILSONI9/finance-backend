const db = require('../../config/db');

const ALIVE = "deleted_at IS NULL";

const getSummary = () => {
  const row = db.prepare(`
    SELECT
      COALESCE(SUM(CASE WHEN type = 'income' THEN amount ELSE 0 END), 0) AS total_income,
      COALESCE(SUM(CASE WHEN type = 'expense' THEN amount ELSE 0 END), 0) AS total_expenses,
      COUNT(*) AS total_records
    FROM records
    WHERE ${ALIVE}
  `).get();
  return {
    total_income: Math.round(row.total_income * 100) / 100,
    total_expenses: Math.round(row.total_expenses * 100) / 100,
    net_balance: Math.round((row.total_income - row.total_expenses) * 100) / 100,
    total_records: row.total_records
  };
};

const getCategoryBreakdown = () => {
  return db.prepare(`
    SELECT category, type, COUNT(*) AS count, ROUND(SUM(amount), 2) AS total
    FROM records
    WHERE ${ALIVE}
    GROUP BY category, type
    ORDER BY total DESC
  `).all();
};

const getMonthlyTrends = (months = 12) => {
  return db.prepare(`
    SELECT
      strftime('%Y-%m', date) AS month,
      ROUND(SUM(CASE WHEN type = 'income' THEN amount ELSE 0 END), 2) AS income,
      ROUND(SUM(CASE WHEN type = 'expense' THEN amount ELSE 0 END), 2) AS expenses,
      ROUND(SUM(CASE WHEN type = 'income' THEN amount ELSE -amount END), 2) AS net
    FROM records
    WHERE ${ALIVE} AND date >= date('now', ? || ' months')
    GROUP BY month
    ORDER BY month ASC
  `).all(`-${months}`);
};

const getRecentActivity = (limit = 10) => {
  return db.prepare(`
    SELECT r.id, r.amount, r.type, r.category, r.date, r.notes, u.name AS created_by
    FROM records r
    JOIN users u ON r.user_id = u.id
    WHERE r.${ALIVE}
    ORDER BY r.created_at DESC
    LIMIT ?
  `).all(limit);
};

const getTopCategories = (type = 'expense', limit = 5) => {
  return db.prepare(`
    SELECT category, COUNT(*) AS count, ROUND(SUM(amount), 2) AS total
    FROM records
    WHERE ${ALIVE} AND type = ?
    GROUP BY category
    ORDER BY total DESC
    LIMIT ?
  `).all(type, limit);
};

module.exports = { getSummary, getCategoryBreakdown, getMonthlyTrends, getRecentActivity, getTopCategories };