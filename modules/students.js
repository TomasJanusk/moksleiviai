const fs = require("fs");
const path = require("path");
let students = require("../data/students.json").moksleiviai;

const saveAveragesToFile = () => {
  const averages = students.map((student) => {
    const grades = Object.values(student.subjects_grades);
    const average =
      grades.reduce((acc, grade) => acc + grade, 0) / grades.length;
    return { ...student, average };
  });

  const averagesByClass = averages.reduce((acc, student) => {
    acc[student.class] = acc[student.class] || [];
    acc[student.class].push(student);
    return acc;
  }, {});

  fs.writeFileSync(
    "./data/averages.txt",
    JSON.stringify(averagesByClass, null, 2),
    "utf-8"
  );
};

const readAveragesFromFile = () => {
  if (fs.existsSync("./data/averages.txt")) {
    return JSON.parse(fs.readFileSync("./data/averages.txt", "utf-8"));
  }
  return {};
};

const getStudentById = (id) => {
  return students.find((student) => student.id === id);
};

const getStudentsByClass = (className) => {
  return students.filter((student) => student.class === className);
};

const searchStudents = (firstname, lastname, className) => {
  let filteredStudents = students;
  if (firstname) {
    filteredStudents = filteredStudents.filter((student) =>
      student.firstname.includes(firstname)
    );
  }
  if (lastname) {
    filteredStudents = filteredStudents.filter((student) =>
      student.lastName.includes(lastname)
    );
  }
  if (className) {
    filteredStudents = filteredStudents.filter(
      (student) => student.class === className
    );
  }
  return filteredStudents;
};

const sortStudentsByLastName = () => {
  return [...students].sort((a, b) => a.lastName.localeCompare(b.lastName));
};

module.exports = {
  saveAveragesToFile,
  readAveragesFromFile,
  getStudentById,
  getStudentsByClass,
  searchStudents,
  sortStudentsByLastName,
};
