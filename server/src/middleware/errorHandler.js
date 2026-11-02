export function notFound(req, res) {
  res.status(404).json({ error: 'Not found' });
}

// eslint-disable-next-line no-unused-vars
export function errorHandler(error, req, res, next) {
  const status = error.status ?? 500;
  if (status >= 500) console.error(error);
  res.status(status).json({
    error: status >= 500 ? 'Internal server error' : error.message,
    details: error.details,
  });
}
