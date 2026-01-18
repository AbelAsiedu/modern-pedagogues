const buildFilters = (db, query) => {
  const filters = [];
  const params = [];

  if (query.category) {
    params.push(query.category);
    filters.push(`category = $${params.length}`);
  }
  if (query.price === 'free') {
    filters.push('id IN (SELECT content_id FROM marketplace_versions WHERE price_cents = 0)');
  }
  if (query.price === 'paid') {
    filters.push('id IN (SELECT content_id FROM marketplace_versions WHERE price_cents > 0)');
  }
  if (query.rating) {
    params.push(Number(query.rating));
    filters.push(`rating >= $${params.length}`);
  }
  if (query.search) {
    const operator = db.isPostgres ? 'ILIKE' : 'LIKE';
    params.push(`%${query.search}%`);
    filters.push(`(title ${operator} $${params.length} OR description ${operator} $${params.length})`);
  }

  return { filters, params };
};

const buildSort = (sort) => {
  switch (sort) {
    case 'top-rated':
      return 'rating DESC';
    case 'most-downloaded':
      return 'download_count DESC';
    case 'newest':
    default:
      return 'created_at DESC';
  }
};

const listContent = async (db, query) => {
  const page = Math.max(1, Number(query.page || 1));
  const limit = 20;
  const offset = (page - 1) * limit;
  const { filters, params } = buildFilters(db, query);
  const where = filters.length ? `WHERE ${filters.join(' AND ')}` : '';
  const sort = buildSort(query.sort);
  const sql = `SELECT * FROM marketplace_content ${where} ORDER BY ${sort} LIMIT $${params.length + 1} OFFSET $${params.length + 2}`;

  params.push(limit, offset);
  const items = await db.query(sql, params);
  return { items, page };
};

const getContentDetail = async (db, id) => {
  const contentRows = await db.query('SELECT * FROM marketplace_content WHERE id = $1', [id]);
  const content = contentRows[0];
  if (!content) return null;

  const versions = await db.query('SELECT * FROM marketplace_versions WHERE content_id = $1', [id]);
  const reviews = await db.query('SELECT * FROM marketplace_reviews WHERE content_id = $1 ORDER BY created_at DESC', [id]);
  return { content, versions, reviews };
};

module.exports = { listContent, getContentDetail };
