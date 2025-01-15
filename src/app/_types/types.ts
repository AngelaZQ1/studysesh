import { User } from "@prisma/client";

export type Sesh = {
  id: string;
  title: string;
  start: Date;
  end: Date;
  time: string;
  location: string;
  virtual: boolean;
  ownerId: number;
  participants: User[];
};
