"use client";

import React, { useState } from "react";
import authApi from "@/rest_api/auth";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import styles from "../styles/Login.module.css";

const LoginPage: React.FC = () => {
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<string>("");
  const router = useRouter();

  const onShowRegister = () => {
    router.push("/register");
  };

  const onShowHomePage = () => {
    router.push("/");
  };

  const loginSubmit = async () => {
    const json = {
      username: username,
      password: password,
    };
    try {
      const response = await authApi.login(json);
      const result = await signIn("credentials", {
        username: username,
        password: password,
        redirect: false,
      });

      if (result?.error) {
        console.error("Login failed:", result.error);
        return;
      }

      onShowHomePage();
    } catch (error) {
      console.error(error);
    }
  };

  const handleSubmit = (): void => {
    if (!username || !password) {
      setError("Please fill in all fields");
      return;
    }
    loginSubmit();
  };

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <h2 className={styles.title}>Login</h2>

        {error && <div className={styles.error}>{error}</div>}

        <div className={styles.formGroup}>
          <label className={styles.label}>Username</label>
          <input
            type="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Enter your username"
            className={styles.input}
          />
        </div>

        <div className={styles.formGroup}>
          <label className={styles.label}>Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter your password"
            className={styles.input}
          />
        </div>

        <div className={styles.buttonContainer}>
          <button className={`${styles.button} ${styles.loginBtn}`} onClick={handleSubmit}>
            Login
          </button>
        </div>

        <div className={styles.registerLink}>
          Don't have an account? <a onClick={onShowRegister}>Register here</a>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
