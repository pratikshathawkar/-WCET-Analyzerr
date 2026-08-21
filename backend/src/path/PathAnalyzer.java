package path;

import cfg.CFG;
import cfg.CFGNode;

import java.util.*;

public class PathAnalyzer {

    private int maxCost = 0;
    private List<CFGNode> worstPath = new ArrayList<>();

    public void analyzePaths(CFG cfg) {

        List<CFGNode> nodes = cfg.getNodes();

        if (nodes.isEmpty()) {
            return;
        }

        CFGNode start = nodes.get(0);

        Set<CFGNode> visited = new HashSet<>();

        List<CFGNode> currentPath = new ArrayList<>();

        findPaths(
                cfg,
                start,
                visited,
                currentPath,
                0
        );
    }

    private void findPaths(
            CFG cfg,
            CFGNode current,
            Set<CFGNode> visited,
            List<CFGNode> currentPath,
            int currentCost) {

        // Avoid infinite loop
        if (currentPath.size() > 20) {
            checkWorstPath(currentPath, currentCost);
            return;
        }

        visited.add(current);
        currentPath.add(current);

        // Each node gets a basic cost
        int nodeCost = calculateNodeCost(
                current.getStatement()
        );

        currentCost += nodeCost;

        List<CFGNode> nextNodes =
                cfg.getEdges().get(current);

        if (nextNodes == null || nextNodes.isEmpty()) {

            checkWorstPath(
                    currentPath,
                    currentCost
            );

        } else {

            for (CFGNode next : nextNodes) {

                if (!visited.contains(next)) {

                    findPaths(
                            cfg,
                            next,
                            new HashSet<>(visited),
                            new ArrayList<>(currentPath),
                            currentCost
                    );
                }
            }
        }
    }

    private int calculateNodeCost(String statement) {

        if (statement.contains("FOR LOOP")
                || statement.contains("WHILE LOOP")) {

            return 2;
        }

        if (statement.startsWith("IF")) {
            return 1;
        }

        if (statement.contains("+")
                || statement.contains("-")) {

            return 1;
        }

        if (statement.contains("*")) {
            return 2;
        }

        if (statement.contains("/")) {
            return 4;
        }

        return 1;
    }

    private void checkWorstPath(
            List<CFGNode> path,
            int cost) {

        if (cost > maxCost) {

            maxCost = cost;

            worstPath =
                    new ArrayList<>(path);
        }
    }

    public int getMaxCost() {
        return maxCost;
    }

    public void displayWorstPath() {

        System.out.println(
                "\n===== WORST-CASE PATH ====="
        );

        for (CFGNode node : worstPath) {

            System.out.println(
                    "Node "
                            + node.getId()
                            + " : "
                            + node.getStatement()
            );
        }

        System.out.println(
                "Worst path cost: "
                        + maxCost
                        + " time units"
        );
    }
}