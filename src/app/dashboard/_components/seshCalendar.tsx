"use client";

import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import useCalendar from "@/app/_hooks/useCalendar";
import EventComponent from "./EventComponent";

export default function SeshCalendar() {
  const mLocalizer = momentLocalizer(moment);
  const { events } = useCalendar();

  return (
    <Calendar
      localizer={mLocalizer}
      events={events}
      components={{
        event: EventComponent, // Use the custom event renderer
      }}
      startAccessor="start"
      endAccessor="end"
    />
  );
}
