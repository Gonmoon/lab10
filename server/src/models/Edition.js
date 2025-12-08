const mongoose = require('mongoose');

const editionSchema = new mongoose.Schema(
  {
    index: {
      type: String,
      required: [true, 'Индекс издания обязателен'],
      unique: true,
      trim: true,
      match: [/^[0-9]{5,8}$/, 'Индекс должен быть числом длиной 5–8 символов']
    },
    type: {
      type: String,
      required: [true, 'Вид издания обязателен'],
      enum: {
        values: ['газета', 'журнал'],
        message: 'Вид издания может быть "газета" или "журнал"'
      }
    },
    title: {
      type: String,
      required: [true, 'Название издания обязательно'],
      trim: true,
      minlength: [2, 'Название должно быть не короче 2 символов']
    },
    monthlyPrice: {
      type: Number,
      required: [true, 'Стоимость подписки на 1 месяц обязательна'],
      min: [0, 'Стоимость не может быть отрицательной']
    },
    photoUrl: {
      type: String,
      default: '',
      validate: {
        validator: function (v) {
          if (!v) return true;
          return /^https?:\/\/.+/i.test(v);
        },
        message: 'photoUrl должен быть валидным URL'
      }
    }
  },
  {
    timestamps: true
  }
);

editionSchema.index({ title: 1 });
editionSchema.index({ type: 1 });

module.exports = mongoose.model('Edition', editionSchema);
