import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api";

function Results() {
  const [students, setStudents] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));

    if (!user || user.role !== "TEACHER") {
      alert("Access denied. Only teachers can view results.");
      navigate("/");
      return;
    }

    loadResults();
  }, [navigate]);

  const loadResults = async () => {
    try {
      let res;

      try {
        res = await API.get("/submissions/results");
      } catch {
        res = await API.get("/submissions");
      }

      const grouped = {};

      res.data.forEach((r) => {
        const studentId = r.studentId || "Unknown ID";

        if (!grouped[studentId]) {
          grouped[studentId] = {
            studentId,
            studentName: r.studentName || "Unknown",
            totalAnswers: 0,
            totalMarks: 0,
          };
        }

        grouped[studentId].totalAnswers += 1;

        const marks =
          r.marks !== undefined
            ? Number(r.marks)
            : r.aiMarks !== undefined
            ? Number(r.aiMarks)
            : 0;

        grouped[studentId].totalMarks += marks;
      });

      setStudents(Object.values(grouped));
    } catch (err) {
      console.error("Results loading error:", err);
      alert("Failed to load results");
    }
  };

  return (
    <div className="box">
      <h2>Student Results</h2>

      {students.length === 0 ? (
        <p>No results found</p>
      ) : (
        students.map((s) => (
          <div
            className="card"
            key={s.studentId}
            onClick={() => navigate(`/student-results/${s.studentId}`)}
            style={{ cursor: "pointer" }}
          >
            <p><b>Student ID:</b> {s.studentId}</p>
            <p><b>Student Name:</b> {s.studentName}</p>
            <p><b>Questions Answered:</b> {s.totalAnswers}</p>
            <p><b>Total Marks:</b> {s.totalMarks}</p>
            <button>View Answers</button>
          </div>
        ))
      )}
    </div>
  );
}

export default Results;