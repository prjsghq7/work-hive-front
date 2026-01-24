// components/Calendar.jsx
import React, { useRef } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import "./Calendar.min.css";

export default function Calendar({ events, onDateClick, onRequestClick }) {
    const calendarRef = useRef(null);

    // 한글 월 이름 매핑
    const monthNames = ['1월', '2월', '3월', '4월', '5월', '6월', '7월', '8월', '9월', '10월', '11월', '12월'];

    const handleDateClick = (info) => {
        if (onDateClick) {
            // 날짜를 YYYY-MM-DD 형식으로 변환
            const dateStr = info.dateStr;
            onDateClick(dateStr);
        }
    };

    // 커스텀 버튼 설정
    const customButtons = onRequestClick ? {
        requestButton: {
            text: '신청',
            click: function() {
                onRequestClick();
            }
        }
    } : {};

    return (
        <FullCalendar
            ref={calendarRef}
            plugins={[dayGridPlugin, interactionPlugin]}
            initialView="dayGridMonth"
            events={events}
            height="auto"
            customButtons={customButtons}
            headerToolbar={{
                left: "title",
                center: "",
                right: onRequestClick ? "today prev,next requestButton" : "today prev,next"
            }}
            titleFormat={(dateInfo) => {
                const month = monthNames[dateInfo.date.month];
                return `${dateInfo.date.year}년 ${month}`;
            }}
            dayMaxEvents={3}
            dateClick={handleDateClick}
        />
    );
}