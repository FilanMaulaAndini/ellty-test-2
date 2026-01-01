import express from "express";
import cors from "cors";
import authRoutes from "./routes/auth.routes";
import nodeRoutes from "./routes/node.routes";

const app = express();

app.use(cors());
app.use(express.json());

app.get("/health", (_, res) => res.send("OK"));
// app.use(cors({
//     origin: [
//       'http://localhost:3000',
//       'https://ellty-test-2-three.vercel.app',
//       'https://*.vercel.app'
//     ],
//     credentials: true,
//     methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS']
//   }));
app.use("/auth", authRoutes);
app.use("/nodes", nodeRoutes);


export default app;
