"use client";

import React, { useState } from "react";
import { useAuth } from "./AuthContext";
import { useSession } from "next-auth/react";
import { Node } from "@/app/shared/types/post";
import postApi from "@/rest_api/post";
import styles from "../styles/PostNode.module.css";

interface PostNodeProps {
  post: Node;
}

const operationSymbols: Record<string, string> = {
  add: "+",
  sub: "-",
  mul: "*",
  div: "/",
};

export const PostNode: React.FC<PostNodeProps> = ({ post }) => {
  const [showReplyForm, setShowReplyForm] = useState<boolean>(false);
  const [operation, setOperation] = useState<"add" | "sub" | "mul" | "div">(
    "add"
  );
  const [value, setValue] = useState<string>("");
  const { refetch } = useAuth();
  const { data: session, status } = useSession({ required: false });

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return (
      date.toLocaleDateString("en-US", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      }) +
      " at " +
      date.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
      })
    );
  };
  console.log(value);
  const calculateResult = (
    leftValue: number,
    op: string,
    rightValue: number
  ): number => {
    switch (op) {
      case "add":
        return leftValue + rightValue;
      case "sub":
        return leftValue - rightValue;
      case "mul":
        return leftValue * rightValue;
      case "div":
        return rightValue !== 0 ? leftValue / rightValue : 0;
      default:
        return 0;
    }
  };

  const handleReplySubmit = async () => {
    console.log("submit", value, operation);
    if (!value || !session) return;

    //const numValue = parseFloat(value);
    //const result = calculateResult(post.result, operation, numValue);

    const json = {
      rightOperand: parseFloat(value),
      operation: operation,
    };

    try {
      const response = await postApi.respondNode(json, post.id);
      refetch();
    } catch (error) {
      console.error(error);
    }

    //   const reply: Node = {
    //     id: Date.now().toString(),
    //     author: user.username,
    //     type: 'response',
    //     value: numValue,
    //     operation,
    //     result,
    //     created_at: new Date().toISOString(),
    //     children: []
    //   };

    //   addReply(post.id, reply);
    setValue("");
    setShowReplyForm(false);
  };
  console.log(post);
  return (
    <li className={styles.listItem}>
      <div className={styles.card}>
        <div className={styles.cardHeader}>
          <div className={styles.avatarWrapper}>
            <img src="/images/avatar.jpeg" alt="avatar" />
          </div>

          <div className={styles.cardContent}>
            <div className={styles.userInfo}>
              <span className={styles.username}>
                {session?.user?.username === post.author?.username
                  ? "You"
                  : post.author?.username}
              </span>
              <span className={styles.timestamp}>
                {formatDate(post.created_at)}
              </span>
            </div>

            <div className={styles.postText}>
              {post.type === "start" ? (
                <span>
                  Starting number:{" "}
                  <span style={{ color: "#4CAF50", fontWeight: "bold" }}>
                    {post.result}
                  </span>
                </span>
              ) : (
                <span>
                  <span style={{ color: "#2196F3", fontWeight: "bold" }}>
                    {operationSymbols[post.operation || ""] || post.operation}
                  </span>{" "}
                  {post.right_operand} ={" "}
                  <span style={{ color: "#4CAF50", fontWeight: "bold" }}>
                    {post.result}
                  </span>
                </span>
              )}
            </div>

            {session && (
              <button
                className={styles.replyButton}
                onClick={() => setShowReplyForm(!showReplyForm)}
              >
                {showReplyForm ? "Cancel" : "Reply"}
              </button>
            )}
          </div>
        </div>

        {showReplyForm && (
          <div className={styles.replyForm}>
            <h4>Add Operation</h4>

            <div className={styles.replyFormRow}>
              <div className={styles.selectWrapper}>
                <label>Operation</label>
                <select
                  value={operation}
                  onChange={(e) =>
                    setOperation(
                      e.target.value as "add" | "sub" | "mul" | "div"
                    )
                  }
                  className={styles.select}
                >
                  <option value="add">+ Add</option>
                  <option value="sub">- Subtract</option>
                  <option value="mul">× Multiply</option>
                  <option value="div">÷ Divide</option>
                </select>
              </div>

              <div className={styles.numberWrapper}>
                <label>Number</label>
                <input
                  type="number"
                  value={value}
                  onChange={(e) => setValue(e.target.value)}
                  placeholder="Enter a number"
                  step="any"
                  className={styles.numberInput}
                />
              </div>

              <button className={styles.addButton} onClick={handleReplySubmit}>
                Add
              </button>
            </div>
          </div>
        )}
      </div>

      {post.children && post.children.length > 0 && (
        <ul className={styles.childrenList}>
          {post.children.map((child) => (
            <PostNode key={child.id} post={child} />
          ))}
        </ul>
      )}
    </li>
  );
};
