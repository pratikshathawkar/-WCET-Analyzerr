import { useState } from "react";
import "./App.css";

export default function App() {
const [page, setPage] = useState("home");

const goTo = (target) => {
setPage(target);
window.scrollTo(0, 0);
};

if (page === "login") {
return <LoginPage goTo={goTo} />;
}

if (page === "signup") {
return <SignupPage goTo={goTo} />;
}

if (page === "dashboard") {
return <Dashboard goTo={goTo} />;
}

if (page === "analyzer") {
return <AnalyzerPage goTo={goTo} />;
}

return <HomePage goTo={goTo} />;
}

/* =========================
NAVBAR
========================= */

function Navbar({ goTo }) {
return ( <nav className="navbar">
<div
className="logo"
onClick={() => goTo("home")}
> <div className="logo-icon">⚡</div>

    <div>
      <h2>WCET Analyzer</h2>
      <span>Real-Time Code Analysis</span>
    </div>
  </div>

  <div className="nav-links">
    <button onClick={() => goTo("home")}>
      Home
    </button>

    <a href="#features">Features</a>

    <a href="#how-it-works">
      How It Works
    </a>

    <a href="#about">
      About
    </a>
  </div>

  <div className="nav-actions">
    <button
      className="login-btn"
      onClick={() => goTo("login")}
    >
      Login
    </button>

    <button
      className="signup-btn"
      onClick={() => goTo("signup")}
    >
      Create Account
    </button>
  </div>
</nav>

);
}

/* =========================
HOME PAGE
========================= */

