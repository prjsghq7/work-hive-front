import { useState, useEffect } from "react";
import UserSearchModal from "../user/UserSearchModal.jsx";
import "./LeaveForm.min.css";

/**
 * 연차 보고서 폼 컴포넌트 (공통)
 * @param {Object} props
 * @param {string} props.mode - 'edit' (편집 모드) 또는 'view' (읽기 전용 모드)
 * @param {Object} props.data - 연차 데이터
 * @param {Object} props.approverInfo - 승인자 정보 (edit 모드)
 * @param {Object} props.approvalStatus - 승인 상태 ('approved' | 'rejected' | '') (view 모드)
 * @param {Function} props.onApproverSelect - 승인자 선택 핸들러 (edit 모드)
 * @param {Function} props.onChange - 폼 데이터 변경 핸들러 (edit 모드)
 * @param {Function} props.onSubmit - 폼 제출 핸들러 (edit 모드)
 * @param {Function} props.onCancel - 취소 핸들러 (edit 모드)
 * @param {boolean} props.loading - 로딩 상태 (edit 모드)
 * @param {string} props.error - 에러 메시지 (edit 모드)
 * @param {string} props.validationError - 유효성 검사 에러 (edit 모드)
 * @param {boolean} props.isModalMode - 모달 모드 여부 (스타일링용)
 * @param {boolean} props.hideFooter - 하단 버튼 숨김 여부 (모달에서 modal-actions 사용 시)
 */
