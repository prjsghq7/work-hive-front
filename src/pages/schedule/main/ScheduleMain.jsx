import "./ScheduleMain.min.css";

import Calendar from "../../../components/calendars/Calendar.jsx";
import CalendarFilterBar from "../../../components/calendars/CalendarFilterBar.jsx";
import ScheduleCalendarModal from "../../../components/schedule/ScheduleCalendarModal.jsx";
import ScheduleRequestModal from "../../../components/schedule/ScheduleRequestModal.jsx";
import { scheduleService } from "../../../services/schedule/scheduleService.js";

import { useEffect, useState } from "react";

function ScheduleMain() {
    const [filter, setFilter] = useState("team");
    const [events, setEvents] = useState([]);
    const [calendarList, setCalendarList] = useState([]);
    const [selectedDate, setSelectedDate] = useState(null);
    const [isListModalOpen, setIsListModalOpen] = useState(false);
    const [isRequestModalOpen, setIsRequestModalOpen] = useState(false);
    const [requestModalStartDate, setRequestModalStartDate] = useState(null);

    const filterOptions = [
        { value: "team", label: "팀" },
        { value: "personal", label: "개인" }
    ];

    // 일정 상태에 따라 FullCalendar용 색상 클래스
    const getColorClass = (state) => {
        if (state === 1) return "green";   // 예정
        if (state === 2) return "blue";   // 진행중
        if (state === 3) return "orange"; // 보류
        if (state === 4) return "gray";   // 완료
        return "green";
    };

    const fetchCalendar = async () => {
        try {
            const response = await scheduleService.getCalendarData(filter);
            const fetchedList = response.data?.data?.calendarList ?? response.data?.data ?? [];
            setCalendarList(Array.isArray(fetchedList) ? fetchedList : []);

            const list = Array.isArray(fetchedList) ? fetchedList : [];
            const mapped = list.map((item) => {
                const end = new Date(item.end_date);
                end.setDate(end.getDate() + 1);
                return {
                    id: `schedule-${item.index}`,
                    title: item.title,
                    start: item.start_date,
                    end: end.toISOString().split("T")[0],
                    allDay: true,
                    className: getColorClass(item.state)
                };
            });
            setEvents(mapped);
        } catch (e) {
            console.error("일정 캘린더 로드 실패", e);
            setCalendarList([]);
            setEvents([]);
        }
    };

    useEffect(() => {
        fetchCalendar();
    }, [filter]);

    const handleDateClick = (dateStr) => {
        setSelectedDate(dateStr);
        setIsListModalOpen(true);
    };

    const handleCloseListModal = () => {
        setIsListModalOpen(false);
        setSelectedDate(null);
    };

    const handleOpenRequestModal = (startDate = null) => {
        setRequestModalStartDate(startDate);
        setIsRequestModalOpen(true);
    };

    const handleCloseRequestModal = () => {
        setIsRequestModalOpen(false);
        setRequestModalStartDate(null);
    };

    const handleRequestSuccess = () => {
        fetchCalendar();
    };

    return (
        <div className="schedule-main-container">
            <div className="schedule-main-header">
                <CalendarFilterBar
                    filter={filter}
                    onChangeFilter={setFilter}
                    labels={filterOptions}
                    className="calendar-filter-container"
                />
            </div>

            <Calendar
                filter={filter}
                events={events}
                onDateClick={handleDateClick}
                onRequestClick={handleOpenRequestModal}
            />

            {isListModalOpen && selectedDate && (
                <ScheduleCalendarModal
                    date={selectedDate}
                    schedules={calendarList}
                    onClose={handleCloseListModal}
                    onOpenRequest={handleOpenRequestModal}
                />
            )}

            {isRequestModalOpen && (
                <ScheduleRequestModal
                    onClose={handleCloseRequestModal}
                    onSuccess={handleRequestSuccess}
                    initialStartDate={requestModalStartDate}
                />
            )}
        </div>
    );
}

export default ScheduleMain;
