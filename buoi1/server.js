// 1. Nạp module 'http' có sẵn trong Node.js (Import Spell Book)
const http = require("http");


// 2. Khởi tạo Web Server
const server = http.createServer((req, res) => {
    // Callback này sẽ được kích hoạt mỗi khi có một Request gõ cửa server

    // Thiết lập HTTP Header: Mã 200 (Thành công), Định dạng nội dung là Text
    res.writeHead(200, { "Content-Type": "text/plain; charset=utf-8"});

    // Gửi gói hàng Response và đóng kết nối
    res.end("Welcome the first hero to Server Node.js");
});

// 3. Mở cổng đón khách tại Port 3000 (Địa chỉ làng: localhost:3000)
server.listen(3000, () => {
    console.log("Server is running at http://localhost:3000");
});

const PORT = 3000;
server.listen(PORT, () => {
  console.log(`[SERVER STATUS]: Cổng thành đã mở tại http://localhost:${PORT}`);
});

