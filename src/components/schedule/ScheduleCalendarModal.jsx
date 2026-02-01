import "./ScheduleCalendarModal.min.css";

export default function ScheduleCalendarModal({ date, schedules, onClose, onOpenRequest }) {
    const formatDate = (dateString) => {
        if (!dateString) return "-";
        try {
            return new Date(dateString).toLocaleDateString("ko-KR", {
                year: "numeric",
                month: "long",
                day: "numeric",
                weekday: "long"
            });
        } catch {
            return dateString;
        }
    };

    // 날짜가 일정 기간 내에 있는지 확인
    const isDateInRange = (checkDate, startDate, endDate) => {
        if (!startDate) return false;
        const check = new Date(checkDate);
        const start = new Date(startDate);
        const end = endDate ? new Date(endDate) : start;

        check.setHours(0, 0, 0, 0);
        start.setHours(0, 0, 0, 0);
        end.setHours(0, 0, 0, 0);

        return check >= start && check <= end;
    };

    // 해당 날짜의 일정 필터링
    const filteredSchedules = schedules.filter((schedule) =>
        isDateInRange(date, schedule.start_date, schedule.end_date)
    );

    const handleRequestClick = () => {
        onClose();
        if (onOpenRequest) {
            onOpenRequest(date);
        }
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal schedule-calendar-modal" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                    <h3 className="modal-title">{formatDate(date)} 일정</h3>
                    <span className="modal-stretch"></span>
                    <button type="button" className="modal-close" onClick={onClose}>
                        ×
                    </button>
                </div>

                <div className="modal-body">
                    {filteredSchedules.length === 0 ? (
                        <div className="schedule-calendar-empty">
                            해당 날짜에 일정이 없습니다.
                        </div>
                    ) : (
                        <ul className="schedule-calendar-list">
                            {filteredSchedules.map((schedule) => (
                                <li key={schedule.index} className="schedule-calendar-item">
                                    <div className="schedule-calendar-item-content">
                                        <div className="schedule-calendar-item-title">
                                            {schedule.title || "-"}
                                        </div>
                                        <div
                                            className={`schedule-calendar-item-state state-${schedule.state}`}
                                        >
                                            {schedule.display_text || "-"}
                                        </div>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>

                <div className="modal-actions">
                    <button
                        type="button"
                        className="-button --blue"
                        onClick={handleRequestClick}
                    >
                        일정 추가
                    </button>
                </div>
            </div>
        </div>
    );
}
