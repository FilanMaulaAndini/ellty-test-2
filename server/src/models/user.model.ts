export interface User {
    id: string
    username: string
    passwordHash: string
    role: "guest" | "user"
    createdAt: Date
  }