function HomePage({ goTo }) {
return ( <div className="app"> <Navbar goTo={goTo} />

  <main>
    <section className="hero">
      <div className="hero-left">
        <div className="status-badge">
          <span className="status-dot"></span>
          STATIC ANALYSIS • REAL-TIME SYSTEMS
        </div>

        <h1>
          Analyze the
          <span> Worst-Case </span>
          Execution Time of Your Code.
        </h1>

        <p>
          WCET Analyzer helps developers and researchers
          estimate Worst-Case Execution Time, analyze
          control flow, inspect loops, and understand
          program execution behavior.
        </p>

        <div className="hero-buttons">
          <button
            className="primary-btn"
            onClick={() => goTo("signup")}
          >
            Start Analyzing →
          </button>

          <button
            className="secondary-btn"
            onClick={() => {
              document
                .getElementById("features")
                ?.scrollIntoView({
                  behavior: "smooth",
                });
            }}
          >
            Explore Features
          </button>
        </div>

        <div className="trust-row">
          <div>
            <strong>WCET</strong>
            <span>Analysis</span>
          </div>

          <div>
            <strong>CFG</strong>
            <span>Visualization</span>
          </div>

          <div>
            <strong>AI</strong>
            <span>Abstract State</span>
          </div>
        </div>
      </div>

      <div className="hero-right">
        <div className="glow"></div>

        <div className="analysis-card">
          <div className="card-top">
            <div>
              <span className="small-label">
                ANALYSIS RESULT
              </span>

              <h3>Worst-Case Execution</h3>
            </div>

            <div className="completed">
              ● Completed
            </div>
          </div>

          <div className="wcet-number">
            <span>174</span>
            <small>μs</small>
          </div>

          <p className="wcet-title">
            Estimated Worst-Case Execution Time
          </p>

          <div className="metrics">
            <div>
              <span>Lines of Code</span>
              <strong>87</strong>
            </div>

            <div>
              <span>Complexity</span>
              <strong className="high">
                High
              </strong>
            </div>

            <div>
              <span>Loop Bound</span>
              <strong>25</strong>
            </div>

            <div>
              <span>CFG</span>
              <strong>Generated</strong>
            </div>
          </div>

          <div className="graph">
            <div className="graph-line line1"></div>
            <div className="graph-line line2"></div>
            <div className="graph-line line3"></div>

            <div className="graph-node n1">●</div>
            <div className="graph-node n2">●</div>
            <div className="graph-node n3">●</div>
            <div className="graph-node n4">●</div>
            <div className="graph-node n5">●</div>
          </div>

          <div className="card-footer">
            <span>Control Flow Graph</span>
            <span>16 connections</span>
          </div>
        </div>
      </div>
    </section>


    <section
      className="features-section"
      id="features"
    >
      <div className="section-heading">
        <span>POWERFUL ANALYSIS</span>

        <h2>
          Everything You Need for WCET Analysis
        </h2>

        <p>
          Analyze your program from source code to
          execution-time estimation with one
          powerful platform.
        </p>
      </div>

      <div className="feature-grid">
        <Feature
          icon="⚡"
          title="Execution Time"
          text="Estimate the Worst-Case Execution Time of your program."
        />

        <Feature
          icon="⌘"
          title="Code Analysis"
          text="Analyze loops, decisions, operations and program structure."
        />

        <Feature
          icon="◇"
          title="Control Flow Graph"
          text="Visualize program execution paths using an interactive CFG."
        />

        <Feature
          icon="◈"
          title="Abstract Interpretation"
          text="Inspect possible variable values and program states."
        />

        <Feature
          icon="↻"
          title="Loop Analysis"
          text="Detect loops and calculate their maximum execution bounds."
        />

        <Feature
          icon="▤"
          title="Analysis Report"
          text="View important WCET metrics and analysis results."
        />
      </div>
    </section>


    <section
      className="how-section"
      id="how-it-works"
    >
      <div className="section-heading">
        <span>HOW IT WORKS</span>

        <h2>
          From Source Code to WCET
        </h2>

        <p>
          Our analysis pipeline breaks down your
          program and calculates its worst-case
          execution behavior.
        </p>
      </div>

      <div className="pipeline">
        <Pipeline
          number="01"
          title="Source Code"
          icon="</>"
        />

        <div className="arrow">→</div>

        <Pipeline
          number="02"
          title="Code Analysis"
          icon="⌘"
        />

        <div className="arrow">→</div>

        <Pipeline
          number="03"
          title="CFG"
          icon="◇"
        />

        <div className="arrow">→</div>

        <Pipeline
          number="04"
          title="Loop Analysis"
          icon="↻"
        />

        <div className="arrow">→</div>

        <Pipeline
          number="05"
          title="WCET"
          icon="⚡"
        />
      </div>
    </section>


    <section
      className="about-section"
      id="about"
    >
      <div className="about-content">
        <span>ABOUT WCET ANALYZER</span>

        <h2>
          Understand Your Code.
          <br />
          Predict Its Worst Case.
        </h2>

        <p>
          WCET Analyzer is designed for static
          analysis of programs used in real-time
          and embedded systems. It provides
          developers and students with an easy way
          to understand execution time, control
          flow and program behavior.
        </p>

        <button
          className="primary-btn"
          onClick={() => goTo("signup")}
        >
          Create Your Account →
        </button>
      </div>

      <div className="about-stat">
        <div>
          <strong>01</strong>
          <span>Static Analysis</span>
        </div>

        <div>
          <strong>02</strong>
          <span>Control Flow</span>
        </div>

        <div>
          <strong>03</strong>
          <span>WCET Estimation</span>
        </div>
      </div>
    </section>
  </main>

  <Footer goTo={goTo} />
</div>

);
}

/* =========================
FEATURE CARD
========================= */

function Feature({ icon, title, text }) {
return ( <div className="feature-card"> <div className="feature-icon">
{icon} </div>

  <h3>{title}</h3>

  <p>{text}</p>

  <span className="feature-arrow">→</span>
</div>

);
}

/* =========================
PIPELINE
========================= */

function Pipeline({
number,
title,
icon,
}) {
return ( <div className="pipeline-box"> <span>{number}</span>

  <div className="pipeline-icon">
    {icon}
  </div>

  <h3>{title}</h3>
</div>

);
}

