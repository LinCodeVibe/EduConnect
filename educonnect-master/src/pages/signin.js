import React, { useEffect, useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../config/firebase";
import { useHistory } from "react-router-dom";
import HomeIcon from '@mui/icons-material/Home';


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
      {/* Logo Section */}
      {/* <img 
        src="/img/EduConnect.png" 
        alt="Logo" 
        style={styles.logo} 
      /> */}
      {/* Header with Back to Home */}
      {/* <div style={styles.header}>
        <button style={styles.backButton} onClick={() => history.push("/")}>
          ← Back to Home
        </button>
      </div> */}

      {/* Sign-In Box */}
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
        {/* <p
        style={styles.backToHome}
        onClick={() => history.push("/")} // Navigate to the landing page
        >
        ← Back to Home
        </p> */}
        <p
          style={styles.backToHome}
          onClick={() => history.push("/")} // Navigate to the landing page
        >
          <HomeIcon style={{ fontSize: '24px' }} />
        </p>
      </div>
    </div>
  );
}

const styles = {
  container: {
    display: "flex",
    // flexDirection: "column", // Stack logo and form vertically
    justifyContent: "center",
    alignItems: "center",
    minHeight: "100vh",
    backgroundImage: "url('/img/Edu_BG1.png')", // Add your image URL here
    backgroundSize: "cover", // Ensures the image covers the entire background
    backgroundPosition: "center", // Centers the image
    backgroundRepeat: "no-repeat", // Prevents the image from repeating
    backgroundColor: "rgba(0, 0, 0, 0.2)",
    backgroundBlendMode: "overlay",
    // backgroundColor: "#1111", // Fallback color in case the image fails to load
  },
  header: {
    width: "100%",
    position: "absolute",
    top: 0,
    display: "flex",
    justifyContent: "flex-start",
    padding: "10px 20px",
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
  // logo: {
  //   width: "200px", // Adjust size as needed
  // },
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
    marginTop: "15px",
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
  backToHome: {
    marginTop: "20px",
    fontSize: "14px",
    color: "#555",
    cursor: "pointer",
    textDecoration: "underline",
    fontWeight: "bold",
  },
};
