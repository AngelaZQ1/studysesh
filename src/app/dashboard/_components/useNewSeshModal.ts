import { AppDispatch } from "@/app/_redux/store";
import { useForm } from "@mantine/form";
import { notifications } from "@mantine/notifications";
import moment from "moment";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import useUser from "../../_hooks/useUser";
import useUserContext from "../../_hooks/useUserContext";
import { createSesh, deleteSesh, updateSesh } from "../../_redux/seshSlice";
import { Sesh, User } from "../../_types/types";

interface NewSeshModalProps {
  onSubmit: () => void;
  seshToEdit?: Sesh | null;
}

const useNewSeshModal = ({ onSubmit, seshToEdit }: NewSeshModalProps) => {
  const { getAllUsers } = useUser();
  const { firebaseUser, user } = useUserContext();
  const dispatch = useDispatch<AppDispatch>();

  const [allUsers, setAllUsers] = useState<User[]>([]);
  const [selectedUserIds, setSelectedUserIds] = useState<string[]>([]);
  const [popoverOpened, setPopoverOpened] = useState(false);

  const fetchUsers = async () => {
    const idToken = await firebaseUser.getIdToken();
    const users = await getAllUsers({ idToken });
    const otherUsers = users.filter((u: User) => u.id !== user.id);
    setAllUsers(otherUsers);
  };

  // Update form values when seshToEdit changes
  useEffect(() => {
    if (seshToEdit) {
      fetchUsers();

      form.setValues({
        title: seshToEdit.title,
        date: new Date(seshToEdit.start),
        time: moment(seshToEdit.start).format("HH:mm"),
        locationString: seshToEdit.location,
        location: seshToEdit.virtual ? "virtual" : "inPerson",
        participantIds:
          seshToEdit.participants.map((p: { id: number }) => p.id.toString()) ||
          [],
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
      time: (value) => (!value ? "Time is required" : null),
      locationString: (value): string | null =>
        form.getValues().location === "inPerson" && value.trim().length === 0
          ? "Location cannot be empty"
          : null,
    },
  });

  const handleClose = () => {
    form.reset();
    form.clearErrors();
    onSubmit();
  };

  const handleCancelSesh = async () => {
    if (!seshToEdit) {
      notifications.show({
        title: "Error",
        message: "An error occurred trying to cancel the Sesh.",
        autoClose: 5000,
        color: "red",
      });
      return;
    }

    setPopoverOpened(false);
    await dispatch(deleteSesh({ id: Number(seshToEdit.id) }));
    notifications.show({
      title: "Success!",
      message: "Sesh successfully cancelled.",
      autoClose: 5000,
      color: "pink",
    });
    handleClose();
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
    await dispatch(
      updateSesh({
        id: Number(values.id),
        updatedSesh: requestBody,
      })
    );

    notifications.show({
      title: "Success!",
      message: "Your Sesh has been updated.",
      autoClose: 5000,
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
    await dispatch(createSesh({ newSesh: requestBody }));

    notifications.show({
      title: "Success!",
      message: "Your Sesh has been created.",
      autoClose: 5000,
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
    // if time is provided, start = date + time
    if (values.time) {
      start = new Date(
        values.date.getFullYear(),
        values.date.getMonth(),
        values.date.getDate(),
        ...values.time.split(":").map(Number)
      );
    } else {
      // else start = date
      start = values.date;
    }
    const end = new Date(start);
    end.setHours(end.getHours() + 1);

    const virtual = values.location === "virtual";
    const location = virtual ? null : values.locationString;

    const requestBody = {
      title: values.title,
      start,
      end,
      location,
      virtual,
      participantIds: values.participantIds.map((id) => Number(id)),
      files: null,
    };

    return requestBody;
  };

  return {
    handleClose,
    handleSubmit,
    handleUpdate,
    handleCancelSesh,
    popoverOpened,
    setPopoverOpened,
    form,
    allUsers,
    selectedUserIds,
    setSelectedUserIds,
    fetchUsers,
  };
};

export default useNewSeshModal;
