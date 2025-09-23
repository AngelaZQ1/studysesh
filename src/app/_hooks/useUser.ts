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
    const res = await fetch(`/api/user/uid/${requestBody.firebaseUid}`, {});
    const user = await res.json();
    return user;
  };

  const getUserById = async (requestBody: { id: number; idToken: string }) => {
    const res = await fetch(`/api/user/${requestBody.id}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${requestBody.idToken}`,
      },
    });
    const user = await res.json();
    return user;
  };

  const getAllUsers = async (requestBody: { idToken: string }) => {
    const res = await fetch(`/api/user`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${requestBody.idToken}`,
      },
    });
    const users = await res.json();
    return users;
  };

  const updateUser = async (requestBody: User, idToken: string) => {
    const res = await fetch(`/api/user/${requestBody.id}`, {
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

  const searchUsers = async (requestBody: {
    query: string;
    idToken: string;
  }) => {
    const res = await fetch(`/api/user/search?query=${requestBody.query}`, {
      headers: {
        Authorization: `Bearer ${requestBody.idToken}`,
      },
    });
    if (res.ok) {
      const users = await res.json();
      return users;
    }
  };

  return {
    createUser,
    getAllUsers,
    getUserByUid,
    getUserById,
    updateUser,
    searchUsers,
  };
};

export default useUser;
