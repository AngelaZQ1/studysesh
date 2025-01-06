"use client";
import { createContext } from "react";
import { User } from "firebase/auth";

export interface UserContextType {
  firebaseUser: User;
  userId: number;
}

const UserContext = createContext<UserContextType | null>(null);

export default UserContext;
