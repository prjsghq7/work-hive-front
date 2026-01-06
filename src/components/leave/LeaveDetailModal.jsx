import "./LeaveDetailModal.min.css";

import {leaveService} from "../../services/leave/leaveService.js";
import {useApi} from "../../hooks/useApi.js";

import {useEffect, useState} from "react";

export default function LeaveDetailModal({targetIndex, onClose}) {
    const [leave, setLeave] = useState(null);
    const {run} = useApi();

    useEffect(() => {
        if (!targetIndex) return;

        const fetchDetail = async () => {
            try {
                const res = await leaveService.getDetail(targetIndex);
                const data = res.data.data;

                setLeave({
                    index: data.index,
                    requesterId: data.requesterId ?? "",
                    requesterName: data.requesterName ?? "",
                    approverId: data.approverId ?? "",
                    approverName: data.approverName ?? "",
                    typeText: data.typeText ?? "",
                    stateText: data.stateText ?? "",
                    reason: data.reason ?? "",
                    requestDate: data.requestDate ?? "",
                    approveDate: data.approveDate ?? "",
                    startDate: data.startDate ?? "",
                    endDate: data.endDate ?? "",
                });
            } catch (e) {
                setLeave(null);
            }
        };

        fetchDetail();
    }, [targetIndex]);

    if (!targetIndex) return null;

    // 날짜 포맷팅 함수
    const formatDate = (dateString) => {
        if (!dateString) return '-';
        try {
            return new Date(dateString).toLocaleDateString("ko-KR");
        } catch {
            return dateString;
        }
    };

    // 기간 계산 함수
    const calculatePeriod = (startDate, endDate) => {
        if (!startDate || !endDate) return '-';
        try {
            const start = new Date(startDate);
            const end = new Date(endDate);
            const diffTime = Math.abs(end - start);
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
            return `${diffDays}일`;
        } catch {
            return '-';
        }
    };

    // 승인/반려 처리
    const handleAction = async (action) => {
        if (!leave) return;
        try {
            await run(() => leaveService.patchAction(leave.index, action));
            onClose();
            window.location.reload();
        } catch (e) {
            const actionText = action === "approve" ? "승인" : "반려";
            alert(`${actionText} 처리 중 오류가 발생했습니다.`);
        }
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                    <h3 className="modal-title">연차 상세</h3>
                    <span className="modal-stretch"></span>
                    <button type="button" className="modal-close" onClick={onClose}>
                        ×
                    </button>
                </div>

                <div className="modal-body">
                    {!leave && (
                        <div className="detail-empty">
                            연차 정보를 불러올 수 없습니다.
                        </div>
                    )}

                    {leave && (
                        <>
                            <div className="grid">
                                <div className="item">
                                    <div className="label">요청자</div>
                                    <div className="value">{leave.requesterName}</div>
                                </div>

                                <div className="item">
                                    <div className="label">승인자</div>
                                    <div className="value">{leave.approverName || '-'}</div>
                                </div>

                                <div className="item">
                                    <div className="label">연차 유형</div>
                                    <div className="value">{leave.typeText}</div>
                                </div>

                                <div className="item">
                                    <div className="label">상태</div>
                                    <div className="value">{leave.stateText}</div>
                                </div>

                                <div className="item">
                                    <div className="label">요청일</div>
                                    <div className="value">{formatDate(leave.requestDate)}</div>
                                </div>

                                <div className="item">
                                    <div className="label">승인일</div>
                                    <div className="value">{formatDate(leave.approveDate)}</div>
                                </div>

                                <div className="item">
                                    <div className="label">시작일</div>
                                    <div className="value">{formatDate(leave.startDate)}</div>
                                </div>

                                <div className="item">
                                    <div className="label">종료일</div>
                                    <div className="value">{formatDate(leave.endDate)}</div>
                                </div>

                                <div className="item full-width">
                                    <div className="label">기간</div>
                                    <div className="value">{calculatePeriod(leave.startDate, leave.endDate)}</div>
                                </div>

                                {leave.reason && (
                                    <div className="item full-width">
                                        <div className="label">사유</div>
                                        <div className="value">{leave.reason}</div>
                                    </div>
                                )}
                            </div>
                        </>
                    )}
                </div>

                <div className="modal-actions">
                    <button
                        type="button"
                        className="-button --green"
                        onClick={() => handleAction("approve")}
                    >
                        승인
                    </button>
                    <button
                        type="button"
                        className="-button --red"
                        onClick={() => handleAction("reject")}
                    >
                        반려
                    </button>
                </div>
            </div>
        </div>
    );
}

