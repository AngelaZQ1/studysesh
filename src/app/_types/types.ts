import { User } from "@prisma/client";

export type Event = {
  id: string;
  title: string;
  start: Date;
  end: Date;
  location: string;
  virtual: boolean;
  ownerId: number;
  participants: User[];
};
