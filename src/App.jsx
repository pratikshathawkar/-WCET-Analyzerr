import { useState, useRef } from "react";
import "./App.css";

function App() {
  const [code, setCode] = useState("");
  const [result, setResult] = useState(null);
  const [cfg, setCfg] = useState(null);
  const [activeFeature, setActiveFeature] = useState(null);
  const [highlighted, setHighlighted] = useState(null);

  const codeCardRef = useRef(null);
  const wcetRef = useRef(null);
  const linesRef = useRef(null);
  const complexityRef = useRef(null);
  const statusRef = useRef(null);

  const analyzeCode = async () => {
    if (!code.trim()) {
      alert("Please enter some code first!");
      return;
    }

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
        throw new Error("Backend analysis failed");
      }

      const data = await response.json();

      const lines = code
        .split("\n")
        .filter((line) => line.trim() !== "").length;

      setResult({
        wcet: data.wcet,
        lines: lines,
        complexity:
          lines > 10
            ? "High"
            : lines > 5
            ? "Medium"
            : "Low",
        loopIterations: data.loopIterations ?? 1,
        operationCost: data.operationCost ?? 0,
        worstPathCost: data.worstPathCost ?? 1,
      });

      setCfg(data.cfg ?? null);
      setActiveFeature(null);

    } catch (error) {
      console.error(error);

      alert(
        "Unable to connect to WCET backend. Make sure the Java server is running."
      );
    }
  };

  const clearAll = () => {
    setCode("");
    setResult(null);
    setCfg(null);
    setActiveFeature(null);
  };

  const scrollToBox = (ref, key) => {
    if (!result) {
      codeCardRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });

      alert(
        "Run an analysis first, then click a feature to see that result."
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

  return (
    <div className="app">

      {/* HEADER */}
      <header className="header">
        <div>
          <h1>⚡ WCET Analyzer</h1>
          <p>
            Worst-Case Execution Time Analysis Tool
          </p>
        </div>

        <div className="status">
          <span className="dot"></span>
          System Ready
        </div>
      </header>


      {/* MAIN */}
      <main className="container">

        {/* INTRO */}
        <section className="intro">
          <h2>Analyze Your Program</h2>

          <p>
            Enter your program code below to estimate
            its Worst-Case Execution Time (WCET).
          </p>
        </section>


        {/* WORKSPACE */}
        <div className="workspace">

          {/* SOURCE CODE */}
          <section
            className="card code-card"
            ref={codeCardRef}
          >
            <div className="card-header">
              <h3>📝 Source Code</h3>
              <span>Input</span>
            </div>

            <textarea
              value={code}
              onChange={(e) =>
                setCode(e.target.value)
              }
              placeholder={`Enter your code here...

Example:

int main() {
    int sum = 0;

    for(int i = 0; i < 10; i++) {
        sum = sum + i;

        if(sum > 20) {
            sum = sum * 2;
        }
    }

    return sum;
}`}
            />

            <div className="buttons">

              <button
                className="analyze-btn"
                onClick={analyzeCode}
              >
                ▶ Analyze WCET
              </button>

              <button
                className="clear-btn"
                onClick={clearAll}
              >
                Clear
              </button>

            </div>
          </section>


          {/* RESULT */}
          <section className="card result-card">

            <div className="card-header">
              <h3>📊 Analysis Result</h3>
              <span>Output</span>
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
                  <b> "Analyze WCET"</b>.
                </p>
              </div>

            ) : (

              <div className="results">

                {/* WCET */}
                <div
                  className={`wcet-result ${
                    highlighted === "wcet"
                      ? "highlight"
                      : ""
                  }`}
                  ref={wcetRef}
                >

                  <p>
                    Estimated WCET
                  </p>

                  <h1>
                    {result.wcet} μs
                  </h1>

                  <span>
                    Worst-Case Execution Time
                  </span>

                </div>


                {/* RESULT GRID */}
                <div className="result-grid">

                  <div
                    className={`result-box ${
                      highlighted === "lines"
                        ? "highlight"
                        : ""
                    }`}
                    ref={linesRef}
                  >
                    <span>
                      Lines of Code
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
                  >
                    <span>
                      Complexity
                    </span>

                    <strong>
                      {result.complexity}
                    </strong>
                  </div>


                  <div className="result-box">
                    <span>
                      Loop Bound
                    </span>

                    <strong>
                      {result.loopIterations}
                    </strong>
                  </div>


                  <div className="result-box">
                    <span>
                      HLS Operation Cost
                    </span>

                    <strong>
                      {result.operationCost}
                    </strong>
                  </div>


                  <div className="result-box">
                    <span>
                      Worst Path Cost
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
                      Status
                    </span>

                    <strong className="safe">
                      Analyzed
                    </strong>
                  </div>

                </div>

              </div>
            )}

          </section>

        </div>


        {/* CFG */}
        <section className="card cfg-card">

          <div className="card-header">
            <h3>🔀 Control Flow Graph</h3>
            <span>CFG Visualization</span>
          </div>

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

            <div className="cfg-container">

              {cfg.nodes?.map((node) => (

                <div
                  key={node.id}
                  className="cfg-wrapper"
                >

                  <div
                    className={
                      node.statement?.includes(
                        "FOR LOOP"
                      )
                        ? "cfg-node loop-node"
                        : node.statement?.includes(
                            "IF"
                          )
                        ? "cfg-node if-node"
                        : "cfg-node"
                    }
                  >

                    <div className="cfg-node-number">
                      Node {node.id}
                    </div>

                    <div className="cfg-statement">
                      {node.statement}
                    </div>

                  </div>

                  <div className="cfg-arrow">
                    ↓
                  </div>

                </div>

              ))}

            </div>

          )}

        </section>


        {/* FEATURES */}
        <section className="features">

          <h2>
            WCET Analysis Features
          </h2>


          <div className="feature-grid">

            {/* EXECUTION TIME */}
            <div
              className={`feature ${
                activeFeature === "execution"
                  ? "feature-active"
                  : ""
              }`}
              onClick={() =>
                setActiveFeature("execution")
              }
            >

              <div className="feature-icon">
                ⏱️
              </div>

              <h3>
                Execution Time
              </h3>

              <p>
                Estimate the maximum execution
                time of a program.
              </p>

            </div>


            {/* CODE ANALYSIS */}
            <div
              className={`feature ${
                activeFeature === "code"
                  ? "feature-active"
                  : ""
              }`}
              onClick={() =>
                setActiveFeature("code")
              }
            >

              <div className="feature-icon">
                🔍
              </div>

              <h3>
                Code Analysis
              </h3>

              <p>
                Analyze source code and identify
                important execution paths.
              </p>

            </div>


            {/* COMPLEXITY */}
            <div
              className={`feature ${
                activeFeature === "complexity"
                  ? "feature-active"
                  : ""
              }`}
              onClick={() =>
                setActiveFeature("complexity")
              }
            >

              <div className="feature-icon">
                📈
              </div>

              <h3>
                Complexity
              </h3>

              <p>
                Display basic information about
                program complexity.
              </p>

            </div>


            {/* REPORT */}
            <div
              className={`feature ${
                activeFeature === "report"
                  ? "feature-active"
                  : ""
              }`}
              onClick={() =>
                setActiveFeature("report")
              }
            >

              <div className="feature-icon">
                📊
              </div>

              <h3>
                Analysis Report
              </h3>

              <p>
                Present WCET analysis results in
                an easy-to-understand format.
              </p>

            </div>

          </div>


          {/* FEATURE DETAILS */}

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


          {/* EXECUTION TIME */}

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
                  WCET represents the estimated
                  maximum execution time of the
                  analyzed program. The calculation
                  considers loop iterations,
                  operation cost and worst-path cost.
                </p>

              </div>
            )}


          {/* CODE ANALYSIS */}

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
                      HLS Operation Cost
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
                  The analyzer examines the source
                  code and identifies loops,
                  operations and important execution
                  paths.
                </p>

              </div>
            )}


          {/* COMPLEXITY */}

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

                  The analyzer provides a basic
                  complexity classification based
                  on the analyzed program.

                  <br />
                  <br />

                  <b>Problem Detection:</b>

                  {result.loopIterations > 1
                    ? " A loop was detected. A high loop bound may increase execution time."
                    : " No significant loop bound was detected."
                  }

                </p>

              </div>
            )}


          {/* REPORT */}

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

                  <strong>
                    Analyzed
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
                    HLS Operation Cost
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
                    Conclusion
                  </h4>

                  <p>
                    The program was successfully
                    analyzed. The detected loops,
                    operations and execution paths
                    contribute to the estimated
                    Worst-Case Execution Time.
                  </p>

                </div>

              </div>
            )}

        </section>

      </main>


      {/* FOOTER */}
      <footer>

        <p>
          WCET Analyzer © 2026 |
          Real-Time Systems Analysis
        </p>

      </footer>

    </div>
  );
}

export default App;