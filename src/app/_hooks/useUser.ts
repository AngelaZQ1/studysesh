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

  const updateUser = async (requestBody: User, idToken: string) => {
    const res = await fetch(`/api/user?id=${requestBody.id}`, {
      method: "PUT",
      body: JSON.stringify({ ...requestBody }),
      headers: {
        Authorization: `Bearer ${idToken}`,
      },
    });
    if (res.ok) {
      const user = await res.json();
      return user;
    }
  };

  return { createUser, getAllUsers, getUserByUid, getUserById, updateUser };
};

export default useUser;
