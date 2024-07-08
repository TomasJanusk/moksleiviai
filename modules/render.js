const {
  getStudentById,
  getStudentsByClass,
  searchStudents,
  sortStudentsByLastName,
  saveAveragesToFile,
  readAveragesFromFile,
} = require("./students");

const renderHtml = (res, html) => {
  res.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
  res.write(html);
  res.end();
};

const renderHome = (res) => {
  let students = require("../data/students.json").moksleiviai;
  let html = "<h1>Studentų informacinė sistema</h1>";
  html += `
        <form action="/search" method="GET">
            <input type="text" name="firstname" placeholder="Vardas">
            <input type="text" name="lastname" placeholder="Pavardė">
            <input type="text" name="className" placeholder="Klasė">
            <button type="submit">Ieškoti</button>
        </form>
        <a href="/sort">Rikiuoti pagal pavardę</a>
        <a href="/averages">Rodyti vidurkius</a>
        <ul>
    `;
  students.forEach((student) => {
    html += `
            <li>
                <strong>${student.firstname} ${student.lastName}</strong> - ${student.class}
                <a href="/student/${student.id}">Detali informacija</a>
            </li>
        `;
  });
  html += "</ul>";
  renderHtml(res, html);
};

const renderClass = (res, className) => {
  const filteredStudents = getStudentsByClass(className);
  let html = `<h1>Klasė ${className}</h1><ul>`;
  filteredStudents.forEach((student) => {
    html += `
            <li>
                <strong>${student.firstname} ${student.lastName}</strong>
                <a href="/student/${student.id}">Detali informacija</a>
            </li>
        `;
  });
  html += '</ul><a href="/">Atgal į pagrindinį</a>';
  renderHtml(res, html);
};

const renderStudent = (res, id) => {
  const student = getStudentById(id);
  if (student) {
    let html = `<h1>${student.firstname} ${student.lastName}</h1><p>Klasė: ${student.class}</p><h2>Pažymiai</h2><ul>`;
    Object.entries(student.subjects_grades).forEach(([subject, grade]) => {
      html += `<li>${subject}: ${grade}</li>`;
    });
    html += '</ul><a href="/">Atgal į pagrindinį</a>';
    renderHtml(res, html);
  } else {
    res.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
    res.write("Moksleivis nerastas");
    res.end();
  }
};

const renderSearch = (res, query) => {
  const { firstname, lastname, className } = query;
  const filteredStudents = searchStudents(firstname, lastname, className);
  let html = "<h1>Paieškos rezultatai</h1><ul>";
  filteredStudents.forEach((student) => {
    html += `
            <li>
                <strong>${student.firstname} ${student.lastName}</strong> - ${student.class}
                <a href="/student/${student.id}">Detali informacija</a>
            </li>
        `;
  });
  html += '</ul><a href="/">Atgal į pagrindinį</a>';
  renderHtml(res, html);
};

const renderSorted = (res) => {
  const sortedStudents = sortStudentsByLastName();
  let html = "<h1>Rūšiuota pagal pavardę</h1><ul>";
  sortedStudents.forEach((student) => {
    html += `
            <li>
                <strong>${student.firstname} ${student.lastName}</strong> - ${student.class}
                <a href="/student/${student.id}">Detali informacija</a>
            </li>
        `;
  });
  html += '</ul><a href="/">Atgal į pagrindinį</a>';
  renderHtml(res, html);
};

const renderAverages = (res) => {
  saveAveragesToFile();
  const averages = readAveragesFromFile();
  let html = "<h1>Klasės vidurkiai</h1>";
  Object.entries(averages).forEach(([className, students]) => {
    html += `<h2>Klasė ${className}</h2><ul>`;
    students.forEach((student) => {
      html += `<li><strong>${student.firstname} ${
        student.lastName
      }</strong> - Vidurkis: ${student.average.toFixed(2)}</li>`;
    });
    html += "</ul>";
  });
  html += '<a href="/">Atgal į pagrindinį</a>';
  renderHtml(res, html);
};

module.exports = {
  renderHome,
  renderClass,
  renderStudent,
  renderSearch,
  renderSorted,
  renderAverages,
};
