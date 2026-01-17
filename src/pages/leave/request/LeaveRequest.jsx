import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useApi } from "../../../hooks/useApi.js";
import { leaveService } from "../../../services/leave/leaveService.js";
import { useAuth } from "../../user/AuthContext.jsx";
import LeaveForm from "../../../components/leave/LeaveForm.jsx";

import "./LeaveRequest.min.css";

function LeaveRequest() {
    const navigate = useNavigate();
    const { run, loading, error } = useApi();
    const { user } = useAuth();

    const [approverId, setApproverId] = useState("");
    const [approverInfo, setApproverInfo] = useState(null); // 승인자 전체 정보
    const [formData, setFormData] = useState({
        type: "",
        reason: "",
        startDate: "",
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
        setValidationError("");
        if (formData.startDate && formData.endDate && !isHalfDay) {
            if (new Date(formData.startDate) > new Date(formData.endDate)) {
                setValidationError("종료일은 시작일보다 이후여야 합니다.");
            }
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
            alert("승인자를 선택해주세요.");
            return;
        }

        if (validationError) {
            alert(validationError);
            return;
        }

        if (!isHalfDay && formData.startDate && formData.endDate && new Date(formData.startDate) > new Date(formData.endDate)) {
            alert("종료일은 시작일보다 이후여야 합니다.");
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
            alert("연차 신청이 완료되었습니다.");
            navigate("/leave/main");
        } catch (err) {
            const errorMessage = err?.response?.data?.message || "연차 신청에 실패했습니다.";
            alert(errorMessage);
        }
    };

    return (
        <div className="leave-paper-wrapper">
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
                onCancel={() => navigate("/leave/main")}
                loading={loading}
                error={error}
                validationError={validationError}
            />
        </div>
    );
}

export default LeaveRequest;