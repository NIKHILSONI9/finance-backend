require('dotenv').config({ path: '../.env' });
const bcrypt = require('bcryptjs');
const db = require('../src/config/db');

console.log('Seeding database...');

// Clear existing data (order matters due to foreign keys)
db.exec('DELETE FROM records; DELETE FROM users;');

const insertUser = db.prepare('INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)');

const adminId = insertUser.run('Alice Admin', 'admin@finance.com', bcrypt.hashSync('admin123', 10), 'admin').lastInsertRowid;
const analystId = insertUser.run('Bob Analyst', 'analyst@finance.com', bcrypt.hashSync('analyst123', 10), 'analyst').lastInsertRowid;
insertUser.run('Carol Viewer', 'viewer@finance.com', bcrypt.hashSync('viewer123', 10), 'viewer');

const insertRecord = db.prepare('INSERT INTO records (user_id, amount, type, category, date, notes) VALUES (?, ?, ?, ?, ?, ?)');

const seedRecords = [
  [adminId, 5000, 'income', 'Salary', '2024-01-01', 'January salary'],
  [adminId, 1200, 'expense', 'Rent', '2024-01-02', 'Monthly rent'],
  [adminId, 300, 'expense', 'Groceries', '2024-01-10', null],
  [analystId, 8000, 'income', 'Salary', '2024-02-01', 'February salary'],
  [analystId, 150, 'expense', 'Utilities', '2024-02-05', 'Electric bill'],
  [analystId, 500, 'expense', 'Entertainment', '2024-02-14', "Valentine's dinner"],
  [adminId, 5000, 'income', 'Salary', '2024-03-01', 'March salary'],
  [adminId, 2000, 'income', 'Freelance', '2024-03-15', 'Side project'],
  [adminId, 750, 'expense', 'Travel', '2024-03-20', 'Weekend trip'],
  [analystId, 1000, 'income', 'Bonus', '2024-04-01', 'Q1 bonus'],
  [analystId, 200, 'expense', 'Groceries', '2024-04-08', null],
  [analystId, 450, 'expense', 'Subscriptions', '2024-04-15', 'Annual subscriptions']
];

const insertMany = db.transaction((records) => {
  for (const r of records) insertRecord.run(...r);
});
insertMany(seedRecords);

console.log('Seed complete!');
console.log('Test users:');
console.log('  admin@finance.com / admin123 (admin)');
console.log('  analyst@finance.com / analyst123 (analyst)');
console.log('  viewer@finance.com / viewer123 (viewer)');