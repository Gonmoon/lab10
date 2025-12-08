function errorHandler(err, req, res, next) {
  console.error(err);

  let statusCode = res.statusCode !== 200 ? res.statusCode : 500;
  let message = err.message || 'Внутренняя ошибка сервера';

  // Ошибка валидации Mongoose
  if (err.name === 'ValidationError') {
    statusCode = 400;
    const errors = Object.values(err.errors).map(e => e.message);
    message = 'Ошибка валидации данных';
    return res.status(statusCode).json({ message, errors });
  }

  // Неверный ObjectId
  if (err.name === 'CastError' && err.kind === 'ObjectId') {
    statusCode = 400;
    message = 'Некорректный идентификатор';
  }

  // Нарушение уникальности (E11000)
  if (err.code === 11000) {
    statusCode = 409;
    message = 'Запись с такими уникальными полями уже существует';
  }

  res.status(statusCode).json({
    message
  });
}

module.exports = errorHandler;
