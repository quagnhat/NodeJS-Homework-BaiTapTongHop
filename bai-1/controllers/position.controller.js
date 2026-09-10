const Position = require("../models/position.model");

const getAllPositions = async (req, res, next) => {
  try {
    const positions = await Position.find();
    res.status(200).json({
      message: "Lấy danh sách chức vụ thành công",
      data: positions
    });
  } catch (error) {
    next(error);
  }
};

const getPositionById = async (req, res, next) => {
  try {
    const position = await Position.findById(req.params.id);
    if (!position) {
      return res.status(404).json({
        message: "Không tìm thấy chức vụ"
      });
    }

    res.status(200).json({
      message: "Lấy thông tin chức vụ thành công",
      data: position
    });
  } catch (error) {
    next(error);
  }
};

const createPosition = async (req, res, next) => {
  try {
    const { name, code, description, baseSalary, status } = req.body;

    if (!name || !code) {
      return res.status(400).json({
        message: "Tên và mã chức vụ không được để trống"
      });
    }

    if (baseSalary === undefined || baseSalary === null || Number(baseSalary) < 0) {
      return res.status(400).json({
        message: "Lương cơ bản phải là số lớn hơn hoặc bằng 0"
      });
    }

    const existingPos = await Position.findOne({ code });
    if (existingPos) {
      return res.status(400).json({
        message: "Mã chức vụ đã tồn tại"
      });
    }

    const newPosition = await Position.create({
      name,
      code,
      description,
      baseSalary,
      status: status || "active"
    });

    res.status(201).json({
      message: "Thêm chức vụ thành công",
      data: newPosition
    });
  } catch (error) {
    next(error);
  }
};

const updatePosition = async (req, res, next) => {
  try {
    const { name, code, description, baseSalary, status } = req.body;

    if (code) {
      const existingPos = await Position.findOne({
        code,
        _id: { $ne: req.params.id }
      });
      if (existingPos) {
        return res.status(400).json({
          message: "Mã chức vụ đã tồn tại"
        });
      }
    }

    if (baseSalary !== undefined && Number(baseSalary) < 0) {
      return res.status(400).json({
        message: "Lương cơ bản phải là số lớn hơn hoặc bằng 0"
      });
    }

    const updatedPosition = await Position.findByIdAndUpdate(
      req.params.id,
      { name, code, description, baseSalary, status },
      { new: true, runValidators: true }
    );

    if (!updatedPosition) {
      return res.status(404).json({
        message: "Không tìm thấy chức vụ"
      });
    }

    res.status(200).json({
      message: "Cập nhật chức vụ thành công",
      data: updatedPosition
    });
  } catch (error) {
    next(error);
  }
};

const deletePosition = async (req, res, next) => {
  try {
    const position = await Position.findByIdAndUpdate(
      req.params.id,
      { status: "inactive" },
      { new: true }
    );

    if (!position) {
      return res.status(404).json({
        message: "Không tìm thấy chức vụ"
      });
    }

    res.status(200).json({
      message: "Xóa mềm chức vụ thành công",
      data: position
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllPositions,
  getPositionById,
  createPosition,
  updatePosition,
  deletePosition
};
