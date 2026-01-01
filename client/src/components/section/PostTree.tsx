"use client";

import React from "react";
import { PostNode } from "./PostNode";
import { useAuth } from "./AuthContext";
import styles from "../styles/PostTree.module.css";

export const PostTree: React.FC = () => {
  const { posts } = useAuth();

  if (posts.length === 0) {
    return (
      <div className={styles.noPosts}>
        <p>No posts yet.</p>
        <p>Be the first to start a calculation!</p>
      </div>
    );
  }

  return (
    <ul className={styles.postsList}>
      {posts.map((post) => (
        <PostNode key={post.id} post={post} />
      ))}
    </ul>
  );
};
