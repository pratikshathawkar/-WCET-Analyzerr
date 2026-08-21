package analysis;

public class WCETEstimator {

    public int calculateWCET(
            int operationCost,
            int loopIterations) {

        return operationCost * loopIterations;
    }

    public void displayWCET(int wcet) {

        System.out.println(
                "\n===== WCET ESTIMATION ====="
        );

        System.out.println(
                "Estimated WCET: "
                        + wcet
                        + " time units"
        );
    }
}