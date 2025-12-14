function buildListQueryParams(req, searchableFields = []) {
  // Используем sort, не sortBy
  const { page = 1, limit = 10, sort = 'createdAt', search, ...rest } = req.query;

  const numericPage = Math.max(parseInt(page) || 1, 1);
  const numericLimit = Math.max(parseInt(limit) || 10, 1);
  const skip = (numericPage - 1) * numericLimit;

  // Сортировка: поддержка '-' для обратного порядка
  const sortField = sort.startsWith('-') ? sort.slice(1) : sort;
  const sortOrder = sort.startsWith('-') ? -1 : 1;
  const sortObj = { [sortField]: sortOrder };

  // Фильтр по остальным query-парам
  const filter = {};
  const reservedKeys = ['page', 'limit', 'sort', 'search'];
  Object.keys(rest).forEach(key => {
    if (!reservedKeys.includes(key)) {
      filter[key] = rest[key];
    }
  });

  // Поиск по заданным полям
  if (search && searchableFields.length > 0) {
    const regex = new RegExp(search, 'i');
    filter.$or = searchableFields.map(field => ({ [field]: regex }));
  }

  return { filter, numericPage, numericLimit, skip, sortObj };
}

module.exports = { buildListQueryParams };
