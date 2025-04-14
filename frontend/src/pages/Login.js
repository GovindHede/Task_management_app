import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const Login = ({ setIsAuthenticated }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    // Simulate login
    if (email === "demo@finzarc.com" && password === "finzarc123") {
      setIsAuthenticated(true); // <-- Set user as logged in
      navigate("/dashboard");
    } else {
      alert("Invalid credentials");
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#f4f7fc",
      }}
    >
      <form
        onSubmit={handleSubmit}
        style={{
          padding: "30px",
          width: "100%",
          maxWidth: "400px",
          borderRadius: "8px",
          backgroundColor: "#fff",
          boxShadow: "0 4px 20px rgba(0, 0, 0, 0.1)",
          textAlign: "center",
        }}
      >
        <h2 style={{ color: "#333", marginBottom: "20px" }}>Login to Task Zen</h2>
        
        <div style={{ marginBottom: "15px" }}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            required
            onChange={(e) => setEmail(e.target.value)}
            style={{
              padding: "12px",
              width: "100%",
              borderRadius: "6px",
              border: "1px solid #ccc",
              fontSize: "16px",
              marginBottom: "10px",
              transition: "0.3s",
            }}
            onFocus={(e) => (e.target.style.borderColor = "#007bff")}
            onBlur={(e) => (e.target.style.borderColor = "#ccc")}
          />
        </div>

        <div style={{ marginBottom: "25px" }}>
          <input
            type="password"
            placeholder="Password"
            value={password}
            required
            onChange={(e) => setPassword(e.target.value)}
            style={{
              padding: "12px",
              width: "100%",
              borderRadius: "6px",
              border: "1px solid #ccc",
              fontSize: "16px",
              marginBottom: "10px",
              transition: "0.3s",
            }}
            onFocus={(e) => (e.target.style.borderColor = "#007bff")}
            onBlur={(e) => (e.target.style.borderColor = "#ccc")}
          />
        </div>

        <button
          type="submit"
          style={{
            padding: "12px 20px",
            width: "100%",
            backgroundColor: "#007bff",
            color: "#fff",
            border: "none",
            borderRadius: "6px",
            fontSize: "16px",
            cursor: "pointer",
            transition: "background-color 0.3s",
          }}
          onMouseEnter={(e) => (e.target.style.backgroundColor = "#0056b3")}
          onMouseLeave={(e) => (e.target.style.backgroundColor = "#007bff")}
        >
          Login
        </button>

        <p
          style={{
            fontSize: "14px",
            color: "#888",
            marginTop: "20px",
            textAlign: "center",
          }}
        >
          Demo Email: <strong>demo@finzarc.com</strong><br />
          Password: <strong>finzarc123</strong>
        </p>
      </form>
    </div>
  );
};

export default Login;
