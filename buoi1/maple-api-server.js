const http = require("http");

const server = http.createServer((req, res) => {
    const url = req.url;
    const method = req.method;

    console.log(`[LOG]: ${method} ${url}`);
    //Mỗi khi có ai truy cập, in ra terminal: [LOG]: Method - URL (ví dụ: [LOG]: GET /characters).
    
    if (url === "/" ){
        res.writeHead(200, {"Content-Type": "text/html; charset=utf-8"});
        res.end("<h1>Chào mừng đến với Maple World API!</h1>");
    } else if (url === "/api/character"){
        res.writeHead(200, {"Content-Type": "application/json; charset=utf-8"});
        res.end("name: Zack", "class: Thief","level: 30", "server: Scania");
    } else {
        res.writeHead(404, {"Content-Type": "text/plain; charset=utf-8"});
        res.end("404 Not Found: Khong tim thay ban do nay.");
    }
});