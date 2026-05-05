import React from "react";
import { useNavigate } from "react-router-dom";

function CodingProblems() {
  const navigate = useNavigate();

  const categories = [
    { title: "Array", count: 100, path: "ARRAY" },
    { title: "String", count: 100, path: "STRING" },
    { title: "Trees", count: 100, path: "TREE" },
  ];

  return (
    <div className="box">
      <h2>Coding Problem Categories</h2>

      <div className="category-grid">
        {categories.map((c) => (
          <div
            className="card category-card"
            key={c.path}
            onClick={() => navigate(`/coding-problems/${c.path}`)}
          >
            <h3>{c.title}</h3>
            <p><b>{c.count}</b> Problems</p>
            <button>View Problems</button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default CodingProblems;