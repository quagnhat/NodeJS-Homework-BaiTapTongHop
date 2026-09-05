const {printReport} = require("./student");

const students = [
    {
    name: "Nguyễn Văn An",
    scores: [8.5, 9.0, 9.5]
  },
  {
    name: "Trần Thị Bình",
    scores: [7.0, 6.5, 8.0]
  },
  {
    name: "Lê Hoàng Long",
    scores: [5.0, 4.5, 6.0]
  }
];

console.log("=========================================");
console.log("= BẢNG BÁO CÁO KẾT QUẢ HỌC TẬP HỌC VIÊN =");
console.log("=========================================");

students.forEach((student) => {
  printReport(student);
});
console.log("-----------------------------------------");