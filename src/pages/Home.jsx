import "./Home.min.css";
import {useApi} from "../hooks/useApi.js";
import {testService} from "../services/test/testService.js";
import {useAuth} from "./user/AuthContext.jsx";

import Calendar from "../components/calendars/Calendar.jsx";
import CalendarFilterBar from "../components/calendars/CalendarFilterBar.jsx";

import {useNavigate} from "react-router-dom";
import Loading from "../components/loading/Loading.jsx";
import {useState} from "react";

function Home() {
    // const {data,error,loading,callApi,reset} = useApi();
    const {data, error, loading, run, reset} = useApi();
    const {logout, isLoggedIn} = useAuth();
    const navigate = useNavigate();
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
    const handleLogout = () => {
        if (!isLoggedIn) {
            alert("로그인 부터 해주세요.");
            navigate("/user/login");
            return;
        } else {
            logout();
        }
    }
    console.log(isLoggedIn);
    const [filter, setFilter] = useState("일정");

    return (
        <div className="home-container">
            <div className="home-notice-section">
                <div className="notice-item">
                    <span className="notice-label">
                        <button onClick={handleTestClick} disabled={loading}>
                            {loading ? "요청중 ..." : "Test api 호출"}
                        </button>
                        {error && <p style={{color: "red"}}>에러 발생: {error.message}</p>}
                        {data && <p>응답 데이터: {JSON.stringify(data)}</p>}
                    </span>
                </div>
            </div>
            <div className="home-main-grid">
                <div className="home-profile-section">
                    {isLoggedIn ? (<button onClick={handleLogout}>로그아웃</button>) : (
                        <button onClick={() => navigate("/user/login")}>로그인</button>)}
                </div>
                <div className="home-weather-section">날씨</div>
                <div className="home-chat-section">채팅</div>
                <div className="home-calendar-section">
                    <CalendarFilterBar
                        filter={filter}
                        onChangeFilter={setFilter}
                        labels={["일정", "연차"]}
                        className="calendar-filter-container"
                    />
                    <Calendar filter={filter} events={[]}/>
                </div>
                <div className="home-schedule-section">금일 일정</div>
            </div>
        </div>
    );
}

export default Home;    