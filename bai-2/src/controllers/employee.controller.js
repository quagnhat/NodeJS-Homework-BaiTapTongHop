const Employee = require("../models/Employee");
const Department = require("../models/Department");
const Position = require("../models/Position");
const User = require("../models/User");
const getPagination = require("../utils/pagination");

const getAllEmployees = async (req, res, next) => {
  try {
    const {
      page,
      limit,
      keyword,
      departmentId,
      positionId,
      status,
      gender,
      sortBy,
      order
    } = req.query;

    const query = {};

    if (keyword) {
      const regex = new RegExp(keyword.trim(), "i");
      query.$or = [
        { employeeCode: regex },
        { fullName: regex },
        { email: regex },
        { phone: regex }
      ];
    }

    if (departmentId) {
      query.departmentId = departmentId;
    }

    if (positionId) {
      query.positionId = positionId;
    }

    if (status) {
      query.status = status;
    }

    if (gender) {
      query.gender = gender;
    }

    const totalItems = await Employee.countDocuments(query);
    const pagination = getPagination(page, limit, totalItems);

    const sortOptions = {};
    const validSortFields = ["fullName", "salary", "startDate", "createdAt"];
    const sortField = validSortFields.includes(sortBy) ? sortBy : "createdAt";
    sortOptions[sortField] = order === "asc" ? 1 : -1;

    const employees = await Employee.find(query)
      .populate("departmentId", "name code")
      .populate("positionId", "name code baseSalary")
      .populate("managerId", "employeeCode fullName email")
      .sort(sortOptions)
      .skip(pagination.skip)
      .limit(pagination.limit);

    res.status(200).json({
      message: "Lấy danh sách nhân viên thành công",
      data: employees,
      pagination: {
        page: pagination.page,
        limit: pagination.limit,
        totalItems: pagination.totalItems,
        totalPages: pagination.totalPages
      }
    });
  } catch (error) {
    next(error);
  }
};

const getEmployeeById = async (req, res, next) => {
  try {
    const employee = await Employee.findById(req.params.id)
      .populate("departmentId", "name code")
      .populate("positionId", "name code baseSalary")
      .populate("managerId", "employeeCode fullName email");

    if (!employee) {
      return res.status(404).json({
        message: "Không tìm thấy dữ liệu"
      });
    }

    res.status(200).json({
      message: "Lấy thông tin nhân viên thành công",
      data: employee
    });
  } catch (error) {
    next(error);
  }
};

const createEmployee = async (req, res, next) => {
  try {
    const {
      employeeCode,
      fullName,
      email,
      phone,
      gender,
      dateOfBirth,
      address,
      departmentId,
      positionId,
      managerId,
      salary,
      startDate,
      status
    } = req.body;

    const errors = [];

    if (!employeeCode || !employeeCode.trim()) {
      errors.push("Mã nhân viên không được để trống");
    }

    if (!fullName || !fullName.trim()) {
      errors.push("Họ và tên không được để trống");
    }

    if (!email || !email.trim()) {
      errors.push("Email không được để trống");
    } else {
      const emailRegex = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
      if (!emailRegex.test(email.trim())) {
        errors.push("Email không đúng định dạng");
      }
    }

    if (!phone || !phone.trim()) {
      errors.push("Số điện thoại không được để trống");
    }

    const validGenders = ["male", "female", "other"];
    if (!gender || !validGenders.includes(gender)) {
      errors.push("Giới tính chỉ nhận: male, female, other");
    }

    if (salary === undefined || salary === null || Number(salary) < 0) {
      errors.push("Lương phải lớn hơn hoặc bằng 0");
    }

    const validStatuses = ["probation", "active", "inactive", "resigned"];
    if (status && !validStatuses.includes(status)) {
      errors.push("Trạng thái chỉ nhận: probation, active, inactive, resigned");
    }

    if (errors.length > 0) {
      return res.status(400).json({
        message: "Dữ liệu không hợp lệ",
        errors: errors
      });
    }

    const existingCode = await Employee.findOne({ employeeCode: employeeCode.trim().toUpperCase() });
    if (existingCode) {
      return res.status(400).json({
        message: "Mã nhân viên đã tồn tại"
      });
    }

    const existingEmail = await Employee.findOne({ email: email.trim().toLowerCase() });
    if (existingEmail) {
      return res.status(400).json({
        message: "Email đã tồn tại"
      });
    }

    const department = await Department.findById(departmentId);
    if (!department) {
      return res.status(400).json({
        message: "Phòng ban không tồn tại"
      });
    }

    const position = await Position.findById(positionId);
    if (!position) {
      return res.status(400).json({
        message: "Chức vụ không tồn tại"
      });
    }

    if (managerId) {
      const manager = await Employee.findById(managerId);
      if (!manager) {
        return res.status(400).json({
          message: "Người quản lý không tồn tại"
        });
      }
    }

    const user = await User.findOne({ email: email.trim().toLowerCase() });

    const newEmployee = await Employee.create({
      employeeCode: employeeCode.trim().toUpperCase(),
      fullName: fullName.trim(),
      email: email.trim().toLowerCase(),
      phone: phone.trim(),
      gender,
      dateOfBirth: dateOfBirth ? new Date(dateOfBirth) : undefined,
      address: address ? address.trim() : "",
      departmentId,
      positionId,
      managerId: managerId || null,
      salary: Number(salary),
      startDate: startDate ? new Date(startDate) : new Date(),
      status: status || "active",
      userId: user ? user._id : null
    });

    if (user && !user.employeeId) {
      user.employeeId = newEmployee._id;
      await user.save();
    }

    const populatedEmployee = await Employee.findById(newEmployee._id)
      .populate("departmentId", "name code")
      .populate("positionId", "name code baseSalary")
      .populate("managerId", "employeeCode fullName email");

    res.status(201).json({
      message: "Thêm nhân viên thành công",
      data: populatedEmployee
    });
  } catch (error) {
    next(error);
  }
};

