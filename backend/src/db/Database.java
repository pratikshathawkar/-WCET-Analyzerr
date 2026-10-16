
package db;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.SQLException;

public class Database {

    private static final String URL =
            "jdbc:mysql://localhost:3306/wcet_analyzer";

    private static final String USERNAME = "root";

    private static final String PASSWORD =
            "Abhas@123";

    public static Connection getConnection() throws SQLException {
        try {
            Class.forName("com.mysql.cj.jdbc.Driver");
        } catch (ClassNotFoundException e) {
            throw new SQLException(
                "MySQL JDBC driver not found. Check the Connector/J JAR classpath.",
                e
            );
        }

        return DriverManager.getConnection(URL, USERNAME, PASSWORD);
    }
}
