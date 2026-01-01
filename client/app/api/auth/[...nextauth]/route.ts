import NextAuth, { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

// export const authOptions: NextAuthOptions = {
//   providers: [
//     CredentialsProvider({
//       name: "Credentials",
//       credentials: {
//         email: { label: "Email", type: "text" },
//         password: { label: "Password", type: "password" },
//       },
//       async authorize(credentials) {
//         if (!credentials) return null;
      
//         try {
//           const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/login`, {
//             method: "POST",
//             headers: { "Content-Type": "application/json" },
//             body: JSON.stringify(credentials),
//           });
      
//           if (!res.ok) {
//             console.error("Login failed:", res.status);
//             return null;
//           }
      
//           const data = await res.json();
      
//           if (!data?.user?.id) {
//             console.error("Invalid login response:", data);
//             return null;
//           }
      
//           console.log("✅ User authenticated:", data.user.email);
          
//           // Return user object with token
//           return {
//             id: data.user.id,
//             email: data.user.email,
//             name: data.user.email,
//             accessToken: data.token, // Store the JWT token
//           };
//         } catch (error) {
//           console.error("Auth error:", error);
//           return null;
//         }
//       }
//     }),
//   ],
  
//   callbacks: {
//     async jwt({ token, user }) {
//       // On sign in, add user data to token
//       if (user) {
//         token.id = user.id;
//         token.email = user.email;
//         token.accessToken = user.accessToken; // Store access token in JWT
//       }
//       return token;
//     },
    
//     async session({ session, token }) {
//       // Add token data to session
//       if (token) {
//         session.user.id = token.id as string;
//         session.user.email = token.email as string;
//         session.accessToken = token.accessToken as string;
//       }
//       return session;
//     },
//   },
  
//   session: { 
//     strategy: "jwt",
//     maxAge: 60 * 60, // 1 hour (match your backend token expiry)
//   },
  
//   pages: {
//     signIn: "/login", // Redirect to your login page
//   },
  
//   secret: process.env.NEXTAUTH_SECRET,
  
//   debug: true, // Enable for debugging (remove in production)
// };

export const authOptions: NextAuthOptions = {
    providers: [
      CredentialsProvider({
        name: "Credentials",
        credentials: {
          email: { label: "Email", type: "text" },
          password: { label: "Password", type: "password" },
        },
        async authorize(credentials) {

          const res = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/auth/login`,
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(credentials),
            }
          );
  
          if (!res.ok) return null;
  
          const data = await res.json();

          return {
            id: data.user.id,
            email: data.user.email,
            username: data.user.username, 
            token: data.token, 
          };
        },
      }),
    ],
      
  pages: {
    signIn: "/login",  
    error: "/login",  
  },

    session: { strategy: "jwt",  maxAge: 60 * 60 },
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
              token.id = user.id;
              token.email = user.email;
              token.username = user.username;
              token.accessToken = user.token;
            }
            return token;
    
          },
          async session({ session, token }) {
            session.user = {
              ...(session.user ?? {}),
              id: token.id as string,
              email: token.email as string,
              username: token.username as string,
            };
          
            session.accessToken = token.accessToken as string;
          
            return session;
          },
    },
    secret: process.env.NEXTAUTH_SECRET,
  };
  
  

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };