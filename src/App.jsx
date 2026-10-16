import { useState, useRef } from "react";
import "./App.css";
import CFGVisualization from "./CFGVisualization";
import AbstractStateVisualization from "./AbstractStateVisualization";

function App({ user, onLogout }) {
  const [code, setCode] = useState("");
  const [result, setResult] = useState(null);
  const [cfg, setCfg] = useState(null);

  const [activeFeature, setActiveFeature] = useState(null);
  const [highlighted, setHighlighted] = useState(null);

  const [loading, setLoading] = useState(false);
  const [backendStatus, setBackendStatus] = useState("ready");
  const [errorMessage, setErrorMessage] = useState("");

  const codeCardRef = useRef(null);
  const wcetRef = useRef(null);
  const linesRef = useRef(null);
  const complexityRef = useRef(null);
  const statusRef = useRef(null);
  const cfgRef = useRef(null);
  const abstractRef = useRef(null);
  const featuresRef = useRef(null);

  const analyzeCode = async () => {
    if (!code.trim()) {
      setErrorMessage("Please enter some C/C++ source code first.");
      return;
    }

    setLoading(true);
    setBackendStatus("analyzing");
    setErrorMessage("");

    try {
      const response = await fetch(
        "http://localhost:8080/api/analyze",
        {
          method: "POST",
          headers: {
            "Content-Type": "text/plain",
          },
          body: code,
        }
      );

      if (!response.ok) {
        throw new Error("Backend returned status " + response.status);
      }

      const data = await response.json();

      const lines = code
        .split("\n")
        .filter((line) => line.trim() !== "")
        .length;

      const complexity =
        lines > 10
          ? "High"
          : lines > 5
          ? "Medium"
          : "Low";

      const normalizedAbstractState = (data.abstractState || []).map(
        (item) => ({
          name: item.name ?? item.variable ?? "unknown",
          variable: item.variable ?? item.name ?? "unknown",
          lower:
            item.lower === null || item.lower === undefined
              ? null
              : Number(item.lower),
          upper:
            item.upper === null || item.upper === undefined
              ? null
              : Number(item.upper),
        })
      );

      const analysisResult = {
        wcet: data.wcet ?? 0,
        lines,
        complexity,
        loopIterations: data.loopIterations ?? 1,
        operationCost: data.operationCost ?? 0,
        worstPathCost: data.worstPathCost ?? 1,
        abstractState: normalizedAbstractState,
        loopVariable: data.loopVariable ?? "",
        maximumIterations: data.maximumIterations ?? 0,
      };

      setResult(analysisResult);
      setCfg(data.cfg ?? null);
      setActiveFeature(null);
      setHighlighted(null);
      setBackendStatus("ready");

      setTimeout(() => {
        cfgRef.current?.scrollIntoView({
          behavior: "smooth",
          block: "center",
        });
      }, 400);
    } catch (error) {
      console.error("WCET Analysis Error:", error);

      setBackendStatus("error");

      setErrorMessage(
        "Unable to connect to WCET backend. Make sure WCETServer.java is running on port 8080."
      );

      setResult(null);
      setCfg(null);
    } finally {
      setLoading(false);
    }
  };

  const clearAll = () => {
    setCode("");
    setResult(null);
    setCfg(null);
    setActiveFeature(null);
    setHighlighted(null);
    setErrorMessage("");
    setBackendStatus("ready");
  };

  const scrollToBox = (ref, key) => {
    if (!result) {
      codeCardRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });

      setErrorMessage(
        "Run the analysis first, then click a feature."
      );

      return;
    }

    ref.current?.scrollIntoView({
      behavior: "smooth",
      block: "center",
    });

    setHighlighted(key);

    setTimeout(() => {
      setHighlighted(null);
    }, 1200);
  };

  const handleFeatureClick = (feature) => {
    setActiveFeature(
      activeFeature === feature ? null : feature
    );

    if (!result) {
      setTimeout(() => {
        codeCardRef.current?.scrollIntoView({
          behavior: "smooth",
          block: "center",
        });
      }, 100);
    }
  };

  const getStatusText = () => {
    if (backendStatus === "analyzing") {
      return "Analyzing...";
    }

    if (backendStatus === "error") {
      return "Backend Offline";
    }

    return "System Ready";
  };

  const getUserInitial = () => {
    if (!user?.name) return "U";
    return user.name.charAt(0).toUpperCase();
  };

  return (
    <div className="app">
      <header className="header">
        <div className="header-content">
          <div>
            <h1>⚡ WCET Analyzer</h1>
            <p>Worst-Case Execution Time Analysis Tool</p>
          </div>

          <div className="header-right">
            <div className="status status-ready">
              <span className="dot"></span>
              {getStatusText()}
            </div>

            {user && (
              <div className="user-info">
                <div className="user-avatar">
                  {getUserInitial()}
                </div>

                <div className="user-text">
                  <span>Logged in as</span>
                  <strong>{user.name}</strong>
                </div>
              </div>
            )}

            <button
  className="logout-btn"
  type="button"
  onClick={() => {
    console.log("Logout button clicked");

    if (typeof onLogout === "function") {
      onLogout();
    } else {
      console.error("onLogout function is missing");
    }
  }}
>
  🚪 Logout
</button>
          </div>
        </div>
      </header>

      <main className="container">
        <section className="intro">
          <div className="intro-badge">
            STATIC ANALYSIS • REAL-TIME SYSTEMS
          </div>

          <h2>Analyze Your Program</h2>

          <p>
            Estimate the Worst-Case Execution Time,
            analyze control flow and inspect abstract
            program states.
          </p>
        </section>

        {errorMessage && (
          <div className="error-banner">
            <span>⚠️</span>

            <div>
              <strong>Analysis Error</strong>
              <p>{errorMessage}</p>
            </div>

            <button
              onClick={() => setErrorMessage("")}
              type="button"
            >
              ×
            </button>
          </div>
        )}

        <div className="workspace">
          <section
            className="card code-card"
            ref={codeCardRef}
          >
            <div className="card-header">
              <div>
                <h3>📝 Source Code</h3>
              </div>

              <span>INPUT</span>
            </div>

            <textarea
              value={code}
              onChange={(e) => {
                setCode(e.target.value);
                setErrorMessage("");
              }}
              placeholder={
                "Enter your C/C++ code here...\n\n" +
                "Example:\n\n" +
                "int main() {\n\n" +
                "    int arr[5] = {\n" +
                "        64, 34, 25, 12, 22\n" +
                "    };\n\n" +
                "    int i, j, temp;\n\n" +
                "    for (i = 0; i < 5 - 1; i++) {\n\n" +
                "        for (j = 0;\n" +
                "             j < 5 - i - 1;\n" +
                "             j++) {\n\n" +
                "            if (arr[j] > arr[j + 1]) {\n\n" +
                "                temp = arr[j];\n" +
                "                arr[j] = arr[j + 1];\n" +
                "                arr[j + 1] = temp;\n" +
                "            }\n" +
                "        }\n" +
                "    }\n\n" +
                "    return 0;\n" +
                "}"
              }
            />

            <div className="code-info">
              <span>
                💡 Supports loops, decisions and operations
              </span>

              <span>
                Lines:{" "}
                {
                  code
                    .split("\n")
                    .filter((line) => line.trim() !== "")
                    .length
                }
              </span>
            </div>

            <div className="buttons">
              <button
                className="analyze-btn"
                onClick={analyzeCode}
                disabled={loading}
                type="button"
              >
                {loading ? (
                  <>
                    <span className="spinner"></span>
                    Analyzing...
                  </>
                ) : (
                  <>▶ Analyze WCET</>
                )}
              </button>

              <button
                className="clear-btn"
                onClick={clearAll}
                disabled={loading}
                type="button"
              >
                Clear
              </button>
            </div>
          </section>

          <section className="card result-card">
            <div className="card-header">
              <div>
                <h3>📊 Analysis Result</h3>

                <p className="card-description">
                  Worst-case execution analysis
                </p>
              </div>

              <span>OUTPUT</span>
            </div>

            {!result ? (
              <div className="empty">
                <div className="empty-icon">⏱️</div>

                <h3>No Analysis Yet</h3>

                <p>
                  Enter your source code and click
                  <b> Analyze WCET</b>.
                </p>

                <div className="empty-hint">
                  Your WCET, CFG and abstract state
                  will appear here.
                </div>
              </div>
            ) : (
              <div className="results">
                <div
                  className={
                    "wcet-result " +
                    (highlighted === "wcet"
                      ? "highlight"
                      : "")
                  }
                  ref={wcetRef}
                >
                  <div className="result-label">
                    ESTIMATED WCET
                  </div>

                  <h1>
                    {result.wcet}
                    <small> μs</small>
                  </h1>

                  <span>Worst-Case Execution Time</span>
                </div>

                <div className="result-grid">
                  <div
                    className={
                      "result-box " +
                      (highlighted === "lines"
                        ? "highlight"
                        : "")
                    }
                    ref={linesRef}
                    onClick={() =>
                      scrollToBox(linesRef, "lines")
                    }
                  >
                    <span>📄 Lines of Code</span>
                    <strong>{result.lines}</strong>
                  </div>

                  <div
                    className={
                      "result-box " +
                      (highlighted === "complexity"
                        ? "highlight"
                        : "")
                    }
                    ref={complexityRef}
                    onClick={() =>
                      scrollToBox(
                        complexityRef,
                        "complexity"
                      )
                    }
                  >
                    <span>📈 Complexity</span>
                    <strong>{result.complexity}</strong>
                  </div>

                  <div className="result-box">
                    <span>🔄 Loop Bound</span>
                    <strong>
                      {result.loopIterations}
                    </strong>
                  </div>

                  <div className="result-box">
                    <span>⚙️ Operation Cost</span>
                    <strong>
                      {result.operationCost}
                    </strong>
                  </div>

                  <div className="result-box">
                    <span>🛣️ Worst Path Cost</span>
                    <strong>
                      {result.worstPathCost}
                    </strong>
                  </div>

                  <div
                    className={
                      "result-box " +
                      (highlighted === "status"
                        ? "highlight"
                        : "")
                    }
                    ref={statusRef}
                  >
                    <span>✓ Analysis Status</span>

                    <strong className="safe">
                      Completed
                    </strong>
                  </div>
                </div>
              </div>
            )}
          </section>
        </div>

        <section className="card cfg-card" ref={cfgRef}>
          {!cfg ? (
            <div className="empty">
              <div className="empty-icon">🔀</div>

              <h3>No CFG Available</h3>

              <p>
                Run WCET analysis to generate
                the Control Flow Graph.
              </p>
            </div>
          ) : (
            <CFGVisualization cfg={cfg} />
          )}
        </section>

        {result && (
          <section
            className="analysis-section"
            ref={abstractRef}
          >
            <AbstractStateVisualization
              abstractState={result.abstractState}
            />

            <div className="loop-information">
              <div className="loop-information-header">
                <div>
                  <h3>🔄 Loop Analysis</h3>

                  <p>
                    Information used for WCET
                    bound estimation.
                  </p>
                </div>

                <span className="analysis-badge">
                  STATIC ANALYSIS
                </span>
              </div>

              <div className="loop-info-grid">
                <div>
                  <span>Loop Variable</span>

                  <strong>
                    {result.loopVariable ||
                      "Not detected"}
                  </strong>
                </div>

                <div>
                  <span>Maximum Iterations</span>

                  <strong>
                    {result.maximumIterations ||
                      result.loopIterations ||
                      0}
                  </strong>
                </div>

                <div>
                  <span>WCET Contribution</span>

                  <strong>
                    {result.worstPathCost} μs
                  </strong>
                </div>
              </div>
            </div>
          </section>
        )}

        <section className="features" ref={featuresRef}>
          <div className="section-heading">
            <span className="section-tag">
              ANALYSIS MODULES
            </span>

            <h2>WCET Analysis Features</h2>

            <p>
              Explore different parts of the
              static analysis process.
            </p>
          </div>

          <div className="feature-grid">
            <button
              className={
                "feature " +
                (activeFeature === "execution"
                  ? "feature-active"
                  : "")
              }
              onClick={() =>
                handleFeatureClick("execution")
              }
              type="button"
            >
              <div className="feature-icon">⏱️</div>

              <h3>Execution Time</h3>

              <p>
                Estimate maximum execution
                time using WCET analysis.
              </p>

              <span className="feature-arrow">→</span>
            </button>

            <button
              className={
                "feature " +
                (activeFeature === "code"
                  ? "feature-active"
                  : "")
              }
              onClick={() =>
                handleFeatureClick("code")
              }
              type="button"
            >
              <div className="feature-icon">🔍</div>

              <h3>Code Analysis</h3>

              <p>
                Identify loops, operations
                and execution paths.
              </p>

              <span className="feature-arrow">→</span>
            </button>

            <button
              className={
                "feature " +
                (activeFeature === "complexity"
                  ? "feature-active"
                  : "")
              }
              onClick={() =>
                handleFeatureClick("complexity")
              }
              type="button"
            >
              <div className="feature-icon">📈</div>

              <h3>Complexity</h3>

              <p>
                Understand program complexity
                and loop impact.
              </p>

              <span className="feature-arrow">→</span>
            </button>

            <button
              className={
                "feature " +
                (activeFeature === "report"
                  ? "feature-active"
                  : "")
              }
              onClick={() =>
                handleFeatureClick("report")
              }
              type="button"
            >
              <div className="feature-icon">📊</div>

              <h3>Analysis Report</h3>

              <p>
                View a complete summary of
                the WCET analysis.
              </p>

              <span className="feature-arrow">→</span>
            </button>
          </div>

          {activeFeature && !result && (
            <div className="feature-details">
              <h3>⚠️ No Analysis Available</h3>

              <p>
                Please enter your source code and
                click <b>Analyze WCET</b> first.
              </p>
            </div>
          )}

          {activeFeature === "execution" && result && (
            <div className="feature-details">
              <h3>⏱️ Execution Time Analysis</h3>

              <div className="detail-grid">
                <div>
                  <span>Estimated WCET</span>
                  <strong>{result.wcet} μs</strong>
                </div>

                <div>
                  <span>Loop Bound</span>
                  <strong>{result.loopIterations}</strong>
                </div>

                <div>
                  <span>Operation Cost</span>
                  <strong>{result.operationCost}</strong>
                </div>

                <div>
                  <span>Worst Path Cost</span>
                  <strong>{result.worstPathCost}</strong>
                </div>
              </div>

              <p className="detail-description">
                The WCET represents the estimated
                maximum execution time of the program.
                Loop bounds, operation costs and the
                worst execution path contribute to
                this estimate.
              </p>
            </div>
          )}

          {activeFeature === "code" && result && (
            <div className="feature-details">
              <h3>🔍 Source Code Analysis</h3>

              <div className="detail-grid">
                <div>
                  <span>Lines of Code</span>
                  <strong>{result.lines}</strong>
                </div>

                <div>
                  <span>Loop Bound</span>
                  <strong>{result.loopIterations}</strong>
                </div>

                <div>
                  <span>Operation Cost</span>
                  <strong>{result.operationCost}</strong>
                </div>

                <div>
                  <span>Worst Path Cost</span>
                  <strong>{result.worstPathCost}</strong>
                </div>
              </div>

              <p className="detail-description">
                The analyzer examines the source program
                and identifies important execution
                characteristics such as loops,
                operations and execution paths.
              </p>
            </div>
          )}

          {activeFeature === "complexity" && result && (
            <div className="feature-details">
              <h3>📈 Complexity Analysis</h3>

              <div className="complexity-display">
                <span>Complexity Level</span>

                <strong>{result.complexity}</strong>
              </div>

              <div className="detail-grid">
                <div>
                  <span>Lines of Code</span>
                  <strong>{result.lines}</strong>
                </div>

                <div>
                  <span>Loop Bound</span>
                  <strong>{result.loopIterations}</strong>
                </div>
              </div>

              <p className="detail-description">
                Complexity provides a high-level
                indication of the program's analysis
                difficulty.

                <br />
                <br />

                <b>Problem Detection:</b>

                {result.loopIterations > 1
                  ? " A loop was detected. A larger loop bound can significantly increase WCET."
                  : " No significant loop bound was detected."}
              </p>
            </div>
          )}

          {activeFeature === "report" && result && (
            <div className="feature-details report-details">
              <h3>📊 WCET Analysis Report</h3>

              <div className="report-row">
                <span>Program Status</span>

                <strong className="safe">
                  ✓ Analyzed
                </strong>
              </div>

              <div className="report-row">
                <span>Estimated WCET</span>

                <strong>{result.wcet} μs</strong>
              </div>

              <div className="report-row">
                <span>Lines of Code</span>

                <strong>{result.lines}</strong>
              </div>

              <div className="report-row">
                <span>Complexity</span>

                <strong>{result.complexity}</strong>
              </div>

              <div className="report-row">
                <span>Loop Bound</span>

                <strong>{result.loopIterations}</strong>
              </div>

              <div className="report-row">
                <span>Operation Cost</span>

                <strong>{result.operationCost}</strong>
              </div>

              <div className="report-row">
                <span>Worst Path Cost</span>

                <strong>{result.worstPathCost}</strong>
              </div>

              <div className="report-conclusion">
                <h4>🎯 Conclusion</h4>

                <p>
                  The program was successfully analyzed.
                  The WCET estimate is based on the
                  detected operations, loop bounds and
                  worst execution path.
                </p>
              </div>
            </div>
          )}
        </section>
      </main>

      <footer>
        <p>
          ⚡ WCET Analyzer © 2026
          <span> | </span>
          Real-Time Systems Analysis
        </p>
      </footer>
    </div>
  );
}

export default App;