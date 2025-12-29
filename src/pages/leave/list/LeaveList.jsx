import "../../../assets/Common.min.css";
import { useApi } from "../../../hooks/useApi.js";
import { leaveService } from "../../../services/leave/leaveService.js";
import { useEffect } from "react";

function LeaveList() {
    const { data, loading, error, run } = useApi();

    // 연차 리스트 조회
    useEffect(() => {
        run(() => leaveService.getLeaveData());
    }, [run]);

    return (
        <div className="board-container">
            <div className="board-card">
                <div className="board-header">
                    <h2 className="board-card-title">연차 이력</h2>
                </div>

                <table className="board-table">
                    <thead>
                    <tr>
                        <th className="first">번호</th>
                        <th>연차 유형</th>
                        <th>시작일</th>
                        <th>종료일</th>
                        <th className="last">기간</th>
                    </tr>
                    </thead>

                    <tbody>
                    {loading ? (
                        <tr>
                            <td colSpan={5}>로딩 중...</td>
                        </tr>
                    ) : error ? (
                        <tr>
                            <td colSpan={5}>데이터를 불러오는 중 오류가 발생했습니다.</td>
                        </tr>
                    ) : !data?.data?.leaves || data.data.leaves.length === 0 ? (
                        <tr>
                            <td colSpan={5}>연차 이력이 없습니다.</td>
                        </tr>
                    ) : (
                        data.data.leaves.map((leave) => {
                            const startDate = leave.startDate ? new Date(leave.startDate).toLocaleDateString('ko-KR') : '-';
                            const endDate = leave.endDate ? new Date(leave.endDate).toLocaleDateString('ko-KR') : '-';

                            // 기간 계산
                            let period = '-';
                            if (leave.startDate && leave.endDate) {
                                const start = new Date(leave.startDate);
                                const end = new Date(leave.endDate);
                                const diffTime = Math.abs(end - start);
                                const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
                                period = `${diffDays}일`;
                            }

                            return (
                                <tr key={leave.index}>
                                    <td>{leave.index}</td>
                                    <td>{leave.typeText || '-'}</td>
                                    <td>{startDate}</td>
                                    <td>{endDate}</td>
                                    <td className="last">{period}</td>
                                </tr>
                            );
                        })
                    )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default LeaveList;