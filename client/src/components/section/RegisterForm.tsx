"use client";

import React, { useState, useEffect, useMemo, ChangeEvent } from "react";
import authApi from "@/rest_api/auth";
import { useRouter } from "next/navigation";
import {
  CheckUsernameResponse,
  RegisterResponse,
} from "@/app/shared/types/register";
import styles from "../styles/Register.module.css";

const validateUsername = (username: string): string | undefined => {
  if (username.length < 3) return "Username must be at least 3 characters";
  if (username.length > 20) return "Username must be less than 20 characters";
  if (!/^[a-zA-Z0-9_]+$/.test(username)) {
    return "Username can only contain letters, numbers, and underscores";
  }
  return undefined;
};

const validateEmail = (email: string): string | undefined => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return "Invalid email format";
  }
  return undefined;
};

const validatePassword = (password: string): string | undefined => {
  if (password.length < 8) return "Password must be at least 8 characters";
  return undefined;
};

interface FormData {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
}

const RegisterPage: React.FC = () => {
  const [error, setError] = useState<string>("");
  const [data, setData] = useState<RegisterResponse | null>(null);
  const [isChecking, setIsChecking] = useState(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [formData, setFormData] = useState<FormData>({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState<FormData>({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const router = useRouter();

  const debouncedCheck = useMemo(() => {
    let timeoutId: ReturnType<typeof setTimeout>;

    return (value: string) => {
      if (timeoutId) clearTimeout(timeoutId);

      if (value.length < 3) {
        setIsChecking(false);
        return;
      }

      setIsChecking(true);

      timeoutId = setTimeout(async () => {
        try {
          const result: CheckUsernameResponse = await authApi.checkUsername({
            username: value,
          });

          if (!result.available) {
            setErrors((prev) => ({
              ...prev,
              ["username"]: "Username is already taken",
            }));
          } else {
            setErrors((prev) => ({ ...prev, ["username"]: "" }));
          }
        } catch (err) {
          console.error("Check username failed:", err);
          setErrors((prev) => ({
            ...prev,
            ["username"]: "Could not verify username",
          }));
        } finally {
          setIsChecking(false);
        }
      }, 500);
    };
  }, []);

  useEffect(() => {
    return () => {};
  }, [debouncedCheck]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setFormData((prev) => ({ ...prev, [name]: value }));

    let errorMessage: string | undefined;
    if (name === "username") errorMessage = validateUsername(value);
    if (name === "email") errorMessage = validateEmail(value);
    if (name === "password") errorMessage = validatePassword(value);

    setErrors((prev) => ({ ...prev, [name]: errorMessage || "" }));

    if (name === "username" && !errorMessage) {
      debouncedCheck(value);
    }
  };

  const onShowLogin = () => {
    router.push("/login");
  };

  const registerSubmit = async () => {
    setIsLoading(true);
    const json = {
      email: formData.email,
      password: formData.password,
      username: formData.username,
    };
    try {
      const response = await authApi.register(json);
      setData(response);
      alert("Registration successful! Please log in.");
      onShowLogin();
    } catch (error: any) {
      setError(error?.message || "Registration failed");
      console.error(error);
      setIsLoading(false);
    }
    setIsLoading(false);
  };

  const handleSubmit = (): void => {
    if (
      !formData.username ||
      !formData.email ||
      !formData.password ||
      !formData.confirmPassword
    ) {
      setError("Please fill in all fields");
      return;
    }
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    registerSubmit();
  };
console.log(isLoading)
  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <h2 className={styles.title}>Register</h2>

        {error && <div className={styles.error}>{error}</div>}

        <div className={styles.formGroup}>
          <label className={styles.label}>Username</label>
          <input
            type="text"
            name="username"
            defaultValue={formData.username}
            onChange={handleInputChange}
            placeholder="Choose a username"
            className={styles.input}
          />
          {errors.username && (
            <div className={styles.errors}>{errors.username}</div>
          )}
        </div>

        <div className={styles.formGroup}>
          <label className={styles.label}>Email</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            placeholder="Enter your email"
            className={styles.input}
          />
          {errors.email && <div className={styles.errors}>{errors.email}</div>}
        </div>

        <div className={styles.formGroup}>
          <label className={styles.label}>Password</label>
          <input
            type="password"
            name="password"
            defaultValue={formData.password}
            onChange={handleInputChange}
            placeholder="Choose a password"
            className={styles.input}
          />
        </div>

        <div className={styles.formGroup}>
          <label className={styles.label}>Confirm Password</label>
          <input
            type="password"
            name="confirmPassword"
            defaultValue={formData.confirmPassword}
            onChange={handleInputChange}
            placeholder="Confirm your password"
            className={styles.input}
          />
        </div>

        <button className={styles.button} disabled={isLoading} onClick={handleSubmit}>
          {isLoading ? 'Authenticating...' : 'Register'}
        </button>
      </div>
    </div>
  );
};

export default RegisterPage;
