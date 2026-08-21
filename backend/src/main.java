import analysis.AbstractInterpreter;
import analysis.HLSOperationAnalyzer;
import analysis.WCETEstimator;

import cfg.CFG;
import cfg.CFGBuilder;

import path.PathAnalyzer;
public class Main {


    public static void main(String[] args) {

        String sourceCode = """
                public class Test {

                    public static void main(String[] args) {

                        int x = 10;

                        for(int i = 0; i < 10; i++) {

                            x = x + i;

                        }

                        if(x > 20) {

                            x = x * 2;

                        }
                    }
                }
                """;

        System.out.println("================================");
        System.out.println("       WCET ANALYZER");
        System.out.println("================================");

        // 1. Build CFG

CFGBuilder cfgBuilder = new CFGBuilder();

java.util.List<String> statements =
        new java.util.ArrayList<>();

String[] lines = sourceCode.split("\\n");

for (String line : lines) {

    line = line.trim();

    if (line.isEmpty()) {
        continue;
    }

    if (line.startsWith("if")) {
        statements.add("IF: " + line);
    }
    else if (line.startsWith("for")) {
        statements.add("FOR LOOP: " + line);
    }
    else if (line.startsWith("while")) {
        statements.add("WHILE LOOP: " + line);
    }
    else if (line.startsWith("else")) {
        statements.add("ELSE");
    }
    else if (line.endsWith(";")) {
        statements.add("STATEMENT: " + line);
    }
}

CFG cfg = cfgBuilder.buildCFG(statements);

cfg.displayCFG();
// Worst-Case Path Analysis

PathAnalyzer pathAnalyzer =
        new PathAnalyzer();

pathAnalyzer.analyzePaths(cfg);

pathAnalyzer.displayWorstPath();

        // 1. Abstract Interpretation
        AbstractInterpreter interpreter =
                new AbstractInterpreter();

        interpreter.analyze(sourceCode);

        interpreter.displayValues();


        // 2. HLS Operation Analysis
        HLSOperationAnalyzer hls =
                new HLSOperationAnalyzer();

        hls.analyze(sourceCode);

        hls.displayCost();


        // 3. WCET Estimation
        WCETEstimator estimator =
                new WCETEstimator();

        int operationCost =
                hls.getTotalCost();

        int loopIterations = 10;

        int wcet =
                estimator.calculateWCET(
                        operationCost,
                        loopIterations
                );

        estimator.displayWCET(wcet);

        System.out.println(
                "\nAnalysis completed successfully!"
        );
    }
}