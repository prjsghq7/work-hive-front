import "./LeaveMain.min.css";

import Calendar from "../../../components/calendars/Calendar.jsx";
import CalendarFilterBar from "../../../components/calendars/CalendarFilterBar.jsx";
import LeaveCalendarModal from "../../../components/leave/LeaveCalendarModal.jsx";
import LeaveRequestModal from "../../../components/leave/LeaveRequestModal.jsx";
import { leaveService } from "../../../services/leave/leaveService.js";

import { useEffect, useState } from "react";

function LeaveMain() {
    // 페이지별 필터 상태 관리 (영어 값으로 관리)
    const [filter, setFilter] = useState("team");
    const [events, setEvents] = useState([]);
    const [calendarList, setCalendarList] = useState([]);
    const [selectedDate, setSelectedDate] = useState(null);
    const [isListModalOpen, setIsListModalOpen] = useState(false);
    const [isRequestModalOpen, setIsRequestModalOpen] = useState(false);
    const [requestModalStartDate, setRequestModalStartDate] = useState(null);

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

    const fetchCalendar = async () => {
        try {
            const response = await leaveService.getCalendarData(filter);
            console.log(response);
            const fetchedCalendarList = response.data.data.calendarList || [];
            // 원본 데이터 저장
            setCalendarList(fetchedCalendarList);
            
            const mapped = fetchedCalendarList.map((item) => {
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
        // 신청 완료 후 캘린더 새로고침
        fetchCalendar();
    };

    return (
        <div className="leave-main-container">
            {/* 페이지에서 필터 표시 */}
            <div className="leave-main-header">
                <CalendarFilterBar
                    filter={filter}
                    onChangeFilter={setFilter}
                    labels={filterOptions}
                    className="calendar-filter-container"
                />
                <button 
                    type="button" 
                    className="-button --blue"
                    onClick={handleOpenRequestModal}
                >
                    신청하기
                </button>
            </div>

            {/* 캘린더 표시 */}
            <Calendar filter={filter} events={events} onDateClick={handleDateClick} />

            {/* 일정 리스트 모달 */}
            {isListModalOpen && selectedDate && (
                <LeaveCalendarModal
                    date={selectedDate}
                    leaves={calendarList}
                    onClose={handleCloseListModal}
                    onOpenRequest={() => handleOpenRequestModal(selectedDate)}
                />
            )}

            {/* 연차 신청 모달 */}
            {isRequestModalOpen && (
                <LeaveRequestModal
                    onClose={handleCloseRequestModal}
                    onSuccess={handleRequestSuccess}
                    initialStartDate={requestModalStartDate}
                />
            )}
        </div>
    );
}

export default LeaveMain;