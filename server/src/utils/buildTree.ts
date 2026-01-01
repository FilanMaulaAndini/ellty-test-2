import { CalcNode } from "../models/node.model";

export const buildTree = (nodes: CalcNode[]): CalcNode[] => {
    const map = new Map<string, CalcNode>();
    const roots: CalcNode[] = [];
  
    // Initialize map and ensure children exists
    nodes.forEach(n => {
      map.set(n.id, { ...n, children: n.children ?? [] });
    });
  
    nodes.forEach(n => {
      if (n.parent_id) {
        const parent = map.get(n.parent_id);
        const child = map.get(n.id);
  
        if (parent && child) {
          // ✅ Assert children is defined
          parent.children = parent.children ?? [];
          parent.children.push(child);
        }
      } else {
        const root = map.get(n.id);
        if (root) roots.push(root);
      }
    });
  
    return roots;
  };
  
