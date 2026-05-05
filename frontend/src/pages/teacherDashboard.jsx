import React from "react";
import { useNavigate } from "react-router-dom";

function TeacherDashboard() {
  const navigate = useNavigate();

  return (
    <div className="box teacher-page">
      <h2>Teacher Dashboard</h2>

      <div style={{ textAlign: "center", marginTop: "30px" }}>
        <button onClick={() => navigate("/add-question")}>
          Add Theory Question
        </button>

        <button onClick={() => navigate("/results")}>
          Theory Results
        </button>

        <button onClick={() => navigate("/coding-results")}>
          Coding Results
        </button>

        <button onClick={() => navigate("/analytics")}>
          Analytics
        </button>
      </div>
    </div>
  );
}

export default TeacherDashboard;