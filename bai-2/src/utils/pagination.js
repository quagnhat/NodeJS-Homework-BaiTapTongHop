const getPagination = (page, limit, totalItems) => {
  const currentPage = Math.max(1, parseInt(page, 10) || 1);
  const currentLimit = Math.max(1, parseInt(limit, 10) || 10);
  const totalPages = Math.ceil(totalItems / currentLimit) || 1;
  const skip = (currentPage - 1) * currentLimit;

  return {
    page: currentPage,
    limit: currentLimit,
    skip,
    totalItems,
    totalPages
  };
};

module.exports = getPagination;
