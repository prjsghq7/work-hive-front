import "./LeaveDetailModal.min.css";

import {leaveService} from "../../services/leave/leaveService.js";
import {useApi} from "../../hooks/useApi.js";
import { useDialog } from "../../contexts/modal/DialogContext.jsx";
import LeaveForm from "./LeaveForm.jsx";

import {useEffect, useState} from "react";

export default function LeaveDetailModal({targetIndex, onClose, selectedTab = "all"}) {
    const [leave, setLeave] = useState(null);
    const {run} = useApi();
    const { openDialog } = useDialog();

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
                    requesterTeamName: data.requesterTeamName ?? "",
                    approverId: data.approverId ?? "",
                    approverName: data.approverName ?? "",
                    approverTeamName: data.approverTeamName ?? "",
                    approverRoleName: data.approverRoleName ?? "",
                    approverProfileImg: data.approverProfileImg ?? "",
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

    // 승인/반려 처리
    const handleAction = async (action) => {
        if (!leave) return;
        try {
            await run(() => leaveService.patchAction(leave.index, action));
            const actionText = action === "approve" ? "승인" : "반려";
            openDialog("연차 처리", `${actionText} 처리가 완료되었습니다.`, "success");
            onClose();
            window.location.reload();
        } catch (e) {
            const actionText = action === "approve" ? "승인" : "반려";
            openDialog("연차 처리 실패", `${actionText} 처리 중 오류가 발생했습니다.`, "warning");
        }
    };

    // 승인/반려 상태 확인
    const isApproved = leave?.stateText === "승인";
    const isRejected = leave?.stateText === "반려";
    const approvalStatus = isApproved ? "approved" : isRejected ? "rejected" : "";

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal leave-detail-modal" onClick={(e) => e.stopPropagation()}>
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
                        <LeaveForm
                            mode="view"
                            data={{
                                requesterName: leave.requesterName || "",
                                departmentName: leave.requesterTeamName || "",
                                typeText: leave.typeText || "",
                                startDate: leave.startDate || "",
                                endDate: leave.endDate || "",
                                reason: leave.reason || "",
                                approverName: leave.approverName || "",
                                approverTeamName: leave.approverTeamName || "",
                                approverRoleName: leave.approverRoleName || "",
                                approverProfileImg: leave.approverProfileImg || "",
                            }}
                            approvalStatus={approvalStatus}
                            isModalMode={true}
                        />
                    )}
                </div>

                {selectedTab === "received" && (
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
                )}
            </div>
        </div>
    );
}

