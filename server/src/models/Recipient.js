const mongoose = require('mongoose');

const recipientSchema = new mongoose.Schema(
  {
    code: {
      type: String,
      required: [true, 'Код получателя обязателен'],
      unique: true,
      trim: true
    },
    fullName: {
      type: String,
      required: [true, 'ФИО обязательно'],
      trim: true,
      minlength: [3, 'ФИО слишком короткое']
    },
    street: {
      type: String,
      required: [true, 'Улица обязательна'],
      trim: true
    },
    house: {
      type: String,
      required: [true, 'Дом обязателен'],
      trim: true
    },
    apartment: {
      type: String,
      required: [true, 'Квартира обязательна'],
      trim: true
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

recipientSchema.index({ fullName: 1 });
recipientSchema.index({ street: 1, house: 1 });

module.exports = mongoose.model('Recipient', recipientSchema);
