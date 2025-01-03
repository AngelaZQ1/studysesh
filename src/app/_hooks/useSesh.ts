import useUserContext from "./useUserContext";

const useSesh = () => {
  const { idToken } = useUserContext();

  const createSesh = async (requestBody: {
    title: string;
    start: Date;
    end: Date;
    location: string | null;
    virtual: boolean;
    idToken: string;
  }) => {
    await fetch("/api/sesh", {
      method: "POST",
      body: JSON.stringify({ ...requestBody }),
      headers: {
        Authorization: `Bearer ${idToken}`,
      },
    });
  };

  return { createSesh };
};

export default useSesh;
