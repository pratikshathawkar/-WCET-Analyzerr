import React from "react";
import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  Handle,
  Position,
} from "reactflow";

import "reactflow/dist/style.css";
import "./CFGVisualization.css";

const CustomNode = ({ data }) => {
  let nodeClass = "cfg-node";

  if (data.type === "LOOP") {
    nodeClass += " loop-node";
  } else if (data.type === "DECISION") {
    nodeClass += " decision-node";
  } else {
    nodeClass += " statement-node";
  }

  return (
    <div className={nodeClass}>

      <Handle
        type="target"
        position={Position.Top}
      />

      <div className="node-header">

        <span className="node-icon">
          {data.type === "LOOP"
            ? "🔄"
            : data.type === "DECISION"
            ? "🔀"
            : "▸"}
        </span>

        <strong>
          Node {data.id}
        </strong>

      </div>

      <div className="node-type">
        {data.type}
      </div>

      <div className="node-code">
        {data.code}
      </div>

      <Handle
        type="source"
        position={Position.Bottom}
      />

    </div>
  );
};

const nodeTypes = {
  custom: CustomNode,
};

function CFGVisualization({ cfg }) {

  if (!cfg || !cfg.nodes) {
    return (
      <div className="cfg-empty">
        No Control Flow Graph available.
      </div>
    );
  }

  // Convert backend nodes into React Flow nodes
  const nodes = cfg.nodes.map((node, index) => {

    const statement =
      node.statement || "Statement";

    const text = statement.toUpperCase();

    let type = "STATEMENT";

    if (
      text.includes("FOR LOOP") ||
      text.includes("WHILE LOOP") ||
      text.includes("DO WHILE")
    ) {
      type = "LOOP";
    }

    if (
      text.includes("IF:") ||
      text.includes("IF ") ||
      text.includes("ELSE") ||
      text.includes("SWITCH")
    ) {
      type = "DECISION";
    }

    return {
      id: String(node.id),

      position: {
        x: (index % 3) * 350,
        y: Math.floor(index / 3) * 220,
      },

      data: {
        id: node.id,
        type: type,
        code: statement,
      },

      type: "custom",
    };
  });

  // Convert backend edges into React Flow edges
  const edges = (cfg.edges || [])
    .map((edge, index) => {

      const source =
        edge.from ??
        edge.source ??
        edge.start ??
        edge.fromNode;

      const target =
        edge.to ??
        edge.target ??
        edge.end ??
        edge.toNode;

      if (
        source === undefined ||
        target === undefined
      ) {
        return null;
      }

      return {
        id: `edge-${index}`,

        source: String(source),
        target: String(target),

        label:
          edge.label ??
          edge.condition ??
          "Flow",

        animated: true,

        style: {
          strokeWidth: 2,
        },

        markerEnd: {
          type: "arrowclosed",
        },
      };
    })
    .filter(Boolean);

  return (
    <div className="cfg-container">

      {/* HEADER */}

      <div className="cfg-title">

        <div>
          <h2>
            🔀 Control Flow Graph
          </h2>

          <p>
            Program execution flow and decision paths
          </p>
        </div>

        <div className="cfg-legend">

          <span>
            ▸ Statement
          </span>

          <span>
            🔄 Loop
          </span>

          <span>
            🔀 Decision
          </span>

        </div>

      </div>

      {/* GRAPH */}

      <div className="cfg-flow">

        <ReactFlow
          nodes={nodes}
          edges={edges}
          nodeTypes={nodeTypes}
          fitView
          fitViewOptions={{
            padding: 0.2,
          }}
        >

          <Background />

          <Controls />

          <MiniMap />

        </ReactFlow>

      </div>

      {/* EDGE INFORMATION */}

      <div className="cfg-edge-info">

        <h3>
          🔗 Control Flow Edges
        </h3>

        <p>
          {edges.length} execution connections
          identified during analysis.
        </p>

      </div>

    </div>
  );
}

export default CFGVisualization;