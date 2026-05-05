import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import jsPDF from "jspdf";
import API from "../api";

function StudentResultDetails() {
  const { studentId } = useParams();
  const navigate = useNavigate();
  const [answers, setAnswers] = useState([]);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));

    if (!user || user.role !== "TEACHER") {
      alert("Access denied. Only teachers can view this page.");
      navigate("/");
      return;
    }

    API.get(`/submissions/student/${studentId}`)
      .then((res) => setAnswers(res.data))
      .catch((err) => console.log(err));
  }, [studentId, navigate]);

  const downloadPDF = () => {
    if (answers.length === 0) return;

    const doc = new jsPDF();

    doc.setFontSize(16);
    doc.text("Student AI Grading Report", 20, 20);

    doc.setFontSize(12);
    doc.text(`Student ID: ${answers[0].studentId}`, 20, 35);
    doc.text(`Student Name: ${answers[0].studentName}`, 20, 45);

    let y = 60;

    answers.forEach((a, index) => {
      doc.text(`Question ${index + 1}: ${a.questionText}`, 20, y);
      y += 10;
      doc.text(`Answer: ${a.answer}`, 20, y);
      y += 10;
      doc.text(`Marks: ${a.marks}`, 20, y);
      y += 10;
      doc.text(`Feedback: ${a.feedback}`, 20, y);
      y += 10;
      doc.text(`Plagiarism: ${a.plagiarismScore}% - ${a.plagiarismStatus}`, 20, y);
      y += 15;

      if (y > 270) {
        doc.addPage();
        y = 20;
      }
    });

    doc.save(`${answers[0].studentName}_Report.pdf`);
  };

  return (
    <div className="box">
      <button onClick={() => navigate("/results")}>Back</button>
      <button onClick={downloadPDF}>Download PDF</button>

      <h2>Student Answer Details</h2>

      {answers.length === 0 ? (
        <p>No answers found</p>
      ) : (
        <>
          <div className="card">
            <p><b>Student ID:</b> {answers[0].studentId}</p>
            <p><b>Student Name:</b> {answers[0].studentName}</p>
          </div>

          {answers.map((a) => (
            <div className="card" key={a.submissionId}>
              <p><b>Question ID:</b> {a.questionId}</p>
              <p><b>Question:</b> {a.questionText}</p>
              <p><b>Answer:</b> {a.answer}</p>
              <p><b>Marks:</b> {a.marks}</p>
              <p><b>Feedback:</b> {a.feedback}</p>
              <p><b>Plagiarism Score:</b> {a.plagiarismScore}%</p>
              <p><b>Plagiarism Status:</b> {a.plagiarismStatus}</p>
            </div>
          ))}
        </>
      )}
    </div>
  );
}

export default StudentResultDetails;