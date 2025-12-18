// components/Calendar.jsx
import React, { useRef } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import "./Calendar.css"; // 추후 scss로 변경 예정

export default function Calendar({ events }) {
    const calendarRef = useRef(null);

    // 한글 월 이름 매핑
    const monthNames = ['1월', '2월', '3월', '4월', '5월', '6월', '7월', '8월', '9월', '10월', '11월', '12월'];

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
            titleFormat={(dateInfo) => {
                const month = monthNames[dateInfo.date.month];
                return `${dateInfo.date.year}년 ${month}`;
            }}
            dayMaxEvents={3}
        />
    );
}