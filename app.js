const http = require("http");
const { handleRequest } = require("./modules/routes");

const hostname = "127.0.0.1";
const port = 3000;

const server = http.createServer(handleRequest);

server.listen(port, hostname, () => {
  console.log(`Serveris veikia adresu http://${hostname}:${port}/`);
});
