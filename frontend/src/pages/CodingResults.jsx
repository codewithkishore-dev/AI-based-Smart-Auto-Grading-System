import React, { useEffect, useState } from "react";
import API from "../api";

function CodingResults() {
  const [submissions, setSubmissions] = useState([]);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));

    if (!user || user.role !== "TEACHER") {
      alert("Only teachers can view coding results");
      return;
    }

    API.get("/coding/submissions")
      .then((res) => setSubmissions(res.data))
      .catch((err) => {
        console.error(err);
        alert("Failed to load coding submissions");
      });
  }, []);

  return (
    <div className="box">
      <h2>Coding Results</h2>

      {submissions.length === 0 ? (
        <p>No coding submissions found</p>
      ) : (
        submissions.map((s) => (
          <div className="card" key={s.id}>
            <p><b>Student ID:</b> {s.studentId}</p>
            <p><b>Student Name:</b> {s.studentName}</p>
            <p><b>Problem:</b> {s.problemTitle}</p>
            <p><b>Language:</b> {s.language}</p>
            <p><b>Passed Tests:</b> {s.passedTests}/{s.totalTests}</p>
            <p><b>Score:</b> {s.score}</p>
            <p><b>Status:</b> {s.status}</p>
          </div>
        ))
      )}
    </div>
  );
}

export default CodingResults;