package analysis;

import java.util.HashMap;
import java.util.Map;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

public class AbstractInterpreter {

    private final Map<String, AbstractValue> variables =
            new HashMap<>();

    private int maximumIterations = 0;
    private String loopVariable = "";

    public void analyze(String sourceCode) {

        variables.clear();
        maximumIterations = 0;
        loopVariable = "";

        String[] lines = sourceCode.split("\\R");

        // ==========================================
        // 1. FIND INTEGER DECLARATIONS
        // ==========================================

        Pattern declarationPattern =
                Pattern.compile(
                        "int\\s+(\\w+)\\s*=\\s*(-?\\d+)"
                );

        for (String originalLine : lines) {

            String line = originalLine.trim();

            Matcher matcher =
                    declarationPattern.matcher(line);

            if (matcher.find()) {

                String variable = matcher.group(1);

                int value =
                        Integer.parseInt(
                                matcher.group(2)
                        );

                variables.put(
                        variable,
                        new AbstractValue(value, value)
                );
            }
        }

        // ==========================================
        // 2. FIND FOR LOOP
        // ==========================================

        Pattern loopPattern =
                Pattern.compile(
                        "for\\s*\\(\\s*int\\s+(\\w+)"
                        + "\\s*=\\s*(-?\\d+)\\s*;"
                        + "\\s*\\1\\s*<\\s*(\\d+)"
                );

        for (String originalLine : lines) {

            String line = originalLine.trim();

            Matcher matcher =
                    loopPattern.matcher(line);

            if (matcher.find()) {

                loopVariable = matcher.group(1);

                int start =
                        Integer.parseInt(
                                matcher.group(2)
                        );

                int limit =
                        Integer.parseInt(
                                matcher.group(3)
                        );

                maximumIterations =
                        Math.max(
                                0,
                                limit - start
                        );

                // i = 0 to 9
                variables.put(
                        loopVariable,
                        new AbstractValue(
                                start,
                                limit - 1
                        )
                );

                // Analyze loop body
                analyzeLoopBody(
                        lines,
                        loopVariable,
                        start,
                        limit
                );

                break;
            }
        }
    }

    // ==========================================
    // ANALYZE LOOP BODY
    // ==========================================

    private void analyzeLoopBody(
            String[] lines,
            String loopVariable,
            int start,
            int limit) {

        Pattern additionPattern =
                Pattern.compile(
                        "(\\w+)\\s*=\\s*(\\w+)"
                        + "\\s*\\+\\s*(\\w+)\\s*;"
                );

        for (String originalLine : lines) {

            String line = originalLine.trim();

            Matcher matcher =
                    additionPattern.matcher(line);

            if (!matcher.matches()) {
                continue;
            }

            String target =
                    matcher.group(1);

            String left =
                    matcher.group(2);

            String right =
                    matcher.group(3);

            // Example:
            // sum = sum + i

            if (!target.equals(left)) {
                continue;
            }

            if (!right.equals(loopVariable)) {
                continue;
            }

            if (!variables.containsKey(target)) {
                continue;
            }

            int oldLower =
                    variables.get(target).getLower();

            int oldUpper =
                    variables.get(target).getUpper();

            int iterations =
                    Math.max(
                            0,
                            limit - start
                    );

            // Sum of loop variable:
            //
            // 0 + 1 + 2 + ... + 9
            //
            // = 45

            int loopSum =
                    0;

            for (int i = start;
                 i < limit;
                 i++) {

                loopSum += i;
            }

            int newLower =
                    oldLower + loopSum;

            int newUpper =
                    oldUpper + loopSum;

            variables.put(
                    target,
                    new AbstractValue(
                            newLower,
                            newUpper
                    )
            );

            System.out.println(
                    "Abstract update: "
                    + target
                    + " -> ["
                    + newLower
                    + ", "
                    + newUpper
                    + "]"
            );
        }
    }

    // ==========================================
    // GET LOOP ITERATIONS
    // ==========================================

    public int getMaximumIterations() {
        return maximumIterations;
    }

    // ==========================================
    // GET LOOP VARIABLE
    // ==========================================

    public String getLoopVariable() {
        return loopVariable;
    }

    // ==========================================
    // GET VARIABLES
    // ==========================================

    public Map<String, AbstractValue> getVariables() {
        return variables;
    }

    // ==========================================
    // DISPLAY ABSTRACT STATE
    // ==========================================

    public void displayValues() {

        System.out.println(
                "\n===== ABSTRACT STATE ====="
        );

        for (Map.Entry<String, AbstractValue> entry
                : variables.entrySet()) {

            System.out.println(
                    entry.getKey()
                            + " -> "
                            + entry.getValue()
            );
        }
    }
}