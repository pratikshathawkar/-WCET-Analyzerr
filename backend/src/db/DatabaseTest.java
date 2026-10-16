package db;

import java.sql.Connection;
import java.sql.DriverManager;

public class DatabaseTest {

    public static void main(String[] args) {

        String url = "jdbc:mysql://localhost:3306/wcet_analyzer";
        String username = "root";
        String password = "Abhas@123";

        try {
            Connection connection = DriverManager.getConnection(
                    url,
                    username,
                    password
            );

            System.out.println("MySQL Database Connected Successfully!");

            connection.close();

        } catch (Exception e) {
            System.out.println("Database Connection Failed!");
            e.printStackTrace();
        }
    }
}