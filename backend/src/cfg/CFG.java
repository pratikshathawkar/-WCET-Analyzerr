package cfg;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

public class CFG {

    private List<CFGNode> nodes =
            new ArrayList<>();

    private Map<CFGNode, List<CFGNode>> edges =
            new HashMap<>();


    public void addNode(CFGNode node) {

        nodes.add(node);

        edges.put(
                node,
                new ArrayList<>()
        );
    }


    public void addEdge(
            CFGNode from,
            CFGNode to) {

        if (!edges.containsKey(from)) {

            edges.put(
                    from,
                    new ArrayList<>()
            );
        }

        edges.get(from).add(to);
    }


    public List<CFGNode> getNodes() {

        return nodes;
    }


    public Map<CFGNode, List<CFGNode>>
            getEdges() {

        return edges;
    }


    public void displayCFG() {

        System.out.println(
                "\n===== CONTROL FLOW GRAPH ====="
        );

        for (CFGNode node : nodes) {

            System.out.print(
                    node + " -> "
            );

            List<CFGNode> nextNodes =
                    edges.get(node);

            if (nextNodes != null) {

                for (CFGNode next :
                        nextNodes) {

                    System.out.print(
                            "Node "
                            + next.getId()
                            + " "
                    );
                }
            }

            System.out.println();
        }
    }
}