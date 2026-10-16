package auth;

public class PasswordTest {

    public static void main(String[] args) {

        String password = args[0];

        String storedHash =
                "VOSy3b7SY1JwhQ50sbXxxQ==:tFOsrX32nhtytrianbmxnFUrmXWhXPfMlM9RroDASKs=";

        boolean result =
                PasswordUtil.verifyPassword(
                        password,
                        storedHash
                );

        System.out.println(
                "Password match: " + result
        );
    }
}