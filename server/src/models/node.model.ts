export interface CalcNode {
  id: string;
  author: { id: string; username: string } | null;
  type: string;
  value: number;
  result: number;
  operation?: string;
  right_operand?: number | null;
  parent_id?: string | null;
  children?: any[];
  created_at: string;
}
