"use client";
import { User } from "@prisma/client";
import { User as FirebaseUser } from "firebase/auth";
import { createContext, Dispatch, SetStateAction } from "react";

export interface UserContextType {
  firebaseUser: FirebaseUser;
  user: User;
  setUser: Dispatch<SetStateAction<User | null>>;
}

const UserContext = createContext<UserContextType | null>(null);

export default UserContext;
