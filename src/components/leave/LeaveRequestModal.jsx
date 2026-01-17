import "./LeaveRequestModal.min.css";

import { useState, useEffect } from "react";
import { useApi } from "../../hooks/useApi.js";
import { leaveService } from "../../services/leave/leaveService.js";
import { useAuth } from "../../pages/user/AuthContext.jsx";
import { useDialog } from "../../contexts/modal/DialogContext.jsx";
import LeaveForm from "./LeaveForm.jsx";

export default function LeaveRequestModal({ onClose, onSuccess, initialStartDate }) {
    const { run, loading, error } = useApi();
    const { user } = useAuth();
    const { openDialog } = useDialog();

    const [approverId, setApproverId] = useState("");
    const [approverInfo, setApproverInfo] = useState(null); // 승인자 전체 정보
    const [formData, setFormData] = useState({
        type: "",
        reason: "",
        startDate: initialStartDate || "",
        endDate: "",
    });
    const [validationError, setValidationError] = useState("");

    // 사용자 정보
    const requesterName = user?.name || "사용자";
    const departmentName = user?.teamName || "부서";

    // 반차인지 확인
    const isHalfDay = formData.type === "2" || formData.type === "3";

    // 날짜 유효성 검사
    useEffect(() => {
        if (formData.startDate && formData.endDate && !isHalfDay) {
            if (new Date(formData.startDate) > new Date(formData.endDate)) {
                setValidationError("종료일은 시작일보다 이후여야 합니다.");
            } else {
                setValidationError("");
            }
        } else {
            setValidationError("");
        }
    }, [formData.startDate, formData.endDate, isHalfDay]);

    // 승인자 선택 함수
    const handleSelectApprover = (user) => {
        // empId가 있으면 empId를, 없으면 index를 사용 (empId는 숫자일 수 있으므로 String으로 변환)
        setApproverId(String(user.empId || user.index));
        setApproverInfo({
            name: user.name || "",
            teamName: user.teamName || "",
            roleName: user.roleName || "",
            profileImg: user.profileImg || user.imageUrl || "",
        });
    };

    // 폼 데이터 변경 핸들러
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    // 폼 제출 핸들러
    const handleSubmit = async (e) => {
        e.preventDefault();

        // 유효성 검사
        if (!approverId) {
            openDialog("연차 신청", "승인자를 선택해주세요.", "warning");
            return;
        }

        if (validationError) {
            openDialog("연차 신청", validationError, "warning");
            return;
        }

        if (!isHalfDay && formData.startDate && formData.endDate && new Date(formData.startDate) > new Date(formData.endDate)) {
            openDialog("연차 신청", "종료일은 시작일보다 이후여야 합니다.", "warning");
            return;
        }

        const requestData = {
            approverId,
            type: formData.type,
            reason: formData.reason,
            startDate: formData.startDate,
            endDate: isHalfDay ? formData.startDate : formData.endDate,
        };

        try {
            await run(() => leaveService.request(requestData));
            openDialog("연차 신청", "연차 신청이 완료되었습니다.", "success");
            onClose();
            if (onSuccess) {
                onSuccess();
            }
        } catch (err) {
            const errorMessage = err?.response?.data?.message || "연차 신청에 실패했습니다.";
            openDialog("연차 신청 실패", errorMessage, "warning");
        }
    };

    // 취소 핸들러
    const handleCancel = () => {
        onClose();
    };

    return (
        <div className="modal-overlay" onClick={handleCancel}>
            <div className="modal leave-request-modal" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                    <h3 className="modal-title">연차 신청</h3>
                    <span className="modal-stretch"></span>
                    <button type="button" className="modal-close" onClick={handleCancel}>
                        ×
                    </button>
                </div>

                <div className="modal-body">
                    <LeaveForm
                        mode="edit"
                        data={{
                            requesterName,
                            departmentName,
                            ...formData,
                        }}
                        approverInfo={approverInfo}
                        onApproverSelect={handleSelectApprover}
                        onChange={handleChange}
                        onSubmit={handleSubmit}
                        onCancel={handleCancel}
                        loading={loading}
                        error={error}
                        validationError={validationError}
                        isModalMode={true}
                        hideFooter={true}
                    />
                </div>

                <div className="modal-actions">
                    <button
                        type="button"
                        className="-button --white"
                        onClick={handleCancel}
                        disabled={loading}
                    >
                        취소
                    </button>
                    <button
                        type="submit"
                        form="leave-form-modal"
                        className="-button --blue"
                        disabled={loading || !!validationError}
                    >
                        {loading ? "요청 중..." : "신청"}
                    </button>
                </div>
            </div>
        </div>
    );
}
