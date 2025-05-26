"use client";

import React, { useState } from "react";
import { Sesh } from "@/app/_types/types";
import moment from "moment";
import { Calendar, momentLocalizer, View } from "react-big-calendar";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { useSelector } from "react-redux";
import EventComponent from "./EventComponent";
import useUserContext from "@/app/_hooks/useUserContext";
import user from "pusher-js/types/src/core/user";

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
  const { user } = useUserContext();

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

  // Return the className or style props for styling the event node
  const eventPropGetter = (event: Sesh) => {
    const isOwner = event.ownerId === user.id;
    return {
      style: {
        backgroundColor: isOwner ? "#FC6288" : "#FF9C67",
      },
    };
  };

  return (
    <Calendar
      localizer={mLocalizer}
      events={events}
      eventPropGetter={eventPropGetter}
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
