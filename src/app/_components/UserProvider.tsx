"use client";
import { Center, Flex, Loader } from "@mantine/core";
import { User } from "@prisma/client";
import { User as FirebaseUser, onAuthStateChanged } from "firebase/auth";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { auth } from "../../../firebase";
import UserContext from "../_contexts/UserContext";
import useUser from "../_hooks/useUser";
import { clearFirebaseUser, setFirebaseUser } from "../_redux/authSlice";

interface UserProviderProps {
  children: React.ReactNode;
}

// Component to handle authentication including fetching the Firebase User and redirecting to the dashboard or login pages
// Displays a loading screen if Firebase User or User are null before setting user context values
export default function UserProvider({ children }: UserProviderProps) {
  const { getUserByUid } = useUser();
  const router = useRouter();
  const pathname = usePathname();
  const dispatch = useDispatch();
  const routesWithoutNav = ["/signup", "/login"];

  const [firebaseUser, setFirebaseUserState] = useState<FirebaseUser | null>(
    null
  );
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        setFirebaseUserState(firebaseUser);
        // Store only the essential data to avoid serialization warnings
        dispatch(
          setFirebaseUser({
            uid: firebaseUser.uid,
            email: firebaseUser.email,
            getIdToken: () => firebaseUser.getIdToken(),
          })
        );

        const user = await getUserByUid({ firebaseUid: firebaseUser.uid });
        setUser(user);

        console.log("user", user);
        setIsLoading(false);
        if (pathname === "/login") {
          router.push("/dashboard"); // If the user logs in, navigate to dashboard
        }
      } else {
        setFirebaseUserState(null);
        dispatch(clearFirebaseUser());
        setIsLoading(false);
        // Only navigate if not on signup or login page
        if (!routesWithoutNav.includes(pathname)) {
          router.push("/login");
        }
      }
    });

    return () => unsubscribe();
  }, [dispatch, pathname, router]);

  if (isLoading) {
    return (
      <Flex h="100vh" align="center" justify="center">
        <Center mt={10}>
          <Loader mr={10} size="xs" />
          Loading...
        </Center>
      </Flex>
    );
  }

  return (
    <UserContext.Provider
      value={{
        firebaseUser,
        setFirebaseUser: setFirebaseUserState,
        user: user as User,
        setUser: setUser as React.Dispatch<React.SetStateAction<User | null>>,
      }}
    >
      {children}
    </UserContext.Provider>
  );
}