/* =========================
LOGIN
========================= */

function LoginPage({ goTo }) {
const [email, setEmail] = useState("");
const [password, setPassword] = useState("");

const handleLogin = async (e) => {
e.preventDefault();

if (!email || !password) {
  alert(
    "Please enter email and password."
  );
  return;
}

try {
  const response = await fetch(
    "http://localhost:8080/api/login",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
        password,
      }),
    }
  );

  const data = await response.json();

  if (
    response.ok &&
    data.status === "success"
  ) {
    localStorage.setItem(
      "user",
      JSON.stringify(data.user)
    );

    alert("Login successful!");

    goTo("dashboard");
  } else {
    alert(
      data.error ||
        "Invalid email or password."
    );
  }
} catch (error) {
  console.error(
    "Login error:",
    error
  );

  alert(
    "Unable to connect to WCET backend. Make sure the backend is running on port 8080."
  );
}

};

return ( <div className="auth-page"> <div className="auth-background"></div>

  <div className="auth-card">
    <button
      className="back-home"
      onClick={() => goTo("home")}
    >
      ← Back to Home
    </button>

    <div className="auth-logo">
      <div className="logo-icon">
        ⚡
      </div>

      <h2>WCET Analyzer</h2>
    </div>

    <h1>Welcome Back</h1>

    <p className="auth-subtitle">
      Login to continue your code analysis.
    </p>

    <form onSubmit={handleLogin}>
      <label>Email Address</label>

      <input
        type="email"
        placeholder="Enter your email"
        value={email}
        onChange={(e) =>
          setEmail(e.target.value)
        }
      />

      <label>Password</label>

      <input
        type="password"
        placeholder="Enter your password"
        value={password}
        onChange={(e) =>
          setPassword(e.target.value)
        }
      />

      <div className="forgot-row">
        <label className="remember">
          <input type="checkbox" />
          Remember me
        </label>

        <button type="button">
          Forgot Password?
        </button>
      </div>

      <button
        className="auth-submit"
        type="submit"
      >
        Login →
      </button>
    </form>

    <div className="auth-divider">
      <span>OR</span>
    </div>

    <p className="account-text">
      Don't have an account?

      <button
        onClick={() =>
          goTo("signup")
        }
      >
        Create Account
      </button>
    </p>
  </div>
</div>

);
}

/* =========================
SIGNUP
========================= */

function SignupPage({ goTo }) {
const [name, setName] = useState("");
const [email, setEmail] = useState("");
const [password, setPassword] = useState("");
const [confirmPassword, setConfirmPassword] =
useState("");

const handleSignup = async (e) => {
e.preventDefault();

if (
  !name ||
  !email ||
  !password ||
  !confirmPassword
) {
  alert("Please fill all fields.");
  return;
}

if (password !== confirmPassword) {
  alert("Passwords do not match.");
  return;
}

try {
  const response = await fetch(
    "http://localhost:8080/api/signup",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name,
        email,
        password,
      }),
    }
  );

  const data = await response.json();

  if (
    response.ok &&
    data.status === "success"
  ) {
    alert(
      "Account created successfully!"
    );

    goTo("login");
  } else {
    alert(
      data.error ||
        "Unable to create account."
    );
  }
} catch (error) {
  console.error(
    "Signup error:",
    error
  );

  alert(
    "Unable to connect to WCET backend. Make sure the backend is running on port 8080."
  );
}

};

