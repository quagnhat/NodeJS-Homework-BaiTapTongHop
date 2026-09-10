const mongoose = require("mongoose");

const leaveSchema = new mongoose.Schema(
  {
    employeeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Employee",
      required: [true, "Nhân viên không được để trống"]
    },
    leaveType: {
      type: String,
      required: [true, "Loại nghỉ phép không được để trống"],
      enum: {
        values: ["annual", "sick", "unpaid"],
        message: "Loại nghỉ phép chỉ nhận: annual, sick, unpaid"
      }
    },
    startDate: {
      type: Date,
      required: [true, "Ngày bắt đầu không được để trống"]
    },
    endDate: {
      type: Date,
      required: [true, "Ngày kết thúc không được để trống"]
    },
    reason: {
      type: String,
      required: [true, "Lý do không được để trống"],
      trim: true
    },
    status: {
      type: String,
      enum: {
        values: ["pending", "approved", "rejected"],
        message: "Trạng thái chỉ nhận: pending, approved, rejected"
      },
      default: "pending"
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model("Leave", leaveSchema);
