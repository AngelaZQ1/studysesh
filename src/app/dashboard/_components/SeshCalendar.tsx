"use client";

import React, { useState } from "react";
import { Sesh } from "@/app/_types/types";
import moment from "moment";
import { Calendar, momentLocalizer, View } from "react-big-calendar";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { useSelector } from "react-redux";
import EventComponent from "./EventComponent";

interface SeshCalendarProps {
  handleEdit: (sesh: Sesh) => void;
}

const VIEWS = {
  month: true,
  week: true,
  day: true,
};

export default function SeshCalendar({ handleEdit }: SeshCalendarProps) {
  const mLocalizer = momentLocalizer(moment);
  const { seshes } = useSelector((state) => state.sesh);

  const [currentView, setCurrentView] = useState<View>("month");
  const [currentDate, setCurrentDate] = useState<Date | undefined>(undefined);

  const events = seshes?.map((sesh: Sesh) => ({
    ...sesh,
    id: sesh.id.toString(),
    location: sesh.location || "",
    participants: sesh.participants || [],
    start: new Date(sesh.start),
    end: new Date(sesh.end),
  }));

  return (
    <Calendar
      localizer={mLocalizer}
      events={events}
      views={VIEWS}
      components={{
        event: (props) => (
          <EventComponent event={props.event as Sesh} handleEdit={handleEdit} />
        ),
      }}
      onView={setCurrentView}
      view={currentView}
      date={currentDate}
      onNavigate={setCurrentDate}
    />
  );
}
