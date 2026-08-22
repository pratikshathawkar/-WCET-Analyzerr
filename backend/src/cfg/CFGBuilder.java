
package cfg;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

public class CFGBuilder {

    public CFG buildCFG(List<String> statements) {

        CFG cfg = new CFG();

        List<CFGNode> nodes = new ArrayList<>();

        int id = 1;

        // ==========================================
        // CREATE NODES
        // ==========================================

        for (String statement : statements) {

            CFGNode node =
                    new CFGNode(
                            id++,
                            statement
                    );

            cfg.addNode(node);

            nodes.add(node);
        }

        // No nodes
        if (nodes.isEmpty()) {
            return cfg;
        }

        // ==========================================
        // NORMAL FLOW
        // ==========================================

        for (int i = 0; i < nodes.size() - 1; i++) {

            CFGNode current = nodes.get(i);
            CFGNode next = nodes.get(i + 1);

            addEdgeIfNotExists(
                    cfg,
                    current,
                    next
            );
        }

        // ==========================================
        // SPECIAL CONTROL FLOW
        // ==========================================

        for (int i = 0; i < nodes.size(); i++) {

            CFGNode current = nodes.get(i);

            String statement =
                    current.getStatement();

            // ======================================
            // IF STATEMENT
            // ======================================

            if (statement.startsWith("IF")) {

                // TRUE PATH
                if (i + 1 < nodes.size()) {

                    addEdgeIfNotExists(
                            cfg,
                            current,
                            nodes.get(i + 1)
                    );
                }

                // FALSE PATH
                if (i + 2 < nodes.size()) {

                    addEdgeIfNotExists(
                            cfg,
                            current,
                            nodes.get(i + 2)
                    );
                }
            }

            // ======================================
            // FOR LOOP
            // ======================================

            if (statement.startsWith("FOR LOOP")) {

                // ----------------------------------
                // LOOP BODY
                // ----------------------------------

                if (i + 1 < nodes.size()) {

                    addEdgeIfNotExists(
                            cfg,
                            current,
                            nodes.get(i + 1)
                    );
                }

                // ----------------------------------
                // LOOP BACK EDGE
                // ----------------------------------

                if (i + 1 < nodes.size()) {

                    addEdgeIfNotExists(
                            cfg,
                            nodes.get(i + 1),
                            current
                    );
                }
            }

            // ======================================
            // WHILE LOOP
            // ======================================

            if (statement.startsWith("WHILE LOOP")) {

                // LOOP BODY
                if (i + 1 < nodes.size()) {

                    addEdgeIfNotExists(
                            cfg,
                            current,
                            nodes.get(i + 1)
                    );
                }

                // BACK EDGE
                if (i + 1 < nodes.size()) {

                    addEdgeIfNotExists(
                            cfg,
                            nodes.get(i + 1),
                            current
                    );
                }
            }
        }

        return cfg;
    }

    // ==========================================
    // ADD EDGE WITHOUT DUPLICATES
    // ==========================================

    private void addEdgeIfNotExists(
            CFG cfg,
            CFGNode from,
            CFGNode to) {

        List<CFGNode> existingEdges =
                cfg.getEdges().get(from);

        if (existingEdges == null) {

            cfg.addEdge(from, to);

            return;
        }

        if (!existingEdges.contains(to)) {

            cfg.addEdge(from, to);
        }
    }
}

