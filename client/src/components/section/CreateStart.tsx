"use client";

import React, { useState } from "react";
import { useAuth } from "./AuthContext";
import postApi from "@/rest_api/post";
import styles from "../styles/CreateStart.module.css";

export const CreateStart: React.FC = () => {
  const [value, setValue] = useState<number>(0);
  const { refetch } = useAuth();

  const createSubmit = async () => {
    const json = {
      value: value,
    };

    try {
      const response = await postApi.create(json);
      refetch();
    } catch (error) {
      console.error(error);
    }
  };

  const handleSubmit = (): void => {
    //   if (!value || !user) return;

    //   const post: Node = {
    //     id: Date.now().toString(),
    //     author: 'filan',
    //     type: 'start',
    //     value: value,
    //     result: value,
    //     created_at: new Date().toISOString(),
    //     children: []
    //   };

    //   addPost(post);
    createSubmit();
    setValue(0);
  };

  return (
    <div className={styles.card}>
    <h2 className={styles.title}>Start a New Calculation</h2>
    <div className={styles.formRow}>
      <div className={styles.inputGroup}>
        <label className={styles.label}>Starting Number</label>
        <input
          type="number"
          value={value}
          onChange={(e) => setValue(parseInt(e.target.value))}
          placeholder="Enter a number"
          step="any"
          className={styles.input}
        />
      </div>
      <button className={styles.button} onClick={handleSubmit}>
        Create
      </button>
    </div>
  </div>
  );
};
