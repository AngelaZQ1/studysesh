import useUser from "@/app/_hooks/useUser";
import useUserContext from "@/app/_hooks/useUserContext";
import { fetchSeshes } from "@/app/_redux/seshSlice";
import { AppDispatch } from "@/app/_redux/store";
import { User } from "@/app/_types/types";
import { notifications } from "@mantine/notifications";
import { Sesh } from "@prisma/client";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

const useProfilePage = () => {
  const {
    firebaseUser,
    user: currentUser,
    setUser: setCurrentUser,
  } = useUserContext();
  const { updateUser } = useUser();
  const dispatch = useDispatch<AppDispatch>();
  const { seshes } = useSelector((state) => state.sesh);

  const { getUserById } = useUser();
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const [firstName, setFirstName] = useState(currentUser?.firstName || "");
  const [lastName, setLastName] = useState(currentUser?.lastName || "");
  const [isEditing, setIsEditing] = useState(false);

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

    const fetchUserSeshes = async () => {
      const idToken = await firebaseUser.getIdToken();
      await dispatch(fetchSeshes({ idToken, userId: currentUser.id }));
    };

    await Promise.all([fetchUser(), fetchUserSeshes()]);
    setIsLoading(false);
  };

  const futureSeshes = seshes.filter(
    (sesh: Sesh) => new Date(sesh.start) > new Date()
  );
  const pastSeshes = seshes.filter(
    (sesh: Sesh) => new Date(sesh.start) < new Date()
  );

  const handleSave = async () => {
    const updatedUser = {
      ...currentUser,
      firstName,
      lastName,
    };
    const user = await updateUser(updatedUser);
    setCurrentUser(user);
    setIsEditing(false);
    notifications.show({
      title: "Success!",
      message: "Your name has been updated.",
      autoClose: 5000,
      color: "pink",
    });
  };

  return {
    user,
    isCurrentUser,
    currentUser,
    isLoading,
    fetchUserAndSeshes,
    futureSeshes,
    pastSeshes,
    firstName,
    setFirstName,
    lastName,
    setLastName,
    isEditing,
    setIsEditing,
    handleSave,
  };
};

export default useProfilePage;
