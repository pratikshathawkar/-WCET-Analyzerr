package auth;

import db.Database;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;

public class AuthService {

    public static boolean registerUser(
            String name,
            String email,
            String password
    ) {

        String checkSql =
                "SELECT id FROM users WHERE email = ?";

        String insertSql =
                "INSERT INTO users (name, email, password_hash) VALUES (?, ?, ?)";

        try (Connection connection = Database.getConnection();
             PreparedStatement checkStatement =
                     connection.prepareStatement(checkSql)) {

            checkStatement.setString(1, email);

            ResultSet result = checkStatement.executeQuery();

            if (result.next()) {
                return false;
            }

            String hashedPassword =
                    PasswordUtil.hashPassword(password);

            try (PreparedStatement insertStatement =
                         connection.prepareStatement(insertSql)) {

                insertStatement.setString(1, name);
                insertStatement.setString(2, email);
                insertStatement.setString(3, hashedPassword);

                insertStatement.executeUpdate();

                return true;
            }

        } catch (Exception e) {
            e.printStackTrace();
            return false;
        }
    }

    public static User loginUser(
            String email,
            String password
    ) {

        String sql =
                "SELECT id, name, email, password_hash " +
                "FROM users WHERE email = ?";

        try (Connection connection = Database.getConnection();
             PreparedStatement statement =
                     connection.prepareStatement(sql)) {

            statement.setString(1, email);

            ResultSet result = statement.executeQuery();

            if (result.next()) {

                String storedPassword =
                        result.getString("password_hash");
                        System.out.println("Login account found: true");
System.out.println(
        "Password hash exists: " +
        (storedPassword != null && !storedPassword.isEmpty())
);
System.out.println(
        "Stored hash has expected format: " +
        (storedPassword != null &&
         storedPassword.matches("^[^:]+:[^:]+$"))
);

                boolean valid =
                        PasswordUtil.verifyPassword(
                                password,
                                storedPassword
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

        } catch (Exception e) {
            e.printStackTrace();
        }
        
        return null;
    }
}