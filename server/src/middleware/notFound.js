function notFound(req, res, next) {
  res.status(404).json({
    message: `Маршрут ${req.originalUrl} не найден`
  });
}

module.exports = notFound;
