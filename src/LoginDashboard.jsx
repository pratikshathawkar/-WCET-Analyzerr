
import React, { useState } from "react";
import "./LoginDashboard.css";

function LoginDashboard({ onLogin, onCreateAccount }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    setErrorMessage("");

    if (!username.trim() || !password) {
      setErrorMessage("Please enter email and password.");
      return;
    }

    if (typeof onLogin !== "function") {
      setErrorMessage(
        "Login configuration error. Please check App.jsx."
      );
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(
        "http://localhost:8080/api/login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: username.trim(),
            password: password,
          }),
        }
      );

      const data = await response.json().catch(() => ({}));

      console.log("Login HTTP status:", response.status);
      console.log("Login response:", data);

      if (!response.ok || data.success !== true) {
        setErrorMessage(
          data.message || "Login failed. Check your email and password."
        );
        return;
      }

      const user =
        data.user || { email: username.trim() };

      // Save the authenticated user.
      localStorage.setItem("wcetUser", JSON.stringify(user));

      // Notify the parent component to open the analyzer.
      try {
        await onLogin(user);
      } catch (callbackError) {
        console.error("Login callback error:", callbackError);
        localStorage.removeItem("wcetUser");
        setErrorMessage(
          "Login succeeded, but the dashboard could not open. Please try again."
        );
      }
    } catch (error) {
      console.error("Login error:", error);
      setErrorMessage(
        "Unable to connect to WCET backend. Make sure the backend is running on port 8080."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleCreateAccount = () => {
    if (typeof onCreateAccount === "function") {
      onCreateAccount();
    } else {
      setErrorMessage(
        "Create Account is not configured yet."
      );
    }
  };

  return (
    <div className="wcet-page">
      <header className="wcet-header">
        <div className="brand">
          <div className="brand-logo">W</div>
          <div className="brand-name">WCET Analyzer</div>
        </div>

        <div className="header-badge">
          <span>Static Analysis</span>
          <b>•</b>
          <span>Real-Time Systems</span>
        </div>
      </header>

      <main className="wcet-main">
        <section className="hero-section">
          <div className="hero-badge">
            STATIC ANALYSIS
            <span>•</span>
            REAL-TIME SYSTEMS
          </div>

          <div className="hero-content">
            <div className="hero-text">
              <h1>
                Analyze Code.
                <br />
                <span>Estimate Worst-Case</span>
                <br />
                <span>Execution Time.</span>
              </h1>

              <p className="hero-description">
                WCET Analyzer uses static analysis techniques
                to examine program structure, control flow,
                and execution paths to estimate Worst-Case
                Execution Time without executing the program.
              </p>
            </div>

            <div className="analysis-visual">
              <div className="code-window">
                <div className="window-dots">
                  <span></span>
                  <span></span>
                  <span></span>
                </div>

                <pre>{`int compute(int n) {
    int sum = 0;

    for (int i = 0; i < n; i++) {
        if (i % 2 == 0)
            sum += i;
        else
            sum += 2 * i;
    }

    return sum;
}`}</pre>
              </div>

              <div className="cfg-mini">
                <div className="cfg-node start">Start</div>
                <div className="cfg-arrow">↓</div>
                <div className="cfg-node decision">i &lt; n?</div>

                <div className="cfg-branches">
                  <span>Yes</span>
                  <div className="cfg-node body">Body</div>
                  <span>No</span>
                </div>

                <div className="cfg-arrow">↓</div>
                <div className="cfg-node end">End</div>
              </div>

              <div className="analysis-labels">
                <div>
                  <span></span>
                  CFG Analysis
                </div>
                <div>
                  <span></span>
                  Abstract
                  <br />
                  Interpretation
                </div>
                <div>
                  <span></span>
                  WCET
                  <br />
                  Estimation
                </div>
              </div>
            </div>
          </div>

          <div className="feature-grid">
            <div className="feature-card">
              <div className="feature-icon cfg-icon">⬡</div>
              <span className="feature-number">01</span>
              <h3>Control Flow Graph</h3>
              <p>
                Visualize program execution paths and
                understand how control moves through your code.
              </p>
            </div>

            <div className="feature-card purple-card">
              <div className="feature-icon time-icon">◷</div>
              <span className="feature-number">02</span>
              <h3>WCET Estimation</h3>
              <p>
                Estimate the maximum possible execution time
                based on analyzed execution paths.
              </p>
            </div>

            <div className="feature-card">
              <div className="feature-icon ai-icon">◉</div>
              <span className="feature-number">03</span>
              <h3>Abstract Interpretation</h3>
              <p>
                Analyze program behavior using static analysis
                without executing the source code.
              </p>
            </div>
          </div>

          <div className="analysis-flow">
            <div className="flow-card">
              <div className="flow-icon">&lt;/&gt;</div>
              <h4>Source Code</h4>
              <p>Your program</p>
            </div>

            <div className="flow-arrow">→</div>

            <div className="flow-card">
              <div className="flow-icon purple-flow">⬡</div>
              <h4>CFG Analysis</h4>
              <p>Build control flow graph</p>
            </div>

            <div className="flow-arrow">→</div>

            <div className="flow-card">
              <div className="flow-icon cyan-flow">◉</div>
              <h4>Abstract Interpretation</h4>
              <p>Analyze program states</p>
            </div>

            <div className="flow-arrow">→</div>

            <div className="flow-card">
              <div className="flow-icon blue-flow">◷</div>
              <h4>WCET Estimation</h4>
              <p>Maximum execution time</p>
            </div>
          </div>

          <div className="why-wcet">
            <div className="why-text">
              <h2>Why WCET?</h2>
              <p>
                In real-time systems, knowing the maximum execution
                time of a program is important for meeting timing
                deadlines and ensuring predictable system behavior.
              </p>
            </div>

            <div className="why-flow">
              <div className="why-item">
                <div className="why-icon">▣</div>
                <span>Real-Time<br />Systems</span>
              </div>

              <div className="why-arrow">→</div>

              <div className="why-item">
                <div className="why-icon purple">◉</div>
                <span>Timing<br />Constraints</span>
              </div>

              <div className="why-arrow">→</div>

              <div className="why-item">
                <div className="why-icon">◷</div>
                <span>WCET<br />Estimation</span>
              </div>

              <div className="why-arrow">→</div>

              <div className="why-item">
                <div className="why-icon purple">✓</div>
                <span>Predictable<br />Execution</span>
              </div>
            </div>
          </div>
        </section>

        <section className="login-section">
          <div className="login-card">
            <div className="login-logo">W</div>

            <h2>Welcome Back</h2>
            <p className="login-subtitle">
              Access your WCET Analyzer
            </p>

            {errorMessage && (
              <div className="login-error" role="alert">
                ⚠️ {errorMessage}
              </div>
            )}

            <form onSubmit={handleLogin}>
              <div className="input-group">
                <label>
                  <span className="input-icon">♙</span>
                  <input
                    type="email"
                    placeholder="Email"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    autoComplete="email"
                    required
                  />
                </label>
              </div>

              <div className="input-group">
                <label>
                  <span className="input-icon">🔒</span>
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    autoComplete="current-password"
                    required
                  />

                  <button
                    type="button"
                    className="show-password"
                    onClick={() => setShowPassword((value) => !value)}
                  >
                    {showPassword ? "Hide" : "Show"}
                  </button>
                </label>
              </div>

              <button
                type="submit"
                className="login-button"
                disabled={loading}
              >
                <span>{loading ? "Logging in..." : "Login"}</span>
                <span>→</span>
              </button>
            </form>

            <div className="or-divider">
              <span></span>
              <b>OR</b>
              <span></span>
            </div>

            <button
              type="button"
              className="create-account-button"
              onClick={handleCreateAccount}
            >
              <span className="create-icon">♙+</span>
              <span>Create Account</span>
            </button>

            <div className="security-message">
              <span>♢</span>
              <span>
                Secure access to your analysis dashboard
              </span>
            </div>

            <div className="login-footer">
              WCET Analyzer
              <span>•</span>
              Static Analysis Tool
            </div>
          </div>
        </section>
      </main>

      <footer className="wcet-footer">
        <span>WCET Analyzer</span>
        <span>Static Analysis Tool</span>
        <span>Real-Time Systems</span>
      </footer>
    </div>
  );
}

export default LoginDashboard;
