var http = require("http");
var hostname = "127.0.0.1";
var port = 8080;

const server = http.createServer((req, res) => {
  const path = req.url;
  const method = req.method;
  if (path === "/products") {
    if (method === "GET") {
      res.writeHead(200, {
        "Content-Type": "application/json",
      });
      const products = JSON.stringify([
        {
          name: "product1",
          price: 1000,
        },
      ]);
      res.end(products);
    } else if (method === "POST") {
      res.end("POST");
    }
  }
});

server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});