return ( <div className="auth-page"> <div className="auth-background"></div>

  <div className="auth-card signup-card">
    <button
      className="back-home"
      onClick={() => goTo("home")}
    >
      ← Back to Home
    </button>

    <div className="auth-logo">
      <div className="logo-icon">
        ⚡
      </div>

      <h2>WCET Analyzer</h2>
    </div>

    <h1>Create Account</h1>

    <p className="auth-subtitle">
      Create your account and start analyzing
      code.
    </p>

    <form onSubmit={handleSignup}>
      <label>Full Name</label>

      <input
        type="text"
        placeholder="Enter your name"
        value={name}
        onChange={(e) =>
          setName(e.target.value)
        }
      />

      <label>Email Address</label>

      <input
        type="email"
        placeholder="Enter your email"
        value={email}
        onChange={(e) =>
          setEmail(e.target.value)
        }
      />

      <label>Password</label>

      <input
        type="password"
        placeholder="Create a password"
        value={password}
        onChange={(e) =>
          setPassword(e.target.value)
        }
      />

      <label>Confirm Password</label>

      <input
        type="password"
        placeholder="Confirm your password"
        value={confirmPassword}
        onChange={(e) =>
          setConfirmPassword(
            e.target.value
          )
        }
      />

      <label className="terms">
        <input
          type="checkbox"
          required
        />
        I agree to the Terms & Conditions
      </label>

      <button
        className="auth-submit"
        type="submit"
      >
        Create Account →
      </button>
    </form>

    <p className="account-text">
      Already have an account?

      <button
        onClick={() =>
          goTo("login")
        }
      >
        Login
      </button>
    </p>
  </div>
</div>

);
}

/* =========================
DASHBOARD
========================= */

function Dashboard({ goTo }) {
return ( <div className="dashboard-page"> <Navbar goTo={goTo} />

  <div className="dashboard-container">
    <div className="dashboard-header">
      <div>
        <span>
          WELCOME TO WCET ANALYZER
        </span>

        <h1>
          Your Analysis
          <span> Dashboard</span>
        </h1>

        <p>
          Analyze source code and estimate
          Worst-Case Execution Time.
        </p>
      </div>

      <button
        className="primary-btn"
        onClick={() =>
          goTo("analyzer")
        }
      >
        Open WCET Analyzer →
      </button>
    </div>


    <div className="dashboard-cards">
      <div className="dashboard-card">
        <span>⚡</span>
        <h3>Execution Time</h3>
        <strong>174 μs</strong>
        <p>
          Latest WCET estimation
        </p>
      </div>

      <div className="dashboard-card">
        <span>◇</span>
        <h3>Control Flow</h3>
        <strong>16</strong>
        <p>
          Execution connections
        </p>
      </div>

      <div className="dashboard-card">
        <span>↻</span>
        <h3>Loop Analysis</h3>
        <strong>25</strong>
        <p>
          Maximum iterations
        </p>
      </div>

      <div className="dashboard-card">
        <span>▤</span>
        <h3>Analysis Status</h3>

        <strong className="success-text">
          Ready
        </strong>

        <p>
          System operational
        </p>
      </div>
    </div>


    <div className="dashboard-main-card">
      <div>
        <span className="small-label">
          WCET ANALYZER
        </span>

        <h2>
          Ready to Analyze Your Program?
        </h2>

        <p>
          Submit your C/C++ source code and
          inspect execution time, loops, CFG
          and abstract program states.
        </p>
      </div>

      <button
        className="primary-btn"
        onClick={() =>
          goTo("analyzer")
        }
      >
        Analyze Code →
      </button>
    </div>
  </div>
</div>

);
}

/* =========================
WCET ANALYZER
========================= */

function AnalyzerPage({ goTo }) {
const [code, setCode] = useState(
`#include <stdio.h>

int main() {
int sum = 0;

for (int i = 0; i < 10; i++) {
    sum = sum + i;
}

printf("%d", sum);

return 0;

}`
);

const [result, setResult] =
useState(null);

const [loading, setLoading] =
useState(false);

const [error, setError] =
useState("");

const analyzeCode = async () => {
if (!code.trim()) {
alert(
"Please enter C/C++ source code."
);
return;
}

setLoading(true);
setError("");
setResult(null);

try {
  const response = await fetch(
    "http://localhost:8080/api/analyze",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        code: code,
      }),
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.error ||
        data.message ||
        "WCET analysis failed."
    );
  }

  setResult(data);
} catch (err) {
  console.error(
    "WCET analysis error:",
    err
  );

  setError(
    "Unable to connect to the WCET backend. Make sure the Java backend is running on port 8080."
  );
} finally {
  setLoading(false);
}

};

