"use client";

import React from "react";
import { AuthProvider } from "./AuthContext";
import HomePage from "./HomePage";

const App: React.FC = () => {
  return (
    <div style={{ minHeight: "100vh" }}>
      <HomePage />
    </div>
  );
};

export default function CommentTree() {
  return (
    <AuthProvider>
      <App />
    </AuthProvider>
  );
}
