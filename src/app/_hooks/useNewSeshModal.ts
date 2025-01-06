import { useForm } from "@mantine/form";
import { notifications } from "@mantine/notifications";
import useSesh from "./useSesh";
import useUserContext from "./useUserContext";
import { useEffect, useState } from "react";
import useUser from "./useUser";

type User = {
  firebaseUid: string;
  id: number;
  firstName: string;
  lastName: string;
  email: string;
};

const useNewSeshModal = (onClose: () => void) => {
  const { getAllUsers } = useUser();
  const { firebaseUser, userId } = useUserContext();
  const { createSesh } = useSesh();

  const [allUsers, setAllUsers] = useState<User[]>([]);
  const [selectedUserIds, setSelectedUserIds] = useState<string[]>([]);

  useEffect(() => {
    async function fetchData() {
      const users = await getAllUsers();
      const otherUsers = users.filter((user: User) => user.id !== userId);
      setAllUsers(otherUsers);
    }
    fetchData();
  }, []);

  // title, date, location are required
  // if location is inPerson, locationString is required
  const form = useForm({
    initialValues: {
      title: "",
      date: new Date(),
      time: undefined,
      locationString: "",
      location: "virtual",
      participantIds: [],
    },
    validate: {
      title: (value) =>
        value.trim().length === 0 ? "Title is required" : null,
      date: (value) => (!value ? "Date is required" : null),
      locationString: (value): string | null =>
        form.getValues().location === "inPerson" && value.trim().length === 0
          ? "Location cannot be empty"
          : null,
    },
  });

  const handleClose = () => {
    form.reset();
    form.clearErrors();
    onClose();
  };

  const handleSubmit = async (values: {
    title: string;
    date: Date; // used in form only
    time?: string; // used in form only
    start?: Date; // start and end are optional because they are calculated
    end?: Date;
    location: "virtual" | string;
    locationString: string; // used in form only
    participantIds: string[];
  }) => {
    form.validate();

    const requestBody = await getRequestBody(values);
    createSesh(requestBody);

    notifications.show({
      title: "Success!",
      message: "Your Sesh has been created.",
      autoClose: 3000,
      color: "pink",
    });
    handleClose();
  };

  const getRequestBody = async (values: {
    title: string;
    date: Date;
    time?: string;
    start?: Date;
    end?: Date;
    location: "virtual" | string;
    locationString: string;
    participantIds: string[];
  }) => {
    const isVirtual = values.location === "virtual";
    const location = isVirtual ? null : values.locationString;

    // if time is provided, combine date and time for start
    const start = values.time
      ? new Date(
          values.date.getFullYear(),
          values.date.getMonth(),
          values.date.getDate(),
          ...values.time.split(":").map(Number)
        )
      : values.date;

    const end = new Date(start);
    end.setHours(end.getHours() + 1);

    const idToken = await firebaseUser.getIdToken();

    const requestBody = {
      title: values.title,
      start,
      end,
      location,
      virtual: isVirtual,
      idToken,
      participantIds: values.participantIds.map((id) => Number(id)),
    };

    return requestBody;
  };

  return {
    handleClose,
    handleSubmit,
    form,
    allUsers,
    selectedUserIds,
    setSelectedUserIds,
  };
};

export default useNewSeshModal;
