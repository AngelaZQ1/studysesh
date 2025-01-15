"use client";

import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import EventComponent from "./EventComponent";
import { Sesh } from "@/app/_types/types";

interface SeshCalendarProps {
  seshes: Sesh[];
  handleEdit: (sesh: Sesh) => void;
}

export default function SeshCalendar({
  seshes,
  handleEdit,
}: SeshCalendarProps) {
  const mLocalizer = momentLocalizer(moment);

  const events = seshes.map((sesh) => ({
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
