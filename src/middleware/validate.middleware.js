const { error } = require('../utils/response');

const validate = (schema) => {
  return (req, res, next) => {
    const { error: validationError } = schema.validate(req.body, { abortEarly: false });
    if (validationError) {
      const messages = validationError.details.map(detail => detail.message).join(', ');
      return error(res, `Validation failed: ${messages}`, 400);
    }
    next();
  };
};

module.exports = { validate };