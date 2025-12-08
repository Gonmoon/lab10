function buildListQueryParams(req, searchableFields = []) {
  const {
    page = 1,
    limit = 10,
    sort = 'createdAt',
    search,
    ...rest
  } = req.query;

  const numericPage = Math.max(parseInt(page) || 1, 1);
  const numericLimit = Math.max(parseInt(limit) || 10, 1);
  const skip = (numericPage - 1) * numericLimit;
  const sortBy = sort.split(',').join(' ');

  const filter = {};
  const reservedKeys = ['page', 'limit', 'sort', 'search'];
  Object.keys(rest).forEach(key => {
    if (!reservedKeys.includes(key)) {
      filter[key] = rest[key];
    }
  });

  if (search && searchableFields.length > 0) {
    const regex = new RegExp(search, 'i');
    filter.$or = searchableFields.map(field => ({ [field]: regex }));
  }

  return { filter, numericPage, numericLimit, skip, sortBy };
}

module.exports = { buildListQueryParams };
