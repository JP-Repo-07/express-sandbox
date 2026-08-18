const logger = require("./logger");

function validate(schema, payload) {
  const result = schema.safeParse(payload || {});
  if (!result.success) {
    const issues = result.error.issues.map(issue => {
      const field = issue.path.join('.') || 'root';
      return `${field}: ${issue.message}`;
    });
    return { valid: false, errors: issues };
  }
  return { valid: true, data: result.data };
}


function errorHandler(err, req, res, next) {
  logger.error({
    message: err.message,
    stack: err.stack,
    status: err.status || 500,
    path: req.originalUrl,
    method: req.method,
    errors: err.errors || null
  });

  const status = err.status || 500;
  res.status(status).json({
    success: false,
    status,
    message: err.message || "Internal Server Error",
    errors: err.errors || undefined
  });
}


module.exports = { validate, errorHandler };
