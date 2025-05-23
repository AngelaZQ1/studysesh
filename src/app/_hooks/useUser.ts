import { User } from "@prisma/client";

const useUser = () => {
  const createUser = async (requestBody: {
    firebaseUid: string;
    firstName: string;
    lastName: string;
    email: string;
  }) => {
    const res = await fetch("/api/user", {
      method: "POST",
      body: JSON.stringify({ ...requestBody }),
    });
    const user = await res.json();
    if (res.status === 201) {
      console.log("User successfully created", user);
    }
    if (res.status === 400) {
      console.error("Error creating user", user);
    }
    return user;
  };

  const getUserByUid = async (requestBody: { firebaseUid: string }) => {
    const res = await fetch(`/api/user?uid=${requestBody.firebaseUid}`, {});
    const user = await res.json();
    return user;
  };

  const getUserById = async (requestBody: { id: number }) => {
    const res = await fetch(`/api/user?id=${requestBody.id}`, {});
    const user = await res.json();
    return user;
  };

  const getAllUsers = async () => {
    const res = await fetch(`/api/user`, { method: "GET" });
    const users = await res.json();
    return users;
  };

  const updateUser = async (requestBody: User) => {
    const res = await fetch(`/api/user?id=${requestBody.id}`, {
      method: "PUT",
      body: JSON.stringify({ ...requestBody }),
    });
    const user = await res.json();
    if (res.status === 400) {
      console.error("Error updating user", user);
    }
    return user;
  };

  return { createUser, getAllUsers, getUserByUid, getUserById, updateUser };
};

export default useUser;
