import {useState} from "react";
    import {useNavigate} from "react-router-dom";
import {useApi} from "../../../hooks/useApi.js";
import {leaveService} from "../../../services/leave/leaveService.js";

function LeaveRequest() {
    const navigate = useNavigate();
    const {run, loading, error} = useApi();

    const [approverId, setApproverId] = useState("");
    const [type, setType] = useState(""); // 연차, 오전 반차, 오후 반차
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();

        const requestData = {
            approverId: approverId,
            type: type,
            startDate: startDate,
            endDate: endDate
        };

        console.log("전송할 데이터:", requestData);

        try {
            await run(() =>
                leaveService.request(requestData)
            );

            alert("연차 신청이 완료되었습니다!");
            // 메인 화면으로 이동
            navigate("/leave/main");
        } catch (error) {
            console.error(error);
            alert("연차 신청 실패");
        }
    };

    return (
        <div>
            <h2>연차 신청</h2>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>
                        승인자 ID:
                        <input
                            type="text"
                            value={approverId}
                            onChange={(e) => setApproverId(e.target.value)}
                            required
                        />
                    </label>
                </div>
                <div>
                    <label>
                        연차 타입:
                        <select
                            value={type}
                            onChange={(e) => setType(e.target.value)}
                            required
                        >
                            <option value="">선택하세요</option>
                            <option value="1">연차</option>
                            <option value="2">오전 반차</option>
                            <option value="3">오후 반차</option>
                            {/*<option value="4">병가</option>*/}
                        </select>
                    </label>
                </div>
                <div>
                    <label>
                        연차 시작일:
                        <input
                            type="date"
                            value={startDate}
                            onChange={(e) => setStartDate(e.target.value)}
                            required
                        />
                    </label>
                </div>
                <div>
                    <label>
                        연차 종료일:
                        <input
                            type="date"
                            value={endDate}
                            onChange={(e) => setEndDate(e.target.value)}
                            required
                        />
                    </label>
                </div>
                {error && <p style={{color: "red"}}>에러 발생: {error.message}</p>}
                <button type="submit" disabled={loading}>
                    {loading ? "요청 중..." : "요청하기"}
                </button>
            </form>
        </div>
    );
}

export default LeaveRequest;