import { Sesh } from "@prisma/client";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { pusherClient } from "../pusher";
import { fetchAllSeshes } from "../seshSlice";
import useUserContext from "./useUserContext";

const usePusher = () => {
  const { firebaseUser, user } = useUserContext();
  const dispatch = useDispatch();

  useEffect(() => {
    pusherClient.subscribe("public");

    pusherClient.bind("new-sesh", (sesh: Sesh) => {
      if (sesh.participants.some((p) => p.id === user.id)) {
        firebaseUser.getIdToken().then((idToken) => {
          dispatch(fetchAllSeshes(idToken));
        });
      }
    });

    pusherClient.bind("update-sesh", (sesh: Sesh) => {
      if (sesh.participants.some((p) => p.id === user.id)) {
        firebaseUser.getIdToken().then((idToken) => {
          dispatch(fetchAllSeshes(idToken));
        });
      }
    });

    pusherClient.bind("delete-sesh", (sesh: Sesh) => {
      if (sesh.participants.some((p) => p.id === user.id)) {
        firebaseUser.getIdToken().then((idToken) => {
          dispatch(fetchAllSeshes(idToken));
        });
      }
    });

    return () => {
      pusherClient.unsubscribe("public");
    };
  }, []);
};

export default usePusher;
