const useUser = () => {
  const getUser = async (requestBody: { firebaseUid: string }) => {
    const res = await fetch(`/api/user?uid=${requestBody.firebaseUid}`, {});
    const user = await res.json();
    return user;
  };

  return { getUser };
};

export default useUser;
