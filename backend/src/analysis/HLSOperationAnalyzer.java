package analysis;

public class HLSOperationAnalyzer {

    private int totalCost = 0;

    // Estimated operation costs
    private final int ADDITION_COST = 1;
    private final int SUBTRACTION_COST = 1;
    private final int MULTIPLICATION_COST = 2;
    private final int DIVISION_COST = 4;
    private final int COMPARISON_COST = 1;
    private final int MEMORY_COST = 2;

    public void analyze(String sourceCode) {

        String[] lines = sourceCode.split("\\n");

        for (String line : lines) {

            line = line.trim();

            if (line.isEmpty()) {
                continue;
            }

            // Addition
            if (line.contains("+")) {
                totalCost += ADDITION_COST;
            }

            // Subtraction
            if (line.contains("-")) {
                totalCost += SUBTRACTION_COST;
            }

            // Multiplication
            if (line.contains("*")) {
                totalCost += MULTIPLICATION_COST;
            }

            // Division
            if (line.contains("/")) {
                totalCost += DIVISION_COST;
            }

            // Comparison
            if (line.contains("<")
                    || line.contains(">")
                    || line.contains("==")) {

                totalCost += COMPARISON_COST;
            }

            // Array / memory operation
            if (line.contains("[")
                    || line.contains("array")) {

                totalCost += MEMORY_COST;
            }
        }
    }

    public int getTotalCost() {
        return totalCost;
    }

    public void displayCost() {

        System.out.println(
                "\n===== HLS OPERATION ANALYSIS ====="
        );

        System.out.println(
                "Estimated operation cost: "
                        + totalCost
                        + " time units"
        );
    }
}