const clearAnalyzer = () => {
setCode("");
setResult(null);
setError("");
};

return ( <div className="dashboard-page"> <Navbar goTo={goTo} />

  <div
    className="dashboard-container"
    style={{
      maxWidth: "1200px",
      margin: "0 auto",
    }}
  >
    <div className="dashboard-header">
      <div>
        <span>
          STATIC ANALYSIS • REAL-TIME SYSTEMS
        </span>

        <h1>
          WCET
          <span> Analyzer</span>
        </h1>

        <p>
          Enter your C/C++ source code and
          analyze its Worst-Case Execution Time.
        </p>
      </div>

      <button
        className="secondary-btn"
        onClick={() =>
          goTo("dashboard")
        }
      >
        ← Dashboard
      </button>
    </div>


    <div
      className="dashboard-main-card"
      style={{
        display: "block",
        marginBottom: "25px",
      }}
    >
      <span className="small-label">
        SOURCE CODE
      </span>

      <h2>
        Enter code for WCET analysis
      </h2>

      <textarea
        value={code}
        onChange={(e) =>
          setCode(e.target.value)
        }
        spellCheck="false"
        style={{
          width: "100%",
          minHeight: "360px",
          marginTop: "20px",
          padding: "18px",
          borderRadius: "12px",
          border: "1px solid #d8dee9",
          background: "#111827",
          color: "#f9fafb",
          fontFamily:
            "Consolas, monospace",
          fontSize: "14px",
          lineHeight: "1.6",
          resize: "vertical",
          boxSizing: "border-box",
          outline: "none",
        }}
      />

      <div
        style={{
          display: "flex",
          gap: "12px",
          marginTop: "18px",
        }}
      >
        <button
          className="primary-btn"
          onClick={analyzeCode}
          disabled={loading}
        >
          {loading
            ? "Analyzing..."
            : "Analyze WCET →"}
        </button>

        <button
          className="secondary-btn"
          onClick={clearAnalyzer}
        >
          Clear
        </button>
      </div>

      {error && (
        <div
          style={{
            marginTop: "20px",
            padding: "15px",
            borderRadius: "10px",
            background: "#fee2e2",
            color: "#991b1b",
          }}
        >
          {error}
        </div>
      )}
    </div>


    {result && (
      <>
        <div
          className="dashboard-cards"
          style={{
            marginBottom: "25px",
          }}
        >
          <div className="dashboard-card">
            <span>⚡</span>

            <h3>
              Worst-Case Execution
            </h3>

            <strong>
              {result.wcet ?? "--"} μs
            </strong>

            <p>
              Estimated WCET
            </p>
          </div>

          <div className="dashboard-card">
            <span>▤</span>

            <h3>
              Lines of Code
            </h3>

            <strong>
              {result.lines ?? "--"}
            </strong>

            <p>
              Analyzed lines
            </p>
          </div>

          <div className="dashboard-card">
            <span>↻</span>

            <h3>
              Loop Iterations
            </h3>

            <strong>
              {result.loopIterations ??
                "--"}
            </strong>

            <p>
              Maximum iterations
            </p>
          </div>

          <div className="dashboard-card">
            <span>◇</span>

            <h3>
              Worst Path
            </h3>

            <strong>
              {result.worstPathCost ??
                "--"}
            </strong>

            <p>
              Path cost
            </p>
          </div>
        </div>


        <div
          className="dashboard-main-card"
          style={{
            display: "block",
          }}
        >
          <span className="small-label">
            ANALYSIS RESULTS
          </span>

          <h2>
            WCET Analysis Report
          </h2>

          <div
            style={{
              display: "grid",
              gridTemplateColumns:
                "repeat(auto-fit, minmax(220px, 1fr))",
              gap: "18px",
              marginTop: "25px",
            }}
          >
            <ResultItem
              title="WCET"
              value={
                result.wcet !== undefined
                  ? `${result.wcet} μs`
                  : "--"
              }
            />

            <ResultItem
              title="Lines"
              value={
                result.lines ??
                "--"
              }
            />

            <ResultItem
              title="Loop Variable"
              value={
                result.loopVariable ??
                "--"
              }
            />

            <ResultItem
              title="Maximum Iterations"
              value={
                result.maximumIterations ??
                result.loopIterations ??
                "--"
              }
            />

            <ResultItem
              title="Operation Cost"
              value={
                result.operationCost ??
                "--"
              }
            />

            <ResultItem
              title="Worst Path Cost"
              value={
                result.worstPathCost ??
                "--"
              }
            />
          </div>


          <div
            style={{
              marginTop: "30px",
            }}
          >
            <h3>
              Abstract State
            </h3>

            <pre
              style={{
                marginTop: "12px",
                padding: "18px",
                background: "#111827",
                color: "#f9fafb",
                borderRadius: "10px",
                overflowX: "auto",
                fontSize: "13px",
              }}
            >
              {formatResult(
                result.abstractState
              )}
            </pre>
          </div>


          <div
            style={{
              marginTop: "30px",
            }}
          >
            <h3>
              Control Flow Graph
            </h3>

            <pre
              style={{
                marginTop: "12px",
                padding: "18px",
                background: "#111827",
                color: "#f9fafb",
                borderRadius: "10px",
                overflowX: "auto",
                fontSize: "13px",
              }}
            >
              {formatResult(
                result.cfg
              )}
            </pre>
          </div>
        </div>
      </>
    )}
  </div>
</div>

);
}

