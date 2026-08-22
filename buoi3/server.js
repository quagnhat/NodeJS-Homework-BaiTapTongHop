const http = require("http");

const products = [
  { id: 1, name: "Laptop" },
  { id: 2, name: "Mouse" }
];

const server = http.createServer((req, res) => {
  if (req.url === "/") {
    res.writeHead(200, { "Content-Type": "text/html" });
    res.end("<h1>Home Page</h1>");
  } else if (req.url === "/products") {
    res.writeHead(200, { "Content-Type": "text/html" });
    res.end("<h1>Product List</h1><ul><li>Laptop</li><li>Mouse</li></ul>");
  } else if (req.url === "/api/products") {
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify(products));
  } else {
    res.writeHead(404, { "Content-Type": "text/plain" });
    res.end("404 Not Found");
  }
});

server.listen(3000);
