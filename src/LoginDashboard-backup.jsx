import { useState } from "react";

import "./LoginDashboard.css";

function LoginDashboard() {
  const [page, setPage] = useState("login");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loggedUser, setLoggedUser] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = (e) => {
    e.preventDefault();

    if (!username.trim() || !password.trim()) {
      alert("Please enter username and password.");
      return;
    }

    setLoggedUser(username.trim());
    setPage("dashboard");
  };

  const handleLogout = () => {
    setUsername("");
    setPassword("");
    setLoggedUser("");
    setPage("login");
  };

  if (page === "analyzer") {
    return (
      <div className="analyzer-wrapper">
        <div className="analyzer-topbar">
          <div className="brand-small">
            <div className="brand-icon">W</div>
            <span>WCET Analyzer</span>
          </div>

          <div className="user-actions">
            <span>Hi, {loggedUser}</span>

            <button onClick={() => setPage("dashboard")}>
              Dashboard
            </button>

            <button onClick={handleLogout} className="logout-small">
              Logout
            </button>
          </div>
        </div>

        <App />
      </div>
    );
  }

  if (page === "dashboard") {
    return (
      <div className="dashboard-page">
        <header className="dashboard-header">
          <div className="brand">
            <div className="brand-icon">W</div>

            <div>
              <div className="brand-name">WCET Analyzer</div>
              <div className="brand-label">
                Worst-Case Execution Time Analysis
              </div>
            </div>
          </div>

          <div className="header-user">
            <span>Welcome, {loggedUser}</span>

            <button onClick={handleLogout}>
              Logout
            </button>
          </div>
        </header>

        <main className="dashboard-content">
          <div className="welcome-badge">
            STATIC ANALYSIS TOOL
          </div>

          <h1>
            Welcome, <span>{loggedUser}</span>
          </h1>

          <p className="dashboard-description">
            Analyze your source code and estimate its
            <strong> Worst-Case Execution Time (WCET)</strong>
            using static analysis techniques.
          </p>

          <button
            className="launch-button"
            onClick={() => setPage("analyzer")}
          >
            <span>Open WCET Analyzer</span>
            <span className="arrow">→</span>
          </button>

          <div className="feature-line">
            <span>Static Analysis</span>
            <span>•</span>
            <span>Control Flow Graph</span>
            <span>•</span>
            <span>WCET Estimation</span>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="login-page">
      <div className="login-background-shape shape-one"></div>
      <div className="login-background-shape shape-two"></div>

      <div className="login-container">
        <div className="login-info">
          <div className="login-brand">
            <div className="large-brand-icon">W</div>

            <div>
              <h2>WCET Analyzer</h2>
              <p>Worst-Case Execution Time Analysis</p>
            </div>
          </div>

          <div className="login-intro">
            <div className="intro-label">
              STATIC ANALYSIS • REAL-TIME SYSTEMS
            </div>

            <h1>
              Analyze your code.
              <br />
              Understand its <span>WCET.</span>
            </h1>

            <p>
              A simple tool for analyzing source code and estimating
              Worst-Case Execution Time through static analysis.
            </p>
          </div>

          <div className="login-features">
            <div>
              <span className="feature-check">✓</span>
              <span>Control Flow Graph Analysis</span>
            </div>

            <div>
              <span className="feature-check">✓</span>
              <span>Worst-Case Execution Time</span>
            </div>

            <div>
              <span className="feature-check">✓</span>
              <span>Abstract Interpretation</span>
            </div>
          </div>
        </div>

        <div className="login-card">
          <div className="login-card-header">
            <h1>Welcome Back</h1>
            <p>Login to continue to your analyzer</p>
          </div>

          <form onSubmit={handleLogin}>
            <div className="input-group">
              <label>Username</label>

              <div className="input-wrapper">
                <span className="input-icon">👤</span>

                <input
                  type="text"
                  placeholder="Enter your username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
              </div>
            </div>

            <div className="input-group">
              <label>Password</label>

              <div className="input-wrapper">
                <span className="input-icon">🔒</span>

                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />

                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>
            </div>

            <button type="submit" className="login-button">
              Login
              <span>→</span>
            </button>
          </form>

          <div className="login-footer">
            <span>WCET Analyzer</span>
            <span>•</span>
            <span>Static Analysis Tool</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LoginDashboard;

