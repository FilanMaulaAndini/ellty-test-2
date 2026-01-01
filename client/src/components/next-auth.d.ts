import NextAuth from "next-auth";

declare module "next-auth" {
  interface Session {
    accessToken?: string;
    user: {
      id: string;
      email: string;
        username: string;
    };
  }

  interface User {
    id: string;
    email: string;
    username?: string;
    token: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id?: string;
    email?: string;
    username?: string;
    accessToken?: string;
  }
}
