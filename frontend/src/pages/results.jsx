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

    API.get("/submissions/results")
      .then((res) => {
        const grouped = {};

        res.data.forEach((r) => {
          if (!grouped[r.studentId]) {
            grouped[r.studentId] = {
              studentId: r.studentId,
              studentName: r.studentName,
              totalAnswers: 0,
              totalMarks: 0,
            };
          }

          grouped[r.studentId].totalAnswers += 1;
          grouped[r.studentId].totalMarks += Number(r.marks);
        });

        setStudents(Object.values(grouped));
      })
      .catch((err) => {
        console.error(err);
        alert("Failed to load results");
      });
  }, [navigate]);

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