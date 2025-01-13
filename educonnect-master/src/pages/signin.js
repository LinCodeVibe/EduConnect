import React, { useEffect, useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../config/firebase";
import { useHistory } from "react-router-dom";

export default function SigninPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const history = useHistory();

  useEffect(() => {
    // Disable scrolling when the sign-in page is mounted
    document.body.style.overflow = "hidden";

    // Re-enable scrolling when the sign-in page is unmounted
    return () => {
      document.body.style.overflow = "auto";
    };
  }, []);

  const handleSignin = async () => {
    if (!email || !password) {
      alert("Please fill all fields");
      return;
    }

    try {
      await signInWithEmailAndPassword(auth, email, password);
      history.push("/dashboard");
    } catch (error) {
      alert("Signin Error: " + error.message);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.formContainer}>
        <h1 style={styles.title}>Sign In</h1>
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
        <button style={styles.signinButton} onClick={handleSignin}>
          Sign In
        </button>
        <p style={styles.signupText}>
          Don't have an account? {" "}
          <span
            style={styles.signupLink}
            onClick={() => history.push("/signup")}
          >
            Sign Up
          </span>
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
    backgroundColor: "#1111",
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
  signinButton: {
    width: "100%",
    padding: "10px",
    backgroundColor: "#4CAF50",
    border: "none",
    borderRadius: "5px",
    color: "white",
    fontWeight: "bold",
    cursor: "pointer",
  },
  signupText: {
    marginTop: "10px",
    fontSize: "14px",
    color: "#555",
  },
  signupLink: {
    color: "#007BFF",
    cursor: "pointer",
    textDecoration: "underline",
  },
};
