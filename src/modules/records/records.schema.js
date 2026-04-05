const Joi = require('joi');

const createRecordSchema = Joi.object({
  amount: Joi.number().positive().precision(2).required(),
  type: Joi.string().valid('income', 'expense').required(),
  category: Joi.string().min(1).max(100).required(),
  date: Joi.string().pattern(/^\d{4}-\d{2}-\d{2}$/).required().messages({
    'string.pattern.base': 'Date must be in YYYY-MM-DD format.'
  }),
  notes: Joi.string().max(500).allow('', null).optional()
});

const updateRecordSchema = Joi.object({
  amount: Joi.number().positive().precision(2),
  type: Joi.string().valid('income', 'expense'),
  category: Joi.string().min(1).max(100),
  date: Joi.string().pattern(/^\d{4}-\d{2}-\d{2}$/).messages({
    'string.pattern.base': 'Date must be in YYYY-MM-DD format.'
  }),
  notes: Joi.string().max(500).allow('', null)
}).min(1);

module.exports = { createRecordSchema, updateRecordSchema };