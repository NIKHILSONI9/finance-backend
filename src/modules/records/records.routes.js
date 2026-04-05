const router = require('express').Router();
const { authenticate } = require('../../middleware/auth.middleware');
const { authorize } = require('../../middleware/role.middleware');
const { validate } = require('../../middleware/validate.middleware');
const { createRecordSchema, updateRecordSchema } = require('./records.schema');
const recordsService = require('./records.service');
const { success, error } = require('../../utils/response');

// All record routes require authentication
router.use(authenticate);

// GET /api/records - viewer, analyst, admin
router.get('/', (req, res) => {
  try {
    const { type, category, date_from, date_to, page = 1, limit = 20 } = req.query;
    const filters = { type, category, date_from, date_to };
    // Admin can filter by user_id
    if (req.query.user_id && req.user.role === 'admin') {
      filters.user_id = Number(req.query.user_id);
    }
    const result = recordsService.getAllRecords(filters, Number(page), Number(limit));
    return success(res, result);
  } catch (err) {
    return error(res, err.message, err.statusCode || 500);
  }
});

// GET /api/records/:id
router.get('/:id', (req, res) => {
  try {
    const record = recordsService.getRecordById(Number(req.params.id));
    return success(res, record);
  } catch (err) {
    return error(res, err.message, err.statusCode || 500);
  }
});

// POST /api/records - analyst or admin only
router.post('/', authorize('analyst', 'admin'), validate(createRecordSchema), (req, res) => {
  try {
    const record = recordsService.createRecord(req.user.id, req.body);
    return success(res, record, 'Record created successfully.', 201);
  } catch (err) {
    return error(res, err.message, err.statusCode || 500);
  }
});

// PATCH /api/records/:id - analyst or admin only
router.patch('/:id', authorize('analyst', 'admin'), validate(updateRecordSchema), (req, res) => {
  try {
    const record = recordsService.updateRecord(Number(req.params.id), req.body);
    return success(res, record, 'Record updated successfully.');
  } catch (err) {
    return error(res, err.message, err.statusCode || 500);
  }
});

// DELETE /api/records/:id - admin only
router.delete('/:id', authorize('admin'), (req, res) => {
  try {
    const result = recordsService.deleteRecord(Number(req.params.id));
    return success(res, result, 'Record deleted successfully.');
  } catch (err) {
    return error(res, err.message, err.statusCode || 500);
  }
});

module.exports = router;