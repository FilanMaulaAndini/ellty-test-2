import { Request, Response } from "express";
import { nodes } from "../store/node.store";
import { randomUUID } from "crypto";
import { buildTree } from "../utils/buildTree";
import { AuthRequest } from "../middleware/auth.middleware";
import { supabase } from "../supabaseClient";
import { CalcNode } from "../models/node.model";

export const getTree = async (_: Request, res: Response) => {
  const { data, error } = await supabase
    .from("posts")
    .select(
      `
      *,
      author:profiles(id, email, username)
    `
    )
    .order("created_at", { ascending: false });

  if (error) {
    console.error(error);
    return res.status(500).json({ message: "Failed to fetch posts" });
  }

  // const postsWithAuthor: CalcNode[] = data as CalcNode[];
  res.setHeader("Cache-Control", "no-store");
  const tree = buildTree(data);
  res.status(200).json(buildTree(tree));
};

export const startNode = async (req: AuthRequest, res: Response) => {
  const { value } = req.body;
  const user = req.user;

  if (!user) return res.status(401).json({ message: "Unauthorized" });

  const post = {
    id: randomUUID(),
    author: user.id,
    type: "start",
    value: value,
    result: value,
    created_at: new Date().toISOString(),
    children: [] as any[],
  };

  const { data, error } = await supabase.from("posts").insert(post).select();

  if (error) {
    console.error(error);
    return res.status(500).json({ message: "Failed to create node" });
  }

  res.status(201).json(data[0]);
};

export const respondNode = async (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  const { operation, rightOperand } = req.body;

  if (!operation || rightOperand === undefined) {
    return res.status(400).json({ message: "Invalid payload" });
  }

  const { data: parent, error: parentError } = await supabase
    .from("posts")
    .select("*")
    .eq("id", id)
    .single();

  if (parentError || !parent) {
    return res.status(404).json({ message: "Parent not found" });
  }

  let value = parent.value;

  switch (operation) {
    case "add":
      value += rightOperand;
      break;
    case "sub":
      value -= rightOperand;
      break;
    case "mul":
      value *= rightOperand;
      break;
    case "div":
      if (rightOperand === 0) {
        return res.status(400).json({ message: "Division by zero" });
      }
      value /= rightOperand;
      break;
    default:
      return res.status(400).json({ message: "Unknown operation" });
  }

  const newNode = {
    id: randomUUID(),
    parent_id: parent.id,
    author: req.user!.id,
    type: "respond",
    value,
    result: value,
    operation,
    right_operand: rightOperand,
    created_at: new Date().toISOString(),
  };

  const { data, error } = await supabase
    .from("posts")
    .insert(newNode)
    .select()
    .single();

  if (error) {
    console.error(error);
    return res.status(500).json({ message: "Failed to respond" });
  }

  res.status(201).json(data);
};
