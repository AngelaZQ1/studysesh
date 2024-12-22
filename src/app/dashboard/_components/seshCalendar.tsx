"use client";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";

export default function SeshCalendar() {
  const mLocalizer = momentLocalizer(moment);
  return (
    <Calendar
      localizer={mLocalizer}
      events={[]}
      startAccessor="start"
      endAccessor="end"
    />
  );
}