const updateEmployee = async (req, res, next) => {
  try {
    const employee = await Employee.findById(req.params.id);
    if (!employee) {
      return res.status(404).json({
        message: "Không tìm thấy dữ liệu"
      });
    }

    const {
      employeeCode,
      fullName,
      email,
      phone,
      gender,
      dateOfBirth,
      address,
      departmentId,
      positionId,
      managerId,
      salary,
      startDate,
      status
    } = req.body;

    const errors = [];

    if (email) {
      const emailRegex = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
      if (!emailRegex.test(email.trim())) {
        errors.push("Email không đúng định dạng");
      }
    }

    if (gender) {
      const validGenders = ["male", "female", "other"];
      if (!validGenders.includes(gender)) {
        errors.push("Giới tính chỉ nhận: male, female, other");
      }
    }

    if (salary !== undefined && Number(salary) < 0) {
      errors.push("Lương phải lớn hơn hoặc bằng 0");
    }

    if (status) {
      const validStatuses = ["probation", "active", "inactive", "resigned"];
      if (!validStatuses.includes(status)) {
        errors.push("Trạng thái chỉ nhận: probation, active, inactive, resigned");
      }
    }

    if (errors.length > 0) {
      return res.status(400).json({
        message: "Dữ liệu không hợp lệ",
        errors: errors
      });
    }

    if (employeeCode) {
      const existingCode = await Employee.findOne({
        employeeCode: employeeCode.trim().toUpperCase(),
        _id: { $ne: req.params.id }
      });
      if (existingCode) {
        return res.status(400).json({
          message: "Mã nhân viên đã tồn tại"
        });
      }
    }

    if (email) {
      const existingEmail = await Employee.findOne({
        email: email.trim().toLowerCase(),
        _id: { $ne: req.params.id }
      });
      if (existingEmail) {
        return res.status(400).json({
          message: "Email đã tồn tại"
        });
      }
    }

    if (departmentId) {
      const department = await Department.findById(departmentId);
      if (!department) {
        return res.status(400).json({
          message: "Phòng ban không tồn tại"
        });
      }
    }

    if (positionId) {
      const position = await Position.findById(positionId);
      if (!position) {
        return res.status(400).json({
          message: "Chức vụ không tồn tại"
        });
      }
    }

    if (managerId) {
      if (managerId.toString() === req.params.id.toString()) {
        return res.status(400).json({
          message: "Quản lý trực tiếp không thể là chính mình"
        });
      }
      const manager = await Employee.findById(managerId);
      if (!manager) {
        return res.status(400).json({
          message: "Người quản lý không tồn tại"
        });
      }
    }

    if (employeeCode) employee.employeeCode = employeeCode.trim().toUpperCase();
    if (fullName) employee.fullName = fullName.trim();
    if (email) employee.email = email.trim().toLowerCase();
    if (phone) employee.phone = phone.trim();
    if (gender) employee.gender = gender;
    if (dateOfBirth !== undefined) employee.dateOfBirth = dateOfBirth ? new Date(dateOfBirth) : null;
    if (address !== undefined) employee.address = address.trim();
    if (departmentId) employee.departmentId = departmentId;
    if (positionId) employee.positionId = positionId;
    if (managerId !== undefined) employee.managerId = managerId || null;
    if (salary !== undefined) employee.salary = Number(salary);
    if (startDate !== undefined) employee.startDate = startDate ? new Date(startDate) : employee.startDate;
    if (status) employee.status = status;

    await employee.save();

    const updatedEmployee = await Employee.findById(employee._id)
      .populate("departmentId", "name code")
      .populate("positionId", "name code baseSalary")
      .populate("managerId", "employeeCode fullName email");

    res.status(200).json({
      message: "Cập nhật nhân viên thành công",
      data: updatedEmployee
    });
  } catch (error) {
    next(error);
  }
};

const deleteEmployee = async (req, res, next) => {
  try {
    const employee = await Employee.findByIdAndUpdate(
      req.params.id,
      { status: "inactive" },
      { new: true }
    );

    if (!employee) {
      return res.status(404).json({
        message: "Không tìm thấy dữ liệu"
      });
    }

    res.status(200).json({
      message: "Xóa mềm nhân viên thành công",
      data: employee
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllEmployees,
  getEmployeeById,
  createEmployee,
  updateEmployee,
  deleteEmployee
};
