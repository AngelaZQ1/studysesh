import { User as dbUser } from "@prisma/client";

export type Sesh = {
  id: string;
  title: string;
  start: Date;
  end: Date;
  time: string;
  location: string;
  virtual: boolean;
  ownerId: number;
  participants: dbUser[];
};

export type User = {
  firebaseUid: string;
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  seshes: Sesh[];
};
