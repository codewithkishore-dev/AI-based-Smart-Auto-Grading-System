import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api";

function Login({ setUser }) {
  const navigate = useNavigate();

  const [isRegister, setIsRegister] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const goToDashboard = (user) => {
    localStorage.setItem("user", JSON.stringify(user));

    if (setUser) {
      setUser(user);
    }

    if (user.role === "TEACHER") {
      navigate("/teacher");
    } else {
      navigate("/student");
    }
  };

  const handleGoogleResponse = (response) => {
    const userObject = JSON.parse(atob(response.credential.split(".")[1]));

    const googleUser = {
      name: userObject.name,
      email: userObject.email,
      password: "google-login",
      role: userObject.email.endsWith("@college.edu") ? "TEACHER" : "STUDENT",
    };

    goToDashboard(googleUser);
  };

  useEffect(() => {
    if (window.google) {
      window.google.accounts.id.initialize({
        client_id:
          "991424211281-2e27008qqedndakf5i64vh7iv5892g4s.apps.googleusercontent.com",
        callback: handleGoogleResponse,
      });

      window.google.accounts.id.renderButton(
        document.getElementById("googleLoginBtn"),
        {
          theme: "outline",
          size: "large",
          shape: "pill",
          text: "continue_with",
        }
      );
    }
  }, []);

  const handleLogin = async () => {
    try {
      if (!email || !password) {
        alert("Enter email and password");
        return;
      }

      const res = await API.post("/auth/login", {
        email,
        password,
      });

      goToDashboard(res.data);
    } catch (err) {
      alert(err.response?.data || "Invalid credentials. Please sign up first.");
    }
  };

  const handleRegister = async () => {
    try {
      if (!name || !email || !password) {
        alert("Enter name, email and password");
        return;
      }

      const res = await API.post("/auth/register", {
        name,
        email,
        password,
      });

      alert("Account created successfully");
      goToDashboard(res.data);
    } catch (err) {
      alert(err.response?.data || "Registration failed");
    }
  };

  return (
    <div className="box login-page">
      <h1>{isRegister ? "Create Account" : "Login"}</h1>

      {isRegister && (
        <input
          type="text"
          placeholder="Enter Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      )}

      <input
        type="email"
        placeholder="Enter Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />

      <input
        type="password"
        placeholder="Enter Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      <button onClick={isRegister ? handleRegister : handleLogin}>
        {isRegister ? "Create Account" : "Login"}
      </button>

      <button onClick={() => setIsRegister(!isRegister)}>
        {isRegister ? "Already have account? Login" : "New user? Sign Up"}
      </button>

      <div style={{ marginTop: "18px" }}>
        <div id="googleLoginBtn"></div>
      </div>
    </div>
  );
}

window.google.accounts.id.renderButton(
  document.getElementById("googleLoginBtn"),
  {
    theme: "outline",
    size: "medium",   // 🔥 changed
    shape: "pill",
    text: "continue_with",
    width: 250        // 🔥 control width
  }
);

export default Login;