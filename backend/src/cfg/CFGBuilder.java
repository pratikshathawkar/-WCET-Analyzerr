package cfg;

import java.util.ArrayList;
import java.util.List;

public class CFGBuilder {

    public CFG buildCFG(
            List<String> statements) {

        CFG cfg = new CFG();

        List<CFGNode> nodes =
                new ArrayList<>();

        int id = 1;


        // Create nodes
        for (String statement :
                statements) {

            CFGNode node =
                    new CFGNode(
                            id++,
                            statement
                    );

            cfg.addNode(node);

            nodes.add(node);
        }


        // Create normal flow
        for (int i = 0;
             i < nodes.size() - 1;
             i++) {

            CFGNode current =
                    nodes.get(i);

            CFGNode next =
                    nodes.get(i + 1);

            cfg.addEdge(
                    current,
                    next
            );
        }


        // Add special CFG edges
        for (int i = 0;
             i < nodes.size();
             i++) {

            CFGNode current =
                    nodes.get(i);

            String statement =
                    current.getStatement();


            // -------------------------
            // IF BRANCH
            // -------------------------

            if (statement.startsWith("IF")) {

                // TRUE path
                if (i + 1 < nodes.size()) {

                    cfg.addEdge(
                            current,
                            nodes.get(i + 1)
                    );
                }

                // FALSE path
                if (i + 2 < nodes.size()) {

                    cfg.addEdge(
                            current,
                            nodes.get(i + 2)
                    );
                }
            }


            // -------------------------
            // FOR LOOP
            // -------------------------

            if (statement.startsWith(
                    "FOR LOOP")) {

                // Loop body
                if (i + 1 < nodes.size()) {

                    cfg.addEdge(
                            current,
                            nodes.get(i + 1)
                    );
                }

                // Back edge
                if (i + 1 < nodes.size()) {

                    cfg.addEdge(
                            nodes.get(i + 1),
                            current
                    );
                }
            }


            // -------------------------
            // WHILE LOOP
            // -------------------------

            if (statement.startsWith(
                    "WHILE LOOP")) {

                // Loop body
                if (i + 1 < nodes.size()) {

                    cfg.addEdge(
                            current,
                            nodes.get(i + 1)
                    );
                }

                // Back edge
                if (i + 1 < nodes.size()) {

                    cfg.addEdge(
                            nodes.get(i + 1),
                            current
                    );
                }
            }
        }


        return cfg;
    }
}