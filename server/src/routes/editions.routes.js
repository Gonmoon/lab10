const express = require('express');
const Edition = require('../models/Edition');
const validateObjectId = require('../middleware/validateObjectId');
const { buildListQueryParams } = require('./utils');

const router = express.Router();

// Создать
router.post('/', async (req, res, next) => {
  try {
    const edition = await Edition.create(req.body);
    res.status(201).json(edition);
  } catch (err) {
    next(err);
  }
});

// Список
router.get('/', async (req, res, next) => {
  try {
    // Везде sort, а не sortBy
    const { filter, numericPage, numericLimit, skip, sortObj } =
      buildListQueryParams(req, ['title', 'type', 'index']);

    const total = await Edition.countDocuments(filter);
    const data = await Edition.find(filter)
      .sort(sortObj)
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
    const edition = await Edition.findById(req.params.id);
    if (!edition) return res.status(404).json({ message: 'Издание не найдено' });
    res.json(edition);
  } catch (err) {
    next(err);
  }
});

// Обновить
router.put('/:id', validateObjectId, async (req, res, next) => {
  try {
    const edition = await Edition.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!edition) return res.status(404).json({ message: 'Издание не найдено' });
    res.json(edition);
  } catch (err) {
    next(err);
  }
});

// Удалить
router.delete('/:id', validateObjectId, async (req, res, next) => {
  try {
    const edition = await Edition.findByIdAndDelete(req.params.id);
    if (!edition) return res.status(404).json({ message: 'Издание не найдено' });
    res.json({ message: 'Издание удалено' });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
