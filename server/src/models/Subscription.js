const mongoose = require('mongoose');

const subscriptionSchema = new mongoose.Schema(
  {
    recipient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Recipient',
      required: [true, 'Получатель обязателен']
    },
    edition: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Edition',
      required: [true, 'Издание обязательно']
    },
    months: {
      type: Number,
      required: [true, 'Срок подписки обязателен'],
      enum: {
        values: [1, 3, 6],
        message: 'Срок подписки может быть 1, 3 или 6 месяцев'
      }
    },
    startMonth: {
      type: Number,
      required: [true, 'Месяц начала доставки обязателен'],
      min: [1, 'Месяц должен быть от 1 до 12'],
      max: [12, 'Месяц должен быть от 1 до 12']
    },
    startYear: {
      type: Number,
      required: [true, 'Год начала доставки обязателен'],
      validate: {
        validator: function (v) {
          // пример пользовательского валидатора:
          // подписка не может начинаться раньше 2000 года и позже +5 лет от текущего
          const currentYear = new Date().getFullYear();
          return v >= 2000 && v <= currentYear + 5;
        },
        message: 'Год начала подписки должен быть в разумных пределах'
      }
    }
  },
  {
    timestamps: true
  }
);

// уникальность подписки на одно и то же издание с той же даты для одного получателя
subscriptionSchema.index(
  { recipient: 1, edition: 1, startMonth: 1, startYear: 1 },
  { unique: true, name: 'unique_subscription_per_period' }
);

module.exports = mongoose.model('Subscription', subscriptionSchema);
