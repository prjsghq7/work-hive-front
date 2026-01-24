import {useState, useEffect} from "react";
import "../../../assets/Common.min.css";
import "./LeaveList.min.css";
import {leaveService} from "../../../services/leave/leaveService.js";
import {useApi} from "../../../hooks/useApi.js";
import LeaveDetailModal from "../../../components/leave/LeaveDetailModal.jsx";
import {useAuth} from "../../user/AuthContext.jsx";
import {editService, subTableListService} from "../../../services/user/userService.js";

function LeaveList() {
    const [selectedTab, setSelectedTab] = useState("all");
    const {data, loading, error, run} = useApi();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [targetIndex, setTargetIndex] = useState(null);
    const {user} = useAuth();
    const [profileImageUrl, setProfileImageUrl] = useState(null);
    const [roleList, setRoleList] = useState([]);
    const [leaveStats, setLeaveStats] = useState({ pendingApprovalCount: 0, pendingApproverCount: 0 });

    const openModal = (index) => {
        setTargetIndex(index);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setTargetIndex(null);
        setIsModalOpen(false);
    };

    // 통계 데이터 로드 (초기 1회만)
    useEffect(() => {
        if (user) {
            (async () => {
                try {
                    const statsData = await run(() => leaveService.getLeaveStats());
                    setLeaveStats({
                        pendingApprovalCount: statsData?.data?.pendingApprovalCount ?? 0,
                        pendingApproverCount: statsData?.data?.pendingApproverCount ?? 0
                    });
                } catch (e) {
                    setLeaveStats({ pendingApprovalCount: 0, pendingApproverCount: 0 });
                }
            })();
        }
    }, [user, run]);

    // 탭 변경 시 테이블 데이터만 로드
    useEffect(() => {
        run(() => leaveService.getLeaveData(selectedTab));
    }, [run, selectedTab]);

    // 프로필 이미지 로드
    useEffect(() => {
        const loadProfileImage = async () => {
            try {
                const blob = await run(() => editService.getProfileImageBlob());
                const url = URL.createObjectURL(blob);
                setProfileImageUrl((prev) => {
                    if (prev) URL.revokeObjectURL(prev);
                    return url;
                });
            } catch (e) {
                setProfileImageUrl(null);
            }
        };
        if (user) {
            loadProfileImage();
        }
    }, [user, run]);

    // 직급 리스트 로드
    useEffect(() => {
        (async () => {
            try {
                const roleBody = await run(() => subTableListService.getRoleList());
                setRoleList(roleBody?.data?.codes ?? []);
            } catch (e) {
                setRoleList([]);
            }
        })();
    }, [run]);

    const TABS = [
        {key: "all", label: "전체"},
        {key: "personal", label: "개인"},
        {key: "received", label: "결재 대기"},
    ];

    const allLeaves = data?.data?.leaves || [];
    
    // 전체 탭에서는 승인된 것만 필터링
    const leaves = selectedTab === "all" 
        ? allLeaves.filter(leave => leave.stateText === "승인")
        : allLeaves;

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

    // 연차 정보 계산
    const totalLeave = user?.totalDayOffs ?? 0;
    const remainingLeave = user?.remainingDayOffs ?? 0;
    const usedLeave = totalLeave - remainingLeave;
    
    // 승인 대기 / 결재 대기 (API에서 받아온 통계 사용)
    const pendingApprovalCount = leaveStats.pendingApprovalCount;
    const pendingApproverCount = leaveStats.pendingApproverCount;
    
    // 직급 텍스트
    const roleText = roleList.find((r) => String(r.code) === String(user?.roleCode))?.displayText ?? "";
    const userName = user?.name ?? "";
    const displayName = roleText ? `${userName} ${roleText}` : userName;

    return (
        <div className="board-container">
            {/* 내 연차 이력 섹션 */}
            <div className="leave-summary-section">
                <div className="leave-summary-profile">
                    {profileImageUrl ? (
                        <img src={profileImageUrl} alt="프로필" className="leave-summary-avatar" />
                    ) : (
                        <div className="leave-summary-avatar-placeholder">No Image</div>
                    )}
                    <span className="leave-summary-name">{displayName}</span>
                </div>
                <div className="leave-summary-stats">
                    <div className="leave-summary-stat-item">
                        <span className="leave-summary-label">총 연차</span>
                        <span className="leave-summary-value highlight">{totalLeave}</span>
                    </div>
                    <div className="leave-summary-divider"></div>
                    <div className="leave-summary-stat-item">
                        <span className="leave-summary-label">사용 연차</span>
                        <span className="leave-summary-value highlight">{usedLeave}</span>
                    </div>
                    <div className="leave-summary-divider"></div>
                    <div className="leave-summary-stat-item">
                        <span className="leave-summary-label">잔여 연차</span>
                        <span className="leave-summary-value highlight">{remainingLeave}</span>
                    </div>
                    <div className="leave-summary-divider"></div>
                    <div className="leave-summary-stat-item">
                        <span className="leave-summary-label">승인 대기</span>
                        <span className="leave-summary-value highlight">{pendingApprovalCount}</span>
                    </div>
                    <div className="leave-summary-divider"></div>
                    <div className="leave-summary-stat-item">
                        <span className="leave-summary-label">결재 대기</span>
                        <span className="leave-summary-value highlight">{pendingApproverCount}</span>
                    </div>
                </div>
            </div>

            <div className="leave-list-tabs">
                {TABS.map(tab => (
                    <button
                        key={tab.key}
                        onClick={() => setSelectedTab(tab.key)}
                        className={`leave-list-tab ${selectedTab === tab.key ? 'active' : ''}`}
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
                        <th>상태</th>
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
                            <td colSpan={10}>로딩 중...</td>
                        </tr>
                    ) : error ? (
                        <tr>
                            <td colSpan={10}>데이터를 불러오는 중 오류가 발생했습니다.</td>
                        </tr>
                    ) : !leaves || leaves.length === 0 ? (
                        <tr>
                            <td colSpan={10}>연차 이력이 없습니다.</td>
                        </tr>
                    ) : (
                        leaves.map((leave, idx) => {
                            const period = (leave.startDate && leave.endDate)
                                ? (() => {
                                    const start = new Date(leave.startDate);
                                    const end = new Date(leave.endDate);
                                    const diffTime = Math.abs(end - start);
                                    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
                                    return `${diffDays}일`;
                                })()
                                : '-';
                            
                            // 상태에 따른 클래스명
                            const getStatusClass = (stateText) => {
                                if (stateText === "승인") {
                                    return "approved";
                                } else if (stateText === "반려") {
                                    return "rejected";
                                } else {
                                    return "pending";
                                }
                            };

                            return (
                                <tr
                                    key={leave.index}
                                    onClick={() => openModal(leave.index)}
                                    className="leave-list-table-row"
                                >
                                    <td>{idx + 1}</td>
                                    <td>
                                        <span className={`leave-status-badge ${getStatusClass(leave.stateText)}`}>
                                            {leave.stateText || '대기'}
                                        </span>
                                    </td>
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
                <LeaveDetailModal 
                    targetIndex={targetIndex} 
                    onClose={closeModal}
                    selectedTab={selectedTab}
                />
            )}
        </div>
    );
}

export default LeaveList;