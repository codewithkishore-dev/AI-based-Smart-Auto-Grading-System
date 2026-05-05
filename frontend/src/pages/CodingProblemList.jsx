import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import API from "../api";

function CodingProblemList() {
  const { category } = useParams();
  const navigate = useNavigate();
  const [problems, setProblems] = useState([]);

  useEffect(() => {
    API.get(`/coding/problems/category/${category}`)
      .then((res) => setProblems(res.data))
      .catch((err) => {
        console.error(err);
        alert("Failed to load problems");
      });
  }, [category]);

  return (
    <div className="box">
      <button onClick={() => navigate("/coding-problems")}>Back</button>

      <h2>{category} Problems</h2>

      {problems.length === 0 ? (
        <p>No problems found</p>
      ) : (
        problems.map((p, index) => (
          <div className="card" key={p.id}>
            <h3>{index + 1}. {p.title}</h3>
            <p><b>Difficulty:</b> {p.difficulty}</p>
            <p>{p.description}</p>

            <button onClick={() => navigate(`/coding/${p.id}`)}>
              Solve Problem
            </button>
          </div>
        ))
      )}
    </div>
  );
}

export default CodingProblemList;