"use client";

import { Sesh } from "@/app/_types/types";
import moment from "moment";
import { Calendar, momentLocalizer } from "react-big-calendar";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { useSelector } from "react-redux";
import EventComponent from "./EventComponent";

interface SeshCalendarProps {
  handleEdit: (sesh: Sesh) => void;
}

export default function SeshCalendar({ handleEdit }: SeshCalendarProps) {
  const mLocalizer = momentLocalizer(moment);
  const { seshes } = useSelector((state) => state.sesh);

  const events = seshes?.map((sesh) => ({
    ...sesh,
    id: sesh.id.toString(),
    location: sesh.location || "",
    participants: sesh.participants || [],
  }));

  return (
    <Calendar
      localizer={mLocalizer}
      events={events}
      components={{
        event: (props) => (
          <EventComponent event={props.event} handleEdit={handleEdit} />
        ),
      }}
      startAccessor="start"
      endAccessor="end"
    />
  );
}
