import React, { useState } from "react";
import api from "../api";

function AddQuestion() {
  const [questionText, setQuestionText] = useState("");
  const [modelAnswer, setModelAnswer] = useState("");
  const [maxMarks, setMaxMarks] = useState("");

  const saveQuestion = async () => {
    await api.post("/questions", {
      questionText,
      modelAnswer,
      maxMarks
    });

    alert("Question added successfully");
    setQuestionText("");
    setModelAnswer("");
    setMaxMarks("");
  };

  return (
    <div className="box">
      <h2>Add Question</h2>

      <textarea
        placeholder="Enter question"
        value={questionText}
        onChange={(e) => setQuestionText(e.target.value)}
      />

      <textarea
        placeholder="Enter model answer"
        value={modelAnswer}
        onChange={(e) => setModelAnswer(e.target.value)}
      />

      <input
        type="number"
        placeholder="Max marks"
        value={maxMarks}
        onChange={(e) => setMaxMarks(e.target.value)}
      />

      <button onClick={saveQuestion}>Save Question</button>
    </div>
  );
}

export default AddQuestion;