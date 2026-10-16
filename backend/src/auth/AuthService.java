
       
package auth;

import db.Database;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;

public class AuthService {

    public static boolean registerUser(
            String name,
            String email,
            String password
    ) {
        // Validate input
        if (name == null || name.trim().isEmpty()
                || email == null || email.trim().isEmpty()
                || password == null || password.isEmpty()) {

            System.out.println("Signup failed: Missing required fields.");
            return false;
        }

        name = name.trim();
        email = email.trim().toLowerCase();

        String checkSql =
                "SELECT id FROM users WHERE email = ?";

        String insertSql =
                "INSERT INTO users (name, email, password_hash) VALUES (?, ?, ?)";

        try (Connection connection = Database.getConnection()) {

            // Check whether email already exists
            try (PreparedStatement checkStatement =
                         connection.prepareStatement(checkSql)) {

                checkStatement.setString(1, email);

                try (ResultSet result = checkStatement.executeQuery()) {
                    if (result.next()) {
                        System.out.println(
                                "Signup failed: Email already exists."
                        );
                        return false;
                    }
                }
            }

            // Hash password
            String hashedPassword =
                    PasswordUtil.hashPassword(password);

            if (hashedPassword == null || hashedPassword.isEmpty()) {
                System.out.println("Signup failed: Password hashing failed.");
                return false;
            }

            // Insert new user
            try (PreparedStatement insertStatement =
                         connection.prepareStatement(insertSql)) {

                insertStatement.setString(1, name);
                insertStatement.setString(2, email);
                insertStatement.setString(3, hashedPassword);

                int rowsInserted = insertStatement.executeUpdate();

                if (rowsInserted == 1) {
                    System.out.println(
                            "Signup successful for: " + email
                    );
                    return true;
                }

                System.out.println("Signup failed: No row inserted.");
                return false;
            }

        } catch (SQLException e) {
            System.err.println("Database error during signup:");
            System.err.println("SQL state: " + e.getSQLState());
            System.err.println("Error code: " + e.getErrorCode());
            e.printStackTrace();
            return false;

        } catch (Exception e) {
            System.err.println("Signup error:");
            e.printStackTrace();
            return false;
        }
    }

    public static User loginUser(
            String email,
            String password
    ) {
        if (email == null || email.trim().isEmpty()
                || password == null || password.isEmpty()) {
            return null;
        }

        String sql =
                "SELECT id, name, email, password_hash " +
                "FROM users WHERE email = ?";

        try (Connection connection = Database.getConnection();
             PreparedStatement statement =
                     connection.prepareStatement(sql)) {

            statement.setString(
                    1,
                    email.trim().toLowerCase()
            );

            try (ResultSet result = statement.executeQuery()) {

                if (result.next()) {
                    String storedPassword =
                            result.getString("password_hash");

                    boolean valid =
                            PasswordUtil.verifyPassword(
                                    password,
                                    storedPassword
                            );

                    System.out.println(
                            "Login account found: true"
                    );
                    System.out.println(
                            "Password verification passed: " + valid
                    );

                    if (valid) {
                        return new User(
                                result.getInt("id"),
                                result.getString("name"),
                                result.getString("email")
                        );
                    }
                }
            }

        } catch (Exception e) {
            System.err.println("Login error:");
            e.printStackTrace();
        }

        return null;
    }
}
