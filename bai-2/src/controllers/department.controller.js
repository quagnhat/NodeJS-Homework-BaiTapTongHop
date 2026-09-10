const Department = require("../models/Department");
const Employee = require("../models/Employee");

const getAllDepartments = async (req, res, next) => {
  try {
    const departments = await Department.find();
    res.status(200).json({
      message: "Lấy danh sách phòng ban thành công",
      data: departments
    });
  } catch (error) {
    next(error);
  }
};

const getDepartmentById = async (req, res, next) => {
  try {
    const department = await Department.findById(req.params.id);
    if (!department) {
      return res.status(404).json({
        message: "Không tìm thấy dữ liệu"
      });
    }

    res.status(200).json({
      message: "Lấy thông tin phòng ban thành công",
      data: department
    });
  } catch (error) {
    next(error);
  }
};

const createDepartment = async (req, res, next) => {
  try {
    const { name, code, description, status } = req.body;

    if (!name || !code) {
      return res.status(400).json({
        message: "Tên và mã phòng ban không được để trống"
      });
    }

    const existingDept = await Department.findOne({ code: code.toUpperCase() });
    if (existingDept) {
      return res.status(400).json({
        message: "Mã phòng ban đã tồn tại"
      });
    }

    const newDepartment = await Department.create({
      name,
      code,
      description,
      status: status || "active"
    });

    res.status(201).json({
      message: "Thêm phòng ban thành công",
      data: newDepartment
    });
  } catch (error) {
    next(error);
  }
};

const updateDepartment = async (req, res, next) => {
  try {
    const { name, code, description, status } = req.body;

    if (code) {
      const existingDept = await Department.findOne({
        code: code.toUpperCase(),
        _id: { $ne: req.params.id }
      });
      if (existingDept) {
        return res.status(400).json({
          message: "Mã phòng ban đã tồn tại"
        });
      }
    }

    const updatedDepartment = await Department.findByIdAndUpdate(
      req.params.id,
      { name, code, description, status },
      { new: true, runValidators: true }
    );

    if (!updatedDepartment) {
      return res.status(404).json({
        message: "Không tìm thấy dữ liệu"
      });
    }

    res.status(200).json({
      message: "Cập nhật phòng ban thành công",
      data: updatedDepartment
    });
  } catch (error) {
    next(error);
  }
};

const deleteDepartment = async (req, res, next) => {
  try {
    const activeEmployee = await Employee.findOne({
      departmentId: req.params.id,
      status: "active"
    });

    if (activeEmployee) {
      return res.status(400).json({
        message: "Không thể xóa phòng ban đang có nhân viên hoạt động"
      });
    }

    const department = await Department.findByIdAndUpdate(
      req.params.id,
      { status: "inactive" },
      { new: true }
    );

    if (!department) {
      return res.status(404).json({
        message: "Không tìm thấy dữ liệu"
      });
    }

    res.status(200).json({
      message: "Xóa mềm phòng ban thành công",
      data: department
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllDepartments,
  getDepartmentById,
  createDepartment,
  updateDepartment,
  deleteDepartment
};
