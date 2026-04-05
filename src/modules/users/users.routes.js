const router = require('express').Router();
const Joi = require('joi');
const { authenticate } = require('../../middleware/auth.middleware');
const { authorize } = require('../../middleware/role.middleware');
const { validate } = require('../../middleware/validate.middleware');
const usersService = require('./users.service');
const { success, error } = require('../../utils/response');

const roleSchema = Joi.object({
  role: Joi.string().valid('viewer', 'analyst', 'admin').required()
});
const statusSchema = Joi.object({
  is_active: Joi.boolean().required()
});

// GET /api/users/me - any authenticated user
router.get('/me', authenticate, (req, res) => {
  try {
    const user = usersService.getMe(req.user.id);
    return success(res, user);
  } catch (err) {
    return error(res, err.message, err.statusCode || 500);
  }
});

// GET /api/users - admin only
router.get('/', authenticate, authorize('admin'), (req, res) => {
  try {
    const users = usersService.getAllUsers();
    return success(res, users);
  } catch (err) {
    return error(res, err.message, err.statusCode || 500);
  }
});

// GET /api/users/:id - admin only
router.get('/:id', authenticate, authorize('admin'), (req, res) => {
  try {
    const user = usersService.getUserById(Number(req.params.id));
    return success(res, user);
  } catch (err) {
    return error(res, err.message, err.statusCode || 500);
  }
});

// PATCH /api/users/:id/role - admin only
router.patch('/:id/role', authenticate, authorize('admin'), validate(roleSchema), (req, res) => {
  try {
    const user = usersService.updateUserRole(Number(req.params.id), req.body.role);
    return success(res, user, 'User role updated.');
  } catch (err) {
    return error(res, err.message, err.statusCode || 500);
  }
});

// PATCH /api/users/:id/status - admin only
router.patch('/:id/status', authenticate, authorize('admin'), validate(statusSchema), (req, res) => {
  try {
    const user = usersService.setUserStatus(Number(req.params.id), req.body.is_active);
    return success(res, user, `User ${req.body.is_active ? 'activated' : 'deactivated'}.`);
  } catch (err) {
    return error(res, err.message, err.statusCode || 500);
  }
});

module.exports = router;