const http = require("http");

const PORT = 3000;

const server = http.createServer((req, res) => {
    const url = req.url;
    const method = req.method;

    console.log(`[REQUEST]: ${method} ${url}`);

    if (url === "/") {
        res.writeHead(200, {"Content-Type": "text/plain; charset=utf-8" });
        res.end("Welcome to my Node.js homework.");
    } 
    else if (url === "/profile") {
        res.writeHead(200, {"Content-Type": "text/plain; charset=utf-8"});
        res.end(
            "Họ và tên: Cung Quang Nhật\n" + 
            "Lớp học: C2411L - NodeJS Backend Developer\n" +
            "Mục tiêu: Nắm vững kiến trúc Server-Side, xây dựng RESTful API và làm chủ hệ sinh thái Node.js."
        );
    } 
    else if (url === "/nodejs") {
        res.writeHead(200, {"Content-Type": "text/plain; charset=utf-8"});
        res.end(
            "<h1>About Server-side Development</h1>" +
            "<p>Server-side programming processes logic on the server.</p>"
        );
    }
    else if (url === "/api/server-info") {
        res.writeHead(200, {"Content-Type": "application/json; charset=utf-8"});
        const serverInfo = {
            runtime: "Node.js",
            language: "JavaScript",
            type: "server-side"
        };
        res.end(JSON.stringify(serverInfo));
    }
    else {
        res.writeHead(404, {"Content-Type": "text/plain; charset=utf-8"});
        res.end("404 not found.");
    }
});

server.listen(PORT, () => {
     console.log(`=================================================`);
  console.log(`Homework Server is running at potal: http://localhost:${PORT}`);
  console.log(`=================================================`);
});