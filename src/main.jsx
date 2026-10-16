import { StrictMode, useState } from "react";
import { createRoot } from "react-dom/client";
import LoginDashboard from "./LoginDashboard.jsx";
import App from "./App.jsx";
import "./App.css";

function Main() {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem("wcetUser");

    if (!savedUser) {
      return null;
    }

    try {
      return JSON.parse(savedUser);
    } catch (error) {
      localStorage.removeItem("wcetUser");
      return null;
    }
  });

  const handleLogin = (loggedInUser) => {
    localStorage.setItem(
      "wcetUser",
      JSON.stringify(loggedInUser)
    );

    setUser(loggedInUser);
  };

  const handleLogout = () => {
    console.log("LOGOUT CLICKED");

    localStorage.removeItem("wcetUser");
    localStorage.removeItem("user");

    setUser(null);
  };

  if (user) {
    return (
      <App
        user={user}
        onLogout={handleLogout}
      />
    );
  }

  return (
    <LoginDashboard
      onLogin={handleLogin}
    />
  );
}

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Main />
  </StrictMode>
);