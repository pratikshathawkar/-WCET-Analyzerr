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

        for (String line : lines) {

            line = line.trim();

            // ==========================================
            // INTEGER DECLARATION
            // Example: int x = 10;
            // ==========================================

            Pattern declaration =
                    Pattern.compile(
                            "int\\s+(\\w+)\\s*=\\s*(-?\\d+)"
                    );

            Matcher declarationMatcher =
                    declaration.matcher(line);

            if (declarationMatcher.find()) {

                String variable =
                        declarationMatcher.group(1);

                int value =
                        Integer.parseInt(
                                declarationMatcher.group(2)
                        );

                variables.put(
                        variable,
                        new AbstractValue(value, value)
                );
            }

            // ==========================================
            // FOR LOOP
            // Example:
            // for(int i = 0; i < 10; i++)
            // ==========================================

            Pattern loop =
                    Pattern.compile(
                            "for\\s*\\(\\s*int\\s+(\\w+)"
                            + "\\s*=\\s*(-?\\d+)\\s*;"
                            + "\\s*\\1\\s*<\\s*(\\d+)"
                    );

            Matcher loopMatcher =
                    loop.matcher(line);

            if (loopMatcher.find()) {

                loopVariable =
                        loopMatcher.group(1);

                int start =
                        Integer.parseInt(
                                loopMatcher.group(2)
                        );

                int limit =
                        Integer.parseInt(
                                loopMatcher.group(3)
                        );

                int iterations =
                        Math.max(
                                0,
                                limit - start
                        );

                maximumIterations =
                        iterations;

                variables.put(
                        loopVariable,
                        new AbstractValue(
                                start,
                                limit - 1
                        )
                );
            }
        }
    }

    // ==========================================
    // GET LOOP INFORMATION
    // ==========================================

    public int getMaximumIterations() {
        return maximumIterations;
    }

    public String getLoopVariable() {
        return loopVariable;
    }

    // ==========================================
    // GET ABSTRACT VARIABLES
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