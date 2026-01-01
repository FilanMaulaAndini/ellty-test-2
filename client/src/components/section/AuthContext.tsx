"use client";

import React, { useState, createContext, useContext, useEffect, ReactNode } from 'react';
import { Node } from '@/app/shared/types/post';
import postApi from '@/api/post';

interface User {
  id: string;
  username: string;
}

interface AuthContextType {
  user: User | null;
  refetch: () => void;
  login: (username: string, password: string) => void;
  register: (username: string, email: string, password: string) => void;
  logout: () => void;
  posts: Node[];
  addPost: (post: Node) => void;
  addReply: (parentId: string, reply: Node) => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [posts, setPosts] = useState<Node[]>([]);
  const [isUpdate, setUpdate] = useState<boolean>(false);
  const refetch = (): void => {
    setUpdate(!isUpdate);
  };
  // const [nodes, setNodes] = useState<Node[]>([]);

  useEffect(() => {
      // if (!session) return; // wait for session
      getPosts();
    }, [isUpdate]);
  
  const getPosts = async (): Promise<void> => {
      try {
        const response = await postApi.getPost();
        setPosts(response);
      } catch (error) {
        console.error(error);
      }
    };

  const login = (username: string, password: string): void => {
    setUser({ id: '1', username });
  };

  const register = (username: string, email: string, password: string): void => {
    setUser({ id: '1', username });
  };

  const logout = (): void => {
    setUser(null);
  };

  const addPost = (post: Node): void => {
    setPosts(prev => [post, ...prev]);
  };

  const addReply = (parentId: string, reply: Node): void => {
    setPosts(prev => {
      const updateChildren = (posts: Node[]): Node[] => {
        return posts.map(post => {
          if (post.id === parentId) {
            return {
              ...post,
              children: [...(post.children || []), reply]
            };
          }
          if (post.children) {
            return {
              ...post,
              children: updateChildren(post.children)
            };
          }
          return post;
        });
      };
      return updateChildren(prev);
    });
  };

  return (
    <AuthContext.Provider 
      value={{ user, refetch, login, register, logout, posts, addPost, addReply }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};
