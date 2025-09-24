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

  const getUserFriendRequests = async (requestBody: {
    userId: number;
    idToken: string;
  }) => {
    const res = await fetch(
      `/api/friend-request?userId=${requestBody.userId}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${requestBody.idToken}`,
        },
      }
    );
    const friendRequests = await res.json();
    return friendRequests;
  };

  return {
    createFriendRequest,
    getUserFriendRequests,
  };
};

export default useFriendRequest;
