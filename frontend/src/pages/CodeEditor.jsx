import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import API from "../api";

const starterCodes = {
  java: `public class Main {
    public static void main(String[] args) {
        System.out.println("Write your answer here");
    }
}`,

  python: `def solve():
    print("Write your answer here")

solve()`,

  c: `#include <stdio.h>

int main() {
    printf("Write your answer here");
    return 0;
}`
};

function CodeEditor() {
  const { problemId } = useParams();
  const navigate = useNavigate();

  const [problem, setProblem] = useState(null);
  const [testCases, setTestCases] = useState([]);
  const [language, setLanguage] = useState("java");
  const [code, setCode] = useState(starterCodes.java);
  const [runOutput, setRunOutput] = useState("");

  useEffect(() => {
    API.get(`/coding/problems/${problemId}`)
      .then((res) => {
        setProblem(res.data.problem);
        setTestCases(res.data.testCases);
      })
      .catch((err) => {
        console.error(err);
        alert("Failed to load problem");
      });
  }, [problemId]);

  const changeLanguage = (lang) => {
    setLanguage(lang);
    setCode(starterCodes[lang]);
    setRunOutput("");
  };

  const validateLanguageCode = () => {
    const c = code.toLowerCase();

    if (language === "java") {
      return c.includes("class") && c.includes("public static void main") && c.includes("system.out");
    }

    if (language === "python") {
      return c.includes("def ") || c.includes("print(") || c.includes("input(");
    }

    if (language === "c") {
      return c.includes("#include") && c.includes("int main") && c.includes("printf");
    }

    return false;
  };

  const runCode = () => {
    if (!validateLanguageCode()) {
      setRunOutput(`❌ Invalid ${language.toUpperCase()} code. Please write only ${language.toUpperCase()} code.`);
      return;
    }

    if (!testCases || testCases.length === 0) {
      setRunOutput("No sample test case found");
      return;
    }

    setRunOutput(
      `✅ ${language.toUpperCase()} compiler selected\n\n` +
      `Sample Input:\n${testCases[0].inputData}\n\n` +
      `Expected Output:\n${testCases[0].expectedOutput}\n\n` +
      `Status: Sample test accepted for selected language format`
    );
  };

  const submitCode = async () => {
    const user = JSON.parse(localStorage.getItem("user"));

    if (!user || user.role !== "STUDENT") {
      alert("Only students can submit coding answers");
      navigate("/");
      return;
    }

    if (!validateLanguageCode()) {
      alert(`Rejected: Please write valid ${language.toUpperCase()} code only`);
      return;
    }

    const studentId = prompt("Enter Student ID e.g. 2023PECCB001");
    const studentName = prompt("Enter Student Name");

    if (!studentId || !studentName) {
      alert("Student ID and name are required");
      return;
    }

    if (!/^2023PECCB\d{3}$/.test(studentId)) {
      alert("Student ID must be like 2023PECCB001 to 2023PECCB999");
      return;
    }

    try {
      const res = await API.post("/coding/submit", {
        studentId,
        studentName,
        problemId: Number(problemId),
        language,
        code,
      });

      alert(
        `Submitted Successfully\nLanguage: ${language.toUpperCase()}\nScore: ${res.data.score}\nStatus: ${res.data.status}`
      );

      navigate("/student");
    } catch (err) {
      console.error(err);
      alert("Code submission failed");
    }
  };

  if (!problem) {
    return <div className="box">Loading problem...</div>;
  }

  return (
    <div className="box">
      <button onClick={() => navigate("/coding-problems")}>Back</button>

      <h2>{problem.title}</h2>

      <div className="card">
        <p><b>Difficulty:</b> {problem.difficulty}</p>
        <p><b>Description:</b> {problem.description}</p>
        <p><b>Input Format:</b> {problem.inputFormat}</p>
        <p><b>Output Format:</b> {problem.outputFormat}</p>

        <p><b>Sample Input:</b></p>
        <pre>{problem.sampleInput}</pre>

        <p><b>Sample Output:</b></p>
        <pre>{problem.sampleOutput}</pre>
      </div>

      <h3>Compiler</h3>

      <select value={language} onChange={(e) => changeLanguage(e.target.value)}>
        <option value="java">Java</option>
        <option value="python">Python</option>
        <option value="c">C</option>
      </select>

      <h3>{language.toUpperCase()} Code Editor</h3>

      <textarea
        className="code-editor"
        value={code}
        onChange={(e) => setCode(e.target.value)}
      />

      <button onClick={runCode}>Run Code</button>
      <button onClick={submitCode}>Submit Code</button>

      {runOutput && (
        <div className="card">
          <h3>Compiler Output</h3>
          <pre>{runOutput}</pre>
        </div>
      )}
    </div>
  );
}

export default CodeEditor;