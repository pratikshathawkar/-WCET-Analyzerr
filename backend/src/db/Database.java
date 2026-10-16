
package db;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.SQLException;

public class Database {

    public static Connection getConnection() throws SQLException {

        String host = System.getenv("DB_HOST");
        String port = System.getenv().getOrDefault("DB_PORT", "3306");
        String database = System.getenv("DB_NAME");
        String username = System.getenv("DB_USER");
        String password = System.getenv("DB_PASSWORD");
        String ssl = System.getenv().getOrDefault("DB_SSL", "true");

        if (host == null || database == null ||
            username == null || password == null) {
            throw new SQLException(
                "Database configuration missing. Check Render environment variables."
            );
        }

        try {
            Class.forName("com.mysql.cj.jdbc.Driver");
        } catch (ClassNotFoundException e) {
            throw new SQLException(
                "MySQL JDBC Driver not found. Check the connector JAR and classpath.",
                e
            );
        }

        String sslMode = Boolean.parseBoolean(ssl)
                ? "REQUIRED"
                : "DISABLED";

        String url = "jdbc:mysql://" + host + ":" + port + "/"
                + database + "?sslMode=" + sslMode;

        return DriverManager.getConnection(url, username, password);
    }
}