/* =========================
RESULT ITEM
========================= */

function ResultItem({
title,
value,
}) {
return (
<div
style={{
padding: "20px",
borderRadius: "12px",
background: "#f8fafc",
border: "1px solid #e2e8f0",
}}
>
<span
style={{
display: "block",
fontSize: "13px",
color: "#64748b",
marginBottom: "8px",
}}
>
{title} </span>

  <strong
    style={{
      fontSize: "22px",
    }}
  >
    {value}
  </strong>
</div>

);
}

/* =========================
RESULT FORMATTER
========================= */

function formatResult(value) {
if (
value === undefined ||
value === null
) {
return "No data available.";
}

if (
typeof value === "string"
) {
return value;
}

try {
return JSON.stringify(
value,
null,
2
);
} catch {
return String(value);
}
}

/* =========================
FOOTER
========================= */

function Footer({ goTo }) {
return ( <footer> <div className="footer-main"> <div className="footer-brand"> <div className="logo"> <div className="logo-icon">
⚡ </div>

        <div>
          <h2>WCET Analyzer</h2>
          <span>
            Real-Time Code Analysis
          </span>
        </div>
      </div>

      <p>
        Analyze, understand and estimate
        the Worst-Case Execution Time of
        your programs.
      </p>
    </div>


    <div className="footer-links">
      <h3>Product</h3>

      <button
        onClick={() =>
          goTo("home")
        }
      >
        Home
      </button>

      <a href="#features">
        Features
      </a>

      <a href="#how-it-works">
        How It Works
      </a>
    </div>


    <div className="footer-links">
      <h3>Account</h3>

      <button
        onClick={() =>
          goTo("login")
        }
      >
        Login
      </button>

      <button
        onClick={() =>
          goTo("signup")
        }
      >
        Create Account
      </button>
    </div>
  </div>


  <div className="footer-bottom">
    <span>
      © 2026 WCET Analyzer
    </span>

    <span>
      Static Analysis • Real-Time Systems
    </span>
  </div>
</footer>

);
}
