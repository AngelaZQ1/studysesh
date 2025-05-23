const useSesh = () => {
  const getSeshesForUser = async (userId: number, idToken: string) => {
    const res = await fetch(`/api/sesh?userId=${userId}`, {
      headers: {
        Authorization: `Bearer ${idToken}`,
      },
    });
    const seshes = await res.json();
    if (res.status === 400) {
      console.error("Error fetching seshes for user", seshes);
    }
    return seshes;
  };

  return getSeshesForUser;
};

export default useSesh;
