// multi-route-server.js
const http = require("http");

const server = http.createServer((req, res) => {
  const url = req.url;
  const method = req.method;

  // Ghi nhật ký (Log) mỗi lượt truy cập vào Console Server
  console.log(`[LOG] Có hiệp sĩ truy cập: ${method} ${url}`);

  if (url === "/" || url === "/home") {
    res.writeHead(200, { "Content-Type": "text/plain; charset=utf-8" });
    res.end("🏰 Chào mừng bạn đã đặt chân đến Quảng trường Trung tâm Henesys!");
  } 
  else if (url === "/about") {
    res.writeHead(200, { "Content-Type": "text/plain; charset=utf-8" });
    res.end("📖 Thông tin: Hệ thống Server-side Development được vận hành bởi Node.js.");
  } 
  else if (url === "/contact") {
    res.writeHead(200, { "Content-Type": "text/plain; charset=utf-8" });
    res.end("📬 Liên hệ Đội ngũ Quản trị Game: admin@maplestory-node.dev | Hotline: 1900-NODE");
  } 
  else if (url === "/nodejs") {
    res.writeHead(200, { "Content-Type": "text/plain; charset=utf-8" });
    res.end("⚡ Node.js: Môi trường thực thi JavaScript bất đồng bộ, Non-blocking I/O.");
  } 
  else {
    // Nếu người chơi đi vào vùng đất không có trên bản đồ
    res.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
    res.end("❌ 404 NOT FOUND: Vùng đất này không tồn tại trong bản đồ Maple World!");
  }
});

const PORT = 4000;
server.listen(PORT, () => {
  console.log(`Server Routing đang hoạt động tại http://localhost:${PORT}`);
});