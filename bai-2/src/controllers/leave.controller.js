const Leave = require("../models/Leave");
const Employee = require("../models/Employee");
const getPagination = require("../utils/pagination");

const getEmployeeForRequest = async (req) => {
  if (req.user.role === "staff") {
    const query = [
      { email: req.user.email },
      { userId: req.user._id }
    ];
    if (req.user.employeeId) {
      query.push({ _id: req.user.employeeId });
    }
    return await Employee.findOne({ $or: query });
  }

  if (req.body && req.body.employeeId) {
    return await Employee.findById(req.body.employeeId);
  }

  const query = [
    { email: req.user.email },
    { userId: req.user._id }
  ];
  if (req.user.employeeId) {
    query.push({ _id: req.user.employeeId });
  }
  return await Employee.findOne({ $or: query });
};

const createLeave = async (req, res, next) => {
  try {
    const employee = await getEmployeeForRequest(req);
    if (!employee) {
      return res.status(400).json({
        message: "Không tìm thấy thông tin nhân viên"
      });
    }

    const { leaveType, startDate, endDate, reason } = req.body;
    const errors = [];

    const validLeaveTypes = ["annual", "sick", "unpaid"];
    if (!leaveType || !validLeaveTypes.includes(leaveType)) {
      errors.push("Loại nghỉ phép chỉ nhận: annual, sick, unpaid");
    }

    if (!startDate) {
      errors.push("Ngày bắt đầu không được để trống");
    }

    if (!endDate) {
      errors.push("Ngày kết thúc không được để trống");
    }

    if (startDate && endDate && new Date(startDate) > new Date(endDate)) {
      errors.push("Ngày bắt đầu phải nhỏ hơn hoặc bằng ngày kết thúc");
    }

    if (!reason || !reason.trim()) {
      errors.push("Lý do không được để trống");
    }

    if (errors.length > 0) {
      return res.status(400).json({
        message: "Dữ liệu không hợp lệ",
        errors: errors
      });
    }

    const leave = await Leave.create({
      employeeId: employee._id,
      leaveType,
      startDate: new Date(startDate),
      endDate: new Date(endDate),
      reason: reason.trim(),
      status: "pending"
    });

    res.status(201).json({
      message: "Gửi đơn nghỉ phép thành công",
      data: leave
    });
  } catch (error) {
    next(error);
  }
};

const getAllLeaves = async (req, res, next) => {
  try {
    const { employeeId, status, leaveType, page, limit } = req.query;

    const query = {};

    if (employeeId) {
      query.employeeId = employeeId;
    }

    if (status) {
      query.status = status;
    }

    if (leaveType) {
      query.leaveType = leaveType;
    }

    const totalItems = await Leave.countDocuments(query);
    const pagination = getPagination(page, limit, totalItems);

    const leaves = await Leave.find(query)
      .populate("employeeId", "employeeCode fullName email")
      .sort({ createdAt: -1 })
      .skip(pagination.skip)
      .limit(pagination.limit);

    res.status(200).json({
      message: "Lấy danh sách đơn nghỉ phép thành công",
      data: leaves,
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

const getMyLeaves = async (req, res, next) => {
  try {
    const queryEmp = [
      { email: req.user.email },
      { userId: req.user._id }
    ];
    if (req.user.employeeId) {
      queryEmp.push({ _id: req.user.employeeId });
    }

    const employee = await Employee.findOne({ $or: queryEmp });
    if (!employee) {
      return res.status(400).json({
        message: "Không tìm thấy thông tin nhân viên"
      });
    }

    const { status, leaveType, page, limit } = req.query;
    const query = { employeeId: employee._id };

    if (status) {
      query.status = status;
    }

    if (leaveType) {
      query.leaveType = leaveType;
    }

    const totalItems = await Leave.countDocuments(query);
    const pagination = getPagination(page, limit, totalItems);

    const leaves = await Leave.find(query)
      .populate("employeeId", "employeeCode fullName email")
      .sort({ createdAt: -1 })
      .skip(pagination.skip)
      .limit(pagination.limit);

    res.status(200).json({
      message: "Lấy danh sách đơn nghỉ phép cá nhân thành công",
      data: leaves,
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

const getLeaveById = async (req, res, next) => {
  try {
    const leave = await Leave.findById(req.params.id)
      .populate("employeeId", "employeeCode fullName email");

    if (!leave) {
      return res.status(404).json({
        message: "Không tìm thấy dữ liệu"
      });
    }

    if (req.user.role === "staff") {
      const queryEmp = [
        { email: req.user.email },
        { userId: req.user._id }
      ];
      if (req.user.employeeId) {
        queryEmp.push({ _id: req.user.employeeId });
      }

      const employee = await Employee.findOne({ $or: queryEmp });
      const employeeId = leave.employeeId._id
        ? leave.employeeId._id.toString()
        : leave.employeeId.toString();

      if (!employee || employee._id.toString() !== employeeId) {
        return res.status(403).json({
          message: "Bạn không có quyền xem đơn nghỉ phép này"
        });
      }
    }

    res.status(200).json({
      message: "Lấy thông tin đơn nghỉ phép thành công",
      data: leave
    });
  } catch (error) {
    next(error);
  }
};

const approveLeave = async (req, res, next) => {
  try {
    const leave = await Leave.findById(req.params.id);
    if (!leave) {
      return res.status(404).json({
        message: "Không tìm thấy dữ liệu"
      });
    }

    if (leave.status !== "pending") {
      return res.status(400).json({
        message: "Chỉ đơn nghỉ phép có trạng thái pending mới được duyệt"
      });
    }

    leave.status = "approved";
    await leave.save();

    res.status(200).json({
      message: "Duyệt đơn nghỉ phép thành công",
      data: leave
    });
  } catch (error) {
    next(error);
  }
};

const rejectLeave = async (req, res, next) => {
  try {
    const leave = await Leave.findById(req.params.id);
    if (!leave) {
      return res.status(404).json({
        message: "Không tìm thấy dữ liệu"
      });
    }

    if (leave.status !== "pending") {
      return res.status(400).json({
        message: "Chỉ đơn nghỉ phép có trạng thái pending mới được từ chối"
      });
    }

    leave.status = "rejected";
    await leave.save();

    res.status(200).json({
      message: "Từ chối đơn nghỉ phép thành công",
      data: leave
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createLeave,
  getAllLeaves,
  getMyLeaves,
  getLeaveById,
  approveLeave,
  rejectLeave
};
