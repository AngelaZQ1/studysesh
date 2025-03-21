"use client";
import { createContext } from "react";
import { User as FirebaseUser } from "firebase/auth";
import { User } from "@prisma/client";

export interface UserContextType {
  firebaseUser: FirebaseUser;
  user: User;
}

const UserContext = createContext<UserContextType | null>(null);

export default UserContext;
