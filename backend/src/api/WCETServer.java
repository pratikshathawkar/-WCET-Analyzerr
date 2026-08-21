package api;

import com.sun.net.httpserver.HttpExchange;
import com.sun.net.httpserver.HttpServer;

import analysis.WCETEstimator;
import cfg.CFG;
import cfg.CFGBuilder;
import cfg.CFGNode;

import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.net.InetSocketAddress;
import java.nio.charset.StandardCharsets;
import java.util.ArrayList;
import java.util.List;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

public class WCETServer {

    public static void main(String[] args) throws Exception {

        HttpServer server =
                HttpServer.create(
                        new InetSocketAddress(8080),
                        0
                );

        server.createContext(
                "/api/analyze",
                WCETServer::handleAnalyze
        );

        server.setExecutor(null);

        System.out.println(
                "WCET Backend Server started!"
        );

        System.out.println(
                "http://localhost:8080"
        );

        server.start();
    }

    private static void handleAnalyze(
            HttpExchange exchange) throws IOException {

        exchange.getResponseHeaders().add(
                "Access-Control-Allow-Origin",
                "*"
        );

        exchange.getResponseHeaders().add(
                "Access-Control-Allow-Headers",
                "Content-Type"
        );

        exchange.getResponseHeaders().add(
                "Access-Control-Allow-Methods",
                "POST, OPTIONS"
        );

        if (exchange.getRequestMethod()
                .equalsIgnoreCase("OPTIONS")) {

            exchange.sendResponseHeaders(204, -1);
            return;
        }

        if (!exchange.getRequestMethod()
                .equalsIgnoreCase("POST")) {

            sendResponse(
                    exchange,
                    405,
                    "{\"error\":\"Only POST is allowed\"}"
            );

            return;
        }

        // ==============================
        // READ SOURCE CODE
        // ==============================

        InputStream input =
                exchange.getRequestBody();

        String code =
                new String(
                        input.readAllBytes(),
                        StandardCharsets.UTF_8
                );

        System.out.println("Received code:");
        System.out.println(code);

        // ==============================
        // BASIC ANALYSIS
        // ==============================

        int lines = countLines(code);

        int loopIterations =
                detectLoopBound(code);

        int operationCost =
                calculateOperationCost(code);

        int worstPathCost =
                calculateWorstPath(code);

        // ==============================
        // WCET
        // ==============================

        WCETEstimator estimator =
                new WCETEstimator();

        int wcet =
                estimator.calculateWCET(
                        operationCost,
                        loopIterations
                );

        // ==============================
        // BUILD CFG
        // ==============================

        List<String> statements =
                extractStatements(code);

        CFGBuilder builder =
                new CFGBuilder();

        CFG cfg =
                builder.buildCFG(statements);

        // Display CFG in backend console
        cfg.displayCFG();

        // ==============================
        // CREATE CFG JSON
        // ==============================

        String cfgJson =
                buildCFGJson(cfg);

        // ==============================
        // JSON RESPONSE
        // ==============================

        String response =
                "{"
                + "\"status\":\"success\","
                + "\"message\":\"Code analyzed successfully\","
                + "\"wcet\":" + wcet + ","
                + "\"loopIterations\":" + loopIterations + ","
                + "\"operationCost\":" + operationCost + ","
                + "\"worstPathCost\":" + worstPathCost + ","
                + "\"lines\":" + lines + ","
                + "\"cfg\":" + cfgJson
                + "}";

        sendResponse(
                exchange,
                200,
                response
        );
    }

    // ==========================================
    // EXTRACT STATEMENTS FOR CFG
    // ==========================================

    private static List<String> extractStatements(
            String code) {

        List<String> statements =
                new ArrayList<>();

        String[] lines =
                code.split("\\R");

        for (String line : lines) {

            line = line.trim();

            if (line.isEmpty()) {
                continue;
            }

            // Ignore opening/closing braces
            if (line.equals("{")
                    || line.equals("}")) {
                continue;
            }

            // Variable declaration
            if (line.startsWith("int ")) {
                statements.add(
                        "STATEMENT: " + line
                );
            }

            // FOR loop
            else if (line.startsWith("for")) {
                statements.add(
                        "FOR LOOP: " + line
                );
            }

            // WHILE loop
            else if (line.startsWith("while")) {
                statements.add(
                        "WHILE LOOP: " + line
                );
            }

            // IF
            else if (line.startsWith("if")) {
                statements.add(
                        "IF: " + line
                );
            }

            // Other statements
            else if (line.contains("=")) {
                statements.add(
                        "STATEMENT: " + line
                );
            }
        }

        return statements;
    }

