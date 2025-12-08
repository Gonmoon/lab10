const express = require('express');
const Recipient = require('../models/Recipient');
const Subscription = require('../models/Subscription');
const validateObjectId = require('../middleware/validateObjectId');
const { buildListQueryParams } = require('./utils');

const router = express.Router();

// Создать получателя
router.post('/', async (req, res, next) => {
  try {
    const recipient = await Recipient.create(req.body);
    res.status(201).json(recipient);
  } catch (err) {
    next(err);
  }
});

// Список
router.get('/', async (req, res, next) => {
  try {
    const { filter, numericPage, numericLimit, skip, sortBy } =
      buildListQueryParams(req, ['fullName', 'street', 'code']);

    const total = await Recipient.countDocuments(filter);
    const data = await Recipient.find(filter)
      .sort(sortBy)
      .skip(skip)
      .limit(numericLimit);

    res.json({
      data,
      meta: {
        total,
        page: numericPage,
        totalPages: Math.ceil(total / numericLimit),
        limit: numericLimit
      }
    });
  } catch (err) {
    next(err);
  }
});

// Детально
router.get('/:id', validateObjectId, async (req, res, next) => {
  try {
    const recipient = await Recipient.findById(req.params.id);
    if (!recipient) {
      return res.status(404).json({ message: 'Получатель не найден' });
    }
    res.json(recipient);
  } catch (err) {
    next(err);
  }
});

// Обновить
router.put('/:id', validateObjectId, async (req, res, next) => {
  try {
    const recipient = await Recipient.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });
    if (!recipient) {
      return res.status(404).json({ message: 'Получатель не найден' });
    }
    res.json(recipient);
  } catch (err) {
    next(err);
  }
});

// Удалить (с проверкой подписок)
router.delete('/:id', validateObjectId, async (req, res, next) => {
  try {
    const hasSubscriptions = await Subscription.exists({ recipient: req.params.id });
    if (hasSubscriptions) {
      return res
        .status(409)
        .json({ message: 'Нельзя удалить получателя: у него есть подписки' });
    }

    const recipient = await Recipient.findByIdAndDelete(req.params.id);
    if (!recipient) {
      return res.status(404).json({ message: 'Получатель не найден' });
    }

    res.json({ message: 'Получатель удалён' });
  } catch (err) {
    next(err);
  }
});

// Проверка существования
router.get('/:id/exists', validateObjectId, async (req, res, next) => {
  try {
    const exists = await Recipient.exists({ _id: req.params.id });
    res.json({ exists: !!exists });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
