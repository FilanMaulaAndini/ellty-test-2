"use client";

import React, { useState } from "react";
import authApi from "@/api/auth";
import { useRouter } from "next/navigation";
import { RegisterResponse } from "@/app/shared/types/register";
import styles from "../styles/Register.module.css";

const RegisterPage: React.FC = () => {
  const [username, setUsername] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [data, setData] = useState<RegisterResponse | null>(null);
  const router = useRouter();

  const onShowLogin = () => {
    router.push("/login");
  };

  const registerSubmit = async () => {
    const json = { email, password, username };
    try {
      const response = await authApi.register(json);
      setData(response);
      alert("Registration successful! Please log in.");
      onShowLogin();
    } catch (error: any) {
      setError(error?.message || "Registration failed");
      console.error(error);
    }
  };

  const handleSubmit = (): void => {
    if (!username || !email || !password || !confirmPassword) {
      setError("Please fill in all fields");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    registerSubmit();
  };

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <h2 className={styles.title}>Register</h2>

        {error && <div className={styles.error}>{error}</div>}

        <div className={styles.formGroup}>
          <label className={styles.label}>Username</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Choose a username"
            className={styles.input}
          />
        </div>

        <div className={styles.formGroup}>
          <label className={styles.label}>Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            className={styles.input}
          />
        </div>

        <div className={styles.formGroup}>
          <label className={styles.label}>Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Choose a password"
            className={styles.input}
          />
        </div>

        <div className={styles.formGroup}>
          <label className={styles.label}>Confirm Password</label>
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Confirm your password"
            className={styles.input}
          />
        </div>

        <button className={styles.button} onClick={handleSubmit}>
          Register
        </button>
      </div>
    </div>
  );
};

export default RegisterPage;
