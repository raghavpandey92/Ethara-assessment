function notFound(req, res, next) {
  const error = new Error(`Route not found: ${req.originalUrl}`);
  res.status(404);
  next(error);
}

function errorHandler(error, req, res, next) {
  // If a controller already set a status, reuse it. Otherwise use 500.
  const statusCode = error.statusCode || (res.statusCode === 200 ? 500 : res.statusCode);

  res.status(statusCode).json({
    message: error.message || 'Server error',
  });
}

module.exports = {
  notFound,
  errorHandler,
};
