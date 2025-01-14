import React, { useEffect, useState } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../config/firebase";
import { useHistory } from "react-router-dom"; 

export default function SignupPage() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const history = useHistory(); // Use useHistory for v5

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, []);

  const handleSignup = async () => {
    if (!username || !email || !password || !confirmPassword) {
      alert("Please fill all fields");
      return;
    }

    if (password !== confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      alert("Signup Successful!");
      history.push('/signin');
    } catch (error) {
      console.error("Signup Error: ", error); // Log for debugging
      alert("Signup Error: " + error.message);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.formContainer}>
        <h1 style={styles.title}>Sign Up</h1>
        <input
          style={styles.input}
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <input
          style={styles.input}
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          style={styles.input}
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <input
          style={styles.input}
          type="password"
          placeholder="Confirm Password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
        />
        <button style={styles.signupButton} onClick={handleSignup}>
          Sign Up
        </button>
        <p style={styles.loginText}>
          Already have an account?{" "}
          <span
            style={styles.loginLink}
            onClick={() => history.push('/signin')} // Updated for v5
          >
            Login
          </span>
        </p>
        <p
        style={styles.backToHome}
        onClick={() => history.push("/")} // Navigate to the landing page
        >
        ← Back to Home
        </p>
      </div>
    </div>
  );
}

const styles = {
  container: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    minHeight: "100vh",
    paddingTop: "20px",
    backgroundImage: "url('/img/Edu_BG1.png')", // Add your image URL here
    backgroundSize: "cover", // Ensures the image covers the entire background
    backgroundPosition: "center", // Centers the image
    backgroundRepeat: "no-repeat", // Prevents the image from repeating
    backgroundColor: "rgba(0, 0, 0, 0.2)",
    backgroundBlendMode: "overlay",
  },
  formContainer: {
    backgroundColor: "#FFF",
    borderRadius: "10px",
    padding: "20px",
    width: "90%",
    maxWidth: "400px",
    textAlign: "center",
    boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
  },
  title: {
    fontSize: "24px",
    color: "#333",
    marginBottom: "20px",
  },
  input: {
    width: "100%",
    padding: "10px",
    marginBottom: "10px",
    borderRadius: "5px",
    border: "1px solid #ccc",
    boxSizing: "border-box",
  },
  signupButton: {
    width: "100%",
    padding: "10px",
    backgroundColor: "#4CAF50",
    border: "none",
    borderRadius: "5px",
    color: "white",
    fontWeight: "bold",
    cursor: "pointer",
    marginTop: "15px",

  },
  loginText: {
    marginTop: "10px",
    fontSize: "14px",
    color: "#555",
  },
  loginLink: {
    color: "#007BFF",
    cursor: "pointer",
    textDecoration: "underline",
  },
  backToHome: {
    marginTop: "20px",
    fontSize: "14px",
    color: "#555",
    cursor: "pointer",
    textDecoration: "underline",
    fontWeight: "bold",
  },
};
