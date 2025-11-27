const logger = (req, res, next) => {
  const timestamp = new Date().toISOString();
  const method = req.method;
  const path = req.path;

  // Log to console in development
  if (process.env.NODE_ENV === 'development') {
    console.log(`[${timestamp}] ${method} ${path}`);
  }

  // Log critical events (optional: could be extended to log to file/database)
  if (method === 'POST' || method === 'PUT' || method === 'DELETE') {
    console.log(`[AUDIT] [${timestamp}] ${method} ${path} - User: ${req.user?.id || 'unknown'}`);
  }

  next();
};

module.exports = { logger };
