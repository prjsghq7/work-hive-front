import "./LeaveMain.min.css";

import Calendar from "../../../components/calendars/Calendar.jsx";
import CalendarFilterBar from "../../../components/calendars/CalendarFilterBar.jsx";

import { useState } from "react";

function LeaveMain() {
    // 페이지별 필터 상태 관리
    const [filter, setFilter] = useState("팀");

    return (
        <div style={{textAlign: 'center', marginTop: '100px'}}>
            {/* 페이지에서 필터 표시 */}
            <CalendarFilterBar
                filter={filter}
                onChangeFilter={setFilter}
                labels={["팀", "개인"]} // ← 페이지마다 다르게 변경 가능
            />

            {/* 캘린더 표시 */}
            <Calendar filter={filter} />
        </div>
    );
}

export default LeaveMain;