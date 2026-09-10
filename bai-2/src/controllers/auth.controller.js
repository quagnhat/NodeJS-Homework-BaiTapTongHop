const User = require("../models/User");
const Employee = require("../models/Employee");
const generateToken = require("../utils/generateToken");

const register = async (req, res, next) => {
  try {
    const { fullName, email, password, role, status } = req.body;

    if (!fullName || !email || !password) {
      return res.status(400).json({
        message: "Vui lòng nhập đầy đủ họ tên, email và mật khẩu"
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        message: "Mật khẩu phải có ít nhất 6 ký tự"
      });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        message: "Email đã được sử dụng"
      });
    }

    const employee = await Employee.findOne({ email });

    const newUser = await User.create({
      fullName,
      email,
      password,
      role: role || "staff",
      status: status || "active",
      employeeId: employee ? employee._id : null
    });

    if (employee && !employee.userId) {
      employee.userId = newUser._id;
      await employee.save();
    }

    res.status(201).json({
      message: "Đăng ký tài khoản thành công",
      data: {
        _id: newUser._id,
        fullName: newUser.fullName,
        email: newUser.email,
        role: newUser.role,
        status: newUser.status
      }
    });
  } catch (error) {
    next(error);
  }
};

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: "Vui lòng nhập email và mật khẩu"
      });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({
        message: "Email hoặc mật khẩu không chính xác"
      });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({
        message: "Email hoặc mật khẩu không chính xác"
      });
    }

    if (user.status === "inactive") {
      return res.status(403).json({
        message: "Tài khoản của bạn đã bị vô hiệu hóa"
      });
    }

    const token = generateToken(user._id, user.role);

    res.status(200).json({
      message: "Đăng nhập thành công",
      token: token,
      user: {
        _id: user._id,
        fullName: user.fullName,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    next(error);
  }
};

const getMe = async (req, res, next) => {
  try {
    res.status(200).json({
      message: "Lấy thông tin người dùng thành công",
      data: req.user
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  register,
  login,
  getMe
};
