const errorMiddleware = (err, req, res, next) => {
  let statusCode = err.statusCode || 500;
  let message = err.message || "Lỗi máy chủ nội bộ";

  if (err.name === "ValidationError") {
    statusCode = 400;
    const messages = Object.values(err.errors).map((item) => item.message);
    message = messages.join(", ");
  }

  if (err.code === 11000) {
    statusCode = 400;
    const field = Object.keys(err.keyValue)[0];
    message = `${field} đã tồn tại trong hệ thống`;
  }

  if (err.name === "CastError") {
    statusCode = 400;
    message = `Dữ liệu không hợp lệ cho trường ${err.path}`;
  }

  res.status(statusCode).json({
    message: message
  });
};

module.exports = errorMiddleware;
