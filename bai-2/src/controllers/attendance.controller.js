const Attendance = require("../models/Attendance");
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

const checkIn = async (req, res, next) => {
  try {
    const employee = await getEmployeeForRequest(req);
    if (!employee) {
      return res.status(400).json({
        message: "Không tìm thấy thông tin nhân viên"
      });
    }

    const now = new Date();
    const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0, 0);
    const endOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59, 999);

    const existingAttendance = await Attendance.findOne({
      employeeId: employee._id,
      date: { $gte: startOfDay, $lte: endOfDay }
    });

    if (existingAttendance && existingAttendance.checkIn) {
      return res.status(400).json({
        message: "Nhân viên đã check-in trong ngày hôm nay"
      });
    }

    const validStatuses = ["present", "late", "absent", "leave"];
    const status = req.body.status && validStatuses.includes(req.body.status)
      ? req.body.status
      : "present";

    let attendance;
    if (existingAttendance) {
      existingAttendance.checkIn = now;
      existingAttendance.status = status;
      attendance = await existingAttendance.save();
    } else {
      attendance = await Attendance.create({
        employeeId: employee._id,
        date: startOfDay,
        checkIn: now,
        status: status
      });
    }

    res.status(200).json({
      message: "Check-in thành công",
      data: attendance
    });
  } catch (error) {
    next(error);
  }
};

const checkOut = async (req, res, next) => {
  try {
    const employee = await getEmployeeForRequest(req);
    if (!employee) {
      return res.status(400).json({
        message: "Không tìm thấy thông tin nhân viên"
      });
    }

    const now = new Date();
    const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0, 0);
    const endOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59, 999);

    const attendance = await Attendance.findOne({
      employeeId: employee._id,
      date: { $gte: startOfDay, $lte: endOfDay }
    });

    if (!attendance || !attendance.checkIn) {
      return res.status(400).json({
        message: "Không thể check-out khi chưa check-in"
      });
    }

    if (attendance.checkOut) {
      return res.status(400).json({
        message: "Nhân viên đã check-out trong ngày hôm nay"
      });
    }

    const diffMilliseconds = now.getTime() - new Date(attendance.checkIn).getTime();
    const workingHours = Number((diffMilliseconds / (1000 * 60 * 60)).toFixed(2));

    attendance.checkOut = now;
    attendance.workingHours = workingHours;
    await attendance.save();

    res.status(200).json({
      message: "Check-out thành công",
      data: attendance
    });
  } catch (error) {
    next(error);
  }
};

const getAllAttendances = async (req, res, next) => {
  try {
    const { employeeId, fromDate, toDate, page, limit } = req.query;

    const query = {};

    if (employeeId) {
      query.employeeId = employeeId;
    }

    if (fromDate || toDate) {
      query.date = {};
      if (fromDate) {
        query.date.$gte = new Date(fromDate);
      }
      if (toDate) {
        const end = new Date(toDate);
        end.setHours(23, 59, 59, 999);
        query.date.$lte = end;
      }
    }

    const totalItems = await Attendance.countDocuments(query);
    const pagination = getPagination(page, limit, totalItems);

    const attendances = await Attendance.find(query)
      .populate("employeeId", "employeeCode fullName email")
      .sort({ date: -1 })
      .skip(pagination.skip)
      .limit(pagination.limit);

    res.status(200).json({
      message: "Lấy danh sách chấm công thành công",
      data: attendances,
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

const getMyAttendances = async (req, res, next) => {
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

    const { fromDate, toDate, page, limit } = req.query;
    const query = { employeeId: employee._id };

    if (fromDate || toDate) {
      query.date = {};
      if (fromDate) {
        query.date.$gte = new Date(fromDate);
      }
      if (toDate) {
        const end = new Date(toDate);
        end.setHours(23, 59, 59, 999);
        query.date.$lte = end;
      }
    }

    const totalItems = await Attendance.countDocuments(query);
    const pagination = getPagination(page, limit, totalItems);

    const attendances = await Attendance.find(query)
      .populate("employeeId", "employeeCode fullName email")
      .sort({ date: -1 })
      .skip(pagination.skip)
      .limit(pagination.limit);

    res.status(200).json({
      message: "Lấy dữ liệu chấm công cá nhân thành công",
      data: attendances,
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

const getAttendanceByEmployeeId = async (req, res, next) => {
  try {
    const { fromDate, toDate, page, limit } = req.query;
    const query = { employeeId: req.params.employeeId };

    if (fromDate || toDate) {
      query.date = {};
      if (fromDate) {
        query.date.$gte = new Date(fromDate);
      }
      if (toDate) {
        const end = new Date(toDate);
        end.setHours(23, 59, 59, 999);
        query.date.$lte = end;
      }
    }

    const totalItems = await Attendance.countDocuments(query);
    const pagination = getPagination(page, limit, totalItems);

    const attendances = await Attendance.find(query)
      .populate("employeeId", "employeeCode fullName email")
      .sort({ date: -1 })
      .skip(pagination.skip)
      .limit(pagination.limit);

    res.status(200).json({
      message: "Lấy dữ liệu chấm công nhân viên thành công",
      data: attendances,
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

module.exports = {
  checkIn,
  checkOut,
  getAllAttendances,
  getMyAttendances,
  getAttendanceByEmployeeId
};
