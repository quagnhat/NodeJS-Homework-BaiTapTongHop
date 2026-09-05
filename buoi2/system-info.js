const os = require("os");

// 1. Tên hệ điều hành
const osType = os.type();

// 2. Nền tảng (Platform)
const platform = os.platform();

// 3. Tổng dung lượng RAM (Đổi từ bytes sang GB)
const totalRAM = (os.totalmem() / Math.pow(1024, 3)).toFixed(2) + " GB";

// 4. Dung lượng RAM còn trống (Đổi sang GB)
const freeRAM = (os.freemem() / Math.pow(1024, 3)).toFixed(2) + " GB";

// 5. Số lượng nhân CPU (Cores)
const cpuCores = os.cpus().length;

// In báo cáo hệ thống ra màn hình Console
console.log("=========================================");
console.log(" THÔNG TIN HỆ THỐNG MÁY CHỦ (SYSTEM INFO)");
console.log("=========================================");
console.log(` Tên hệ điều hành : ${osType}`);
console.log(` Nền tảng (Platform): ${platform}`);
console.log(` Tổng dung lượng RAM: ${totalRAM}`);
console.log(` RAM còn trống     : ${freeRAM}`);
console.log(` Số nhân CPU (Cores): ${cpuCores} cores`);
console.log("=========================================");