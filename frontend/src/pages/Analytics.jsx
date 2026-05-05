import React, { useEffect, useState } from "react";
import API from "../api";

function Analytics() {
  const [data, setData] = useState(null);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));

    if (!user || user.role !== "TEACHER") {
      alert("Only teachers can view analytics");
      return;
    }

    API.get("/submissions/analytics")
      .then((res) => setData(res.data))
      .catch((err) => console.log(err));
  }, []);

  if (!data) return <div className="box">Loading analytics...</div>;

  return (
    <div className="box">
      <h2>Teacher Analytics Dashboard</h2>

      <div className="card">
        <h3>Overall Average Marks</h3>
        <p>{Number(data.averageMarks).toFixed(2)}</p>
      </div>

      <div className="card">
        <h3>Top Students</h3>
        {data.topStudents.map((s, index) => (
          <p key={index}>
            {index + 1}. {s.student} → Avg: {Number(s.average).toFixed(2)}
          </p>
        ))}
      </div>

      <div className="card">
        <h3>Weak Questions</h3>
        {data.weakQuestions.map((q, index) => (
          <p key={index}>
            Q{q.questionId}: {q.questionText} → Avg: {Number(q.average).toFixed(2)}
          </p>
        ))}
      </div>
    </div>
  );
}

export default Analytics;