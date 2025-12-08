import "./Home.min.css";
import {useApi} from "../hooks/useApi.js";
import { testService} from "../services/test/testService.js";

// 🔥 캘린더 컴포넌트 import
import Calendar from "../components/calendars/Calendar.jsx";
import CalendarFilterBar from "../components/calendars/CalendarFilterBar.jsx";

import { useState } from "react";

function Home() {
    // const {data,error,loading,callApi,reset} = useApi();
    const {data,error,loading,run,reset} = useApi();
    const handleTestClick = async () => {
        try {
            reset();
            const res = await run(() => testService.test());
            // const res = await callApi(testApiInfo.api, testApiInfo.method);
            console.log("test 응답:", res);
            alert("요청 성공 콘솔 확인");
        } catch (err) {
            console.error("test 요청 실패:", err);
            alert("요청 실패");
        }
    };

    // 🔥 페이지별 필터 상태 관리
    const [filter, setFilter] = useState("전체");

    return (
        <div style={{textAlign: 'center', marginTop: '100px'}}>
            <h1>Home Page</h1>
            <p>home first page</p>

            <button onClick={handleTestClick} disabled={loading}>
                {loading ? "요청중 ..." : "Test api 호출"}
            </button>
            {error && <p style={{ color: "red" }}>에러 발생: {error.message}</p>}
            {data && <p>응답 데이터: {JSON.stringify(data)}</p>}

            {/* 🔥 페이지에서 필터 표시 */}
            <CalendarFilterBar
                filter={filter}
                onChangeFilter={setFilter}
                labels={["전체", "일정", "연차"]} // ← 페이지마다 다르게 변경 가능
            />

            {/* 🔥 캘린더 표시 */}
            <Calendar filter={filter} />
        </div>
    );
}

export default Home;