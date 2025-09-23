const useFriendRequest = () => {
  const createFriendRequest = async (requestBody: {
    senderId: number;
    recipientId: number;
    idToken: string;
  }) => {
    const res = await fetch("/api/friend-request", {
      method: "POST",
      body: JSON.stringify({ ...requestBody }),
      headers: {
        Authorization: `Bearer ${requestBody.idToken}`,
      },
    });
    const friendRequest = await res.json();
    return friendRequest;
  };

  return {
    createFriendRequest,
  };
};

export default useFriendRequest;
