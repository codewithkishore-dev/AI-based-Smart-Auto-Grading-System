import React from "react";
import { useNavigate } from "react-router-dom";

function StudentDashboard() {
  const navigate = useNavigate();

  return (
    <div className="box student-page">
      <h2>Student Dashboard</h2>

      <div style={{ textAlign: "center", marginTop: "30px" }}>
        <button onClick={() => navigate("/submit")}>
          Submit Theory Answer
        </button>

        <button onClick={() => navigate("/coding-problems")}>
          Coding Problems
        </button>
      </div>
    </div>
  );
}

export default StudentDashboard;