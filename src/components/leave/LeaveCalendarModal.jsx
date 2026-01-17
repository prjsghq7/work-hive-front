import "./LeaveCalendarModal.min.css";
import { useState } from "react";
import LeaveDetailModal from "./LeaveDetailModal.jsx";

export default function LeaveCalendarModal({ date, leaves, onClose, onOpenRequest }) {
    const [selectedIndex, setSelectedIndex] = useState(null);
    const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

    // 연차 유형에 따라 색상 클래스 결정
    const getColorClass = (typeText) => {
        if (typeText === "연차") return "green";
        if (typeText === "오전 반차") return "blue";
        if (typeText === "오후 반차") return "blue";
        if (typeText === "병가") return "red";
        return "green"; // 기본값
    };

    // 날짜 포맷팅
    const formatDate = (dateString) => {
        if (!dateString) return '-';
        try {
            return new Date(dateString).toLocaleDateString("ko-KR", {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                weekday: 'long'
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
        
        // 날짜만 비교 (시간 제외)
        check.setHours(0, 0, 0, 0);
        start.setHours(0, 0, 0, 0);
        end.setHours(0, 0, 0, 0);
        
        return check >= start && check <= end;
    };

    // 해당 날짜의 일정 필터링
    const filteredLeaves = leaves.filter(leave => 
        isDateInRange(date, leave.startDate, leave.endDate)
    );

    const handleLeaveClick = (index) => {
        setSelectedIndex(index);
        setIsDetailModalOpen(true);
    };

    const handleCloseDetail = () => {
        setIsDetailModalOpen(false);
        setSelectedIndex(null);
    };

    const handleRequestClick = () => {
        onClose();
        // 부모 컴포넌트에 신청 모달 열기 요청
        if (onOpenRequest) {
            onOpenRequest();
        }
    };

    return (
        <>
            <div className="modal-overlay" onClick={onClose}>
                <div className="modal leave-calendar-modal" onClick={(e) => e.stopPropagation()}>
                    <div className="modal-header">
                        <h3 className="modal-title">{formatDate(date)} 일정</h3>
                        <span className="modal-stretch"></span>
                        <button type="button" className="modal-close" onClick={onClose}>
                            ×
                        </button>
                    </div>

                    <div className="modal-body">
                        {filteredLeaves.length === 0 ? (
                            <div className="leave-calendar-empty">
                                해당 날짜에 일정이 없습니다.
                            </div>
                        ) : (
                            <ul className="leave-calendar-list">
                                {filteredLeaves.map((leave) => (
                                    <li
                                        key={leave.index}
                                        className="leave-calendar-item"
                                        onClick={() => handleLeaveClick(leave.index)}
                                    >
                                        <div className="leave-calendar-item-content">
                                            <div className="leave-calendar-item-name">
                                                {leave.name || '-'}
                                            </div>
                                            <div className={`leave-calendar-item-type ${getColorClass(leave.typeText)}`}>
                                                {leave.typeText || '-'}
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
                            신청하기
                        </button>
                    </div>
                </div>
            </div>

            {isDetailModalOpen && selectedIndex && (
                <LeaveDetailModal
                    targetIndex={selectedIndex}
                    onClose={handleCloseDetail}
                    selectedTab="all"
                />
            )}
        </>
    );
}
