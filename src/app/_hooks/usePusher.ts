import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { pusherClient } from "../pusher";
import useUserContext from "./useUserContext";
import { fetchSeshes } from "../_redux/seshSlice";
import { Sesh } from "../_types/types";
import { AppDispatch } from "../_redux/store";

const usePusher = () => {
  const { firebaseUser, user } = useUserContext();
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    pusherClient.subscribe("public");

    pusherClient.bind("new-sesh", (sesh: Sesh) => {
      if (sesh.participants.some((p) => p.id === user.id)) {
        firebaseUser.getIdToken().then((idToken) => {
          dispatch(fetchSeshes({ idToken, userId: user.id }));
        });
      }
    });

    pusherClient.bind("update-sesh", (sesh: Sesh) => {
      if (sesh.participants.some((p) => p.id === user.id)) {
        firebaseUser.getIdToken().then((idToken) => {
          dispatch(fetchSeshes({ idToken, userId: user.id }));
        });
      }
    });

    pusherClient.bind("delete-sesh", (sesh: Sesh) => {
      if (sesh.participants.some((p) => p.id === user.id)) {
        firebaseUser.getIdToken().then((idToken) => {
          dispatch(fetchSeshes({ idToken, userId: user.id }));
        });
      }
    });

    return () => {
      pusherClient.unsubscribe("public");
    };
  }, []);
};

export default usePusher;
