const router = require('express').Router();
const { validate } = require('../../middleware/validate.middleware');
const { registerSchema, loginSchema } = require('./auth.schema');
const authService = require('./auth.service');
const { success, error } = require('../../utils/response');

router.post('/register', validate(registerSchema), (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    const user = authService.register(name, email, password, role);
    return success(res, user, 'User registered successfully.', 201);
  } catch (err) {
    return error(res, err.message, err.statusCode || 500);
  }
});

router.post('/login', validate(loginSchema), (req, res) => {
  try {
    const { email, password } = req.body;
    const result = authService.login(email, password);
    return success(res, result, 'Login successful.');
  } catch (err) {
    return error(res, err.message, err.statusCode || 500);
  }
});

module.exports = router;