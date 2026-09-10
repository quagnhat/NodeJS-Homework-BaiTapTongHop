const mongoose = require("mongoose");

const attendanceSchema = new mongoose.Schema(
  {
    employeeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Employee",
      required: [true, "Nhân viên không được để trống"]
    },
    date: {
      type: Date,
      required: [true, "Ngày chấm công không được để trống"]
    },
    checkIn: {
      type: Date,
      default: null
    },
    checkOut: {
      type: Date,
      default: null
    },
    workingHours: {
      type: Number,
      default: 0
    },
    status: {
      type: String,
      enum: {
        values: ["present", "late", "absent", "leave"],
        message: "Trạng thái chỉ nhận: present, late, absent, leave"
      },
      default: "present"
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model("Attendance", attendanceSchema);
