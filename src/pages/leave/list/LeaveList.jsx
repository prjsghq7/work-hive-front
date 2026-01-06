import {useState, useEffect} from "react";
import "../../../assets/Common.min.css";
import {leaveService} from "../../../services/leave/leaveService.js";
import {useApi} from "../../../hooks/useApi.js";
import LeaveDetailModal from "../../../components/leave/LeaveDetailModal.jsx";

function LeaveList() {
    const [selectedTab, setSelectedTab] = useState("all");
    const {data, loading, error, run} = useApi();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [targetIndex, setTargetIndex] = useState(null);

    const openModal = (index) => {
        setTargetIndex(index);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setTargetIndex(null);
        setIsModalOpen(false);
    };

    useEffect(() => {
        run(() => leaveService.getLeaveData(selectedTab));
    }, [run, selectedTab]);

    const TABS = [
        {key: "all", label: "전체"},
        {key: "personal", label: "개인"},
        {key: "received", label: "요청 내역"},
    ];

    const leaves = data?.data?.leaves || [];

    // 날짜 표기 가공 유틸
    const formatDate = (dateString) => {
        if (!dateString) return '-';
        try {
            // ISO 포함되어있을 수도 있으므로 substring(0,10)
            return new Date(dateString).toLocaleDateString("ko-KR");
        } catch {
            return dateString;
        }
    };

    return (
        <div className="board-container">
            <div style={{
                display: 'flex',
                borderBottom: '2px solid #eee',
                marginBottom: '1.5rem'
            }}>
                {TABS.map(tab => (
                    <button
                        key={tab.key}
                        onClick={() => setSelectedTab(tab.key)}
                        style={{
                            padding: '1rem 2rem',
                            cursor: 'pointer',
                            border: 'none',
                            borderBottom: selectedTab === tab.key ? '3px solid #1177fe' : 'none',
                            background: 'none',
                            fontWeight: selectedTab === tab.key ? 'bold' : 'normal',
                            color: selectedTab === tab.key ? '#1177fe' : '#555'
                        }}
                    >
                        {tab.label}
                    </button>
                ))}
            </div>

            <div className="board-card">
                <div className="board-header">
                    <h2 className="board-card-title">연차 이력</h2>
                </div>
                <table className="board-table">
                    <thead>
                    <tr>
                        <th className="first">번호</th>
                        <th>요청자</th>
                        <th>승인자</th>
                        <th>연차 유형</th>
                        <th>요청일</th>
                        <th>승인일</th>
                        <th>시작일</th>
                        <th>종료일</th>
                        <th className="last">기간</th>
                    </tr>
                    </thead>
                    <tbody>
                    {loading ? (
                        <tr>
                            <td colSpan={9}>로딩 중...</td>
                        </tr>
                    ) : error ? (
                        <tr>
                            <td colSpan={9}>데이터를 불러오는 중 오류가 발생했습니다.</td>
                        </tr>
                    ) : !leaves || leaves.length === 0 ? (
                        <tr>
                            <td colSpan={9}>연차 이력이 없습니다.</td>
                        </tr>
                    ) : (
                        leaves.map((leave) => {
                            const period = (leave.startDate && leave.endDate)
                                ? (() => {
                                    const start = new Date(leave.startDate);
                                    const end = new Date(leave.endDate);
                                    const diffTime = Math.abs(end - start);
                                    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
                                    return `${diffDays}일`;
                                })()
                                : '-';
                            return (
                                <tr
                                    key={leave.index}
                                    onClick={() => openModal(leave.index)}
                                    style={{cursor: "pointer"}}
                                >
                                    <td>{leave.index}</td>
                                    <td>{leave.requesterName || '-'}</td>
                                    <td>{leave.approverName || '-'}</td>
                                    <td>{leave.typeText || '-'}</td>
                                    <td>{formatDate(leave.requestDate)}</td>
                                    <td>{formatDate(leave.approveDate)}</td>
                                    <td>{formatDate(leave.startDate)}</td>
                                    <td>{formatDate(leave.endDate)}</td>
                                    <td className="last">{period}</td>
                                </tr>
                            );
                        })
                    )}
                    </tbody>
                </table>
            </div>

            {isModalOpen && (
                <LeaveDetailModal targetIndex={targetIndex} onClose={closeModal}/>
            )}
        </div>
    );
}

export default LeaveList;