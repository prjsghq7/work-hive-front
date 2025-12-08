// components/Calendar.jsx
import React, { useRef } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import "./Calendar.css"; // 추후 scss로 변경 예정

export default function Calendar({ events }) {
    const calendarRef = useRef(null);

    return (
        <FullCalendar
            ref={calendarRef}
            plugins={[dayGridPlugin, interactionPlugin]}
            initialView="dayGridMonth"
            events={events}
            height="auto"
            headerToolbar={{
                left: "title",
                center: "",
                right: "today prev,next"
            }}
            dayMaxEvents={3}
        />
    );
}