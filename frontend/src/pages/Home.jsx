import React from "react";
import { useNavigate } from "react-router-dom";

function Home() {
  const navigate = useNavigate();

  const days = ["S", "M", "T", "W", "T", "F", "S"];
  const currentDay = 5;

  const monthDays = Array.from({ length: 31 }, (_, i) => i + 1);

  return (
    <div className="leet-home">
      <aside className="leet-sidebar">
        <h2 className="leet-logo">🧠 LeetBrains</h2>

        <div className="side-item">📚 Library</div>
        <div className="side-item">⚔️ Quest</div>
        <div className="side-item">🌍 Explore</div>
        <div className="side-item">🎯 Study Plan</div>
      </aside>

      <main className="leet-main">
        <div className="leet-topbar">
          <h1>Problems</h1>
          <button onClick={() => navigate("/login")}>Login</button>
        </div>

        <section className="hero-card">
          <h2>🚀 Start Coding Journey</h2>
          <p>Practice 300+ problems in Arrays, Strings and Trees.</p>
          <button onClick={() => navigate("/login")}>Start Now</button>
        </section>

        <section className="topic-row">
          <div className="topic-pill">Array 100</div>
          <div className="topic-pill">String 100</div>
          <div className="topic-pill">Tree 100</div>
        </section>
      </main>

      <aside className="leet-right">
        <h3 className="calendar-title">📅 Calendar</h3>

        <div className="calendar-card">
          <div className="calendar-header">
            <button className="cal-arrow">‹</button>
            <h4>May 2026</h4>
            <button className="cal-arrow">›</button>
          </div>

          <p className="streak-text">🔥 5 day streak</p>

          <div className="week-row">
            {days.map((d, index) => (
              <span key={index}>{d}</span>
            ))}
          </div>

          <div className="real-calendar-grid">
            {/* May 2026 starts on Friday, so 5 empty boxes */}
            <span></span>
            <span></span>
            <span></span>
            <span></span>
            <span></span>

            {monthDays.map((day) => (
              <span
                key={day}
                className={day === currentDay ? "active-day" : ""}
              >
                {day}
              </span>
            ))}
          </div>
        </div>
      </aside>
    </div>
  );
}

export default Home;