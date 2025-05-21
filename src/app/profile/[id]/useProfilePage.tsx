import useUser from "@/app/_hooks/useUser";
import useUserContext from "@/app/_hooks/useUserContext";
import { User } from "@/app/_types/types";
import { fetchSeshesForCurrentUser } from "@/app/seshSlice";
import { Sesh } from "@prisma/client";
import { usePathname } from "next/navigation";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

const useProfilePage = () => {
  const { firebaseUser, user: currentUser } = useUserContext();
  const dispatch = useDispatch();
  const { seshes } = useSelector((state) => state.sesh);

  const { getUserById } = useUser();
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const router = useRouter();
  const pathname = usePathname();
  const userId = Number(pathname.split("/")[2]);

  const isCurrentUser = currentUser && currentUser.id === userId;

  useEffect(() => {
    if (firebaseUser === null) {
      router.push("/login");
    }
  }, [firebaseUser, router]);

  useEffect(() => {
    fetchUserAndSeshes();
  }, []);

  const fetchUserAndSeshes = async () => {
    const fetchUser = async () => {
      const res = await getUserById({ id: userId });
      if (res.error) {
        setUser(null);
      } else {
        setUser(res);
      }
    };

    const fetchSeshes = async () => {
      const idToken = await firebaseUser.getIdToken();
      await dispatch(fetchSeshesForCurrentUser(idToken));
    };

    await Promise.all([fetchUser(), fetchSeshes()]);
    setIsLoading(false);
  };

  const futureSeshes = seshes.filter(
    (sesh: Sesh) => new Date(sesh.start) > new Date()
  );
  const pastSeshes = seshes.filter(
    (sesh: Sesh) => new Date(sesh.start) < new Date()
  );

  return {
    user,
    isCurrentUser,
    currentUser,
    isLoading,
    fetchUserAndSeshes,
    futureSeshes,
    pastSeshes,
  };
};

export default useProfilePage;
