const router = require('express').Router();
const { authenticate } = require('../../middleware/auth.middleware');
const { authorize } = require('../../middleware/role.middleware');
const dashboardService = require('./dashboard.service');
const { success, error } = require('../../utils/response');

// All dashboard routes require authentication and analyst/admin role
router.use(authenticate, authorize('analyst', 'admin'));

router.get('/summary', (req, res) => {
  try {
    return success(res, dashboardService.getSummary());
  } catch (err) {
    return error(res, err.message, 500);
  }
});

router.get('/categories', (req, res) => {
  try {
    return success(res, dashboardService.getCategoryBreakdown());
  } catch (err) {
    return error(res, err.message, 500);
  }
});

router.get('/trends', (req, res) => {
  try {
    const months = Math.min(Math.max(Number(req.query.months) || 12, 1), 60);
    return success(res, dashboardService.getMonthlyTrends(months));
  } catch (err) {
    return error(res, err.message, 500);
  }
});

router.get('/recent', (req, res) => {
  try {
    const limit = Math.min(Math.max(Number(req.query.limit) || 10, 1), 50);
    return success(res, dashboardService.getRecentActivity(limit));
  } catch (err) {
    return error(res, err.message, 500);
  }
});

router.get('/top-categories', (req, res) => {
  try {
    const type = ['income', 'expense'].includes(req.query.type) ? req.query.type : 'expense';
    const limit = Math.min(Math.max(Number(req.query.limit) || 5, 1), 20);
    return success(res, dashboardService.getTopCategories(type, limit));
  } catch (err) {
    return error(res, err.message, 500);
  }
});

module.exports = router;