import { useForm } from "@mantine/form";
import { notifications } from "@mantine/notifications";
import useSesh from "./useSesh";
import useUserContext from "./useUserContext";
import { useEffect, useState } from "react";
import useUser from "./useUser";
import { Sesh } from "../_types/types";
import moment from "moment";

type User = {
  firebaseUid: string;
  id: number;
  firstName: string;
  lastName: string;
  email: string;
};

interface NewSeshModalProps {
  onClose: () => void;
  seshToEdit?: Sesh | null;
}

const useNewSeshModal = ({ onClose, seshToEdit }: NewSeshModalProps) => {
  const { getAllUsers } = useUser();
  const { firebaseUser, userId } = useUserContext();
  const { createSesh, updateSesh } = useSesh();

  const [allUsers, setAllUsers] = useState<User[]>([]);
  const [selectedUserIds, setSelectedUserIds] = useState<string[]>([]);

  const fetchUsers = async () => {
    const users = await getAllUsers();
    const otherUsers = users.filter((user: User) => user.id !== userId);
    setAllUsers(otherUsers);
  };

  // Update form values when seshToEdit changes
  useEffect(() => {
    if (seshToEdit) {
      fetchUsers();
      form.setValues({
        title: seshToEdit.title,
        date: new Date(seshToEdit.start),
        time: seshToEdit.time
          ? moment(seshToEdit.time, "h:mmA").format("HH:mm")
          : undefined,
        locationString: seshToEdit.location,
        location: seshToEdit.virtual ? "virtual" : "inPerson",
        participantIds:
          seshToEdit.participants.map((p: User) => p.id.toString()) || [],
      });
    }
  }, [seshToEdit]);

  // title, date, location are required
  // if location is inPerson, locationString is required
  const form = useForm<{
    title: string;
    date: Date;
    time?: string;
    locationString: string;
    location: "virtual" | "inPerson";
    participantIds: string[];
  }>({
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

  const handleUpdate = async (values: {
    id: string;
    title: string;
    date: Date;
    time?: string;
    start?: Date;
    end?: Date;
    location: "virtual" | string;
    locationString: string;
    participantIds: string[];
  }) => {
    form.validate();

    const requestBody = await getRequestBody(values);
    await updateSesh(Number(values.id), requestBody);

    notifications.show({
      title: "Success!",
      message: "Your Sesh has been updated.",
      autoClose: 3000,
      color: "pink",
    });
    handleClose();
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
    let start;
    let time;
    // if time is provided, start = date + time
    if (values.time) {
      time = values.time;
      start = new Date(
        values.date.getFullYear(),
        values.date.getMonth(),
        values.date.getDate(),
        ...values.time.split(":").map(Number)
      );
    } else {
      // else start = date
      start = values.date;
      time = undefined;
    }
    const end = new Date(start);
    end.setHours(end.getHours() + 1);

    const virtual = values.location === "virtual";
    const location = virtual ? null : values.locationString;
    const idToken = await firebaseUser.getIdToken();

    const requestBody = {
      title: values.title,
      start,
      end,
      time,
      location,
      virtual,
      idToken,
      participantIds: values.participantIds.map((id) => Number(id)),
    };

    return requestBody;
  };

  return {
    handleClose,
    handleSubmit,
    handleUpdate,
    form,
    allUsers,
    selectedUserIds,
    setSelectedUserIds,
    fetchUsers,
  };
};

export default useNewSeshModal;
