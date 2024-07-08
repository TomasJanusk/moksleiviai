const url = require("url");
const {
  renderHome,
  renderClass,
  renderStudent,
  renderSearch,
  renderSorted,
  renderAverages,
} = require("./render");

const handleRequest = (req, res) => {
  const reqUrl = url.parse(req.url, true);
  const pathname = reqUrl.pathname;

  if (pathname === "/" && req.method === "GET") {
    renderHome(res);
  } else if (pathname.startsWith("/class/") && req.method === "GET") {
    const className = pathname.split("/")[2];
    renderClass(res, className);
  } else if (pathname.startsWith("/student/") && req.method === "GET") {
    const id = parseInt(pathname.split("/")[2]);
    renderStudent(res, id);
  } else if (pathname === "/search" && req.method === "GET") {
    const query = reqUrl.query;
    renderSearch(res, query);
  } else if (pathname === "/sort" && req.method === "GET") {
    renderSorted(res);
  } else if (pathname === "/averages" && req.method === "GET") {
    renderAverages(res);
  } else {
    res.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
    res.write("Puslapis nerastas");
    res.end();
  }
};

module.exports = { handleRequest };
