import { Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { users } from "../store/user.store";
import { supabase } from "../supabaseClient";
import { User } from "../models/user.model";
import { randomUUID } from "crypto";

const JWT_SECRET = process.env.JWT_SECRET!;

export const register = async (req: Request, res: Response) => {
  const { email, password, username } = req.body;

  if (!email || !password || !username)
    return res.status(400).json({ message: "Missing fields" });

  const { data, error } = await supabase.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
    user_metadata: { 
      username: username 
    }
  });

  if (error) return res.status(400).json({ message: error.message });

  // await supabase.from("profiles").insert({
  //   id: data.user?.id,
  //   email: email,
  //   username,
  // });

  res.status(201).json({ message: "User created", user: data.user });
};

export const checkUsernameAvailability = async (req: Request, res: Response) => {
  const { username } = req.body;
  console.log('checkUsernameAvailability called with:', req.body);

  if (!username || typeof username !== 'string') {
    return res.status(400).json({ message: "Username is required" });
  }

  try {
    const { data, error } = await supabase
      .from("profiles")
      .select("username")
      .ilike("username", username)
      .maybeSingle();

    if (error && error.code !== 'PGRST116') {
      return res.status(500).json({ 
        message: "Error checking username" 
      });
    }

    const isAvailable = !data;

    res.json({ 
      available: isAvailable,
      username: username 
    });

  } catch (error) {
    console.error("Check username error:", error);
    res.status(500).json({ 
      message: "An error occurred" 
    });
  }
};

interface Profile {
  username?: string;
  email: string
}

export const login = async (req: Request, res: Response) => {
  const { username, password } = req.body; 

  try {
    const { data: profileData, error: profileError } = await supabase
      .from("profiles")
      .select("email, id, username")
      .eq("username", username)
      .maybeSingle<Profile>();

    if (profileError || !profileData) {
      return res.status(401).json({ 
        message: "Invalid username or password" 
      });
    }

    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email: profileData.email,
      password,
    });

    if (authError) {
      return res.status(401).json({ 
        message: "Invalid username or password" 
      });
    }

    const token = jwt.sign(
      { id: authData.user.id }, 
      JWT_SECRET, 
      { expiresIn: "7d" }
    );

    res.json({
      token,
      user: {
        id: authData.user.id,
        email: authData.user.email,
        username: profileData.username,
      },
    });

  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ 
      message: "An error occurred during login" 
    });
  }
};

// export const login = async (req: Request, res: Response) => {
//   const { email, password } = req.body;

//   const { data, error } = await supabase.auth.signInWithPassword({
//     email,
//     password,
//   });

//   if (error) return res.status(401).json({ message: error.message });

//   const { data: profileData, error: profileError } = await supabase
//     .from("profiles")
//     .select("*")
//     .eq("id", data.user.id)
//     .maybeSingle<Profile>();

// //   console.log("profile", profileData, profileError);
//   if (profileError) {
//     return res.status(500).json({ message: "Failed to fetch profile" });
//   }

//   const token = jwt.sign({ id: data.user?.id }, JWT_SECRET, {
//     expiresIn: "7d",
//   });

//   res.json({
//     token,
//     user: {
//       ...data.user,
//       username: profileData?.username ?? null,
//     },
//   });
// };
