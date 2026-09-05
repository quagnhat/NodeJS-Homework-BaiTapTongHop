function getAverage(scores) {
    if (!scores || scores.length === 0) return 0;

    const total = scores.reduce((sum, score) => sum + score, 0);
    const avg = total / scores.length;

    return Number(avg.toFixed(2));
}

function getRank(average) {
    if (average >= 9.0) return ("Xuất sắc (S-rank)");
    if (average >= 8.0) return ("Giỏi (A-rank)");
    if (average >= 6.5) return ("Khá (B-rank)");
    if (average >= 5.0) return ("Trung bình (C-rank)");
    return "Yếu (D-rank)";
}

function printReport(student) {
    const avg = getAverage(student.scores);
    const rank = getRank(avg);

    console.log("-----------------------------------------");
    console.log(`Học viên: ${student.name}`);
    console.log(`Danh sách điểm: [ ${student.scores.join(", ")} ]`);
    console.log(`Điểm trung bình: ${avg}`);
    console.log(`Xếp loại học lực: ${rank}`);
} 

module.exports = {
    getAverage,
    getRank,
    printReport
};