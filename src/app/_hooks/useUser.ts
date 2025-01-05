const useUser = () => {
  const getUser = async (requestBody: { firebaseUid: string }) => {
    const res = await fetch(`/api/user?uid=${requestBody.firebaseUid}`, {});
    const user = await res.json();
    return user;
  };

  const getAllUsers = async () => {
    const res = await fetch(`/api/user`, { method: "GET" });
    const users = await res.json();
    return users;
  };

  return { getAllUsers, getUser };
};

export default useUser;
