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
    // 페이지별 필터 상태 관리
    const [filter, setFilter] = useState("팀");
    const [events, setEvents] = useState([]);

    useEffect(() => {
        const fetchCalendar = async () => {
            try {
                const { data } = await leaveService.getCalendarData();
                const mapped = data.map((item) => ({
                    id: `leave-${item.index}`,
                    title: item.typeText,
                    start: item.startDate,
                    end: item.endDate,
                    allDay: true,
                    calendarType: item.calendarType
                }));
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
    }, []);

    return (
        <div style={{textAlign: 'center', marginTop: '100px'}}>
            {/* 페이지에서 필터 표시 */}
            <CalendarFilterBar
                filter={filter}
                onChangeFilter={setFilter}
                labels={["팀", "개인"]} // ← 페이지마다 다르게 변경 가능
            />

            {/* 캘린더 표시 */}
            <Calendar filter={filter} events={events} />
        </div>
    );
}

export default LeaveMain;