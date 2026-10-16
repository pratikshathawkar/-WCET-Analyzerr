package api;

import com.sun.net.httpserver.HttpExchange;
import com.sun.net.httpserver.HttpServer;

import analysis.WCETEstimator;
import cfg.CFG;
import cfg.CFGBuilder;
import cfg.CFGNode;
import analysis.AbstractInterpreter;
import analysis.AbstractValue;
import auth.AuthService;
import auth.User;

import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.net.InetSocketAddress;
import java.nio.charset.StandardCharsets;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

public class WCETServer {

    // ==========================================
    // START SERVER
    // ==========================================

    public static void main(String[] args) throws Exception {

        HttpServer server =
                HttpServer.create(
                        new InetSocketAddress(8080),
                        0
                );

        // WCET Analyzer API
        server.createContext(
                "/api/analyze",
                WCETServer::handleAnalyze
        );

        // Signup API
        server.createContext(
                "/api/signup",
                WCETServer::handleSignup
        );

        // Login API
        server.createContext(
                "/api/login",
                WCETServer::handleLogin
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


    // ==========================================
    // HANDLE ANALYZE REQUEST
    // ==========================================

    private static void handleAnalyze(
            HttpExchange exchange)
            throws IOException {

        addCorsHeaders(exchange);

        // OPTIONS request
        if (exchange.getRequestMethod()
                .equalsIgnoreCase("OPTIONS")) {

            exchange.sendResponseHeaders(
                    204,
                    -1
            );

            return;
        }

        // Only POST allowed
        if (!exchange.getRequestMethod()
                .equalsIgnoreCase("POST")) {

            sendResponse(
                    exchange,
                    405,
                    "{\"error\":\"Only POST is allowed\"}"
            );

            return;
        }

        // ==========================================
        // READ SOURCE CODE
        // ==========================================

        InputStream input =
                exchange.getRequestBody();

        String code =
                new String(
                        input.readAllBytes(),
                        StandardCharsets.UTF_8
                );

        System.out.println();
        System.out.println(
                "===== RECEIVED SOURCE CODE ====="
        );

        System.out.println(code);


        // ==========================================
        // BASIC CODE ANALYSIS
        // ==========================================

        int lines =
                countLines(code);

        int loopIterations =
                detectLoopBound(code);

        int operationCost =
                calculateOperationCost(code);

        int worstPathCost =
                calculateWorstPath(code);


        // ==========================================
        // WCET CALCULATION
        // ==========================================

        WCETEstimator estimator =
                new WCETEstimator();

        int wcet =
                estimator.calculateWCET(
                        operationCost,
                        loopIterations
                );


        // ==========================================
        // BUILD CONTROL FLOW GRAPH
        // ==========================================

        List<String> statements =
                extractStatements(code);

        CFGBuilder builder =
                new CFGBuilder();

        CFG cfg =
                builder.buildCFG(statements);

        // Display CFG in backend terminal
        cfg.displayCFG();


        // ==========================================
        // BUILD CFG JSON
        // ==========================================

        String cfgJson =
                buildCFGJson(cfg);


        // ==========================================
        // ABSTRACT INTERPRETATION
        // ==========================================

        AbstractInterpreter interpreter =
                new AbstractInterpreter();

        interpreter.analyze(code);


        // ==========================================
        // BUILD ABSTRACT STATE JSON
        // ==========================================

        StringBuilder abstractState =
                new StringBuilder();

        abstractState.append("[");

        boolean firstVariable =
                true;

        for (
                Map.Entry<String, AbstractValue> entry :
                interpreter.getVariables().entrySet()
        ) {

            if (!firstVariable) {
                abstractState.append(",");
            }

            firstVariable = false;

            abstractState.append("{");

            abstractState
                    .append("\"variable\":\"")
                    .append(
                            escapeJson(
                                    entry.getKey()
                            )
                    )
                    .append("\",");

            abstractState
                    .append("\"lower\":")
                    .append(
                            entry.getValue()
                                    .getLower()
                    )
                    .append(",");

            abstractState
                    .append("\"upper\":")
                    .append(
                            entry.getValue()
                                    .getUpper()
                    );

            abstractState.append("}");
        }

        abstractState.append("]");


        // ==========================================
        // JSON RESPONSE
        // ==========================================

        String response =
                "{"

                + "\"status\":\"success\","

                + "\"message\":\"Code analyzed successfully\","

                + "\"lines\":"
                + lines
                + ","

                + "\"wcet\":"
                + wcet
                + ","

                + "\"loopIterations\":"
                + loopIterations
                + ","

                + "\"operationCost\":"
                + operationCost
                + ","

                + "\"worstPathCost\":"
                + worstPathCost
                + ","

                + "\"loopVariable\":\""
                + escapeJson(
                        interpreter.getLoopVariable()
                )
                + "\","

                + "\"maximumIterations\":"
                + interpreter.getMaximumIterations()
                + ","

                + "\"abstractState\":"
                + abstractState
                + ","

                + "\"cfg\":"
                + cfgJson

                + "}";


        // ==========================================
        // SEND RESPONSE
        // ==========================================

        sendResponse(
                exchange,
                200,
                response
        );
    }


    // ==========================================
    // HANDLE SIGNUP
    // ==========================================

    private static void handleSignup(
            HttpExchange exchange)
            throws IOException {

        addCorsHeaders(exchange);

        // OPTIONS request
        if (exchange.getRequestMethod()
                .equalsIgnoreCase("OPTIONS")) {

            exchange.sendResponseHeaders(
                    204,
                    -1
            );

            return;
        }

        // Only POST allowed
        if (!exchange.getRequestMethod()
                .equalsIgnoreCase("POST")) {

            sendResponse(
                    exchange,
                    405,
                    "{\"error\":\"Only POST is allowed\"}"
            );

            return;
        }


        // ==========================================
        // READ REQUEST
        // ==========================================

        String body =
                new String(
                        exchange.getRequestBody()
                                .readAllBytes(),
                        StandardCharsets.UTF_8
                );

        System.out.println();
        System.out.println(
                "===== SIGNUP REQUEST ====="
        );

        System.out.println(body);


        // ==========================================
        // EXTRACT DATA
        // ==========================================

        String name =
                extractJsonValue(
                        body,
                        "name"
                );

        String email =
                extractJsonValue(
                        body,
                        "email"
                );

        String password =
                extractJsonValue(
                        body,
                        "password"
                );


        // ==========================================
        // REGISTER USER
        // ==========================================

        boolean registered =
                AuthService.registerUser(
                        name,
                        email,
                        password
                );


        if (registered) {

            sendResponse(
                    exchange,
                    200,
                    "{"
                    + "\"success\":true,"
                    + "\"message\":\"Account created successfully\""
                    + "}"
            );

        } else {

            sendResponse(
                    exchange,
                    400,
                    "{"
                    + "\"success\":false,"
                    + "\"message\":\"Email already exists or registration failed\""
                    + "}"
            );
        }
    }


    // ==========================================
    // HANDLE LOGIN
    // ==========================================

    private static void handleLogin(
            HttpExchange exchange)
            throws IOException {

        addCorsHeaders(exchange);

        // OPTIONS request
        if (exchange.getRequestMethod()
                .equalsIgnoreCase("OPTIONS")) {

            exchange.sendResponseHeaders(
                    204,
                    -1
            );

            return;
        }

        // Only POST allowed
        if (!exchange.getRequestMethod()
                .equalsIgnoreCase("POST")) {

            sendResponse(
                    exchange,
                    405,
                    "{\"error\":\"Only POST is allowed\"}"
            );

            return;
        }


        // ==========================================
        // READ REQUEST
        // ==========================================

        String body =
                new String(
                        exchange.getRequestBody()
                                .readAllBytes(),
                        StandardCharsets.UTF_8
                );

        System.out.println();
        System.out.println(
                "===== LOGIN REQUEST ====="
        );

        System.out.println(body);


        // ==========================================
        // EXTRACT DATA
        // ==========================================

        String email =
                extractJsonValue(
                        body,
                        "email"
                );

        String password =
                extractJsonValue(
                        body,
                        "password"
                );


        // ==========================================
        // LOGIN USER
        // ==========================================

        User user =
                AuthService.loginUser(
                        email,
                        password
                );


        // ==========================================
        // LOGIN SUCCESS
        // ==========================================

        if (user != null) {

            String response =
                    "{"

                    + "\"success\":true,"

                    + "\"message\":\"Login successful\","

                    + "\"user\":{"

                    + "\"id\":"
                    + user.getId()
                    + ","

                    + "\"name\":\""
                    + escapeJson(
                            user.getName()
                    )
                    + "\","

                    + "\"email\":\""
                    + escapeJson(
                            user.getEmail()
                    )
                    + "\""

                    + "}"

                    + "}";

            sendResponse(
                    exchange,
                    200,
                    response
            );

        }

        // ==========================================
        // LOGIN FAILED
        // ==========================================

        else {

            sendResponse(
                    exchange,
                    401,
                    "{"
                    + "\"success\":false,"
                    + "\"message\":\"Invalid email or password\""
                    + "}"
            );
        }
    }


    // ==========================================
    // CORS HEADERS
    // ==========================================

    private static void addCorsHeaders(
            HttpExchange exchange) {

        exchange.getResponseHeaders().set(
                "Access-Control-Allow-Origin",
                "*"
        );

        exchange.getResponseHeaders().set(
                "Access-Control-Allow-Headers",
                "Content-Type"
        );

        exchange.getResponseHeaders().set(
                "Access-Control-Allow-Methods",
                "POST, OPTIONS"
        );
    }


    // ==========================================
    // EXTRACT JSON VALUE
    // ==========================================

    private static String extractJsonValue(
            String json,
            String key) {

        Pattern pattern =
                Pattern.compile(
                        "\"" +
                        Pattern.quote(key) +
                        "\"\\s*:\\s*\"([^\"]*)\""
                );

        Matcher matcher =
                pattern.matcher(json);

        if (matcher.find()) {

            return matcher.group(1);
        }

        return "";
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

            line =
                    line.trim();

            if (line.isEmpty()) {
                continue;
            }

            // Ignore braces
            if (line.equals("{")
                    || line.equals("}")) {

                continue;
            }


            // --------------------------------------
            // FOR LOOP
            // --------------------------------------

            if (line.startsWith("for")) {

                statements.add(
                        "FOR LOOP: " + line
                );

                continue;
            }


            // --------------------------------------
            // WHILE LOOP
            // --------------------------------------

            if (line.startsWith("while")) {

                statements.add(
                        "WHILE LOOP: " + line
                );

                continue;
            }


            // --------------------------------------
            // IF
            // --------------------------------------

            if (line.startsWith("if")) {

                statements.add(
                        "IF: " + line
                );

                continue;
            }


            // --------------------------------------
            // INTEGER DECLARATION
            // --------------------------------------

            if (line.startsWith("int ")) {

                statements.add(
                        "STATEMENT: " + line
                );

                continue;
            }


            // --------------------------------------
            // OTHER ASSIGNMENTS
            // --------------------------------------

            if (line.contains("=")) {

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


        // ==========================================
        // NODES
        // ==========================================

        json.append(
                "\"nodes\":["
        );

        List<CFGNode> nodes =
                cfg.getNodes();

        for (
                int i = 0;
                i < nodes.size();
                i++
        ) {

            CFGNode node =
                    nodes.get(i);

            json.append("{");

            json.append(
                    "\"id\":"
            );

            json.append(
                    node.getId()
            );

            json.append(",");

            json.append(
                    "\"statement\":\""
            );

            json.append(
                    escapeJson(
                            node.getStatement()
                    )
            );

            json.append("\"");

            json.append("}");

            if (
                    i < nodes.size() - 1
            ) {

                json.append(",");
            }
        }

        json.append("],");


        // ==========================================
        // EDGES
        // ==========================================

        json.append(
                "\"edges\":["
        );

        boolean firstEdge =
                true;

        for (CFGNode from :
                nodes) {

            List<CFGNode> nextNodes =
                    cfg.getEdges()
                            .get(from);

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
                        "\"from\":"
                );

                json.append(
                        from.getId()
                );

                json.append(",");

                json.append(
                        "\"to\":"
                );

                json.append(
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


    // ==========================================
    // ESCAPE JSON
    // ==========================================

    private static String escapeJson(
            String text) {

        if (text == null) {
            return "";
        }

        return text
                .replace(
                        "\\",
                        "\\\\"
                )
                .replace(
                        "\"",
                        "\\\""
                )
                .replace(
                        "\r",
                        "\\r"
                )
                .replace(
                        "\n",
                        "\\n"
                );
    }


    // ==========================================
    // COUNT LINES
    // ==========================================

    private static int countLines(
            String code) {

        int count =
                0;

        for (
                String line :
                code.split("\\R")
        ) {

            if (
                    !line.trim().isEmpty()
            ) {

                count++;
            }
        }

        return count;
    }


    // ==========================================
    // DETECT LOOP BOUND
    // ==========================================

    private static int detectLoopBound(
            String code) {

        Pattern loopPattern =
                Pattern.compile(
                        "for\\s*\\([^;]*;\\s*\\w+\\s*<\\s*(\\d+)"
                );

        Matcher matcher =
                loopPattern.matcher(code);

        int total =
                1;

        boolean found =
                false;

        while (
                matcher.find()
        ) {

            found =
                    true;

            int bound =
                    Integer.parseInt(
                            matcher.group(1)
                    );

            total *= bound;
        }

        return found
                ? total
                : 1;
    }


    // ==========================================
    // CALCULATE OPERATION COST
    // ==========================================

    private static int calculateOperationCost(
            String code) {

        int cost =
                0;

        cost += count(
                code,
                "+"
        );

        cost += count(
                code,
                "-"
        );

        cost += count(
                code,
                "*"
        );

        cost += count(
                code,
                "/"
        );

        cost += count(
                code,
                "<"
        );

        cost += count(
                code,
                ">"
        );

        cost += count(
                code,
                "=="
        );

        cost += count(
                code,
                "="
        );

        cost += count(
                code,
                "["
        );

        if (cost == 0) {
            cost = 1;
        }

        return cost;
    }


    // ==========================================
    // CALCULATE WORST PATH
    // ==========================================

    private static int calculateWorstPath(
            String code) {

        int cost =
                0;

        cost += count(
                code,
                "if"
        );

        cost += count(
                code,
                "for"
        );

        cost += count(
                code,
                "while"
        );

        return Math.max(
                cost,
                1
        );
    }


    // ==========================================
    // COUNT OCCURRENCES
    // ==========================================

    private static int count(
            String text,
            String word) {

        int count =
                0;

        int index =
                0;

        while (
                (index =
                        text.indexOf(
                                word,
                                index
                        )
                ) != -1
        ) {

            count++;

            index +=
                    word.length();
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