    // ==========================================
    // BUILD CFG JSON
    // ==========================================

    private static String buildCFGJson(
            CFG cfg) {

        StringBuilder json =
                new StringBuilder();

        json.append("{");

        // --------------------------
        // NODES
        // --------------------------

        json.append("\"nodes\":[");

        List<CFGNode> nodes =
                cfg.getNodes();

        for (int i = 0;
                i < nodes.size();
                i++) {

            CFGNode node =
                    nodes.get(i);

            json.append("{");

            json.append(
                    "\"id\":" +
                    node.getId()
            );

            json.append(",");

            json.append(
                    "\"statement\":\"" +
                    escapeJson(
                            node.getStatement()
                    ) +
                    "\""
            );

            json.append("}");

            if (i < nodes.size() - 1) {
                json.append(",");
            }
        }

        json.append("],");

        // --------------------------
        // EDGES
        // --------------------------

        json.append("\"edges\":[");

        boolean firstEdge = true;

        for (CFGNode from :
                nodes) {

            List<CFGNode> nextNodes =
                    cfg.getEdges().get(from);

            if (nextNodes == null) {
                continue;
            }

            for (CFGNode to :
                    nextNodes) {

                if (!firstEdge) {
                    json.append(",");
                }

                json.append("{");

                json.append(
                        "\"from\":" +
                        from.getId()
                );

                json.append(",");

                json.append(
                        "\"to\":" +
                        to.getId()
                );

                json.append("}");

                firstEdge = false;
            }
        }

        json.append("]");

        json.append("}");

        return json.toString();
    }

    private static String escapeJson(
            String text) {

        return text
                .replace("\\", "\\\\")
                .replace("\"", "\\\"");
    }

    // ==========================================
    // COUNT LINES
    // ==========================================

    private static int countLines(
            String code) {

        int count = 0;

        for (String line :
                code.split("\\R")) {

            if (!line.trim().isEmpty()) {
                count++;
            }
        }

        return count;
    }

    // ==========================================
    // LOOP BOUND
    // ==========================================

    private static int detectLoopBound(
            String code) {

        Pattern loopPattern =
                Pattern.compile(
                        "for\\s*\\([^;]*;\\s*\\w+\\s*<\\s*(\\d+)"
                );

        Matcher matcher =
                loopPattern.matcher(code);

        int total = 1;

        boolean found = false;

        while (matcher.find()) {

            found = true;

            int bound =
                    Integer.parseInt(
                            matcher.group(1)
                    );

            total *= bound;
        }

        return found ? total : 1;
    }

    // ==========================================
    // OPERATION COST
    // ==========================================

    private static int calculateOperationCost(
            String code) {

        int cost = 0;

        cost += count(code, "+");
        cost += count(code, "-");
        cost += count(code, "*");
        cost += count(code, "/");

        cost += count(code, "<");
        cost += count(code, ">");
        cost += count(code, "==");

        cost += count(code, "=");

        cost += count(code, "[");

        if (cost == 0) {
            cost = 1;
        }

        return cost;
    }

    // ==========================================
    // WORST PATH
    // ==========================================

    private static int calculateWorstPath(
            String code) {

        int cost = 0;

        cost += count(code, "if");
        cost += count(code, "for");
        cost += count(code, "while");

        return Math.max(cost, 1);
    }

    // ==========================================
    // COUNT OCCURRENCES
    // ==========================================

    private static int count(
            String text,
            String word) {

        int count = 0;
        int index = 0;

        while ((index =
                text.indexOf(word, index))
                != -1) {

            count++;

            index += word.length();
        }

        return count;
    }

    // ==========================================
    // SEND RESPONSE
    // ==========================================

    private static void sendResponse(
            HttpExchange exchange,
            int statusCode,
            String response)
            throws IOException {

        byte[] data =
                response.getBytes(
                        StandardCharsets.UTF_8
                );

        exchange.getResponseHeaders().set(
                "Content-Type",
                "application/json"
        );

        exchange.sendResponseHeaders(
                statusCode,
                data.length
        );

        OutputStream output =
                exchange.getResponseBody();

        output.write(data);
        output.close();
    }
}