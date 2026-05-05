import React, { useEffect, useState } from "react";
import API from "../api";

function SubmitAnswer() {
  const [questions, setQuestions] = useState([]);
  const [questionId, setQuestionId] = useState("");
  const [studentId, setStudentId] = useState("");
  const [studentName, setStudentName] = useState("");
  const [answer, setAnswer] = useState("");
  const [submittedResult, setSubmittedResult] = useState(null);

  useEffect(() => {
    API.get("/questions")
      .then((res) => setQuestions(res.data))
      .catch((err) => console.log(err));
  }, []);

  const submitAnswer = async () => {
    try {
      if (!studentId || !studentName || !questionId || !answer) {
        alert("Please fill all fields");
        return;
      }

      if (!/^2023PECCB\d{3}$/.test(studentId)) {
        alert("Student ID must be like 2023PECCB001 to 2023PECCB999");
        return;
      }

      const res = await API.post("/submissions", {
        questionId: Number(questionId),
        studentId: studentId,
        studentName: studentName,
        studentAnswer: answer,
      });

      setSubmittedResult(res.data);

      alert("Answer submitted successfully");

      setStudentId("");
      setStudentName("");
      setQuestionId("");
      setAnswer("");
    } catch (err) {
      console.log(err);
      alert("Submit failed. Check backend and AI service.");
    }
  };

  return (
    <div className="box">
      <h2>Submit Answer</h2>

      <input
        placeholder="Student ID e.g. 2023PECCB001"
        value={studentId}
        onChange={(e) => setStudentId(e.target.value)}
      />

      <input
        placeholder="Student Name"
        value={studentName}
        onChange={(e) => setStudentName(e.target.value)}
      />

      <select value={questionId} onChange={(e) => setQuestionId(e.target.value)}>
        <option value="">Select Question</option>
        {questions.map((q) => (
          <option key={q.id} value={q.id}>
            {q.questionText}
          </option>
        ))}
      </select>

      <textarea
        placeholder="Enter your answer"
        value={answer}
        onChange={(e) => setAnswer(e.target.value)}
      />

      <button onClick={submitAnswer}>Submit</button>

      {submittedResult && (
        <div className="card">
          <h3>Submitted Result</h3>
          <p><b>Marks:</b> {submittedResult.aiMarks}</p>
          <p><b>Feedback:</b> {submittedResult.feedback}</p>
          <p><b>Plagiarism Score:</b> {submittedResult.plagiarismScore}%</p>
          <p><b>Plagiarism Status:</b> {submittedResult.plagiarismStatus}</p>
        </div>
      )}
    </div>
  );
}

export default SubmitAnswer;