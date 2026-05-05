import React, { useState } from "react";
import { BrowserRouter, Routes, Route, Link, Navigate, useNavigate } from "react-router-dom";

import Home from "./pages/Home";
import Login from "./pages/Login";
import TeacherDashboard from "./pages/TeacherDashboard";
import StudentDashboard from "./pages/StudentDashboard";
import AddQuestion from "./pages/AddQuestion";
import SubmitAnswer from "./pages/SubmitAnswer";
import Results from "./pages/Results";
import StudentResultDetails from "./pages/StudentResultDetails";
import Analytics from "./pages/Analytics";
import CodingProblems from "./pages/CodingProblems";
import CodingProblemList from "./pages/CodingProblemList";
import CodeEditor from "./pages/CodeEditor";
import CodingResults from "./pages/CodingResults";

import "./style.css";

function Navbar({ user, setUser }) {
  const navigate = useNavigate();

  if (!user) return null;

  const logout = () => {
    localStorage.removeItem("user");
    setUser(null);
    navigate("/");
  };

  return (
    <nav>
      {user.role === "STUDENT" && (
        <>
          <Link to="/submit">Theory Answer</Link>
          <Link to="/coding-problems">Coding Problems</Link>
        </>
      )}

      {user.role === "TEACHER" && (
        <>
          <Link to="/add-question">Add Question</Link>
          <Link to="/results">Theory Results</Link>
          <Link to="/coding-results">Coding Results</Link>
          <Link to="/analytics">Analytics</Link>
        </>
      )}

      <button onClick={logout}>Logout</button>
    </nav>
  );
}

function AppContent() {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem("user");
    return saved ? JSON.parse(saved) : null;
  });

  return (
    <>
      <Navbar user={user} setUser={setUser} />

      <Routes>
        {/* Home page first */}
        <Route path="/" element={<Home />} />

        {/* Login page only when user clicks login/start */}
        <Route
          path="/login"
          element={
            user ? (
              <Navigate to={user.role === "TEACHER" ? "/teacher" : "/student"} />
            ) : (
              <Login setUser={setUser} />
            )
          }
        />

        <Route path="/teacher" element={<TeacherDashboard />} />
        <Route path="/student" element={<StudentDashboard />} />

        <Route path="/add-question" element={<AddQuestion />} />
        <Route path="/submit" element={<SubmitAnswer />} />
        <Route path="/results" element={<Results />} />
        <Route path="/student-results/:studentId" element={<StudentResultDetails />} />
        <Route path="/analytics" element={<Analytics />} />

        <Route path="/coding-problems" element={<CodingProblems />} />
        <Route path="/coding-problems/:category" element={<CodingProblemList />} />
        <Route path="/coding/:problemId" element={<CodeEditor />} />
        <Route path="/coding-results" element={<CodingResults />} />
      </Routes>
    </>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}

export default App;