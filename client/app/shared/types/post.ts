export interface User {
  id: string;
  email?: string;
  username?: string;
}

type OperationType = "add" | "sub" | "mul" | "div" | null;
type NodeTypeName = "start" | "response";

export interface Node {
  id: string;
  author: User;
  type: NodeTypeName;
  value: number;
  result: number;
  operation: OperationType;
  right_operand: number | null;
  parent_id: string | null;
  children: Node[];
  created_at: string;
}
