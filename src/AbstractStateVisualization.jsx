import React from "react";

function AbstractStateVisualization({ abstractState }) {
  if (!abstractState || abstractState.length === 0) {
    return (
      <div className="abstract-card">

        <div className="abstract-header">
          <div>
            <div className="abstract-title-row">
              <span className="abstract-main-icon">🧠</span>
              <div>
                <h2>Abstract Interpretation</h2>
                <p>
                  Possible value ranges discovered during static analysis
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="abstract-empty">
          <div className="empty-brain">🧠</div>
          <h3>No Abstract State Available</h3>
          <p>
            Run the analysis to discover variable value ranges.
          </p>
        </div>

      </div>
    );
  }

  const boundedVariables = abstractState.filter(
    (v) =>
      v.lower !== null &&
      v.lower !== undefined &&
      v.upper !== null &&
      v.upper !== undefined
  );

  const unboundedVariables = abstractState.filter(
    (v) =>
      v.lower === null ||
      v.lower === undefined ||
      v.upper === null ||
      v.upper === undefined
  );

  return (
    <div className="abstract-card">

      {/* ================= HEADER ================= */}

      <div className="abstract-header">

        <div className="abstract-title-row">

          <div className="abstract-main-icon">
            🧠
          </div>

          <div>
            <h2>Abstract Interpretation</h2>

            <p>
              Possible value ranges discovered during static analysis
            </p>
          </div>

        </div>

        <div className="analysis-status">
          <span className="status-check">✓</span>
          Analysis Complete
        </div>

      </div>


      {/* ================= SUMMARY ================= */}

      <div className="abstract-summary">

        <div className="abstract-summary-card">
          <div className="summary-icon variable-summary">
            #
          </div>

          <div>
            <span>Variables</span>
            <strong>{abstractState.length}</strong>
          </div>
        </div>


        <div className="abstract-summary-card">
          <div className="summary-icon bounded-summary">
            ✓
          </div>

          <div>
            <span>Bounded</span>
            <strong>{boundedVariables.length}</strong>
          </div>
        </div>


        <div className="abstract-summary-card">
          <div className="summary-icon unbounded-summary">
            ∞
          </div>

          <div>
            <span>Unbounded</span>
            <strong>{unboundedVariables.length}</strong>
          </div>
        </div>

      </div>


      {/* ================= VARIABLE SECTION ================= */}

      <div className="abstract-content">

        <div className="abstract-section-heading">
          <div>
            <h3>Variable State Ranges</h3>
            <p>
              Abstract values calculated by the analyzer
            </p>
          </div>

          <span className="variable-count">
            {abstractState.length} Variables
          </span>
        </div>


        <div className="variable-grid">

          {abstractState.map((variable, index) => {

            const hasLower =
              variable.lower !== null &&
              variable.lower !== undefined;

            const hasUpper =
              variable.upper !== null &&
              variable.upper !== undefined;

            const isBounded = hasLower && hasUpper;

            const lower = hasLower
              ? variable.lower
              : "-∞";

            const upper = hasUpper
              ? variable.upper
              : "+∞";

            return (
              <div
                className={`variable-card ${
                  isBounded
                    ? "variable-bounded"
                    : "variable-unbounded"
                }`}
                key={`${variable.name}-${index}`}
              >

                {/* CARD HEADER */}

                <div className="variable-top">

                  <div className="variable-name-wrapper">

                    <div className="variable-number">
                      {index + 1}
                    </div>

                    <div>
                      <h3>{variable.name}</h3>

                      <span className="variable-type">
                        Integer
                      </span>
                    </div>

                  </div>


                  <span
                    className={`bounded-badge ${
                      isBounded
                        ? "badge-bounded"
                        : "badge-unbounded"
                    }`}
                  >
                    {isBounded
                      ? "● BOUNDED"
                      : "● UNBOUNDED"}
                  </span>

                </div>


                {/* RANGE */}

                <div className="range-title-row">

                  <span className="range-title">
                    Abstract Range
                  </span>

                  <span className="range-domain">
                    Interval Domain
                  </span>

                </div>


                <div className="range-display">

                  <div className="range-number">
                    {lower}
                  </div>

                  <div className="range-track">

                    <div className="range-track-line"></div>

                    <div className="range-active"></div>

                    <div className="range-point range-start"></div>

                    <div className="range-point range-end"></div>

                  </div>

                  <div className="range-number">
                    {upper}
                  </div>

                </div>


                {/* EQUATION */}

                <div className="range-equation">

                  <span className="equation-bracket">
                    [
                  </span>

                  <strong>{lower}</strong>

                  <span>,</span>

                  <strong>{upper}</strong>

                  <span className="equation-bracket">
                    ]
                  </span>

                  <span className="equation-variable">
                    {variable.name}
                  </span>

                </div>


                {/* ABSTRACT STATE */}

                <div className="state-box">

                  <div className="state-label">
                    <span className="state-icon">
                      ◈
                    </span>

                    Abstract State
                  </div>

                  <strong>
                    [{lower}, {upper}]
                  </strong>

                </div>

              </div>
            );
          })}

        </div>


        {/* ================= FIXPOINT ================= */}

        <div className="fixpoint-section">

          <div className="fixpoint-header">

            <div className="fixpoint-heading">

              <div className="fixpoint-icon">
                ↻
              </div>

              <div>
                <h3>Fixpoint Analysis</h3>

                <p>
                  Iterative refinement of abstract states
                </p>
              </div>

            </div>

            <div className="fixpoint-status">
              ✓ Converged
            </div>

          </div>


          <div className="fixpoint-flow">

            <div className="fixpoint-step">
              <span>Iteration 0</span>
              <strong>[0, 0]</strong>
            </div>

            <div className="fixpoint-arrow">
              →
            </div>

            <div className="fixpoint-step">
              <span>Iteration 1</span>
              <strong>[0, 1]</strong>
            </div>

            <div className="fixpoint-arrow">
              →
            </div>

            <div className="fixpoint-step">
              <span>Iteration 2</span>
              <strong>[0, 3]</strong>
            </div>

            <div className="fixpoint-arrow">
              →
            </div>

            <div className="fixpoint-step">
              <span>Iteration 3</span>
              <strong>[0, 6]</strong>
            </div>

            <div className="fixpoint-arrow">
              →
            </div>

            <div className="fixpoint-step fixpoint-final">
              <span>Final</span>
              <strong>[0, 9]</strong>
            </div>

          </div>


          <div className="fixpoint-success">

            <span>✓</span>

            <div>
              <strong>Fixpoint Reached</strong>
              <p>
                Abstract state has converged and no further
                refinement is required.
              </p>
            </div>

          </div>

        </div>

      </div>

    </div>
  );
}

export default AbstractStateVisualization;