export default function LeaveForm({
    mode = "edit",
    data = {},
    approverInfo = null,
    approvalStatus = "",
    onApproverSelect,
    onChange,
    onSubmit,
    onCancel,
    loading = false,
    error = null,
    validationError = "",
    isModalMode = false,
    hideFooter = false,
}) {
    const isEditMode = mode === "edit";
    const isViewMode = mode === "view";

    // Edit 모드용 state
    const [isApproverModalOpen, setIsApproverModalOpen] = useState(false);

    // 데이터 추출
    const {
        requesterName = "",
        departmentName = "",
        type = "",
        typeText = "",
        startDate = "",
        endDate = "",
        reason = "",
    } = data;

    // 반차인지 확인
    const isHalfDay = type === "2" || type === "3";

    // 날짜 포맷팅 함수 (view 모드용)
    const formatDate = (dateString) => {
        if (!dateString) return "-";
        try {
            return new Date(dateString).toLocaleDateString("ko-KR");
        } catch {
            return dateString;
        }
    };

    // 승인/반려 상태 확인
    const isApproved = approvalStatus === "approved";
    const isRejected = approvalStatus === "rejected";

    // 승인자 선택 핸들러
    const handleSelectApprover = (user) => {
        if (onApproverSelect) {
            onApproverSelect(user);
        }
        setIsApproverModalOpen(false);
    };

    // 승인자 모달 열기
    const handleOpenApproverModal = () => {
        if (isEditMode) {
            setIsApproverModalOpen(true);
        }
    };

    // 승인자 모달 닫기
    const handleCloseApproverModal = () => {
        setIsApproverModalOpen(false);
    };

    // 폼 제출 핸들러
    const handleSubmit = (e) => {
        e.preventDefault();
        if (onSubmit) {
            onSubmit(e);
        }
    };

    // 반차 선택 시 종료일을 시작일과 동일하게 설정 (edit 모드)
    useEffect(() => {
        if (isEditMode && isHalfDay && startDate && onChange) {
            onChange({ target: { name: "endDate", value: startDate } });
        }
    }, [isHalfDay, startDate, isEditMode, onChange]);

    const content = (
        <div className={`leave-paper ${isModalMode ? "modal-mode" : ""}`}>
                {/* 제목 + 승인자 */}
                <div className="title-approval-header">
                    <h2 className="paper-title">연차 보고서</h2>
                    <div className="approval-section">
                        <div className="approval-box">
                            <div className="approval-title">승인자</div>
                            <div className={`approval-stamp-box ${approvalStatus}`}>
                                {isViewMode && isApproved && (
                                    <div className="approval-badge approved">
                                        <span className="approval-text">승인</span>
                                    </div>
                                )}
                                {isViewMode && isRejected && (
                                    <div className="approval-badge rejected">
                                        <span className="approval-text">반려</span>
                                    </div>
                                )}
                            </div>
                            {isEditMode ? (
                                <button
                                    className={`approval-button ${approverInfo ? "has-approver" : ""}`}
                                    type="button"
                                    onClick={handleOpenApproverModal}
                                >
                                    {approverInfo ? (
                                        <div className="approval-profile-section">
                                            <div className="approval-profile-img-wrapper">
                                                {approverInfo.profileImg ? (
                                                    <img
                                                        src={approverInfo.profileImg}
                                                        alt="프로필"
                                                        className="approval-profile-img"
                                                        onError={(e) => {
                                                            e.target.src =
                                                                'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 40 40"%3E%3Ccircle cx="20" cy="20" r="20" fill="%23e5e7eb"/%3E%3Ctext x="20" y="25" font-size="16" fill="%239ca3af" text-anchor="middle"%3E%3F%3C/text%3E%3C/svg%3E';
                                                        }}
                                                    />
                                                ) : (
                                                    <div className="approval-profile-placeholder">
                                                        <svg
                                                            width="40"
                                                            height="40"
                                                            viewBox="0 0 40 40"
                                                            fill="none"
                                                            xmlns="http://www.w3.org/2000/svg"
                                                        >
                                                            <circle cx="20" cy="20" r="20" fill="#e5e7eb" />
                                                            <path
                                                                d="M20 18C22.2091 18 24 16.2091 24 14C24 11.7909 22.2091 10 20 10C17.7909 10 16 11.7909 16 14C16 16.2091 17.7909 18 20 18Z"
                                                                fill="#9ca3af"
                                                            />
                                                            <path
                                                                d="M20 20C15.5817 20 12 22.5817 12 27V30H28V27C28 22.5817 24.4183 20 20 20Z"
                                                                fill="#9ca3af"
                                                            />
                                                        </svg>
                                                    </div>
                                                )}
                                            </div>
                                            <div className="approval-info-text">
                                                <div className="approval-name-row">
                                                    <div className="approval-name">{approverInfo.name}</div>
                                                    {approverInfo.roleName && (
                                                        <span className="approval-role">{approverInfo.roleName}</span>
                                                    )}
                                                </div>
                                                {approverInfo.teamName && (
                                                    <div className="approval-team">{approverInfo.teamName}</div>
                                                )}
                                            </div>
                                        </div>
                                    ) : (
                                        <span className="approval-select-text">승인자 선택</span>
                                    )}
                                </button>
                            ) : (
                                <div className={`approval-button ${data.approverName ? "has-approver" : ""}`}>
                                    {data.approverName ? (
                                        <div className="approval-profile-section">
                                            <div className="approval-profile-img-wrapper">
                                                {data.approverProfileImg ? (
                                                    <img
                                                        src={data.approverProfileImg}
                                                        alt="프로필"
                                                        className="approval-profile-img"
                                                        onError={(e) => {
                                                            e.target.src =
                                                                'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 40 40"%3E%3Ccircle cx="20" cy="20" r="20" fill="%23e5e7eb"/%3E%3Ctext x="20" y="25" font-size="16" fill="%239ca3af" text-anchor="middle"%3E%3F%3C/text%3E%3C/svg%3E';
                                                        }}
                                                    />
                                                ) : (
                                                    <div className="approval-profile-placeholder">
                                                        <svg
                                                            width="40"
                                                            height="40"
                                                            viewBox="0 0 40 40"
                                                            fill="none"
                                                            xmlns="http://www.w3.org/2000/svg"
                                                        >
                                                            <circle cx="20" cy="20" r="20" fill="#e5e7eb" />
                                                            <path
                                                                d="M20 18C22.2091 18 24 16.2091 24 14C24 11.7909 22.2091 10 20 10C17.7909 10 16 11.7909 16 14C16 16.2091 17.7909 18 20 18Z"
                                                                fill="#9ca3af"
                                                            />
                                                            <path
                                                                d="M20 20C15.5817 20 12 22.5817 12 27V30H28V27C28 22.5817 24.4183 20 20 20Z"
                                                                fill="#9ca3af"
                                                            />
                                                        </svg>
                                                    </div>
                                                )}
                                            </div>
                                            <div className="approval-info-text">
                                                <div className="approval-name-row">
                                                    <div className="approval-name">{data.approverName}</div>
                                                    {data.approverRoleName && (
                                                        <span className="approval-role">{data.approverRoleName}</span>
                                                    )}
                                                </div>
                                                {data.approverTeamName && (
                                                    <div className="approval-team">{data.approverTeamName}</div>
                                                )}
                                            </div>
                                        </div>
                                    ) : (
                                        <span className="approval-select-text">-</span>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* ================= 요청자 부서 ================= */}
                <div className="paper-row with-top-border flex-row">
                    <div className="inline-field">
                        <span className="inline-label">요청자</span>
                        <input
                            className="paper-input readonly"
                            value={requesterName}
                            readOnly
                        />
                    </div>

                    <div className="inline-field">
                        <span className="inline-label">부서</span>
                        <input
                            className="paper-input readonly"
                            value={departmentName}
                            readOnly
                        />
                    </div>
                </div>

                {/* ================= 연차 (연차 종류 + 연차 기간) ================= */}
                <div className="paper-row">
                    <div className="paper-label">연차</div>
                    <div className="paper-value leave-type-date-range">
                        <div className="leave-type-select">
                            {isEditMode ? (
                                <select
                                    className="paper-select"
                                    name="type"
                                    value={type}
                                    onChange={onChange}
                                    required
                                >
                                    <option value="">선택</option>
                                    <option value="1">연차</option>
                                    <option value="2">오전 반차</option>
                                    <option value="3">오후 반차</option>
                                    <option value="4">병가</option>
                                </select>
                            ) : (
                                <input
                                    className="paper-input readonly"
                                    value={typeText || "-"}
                                    readOnly
                                />
                            )}
                        </div>
                        <div className="date-range">
                            {isEditMode ? (
                                <>
                                    <input
                                        className="paper-input"
                                        type="date"
                                        name="startDate"
                                        value={startDate}
                                        onChange={onChange}
                                        min={new Date().toISOString().split("T")[0]}
                                        required
                                    />
                                    <span className={`date-separator ${isHalfDay ? "hidden" : ""}`}>~</span>
                                    <input
                                        className="paper-input"
                                        type="date"
                                        name="endDate"
                                        value={endDate}
                                        onChange={onChange}
                                        min={startDate || new Date().toISOString().split("T")[0]}
                                        required
                                        style={isHalfDay ? { display: "none" } : {}}
                                    />
                                </>
                            ) : (
                                <>
                                    <input
                                        className="paper-input readonly"
                                        type="text"
                                        value={formatDate(startDate)}
                                        readOnly
                                    />
                                    {startDate && endDate && startDate !== endDate && (
                                        <>
                                            <span className="date-separator">~</span>
                                            <input
                                                className="paper-input readonly"
                                                type="text"
                                                value={formatDate(endDate)}
                                                readOnly
                                            />
                                        </>
                                    )}
                                </>
                            )}
                        </div>
                    </div>
                </div>

                {/* ================= 사유 ================= */}
                <div className="paper-row">
                    <div className="paper-label">사유</div>
                    <div className="paper-value">
                        {isEditMode ? (
                            <textarea
                                className="paper-textarea"
                                name="reason"
                                value={reason}
                                onChange={onChange}
                                placeholder="연차 신청 사유를 입력하세요"
                            />
                        ) : (
                            <textarea
                                className="paper-textarea readonly"
                                value={reason || ""}
                                readOnly
                            />
                        )}
                    </div>
                </div>

                {/* 에러 메시지 (edit 모드) */}
                {isEditMode && (error || validationError) && (
                    <p className="error-text">
                        {validationError || error?.response?.data?.message || "에러가 발생했습니다."}
                    </p>
                )}

                {/* 폼 푸터 (edit 모드) */}
                {isEditMode && !hideFooter && (
                    <div className="paper-footer">
                        <button
                            className="submit-button"
                            type="submit"
                            disabled={loading || !!validationError}
                        >
                            {loading ? "요청 중..." : "신청"}
                        </button>
                        <button
                            className="cancel-button"
                            type="button"
                            onClick={onCancel}
                            disabled={loading}
                        >
                            취소
                        </button>
                    </div>
                )}
        </div>
    );

    // Edit 모드일 때는 form으로 감싸기
    if (isEditMode) {
        return (
            <>
                <form id={hideFooter ? "leave-form-modal" : undefined} onSubmit={handleSubmit}>
                    {content}
                </form>
                {/* 승인자 검색 모달 */}
                <UserSearchModal
                    isOpen={isApproverModalOpen}
                    onClose={handleCloseApproverModal}
                    onSelect={handleSelectApprover}
                />
            </>
        );
    }

    // View 모드일 때는 그냥 반환
    return content;
}

