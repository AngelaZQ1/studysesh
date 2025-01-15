import useUserContext from "./useUserContext";

const useSesh = () => {
  const { firebaseUser } = useUserContext();

  const createSesh = async (requestBody: {
    title: string;
    start: Date;
    end: Date;
    time?: string;
    location: string | null;
    virtual: boolean;
    idToken: string;
  }) => {
    const idToken = await firebaseUser.getIdToken();
    await fetch("/api/sesh", {
      method: "POST",
      body: JSON.stringify({ ...requestBody }),
      headers: {
        Authorization: `Bearer ${idToken}`,
      },
    });
  };

  const updateSesh = async (
    id: number,
    requestBody: {
      title: string;
      start: Date;
      end: Date;
      time?: string;
      location: string | null;
      virtual: boolean;
      idToken: string;
    }
  ) => {
    const idToken = await firebaseUser.getIdToken();
    await fetch(`/api/sesh/${id}`, {
      method: "PUT",
      body: JSON.stringify({ ...requestBody }),
      headers: {
        Authorization: `Bearer ${idToken}`,
      },
    });
  };

  const getAllSeshes = async () => {
    const idToken = await firebaseUser.getIdToken();
    try {
      const res = await fetch(`/api/sesh`, {
        headers: {
          Authorization: `Bearer ${idToken}`,
        },
      });
      const seshes = await res.json();
      return seshes;
    } catch (err) {
      console.error(err);
    }
  };

  return { createSesh, updateSesh, getAllSeshes };
};

export default useSesh;
