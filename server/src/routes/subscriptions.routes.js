const express = require('express');
const Subscription = require('../models/Subscription');
const Edition = require('../models/Edition');
const Recipient = require('../models/Recipient');
const validateObjectId = require('../middleware/validateObjectId');
const { buildListQueryParams } = require('./utils');

const router = express.Router();

// Создать подписку
router.post('/', async (req, res, next) => {
  try {
    // простая проверка на существование связанных сущностей
    const recipientExists = await Recipient.exists({ _id: req.body.recipient });
    const editionExists = await Edition.exists({ _id: req.body.edition });

    if (!recipientExists) {
      return res.status(400).json({ message: 'Получатель с таким id не существует' });
    }
    if (!editionExists) {
      return res.status(400).json({ message: 'Издание с таким id не существует' });
    }

    const subscription = await Subscription.create(req.body);
    const populated = await subscription.populate('recipient').populate('edition');
    res.status(201).json(populated);
  } catch (err) {
    next(err);
  }
});

// Список (с пагинацией, сортировкой, фильтрацией, поиском по год/месяц/срок)
router.get('/', async (req, res, next) => {
  try {
    const { filter, numericPage, numericLimit, skip, sortBy } =
      buildListQueryParams(req, ['months', 'startYear', 'startMonth']);

    const total = await Subscription.countDocuments(filter);
    const data = await Subscription.find(filter)
      .sort(sortBy)
      .skip(skip)
      .limit(numericLimit)
      .populate('recipient')
      .populate('edition');

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
    const subscription = await Subscription.findById(req.params.id)
      .populate('recipient')
      .populate('edition');

    if (!subscription) {
      return res.status(404).json({ message: 'Подписка не найдена' });
    }

    res.json(subscription);
  } catch (err) {
    next(err);
  }
});

// Обновить
router.put('/:id', validateObjectId, async (req, res, next) => {
  try {
    const subscription = await Subscription.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true
      }
    )
      .populate('recipient')
      .populate('edition');

    if (!subscription) {
      return res.status(404).json({ message: 'Подписка не найдена' });
    }

    res.json(subscription);
  } catch (err) {
    next(err);
  }
});

// Удалить
router.delete('/:id', validateObjectId, async (req, res, next) => {
  try {
    const subscription = await Subscription.findByIdAndDelete(req.params.id);
    if (!subscription) {
      return res.status(404).json({ message: 'Подписка не найдена' });
    }

    res.json({ message: 'Подписка удалена' });
  } catch (err) {
    next(err);
  }
});

// Проверка существования
router.get('/:id/exists', validateObjectId, async (req, res, next) => {
  try {
    const exists = await Subscription.exists({ _id: req.params.id });
    res.json({ exists: !!exists });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
