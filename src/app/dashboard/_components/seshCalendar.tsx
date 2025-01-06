"use client";

import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import EventComponent from "./EventComponent";
import { Sesh } from "@prisma/client";

export default function SeshCalendar({ seshes }: { seshes: Sesh[] }) {
  const mLocalizer = momentLocalizer(moment);

  const events = seshes.map((sesh) => ({
    ...sesh,
    id: sesh.id.toString(),
    location: sesh.location || "",
  }));

  return (
    <Calendar
      localizer={mLocalizer}
      events={events}
      components={{
        event: EventComponent,
      }}
      startAccessor="start"
      endAccessor="end"
    />
  );
}
