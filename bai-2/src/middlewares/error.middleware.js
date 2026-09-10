const errorMiddleware = (err, req, res, next) => {
  if (err.name === "ValidationError") {
    const errors = Object.values(err.errors).map((item) => item.message);
    return res.status(400).json({
      message: "Dữ liệu không hợp lệ",
      errors: errors
    });
  }

  if (err.code === 11000) {
    const field = Object.keys(err.keyValue)[0];
    return res.status(400).json({
      message: `${field} đã tồn tại trong hệ thống`
    });
  }

  if (err.name === "CastError") {
    return res.status(400).json({
      message: `Dữ liệu không hợp lệ cho trường ${err.path}`
    });
  }

  const statusCode = err.statusCode || 500;
  const message = err.message || "Lỗi máy chủ nội bộ";

  res.status(statusCode).json({
    message: message
  });
};

module.exports = errorMiddleware;
