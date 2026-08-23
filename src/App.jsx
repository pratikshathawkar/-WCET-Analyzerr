import { useState, useRef } from "react";
import "./App.css";
import CFGVisualization from "./CFGVisualization";
import AbstractStateVisualization from "./AbstractStateVisualization";

function App() {
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

  /* =========================================================
     ANALYZE CODE
  ========================================================= */

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
        throw new Error(
          `Backend returned status ${response.status}`
        );
      }

      const data = await response.json();

      /* =====================================================
         BASIC SOURCE CODE INFORMATION
      ===================================================== */

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

      /* =====================================================
         NORMALIZE ABSTRACT STATE

         Supports both:
         {
           variable: "i",
           lower: 0,
           upper: 10
         }

         and:
         {
           name: "i",
           lower: 0,
           upper: 10
         }
      ===================================================== */

      const normalizedAbstractState = (
        data.abstractState || []
      ).map((item) => ({
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
      }));

      /* =====================================================
         SET RESULT
      ===================================================== */

      const analysisResult = {
        wcet: data.wcet ?? 0,

        lines,

        complexity,

        loopIterations:
          data.loopIterations ?? 1,

        operationCost:
          data.operationCost ?? 0,

        worstPathCost:
          data.worstPathCost ?? 1,

        abstractState:
          normalizedAbstractState,

        loopVariable:
          data.loopVariable ?? "",

        maximumIterations:
          data.maximumIterations ?? 0,
      };

      setResult(analysisResult);

      /* =====================================================
         CFG
      ===================================================== */

      setCfg(data.cfg ?? null);

      setActiveFeature(null);
      setHighlighted(null);
      setBackendStatus("ready");

      /* =====================================================
         SCROLL TO CFG
      ===================================================== */

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

  /* =========================================================
     CLEAR
  ========================================================= */

  const clearAll = () => {
    setCode("");
    setResult(null);
    setCfg(null);
    setActiveFeature(null);
    setHighlighted(null);
    setErrorMessage("");
    setBackendStatus("ready");
  };

  /* =========================================================
     SCROLL TO RESULT
  ========================================================= */

  const scrollToBox = (ref, key) => {
    if (!result) {
      codeCardRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });

      setErrorMessage(
        'Run the analysis first, then click a feature.'
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

  /* =========================================================
     FEATURE CLICK
  ========================================================= */

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

  /* =========================================================
     NODE TYPE HELPERS
  ========================================================= */

  const getNodeType = (statement = "") => {
    const text = statement.toUpperCase();

    if (
      text.includes("FOR LOOP") ||
      text.includes("WHILE LOOP") ||
      text.includes("DO WHILE")
    ) {
      return "loop";
    }

    if (
      text.includes("IF") ||
      text.includes("ELSE") ||
      text.includes("SWITCH")
    ) {
      return "decision";
    }

    return "statement";
  };

  const getNodeIcon = (type) => {
    if (type === "loop") return "🔄";
    if (type === "decision") return "🔀";
    return "▸";
  };

  const getNodeLabel = (type) => {
    if (type === "loop") return "LOOP";
    if (type === "decision") return "DECISION";
    return "STATEMENT";
  };

  /* =========================================================
     BACKEND STATUS
  ========================================================= */

  const getStatusText = () => {
    if (backendStatus === "analyzing") {
      return "Analyzing...";
    }

    if (backendStatus === "error") {
      return "Backend Offline";
    }

    return "System Ready";
  };

  return (
    <div className="app">

      {/* =====================================================
          HEADER
      ===================================================== */}

      <header className="header">

        <div className="header-content">

          <div>
            <h1>⚡ WCET Analyzer</h1>

            <p>
              Worst-Case Execution Time Analysis Tool
            </p>
          </div>

          <div
            className={`status status-${backendStatus}`}
          >
            <span className="dot"></span>

            {getStatusText()}
          </div>

        </div>

      </header>

      {/* =====================================================
          MAIN
      ===================================================== */}

      <main className="container">

        {/* ===================================================
            INTRO
        =================================================== */}

        <section className="intro">

          <div className="intro-badge">
            STATIC ANALYSIS • REAL-TIME SYSTEMS
          </div>

          <h2>
            Analyze Your Program
          </h2>

          <p>
            Estimate the Worst-Case Execution Time,
            analyze control flow and inspect abstract
            program states.
          </p>

        </section>

        {/* ===================================================
            ERROR MESSAGE
        =================================================== */}

        {errorMessage && (

          <div className="error-banner">

            <span>⚠️</span>

            <div>
              <strong>Analysis Error</strong>

              <p>
                {errorMessage}
              </p>
            </div>

            <button
              onClick={() => setErrorMessage("")}
            >
              ×
            </button>

          </div>

        )}

        {/* ===================================================
            WORKSPACE
        =================================================== */}

        <div className="workspace">

          {/* =================================================
              SOURCE CODE
          ================================================= */}

          <section
            className="card code-card"
            ref={codeCardRef}
          >

            <div className="card-header">

              <div>
                <h3>📝 Source Code</h3>

                <p className="card-description">
                  Enter C/C++ code for WCET analysis
                </p>
              </div>

              <span>
                INPUT
              </span>

            </div>

            <textarea
              value={code}
              onChange={(e) => {
                setCode(e.target.value);
                setErrorMessage("");
              }}
              placeholder={`Enter your C/C++ code here...

Example:

int main() {

    int arr[5] = {
        64, 34, 25, 12, 22
    };

    int i, j, temp;

    for (i = 0; i < 5 - 1; i++) {

        for (j = 0;
             j < 5 - i - 1;
             j++) {

            if (arr[j] > arr[j + 1]) {

                temp = arr[j];
                arr[j] = arr[j + 1];
                arr[j + 1] = temp;
            }
        }
    }

    return 0;
}`}
            />

            {/* CODE INFORMATION */}

            <div className="code-info">

              <span>
                💡 Supports loops, decisions and operations
              </span>

              <span>
                Lines:{" "}
                {
                  code
                    .split("\n")
                    .filter(
                      (line) =>
                        line.trim() !== ""
                    ).length
                }
              </span>

            </div>

            {/* BUTTONS */}

            <div className="buttons">

              <button
                className="analyze-btn"
                onClick={analyzeCode}
                disabled={loading}
              >

                {loading ? (
                  <>
                    <span className="spinner"></span>
                    Analyzing...
                  </>
                ) : (
                  <>
                    ▶ Analyze WCET
                  </>
                )}

              </button>

              <button
                className="clear-btn"
                onClick={clearAll}
                disabled={loading}
              >
                Clear
              </button>

            </div>

          </section>

          {/* =================================================
              RESULT
          ================================================= */}

          <section className="card result-card">

            <div className="card-header">

              <div>
                <h3>📊 Analysis Result</h3>

                <p className="card-description">
                  Worst-case execution analysis
                </p>
              </div>

              <span>
                OUTPUT
              </span>

            </div>

            {!result ? (

              <div className="empty">

                <div className="empty-icon">
                  ⏱️
                </div>

                <h3>
                  No Analysis Yet
                </h3>

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

                {/* =========================================
                    WCET
                ========================================= */}

                <div
                  className={`wcet-result ${
                    highlighted === "wcet"
                      ? "highlight"
                      : ""
                  }`}
                  ref={wcetRef}
                >

                  <div className="result-label">
                    ESTIMATED WCET
                  </div>

                  <h1>
                    {result.wcet}
                    <small> μs</small>
                  </h1>

                  <span>
                    Worst-Case Execution Time
                  </span>

                </div>

                {/* =========================================
                    RESULT GRID
                ========================================= */}

                <div className="result-grid">

                  <div
                    className={`result-box ${
                      highlighted === "lines"
                        ? "highlight"
                        : ""
                    }`}
                    ref={linesRef}
                    onClick={() =>
                      scrollToBox(
                        linesRef,
                        "lines"
                      )
                    }
                  >

                    <span>
                      📄 Lines of Code
                    </span>

                    <strong>
                      {result.lines}
                    </strong>

                  </div>

                  <div
                    className={`result-box ${
                      highlighted === "complexity"
                        ? "highlight"
                        : ""
                    }`}
                    ref={complexityRef}
                    onClick={() =>
                      scrollToBox(
                        complexityRef,
                        "complexity"
                      )
                    }
                  >

                    <span>
                      📈 Complexity
                    </span>

                    <strong>
                      {result.complexity}
                    </strong>

                  </div>

                  <div className="result-box">

                    <span>
                      🔄 Loop Bound
                    </span>

                    <strong>
                      {result.loopIterations}
                    </strong>

                  </div>

                  <div className="result-box">

                    <span>
                      ⚙️ Operation Cost
                    </span>

                    <strong>
                      {result.operationCost}
                    </strong>

                  </div>

                  <div className="result-box">

                    <span>
                      🛣️ Worst Path Cost
                    </span>

                    <strong>
                      {result.worstPathCost}
                    </strong>

                  </div>

                  <div
                    className={`result-box ${
                      highlighted === "status"
                        ? "highlight"
                        : ""
                    }`}
                    ref={statusRef}
                  >

                    <span>
                      ✓ Analysis Status
                    </span>

                    <strong className="safe">
                      Completed
                    </strong>

                  </div>

                </div>

              </div>
            )}

          </section>

        </div>

        {/* ===================================================
            QUICK SUMMARY
        =================================================== */}

        {result && (

          <section className="quick-summary">

            <div className="summary-item">

              <span>WCET</span>

              <strong>
                {result.wcet} μs
              </strong>

            </div>

            <div className="summary-divider"></div>

            <div className="summary-item">

              <span>LOOP BOUND</span>

              <strong>
                {result.loopIterations}
              </strong>

            </div>

            <div className="summary-divider"></div>

            <div className="summary-item">

              <span>COMPLEXITY</span>

              <strong>
                {result.complexity}
              </strong>

            </div>

            <div className="summary-divider"></div>

            <div className="summary-item">

              <span>CFG</span>

              <strong>
                {cfg ? "Generated" : "Unavailable"}
              </strong>

            </div>

          </section>

        )}

        {/* ===================================================
            CFG
        =================================================== */}

        <section
          className="card cfg-card"
          ref={cfgRef}
        >

          {!cfg ? (

            <div className="empty">

              <div className="empty-icon">
                🔀
              </div>

              <h3>
                No CFG Available
              </h3>

              <p>
                Run WCET analysis to generate
                the Control Flow Graph.
              </p>

            </div>

          ) : (

            <CFGVisualization cfg={cfg} />

          )}

        </section>

        {/* ===================================================
            ABSTRACT INTERPRETATION
        =================================================== */}

        {result && (

          <section
            className="analysis-section"
            ref={abstractRef}
          >

            <AbstractStateVisualization
              abstractState={
                result.abstractState
              }
            />

            {/* LOOP INFORMATION */}

            <div className="loop-information">

              <div className="loop-information-header">

                <div>

                  <h3>
                    🔄 Loop Analysis
                  </h3>

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

                  <span>
                    Loop Variable
                  </span>

                  <strong>
                    {result.loopVariable ||
                      "Not detected"}
                  </strong>

                </div>

                <div>

                  <span>
                    Maximum Iterations
                  </span>

                  <strong>
                    {result.maximumIterations ||
                      result.loopIterations ||
                      0}
                  </strong>

                </div>

                <div>

                  <span>
                    WCET Contribution
                  </span>

                  <strong>
                    {result.worstPathCost} μs
                  </strong>

                </div>

              </div>

            </div>

          </section>

        )}

        {/* ===================================================
            FEATURES
        =================================================== */}

        <section
          className="features"
          ref={featuresRef}
        >

          <div className="section-heading">

            <span className="section-tag">
              ANALYSIS MODULES
            </span>

            <h2>
              WCET Analysis Features
            </h2>

            <p>
              Explore different parts of the
              static analysis process.
            </p>

          </div>

          <div className="feature-grid">

            {/* EXECUTION */}

            <button
              className={`feature ${
                activeFeature === "execution"
                  ? "feature-active"
                  : ""
              }`}
              onClick={() =>
                handleFeatureClick("execution")
              }
            >

              <div className="feature-icon">
                ⏱️
              </div>

              <h3>
                Execution Time
              </h3>

              <p>
                Estimate maximum execution
                time using WCET analysis.
              </p>

              <span className="feature-arrow">
                →
              </span>

            </button>

            {/* CODE */}

            <button
              className={`feature ${
                activeFeature === "code"
                  ? "feature-active"
                  : ""
              }`}
              onClick={() =>
                handleFeatureClick("code")
              }
            >

              <div className="feature-icon">
                🔍
              </div>

              <h3>
                Code Analysis
              </h3>

              <p>
                Identify loops, operations
                and execution paths.
              </p>

              <span className="feature-arrow">
                →
              </span>

            </button>

            {/* COMPLEXITY */}

            <button
              className={`feature ${
                activeFeature === "complexity"
                  ? "feature-active"
                  : ""
              }`}
              onClick={() =>
                handleFeatureClick("complexity")
              }
            >

              <div className="feature-icon">
                📈
              </div>

              <h3>
                Complexity
              </h3>

              <p>
                Understand program complexity
                and loop impact.
              </p>

              <span className="feature-arrow">
                →
              </span>

            </button>

            {/* REPORT */}

            <button
              className={`feature ${
                activeFeature === "report"
                  ? "feature-active"
                  : ""
              }`}
              onClick={() =>
                handleFeatureClick("report")
              }
            >

              <div className="feature-icon">
                📊
              </div>

              <h3>
                Analysis Report
              </h3>

              <p>
                View a complete summary of
                the WCET analysis.
              </p>

              <span className="feature-arrow">
                →
              </span>

            </button>

          </div>

          {/* =================================================
              FEATURE DETAILS
          ================================================= */}

          {activeFeature && !result && (

            <div className="feature-details">

              <h3>
                ⚠️ No Analysis Available
              </h3>

              <p>
                Please enter your source code and
                click <b>Analyze WCET</b> first.
              </p>

            </div>

          )}

          {/* =================================================
              EXECUTION TIME
          ================================================= */}

          {activeFeature === "execution" &&
            result && (

            <div className="feature-details">

              <h3>
                ⏱️ Execution Time Analysis
              </h3>

              <div className="detail-grid">

                <div>
                  <span>
                    Estimated WCET
                  </span>

                  <strong>
                    {result.wcet} μs
                  </strong>
                </div>

                <div>
                  <span>
                    Loop Bound
                  </span>

                  <strong>
                    {result.loopIterations}
                  </strong>
                </div>

                <div>
                  <span>
                    Operation Cost
                  </span>

                  <strong>
                    {result.operationCost}
                  </strong>
                </div>

                <div>
                  <span>
                    Worst Path Cost
                  </span>

                  <strong>
                    {result.worstPathCost}
                  </strong>
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

          {/* =================================================
              CODE ANALYSIS
          ================================================= */}

          {activeFeature === "code" &&
            result && (

            <div className="feature-details">

              <h3>
                🔍 Source Code Analysis
              </h3>

              <div className="detail-grid">

                <div>
                  <span>
                    Lines of Code
                  </span>

                  <strong>
                    {result.lines}
                  </strong>
                </div>

                <div>
                  <span>
                    Loop Bound
                  </span>

                  <strong>
                    {result.loopIterations}
                  </strong>
                </div>

                <div>
                  <span>
                    Operation Cost
                  </span>

                  <strong>
                    {result.operationCost}
                  </strong>
                </div>

                <div>
                  <span>
                    Worst Path Cost
                  </span>

                  <strong>
                    {result.worstPathCost}
                  </strong>
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

          {/* =================================================
              COMPLEXITY
          ================================================= */}

          {activeFeature === "complexity" &&
            result && (

            <div className="feature-details">

              <h3>
                📈 Complexity Analysis
              </h3>

              <div className="complexity-display">

                <span>
                  Complexity Level
                </span>

                <strong>
                  {result.complexity}
                </strong>

              </div>

              <div className="detail-grid">

                <div>
                  <span>
                    Lines of Code
                  </span>

                  <strong>
                    {result.lines}
                  </strong>
                </div>

                <div>
                  <span>
                    Loop Bound
                  </span>

                  <strong>
                    {result.loopIterations}
                  </strong>
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
                  : " No significant loop bound was detected."
                }

              </p>

            </div>

          )}

          {/* =================================================
              REPORT
          ================================================= */}

          {activeFeature === "report" &&
            result && (

            <div className="feature-details report-details">

              <h3>
                📊 WCET Analysis Report
              </h3>

              <div className="report-row">
                <span>
                  Program Status
                </span>

                <strong className="safe">
                  ✓ Analyzed
                </strong>
              </div>

              <div className="report-row">
                <span>
                  Estimated WCET
                </span>

                <strong>
                  {result.wcet} μs
                </strong>
              </div>

              <div className="report-row">
                <span>
                  Lines of Code
                </span>

                <strong>
                  {result.lines}
                </strong>
              </div>

              <div className="report-row">
                <span>
                  Complexity
                </span>

                <strong>
                  {result.complexity}
                </strong>
              </div>

              <div className="report-row">
                <span>
                  Loop Bound
                </span>

                <strong>
                  {result.loopIterations}
                </strong>
              </div>

              <div className="report-row">
                <span>
                  Operation Cost
                </span>

                <strong>
                  {result.operationCost}
                </strong>
              </div>

              <div className="report-row">
                <span>
                  Worst Path Cost
                </span>

                <strong>
                  {result.worstPathCost}
                </strong>
              </div>

              <div className="report-conclusion">

                <h4>
                  🎯 Conclusion
                </h4>

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

      {/* =====================================================
          FOOTER
      ===================================================== */}

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