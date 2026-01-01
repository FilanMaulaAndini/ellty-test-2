"use client";

import React from "react";
import { PostTree } from "./PostTree";
import { CreateStart } from "./CreateStart";
import { useRouter } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import styles from "../styles/HomePage.module.css";

const HomePage: React.FC = () => {
  const { data: session, status } = useSession();
  const router = useRouter();

  const onShowRegister = () => {
    router.push("/register");
  };

  const onShowLogin = () => {
    router.push("/login");
  };

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div className={styles.headerInner}>
          <h1 className={styles.headerTitle}>Number Discussion</h1>
          <div className={styles.headerButtons}>
            {session ? (
              <>
                <span className={styles.headerWelcome}>
                  Welcome, <strong>{session.user.username}</strong>
                </span>
                <button
                  className={`${styles.buttonPrimary} ${styles.buttonLogout}`}
                  onClick={() => signOut({ callbackUrl: "/" })}
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <button
                  className={`${styles.buttonPrimary} ${styles.buttonLogin}`}
                  onClick={() => onShowLogin()}
                >
                  Login
                </button>
                <button
                  className={`${styles.buttonPrimary} ${styles.buttonRegister}`}
                  onClick={() => onShowRegister()}
                >
                  Register
                </button>
              </>
            )}
          </div>
        </div>
      </header>

      <div className={styles.content}>
        {session && <CreateStart />}
        <div className={styles.card}>
          <h2 className={styles.cardTitle}>All Discussions</h2>
          <PostTree />
        </div>
      </div>
    </div>
  );
};

export default HomePage;
