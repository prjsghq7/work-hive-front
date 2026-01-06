import "./LeaveMain.min.css";

import Calendar from "../../../components/calendars/Calendar.jsx";
import CalendarFilterBar from "../../../components/calendars/CalendarFilterBar.jsx";
import { leaveService } from "../../../services/leave/leaveService.js";

import { useEffect, useState } from "react";

// CalendarDto 모양의 샘플 데이터
const sampleCalendarDto = [
    {
        index: 1,
        typeText: "연차",
        startDate: "2025-12-10",
        endDate: "2025-12-12",
        calendarType: "dayOffs"
    },
    {
        index: 2,
        typeText: "반차",
        startDate: "2025-12-15",
        endDate: "2025-12-15",
        calendarType: "dayOffs"
    },
    {
        index: 3,
        typeText: "병가",
        startDate: "2025-12-20",
        endDate: "2025-12-20",
        calendarType: "dayOffs"
    }
];

function LeaveMain() {
    // 페이지별 필터 상태 관리 (영어 값으로 관리)
    const [filter, setFilter] = useState("team");
    const [events, setEvents] = useState([]);

    // 필터 옵션 정의 (value: 백엔드 전송값, label: 화면 표시값)
    const filterOptions = [
        { value: "team", label: "팀" },
        { value: "personal", label: "개인" }
    ];

    // 연차 유형에 따라 색상 클래스 결정
    const getColorClass = (typeText) => {
        if (typeText === "연차") return "green";
        if (typeText === "오전 반차") return "blue";
        if (typeText === "오후 반차") return "blue";
        if (typeText === "병가") return "red";
        return "green"; // 기본값
    };

    useEffect(() => {
        const fetchCalendar = async () => {
            try {
                const response = await leaveService.getCalendarData(filter);
                console.log(response);
                const calendarList = response.data.data.calendarList || [];
                const mapped = calendarList.map((item) => {
                    const end = new Date(item.endDate);
                    end.setDate(end.getDate() + 1);

                    return {
                        id: `leave-${item.index}`,
                        title: `${item.name} - ${item.typeText}`,
                        start: item.startDate,
                        end: end.toISOString().split("T")[0],
                        allDay: true,
                        className: getColorClass(item.typeText),
                        calendarType: item.calendarType
                    };
                });
                setEvents(mapped);
            } catch (e) {
                console.error("달력 데이터 로드 실패", e);
                // 백엔드가 막히면 샘플 CalendarDto를 매핑해서 표시
                const mappedSample = sampleCalendarDto.map((item) => ({
                    id: `leave-${item.index}`,
                    title: item.typeText,
                    start: item.startDate,
                    end: item.endDate,
                    allDay: true,
                    calendarType: item.calendarType
                }));
                setEvents(mappedSample);
            }
        };

        fetchCalendar();
    }, [filter]);

    return (
        <div className="leave-main-container">
            {/* 페이지에서 필터 표시 */}
            <CalendarFilterBar
                filter={filter}
                onChangeFilter={setFilter}
                labels={filterOptions}
                className="calendar-filter-container"
            />

            {/* 캘린더 표시 */}
            <Calendar filter={filter} events={events} />
        </div>
    );
}

export default LeaveMain;