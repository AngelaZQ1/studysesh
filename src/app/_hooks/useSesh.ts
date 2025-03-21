import { useState } from "react";
import { Sesh } from "../_types/types";
import useUserContext from "./useUserContext";

const useSesh = () => {
  const { firebaseUser } = useUserContext();

  const [seshes, setSeshes] = useState<Sesh[]>([]);

  const fetchSeshes = async () => {
    const idToken = await firebaseUser.getIdToken();
    try {
      const res = await fetch(`/api/sesh`, {
        headers: {
          Authorization: `Bearer ${idToken}`,
        },
      });
      const seshes = await res.json();
      setSeshes(seshes);
    } catch (err) {
      console.error(err);
    }
  };

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

  const deleteSesh = async (id: number) => {
    const idToken = await firebaseUser.getIdToken();
    await fetch(`/api/sesh/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${idToken}`,
      },
    });
  };

  return {
    seshes,
    fetchSeshes,
    createSesh,
    updateSesh,
    deleteSesh,
  };
};

export default useSesh;
