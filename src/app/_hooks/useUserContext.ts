import { useContext } from "react";
import UserContext, { UserContextType } from "../_contexts/UserContext";

const useUserContext = (): UserContextType => {
  const context = useContext(UserContext);
  if (context === null) {
    throw new Error("UserContext is null");
  }
  return {
    firebaseUser: context.firebaseUser,
    userId: context.userId,
    idToken: context.idToken,
  };
};

export default useUserContext;
