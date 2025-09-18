import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { fetchSeshes } from "../_redux/seshSlice";
import { AppDispatch } from "../_redux/store";
import { Sesh } from "../_types/types";
import { pusherClient } from "../pusher";
import useUserContext from "./useUserContext";

const usePusher = () => {
  const { user } = useUserContext();
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    pusherClient.subscribe("public");

    pusherClient.bind("new-sesh", (sesh: Sesh) => {
      if (sesh.participants.some((p) => p.id === user.id)) {
        dispatch(fetchSeshes({ userId: user.id }));
      }
    });

    pusherClient.bind("update-sesh", (sesh: Sesh) => {
      if (sesh.participants.some((p) => p.id === user.id)) {
        dispatch(fetchSeshes({ userId: user.id }));
      }
    });

    pusherClient.bind("delete-sesh", (sesh: Sesh) => {
      if (sesh.participants.some((p) => p.id === user.id)) {
        dispatch(fetchSeshes({ userId: user.id }));
      }
    });

    return () => {
      pusherClient.unsubscribe("public");
    };
  }, []);
};

export default usePusher;
