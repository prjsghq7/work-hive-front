import "./ScheduleRequestModal.min.css";
import { useState, useEffect } from "react";
import UserSearchModal from "../user/UserSearchModal.jsx";
import { useAuth } from "../../pages/user/AuthContext.jsx";
import { useDialog } from "../../contexts/modal/DialogContext.jsx";

export default function ScheduleRequestModal({ onClose, onSuccess, initialStartDate }) {
    const { user } = useAuth();
    const { openDialog } = useDialog();

    const [formData, setFormData] = useState({
        title: "",
        detail: "",
        start_date: initialStartDate || "",
        end_date: initialStartDate || "",
        state: 1 // 기본값 예정, 상세보기에서 관리자만 변경 가능
    });
    const [participants, setParticipants] = useState([]); // { memberId, name, teamCode, teamName?, isManager }
    const [dateError, setDateError] = useState("");
    const [isUserSearchOpen, setIsUserSearchOpen] = useState(false);

    const currentUserId = String(user?.empId ?? user?.emp_id ?? "");

    // 모달 열릴 때 참여자 목록에 "나" 미리 포함
    useEffect(() => {
        if (!currentUserId) return;
        setParticipants((prev) => {
            const hasMe = prev.some((p) => String(p.memberId) === currentUserId);
            if (hasMe) {
                return prev.map((p) =>
                    String(p.memberId) === currentUserId ? { ...p, name: user?.name || p.name, teamName: user?.teamName ?? p.teamName } : p
                );
            }
            const me = {
                memberId: currentUserId,
                name: user?.name || "나",
                teamCode: user?.teamCode ?? user?.team_code ?? 0,
                teamName: user?.teamName || "",
                isManager: false
            };
            return [me, ...prev];
        });
    }, [currentUserId, user?.name, user?.teamCode, user?.team_code, user?.teamName]);

    // 시작일 변경 시 종료일 검증
    useEffect(() => {
        if (formData.start_date && formData.end_date) {
            if (new Date(formData.start_date) > new Date(formData.end_date)) {
                setDateError("종료일은 시작일보다 이후여야 합니다.");
            } else {
                setDateError("");
            }
        } else {
            setDateError("");
        }
    }, [formData.start_date, formData.end_date]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleAddParticipant = (selectedUser) => {
        const memberId = String(selectedUser.empId ?? selectedUser.index ?? "");
        if (!memberId) return;
        setParticipants((prev) => {
            if (prev.some((p) => String(p.memberId) === memberId)) return prev;
            return [
                ...prev,
                {
                    memberId,
                    name: selectedUser.name || "",
                    teamCode: selectedUser.teamCode ?? selectedUser.team_code ?? 0,
                    teamName: selectedUser.teamName || "",
                    isManager: false
                }
            ];
        });
        setIsUserSearchOpen(false);
    };

    const handleRemoveParticipant = (memberId) => {
        setParticipants((prev) => prev.filter((p) => String(p.memberId) !== String(memberId)));
    };

    const handleToggleManager = (memberId) => {
        setParticipants((prev) =>
            prev.map((p) =>
                String(p.memberId) === String(memberId) ? { ...p, isManager: !p.isManager } : p
            )
        );
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (dateError) {
            openDialog("일정 추가", dateError, "warning");
            return;
        }
        if (new Date(formData.start_date) > new Date(formData.end_date)) {
            openDialog("일정 추가", "종료일은 시작일보다 이후여야 합니다.", "warning");
            return;
        }
        if (!formData.title?.trim()) {
            openDialog("일정 추가", "제목을 입력해주세요.", "warning");
            return;
        }
        if (!formData.detail?.trim()) {
            openDialog("일정 추가", "상세 내용을 입력해주세요.", "warning");
            return;
        }

        const payload = {
            state: formData.state,
            title: formData.title.trim(),
            detail: formData.detail.trim(),
            start_date: formData.start_date,
            end_date: formData.end_date,
            members: participants.map((p) => ({
                member_id: p.memberId,
                user_team_code: p.teamCode,
                is_manager: p.isManager
            }))
        };

        // TODO: 일정 추가 기능 구현 필요
        console.log("ScheduleRequestModal submit", payload);
        onClose();
        if (onSuccess) onSuccess();
    };

    return (
        <>
            <div className="modal-overlay" onClick={onClose}>
                <div className="modal schedule-request-modal" onClick={(e) => e.stopPropagation()}>
                    <div className="modal-header">
                        <h3 className="modal-title">일정 추가</h3>
                        <span className="modal-stretch"></span>
                        <button type="button" className="modal-close" onClick={onClose}>
                            ×
                        </button>
                    </div>

                    <form id="schedule-form-modal" onSubmit={handleSubmit}>
                        <div className="modal-body">
                            <div className="schedule-form-grid">
                                <div className="schedule-form-col">
                                    <div className="schedule-form-row">
                                        <label className="schedule-form-label">제목</label>
                                        <input
                                            type="text"
                                            name="title"
                                            className="schedule-form-input"
                                            value={formData.title}
                                            onChange={handleChange}
                                            placeholder="제목 (최대 25자)"
                                            maxLength={25}
                                        />
                                    </div>
                                    <div className="schedule-form-row">
                                        <label className="schedule-form-label">상세</label>
                                        <textarea
                                            name="detail"
                                            className="schedule-form-textarea"
                                            value={formData.detail}
                                            onChange={handleChange}
                                            placeholder="상세 내용 (최대 255자)"
                                            maxLength={255}
                                            rows={4}
                                        />
                                    </div>
                                    <div className="schedule-form-row schedule-form-row-dates">
                                        <label className="schedule-form-label">기간</label>
                                        <div className="schedule-form-dates">
                                            <input
                                                type="date"
                                                name="start_date"
                                                className="schedule-form-input"
                                                value={formData.start_date}
                                                onChange={handleChange}
                                            />
                                            <span className="schedule-form-date-sep">~</span>
                                            <input
                                                type="date"
                                                name="end_date"
                                                className="schedule-form-input"
                                                value={formData.end_date}
                                                onChange={handleChange}
                                                min={formData.start_date || undefined}
                                            />
                                        </div>
                                        {dateError && <p className="schedule-form-error">{dateError}</p>}
                                    </div>
                                </div>
                                <div className="schedule-form-col">
                                    <div className="schedule-form-row">
                                        <label className="schedule-form-label">참여자</label>
                                        <div className="schedule-form-participants">
                                            <button
                                                type="button"
                                                className="schedule-form-add-participant"
                                                onClick={() => setIsUserSearchOpen(true)}
                                            >
                                                + 참여자 추가
                                            </button>
                                            {participants.length > 0 && (
                                                <ul className="schedule-form-participant-list">
                                                    {participants.map((p) => (
                                                        <li key={p.memberId} className="schedule-form-participant-item">
                                                            <span className="schedule-form-participant-name">
                                                                {p.name || p.memberId}
                                                                {p.teamName && (
                                                                    <span className="schedule-form-participant-team">
                                                                        {" "}({p.teamName})
                                                                    </span>
                                                                )}
                                                            </span>
                                                            <label className="schedule-form-checkbox-label inline">
                                                                <input
                                                                    type="checkbox"
                                                                    checked={!!p.isManager}
                                                                    onChange={() => handleToggleManager(p.memberId)}
                                                                    className="schedule-form-checkbox"
                                                                />
                                                                <span>관리자</span>
                                                            </label>
                                                            {String(p.memberId) !== currentUserId ? (
                                                                <button
                                                                    type="button"
                                                                    className="schedule-form-remove-participant"
                                                                    onClick={() => handleRemoveParticipant(p.memberId)}
                                                                    aria-label="참여자 제거"
                                                                >
                                                                    ×
                                                                </button>
                                                            ) : (
                                                                <span className="schedule-form-participant-spacer" aria-hidden="true" />
                                                            )}
                                                        </li>
                                                    ))}
                                                </ul>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="modal-actions">
                            <button type="button" className="-button --white" onClick={onClose}>
                                취소
                            </button>
                            <button
                                type="submit"
                                className="-button --blue"
                                disabled={!!dateError}
                            >
                                등록
                            </button>
                        </div>
                    </form>
                </div>
            </div>

            <UserSearchModal
                isOpen={isUserSearchOpen}
                onClose={() => setIsUserSearchOpen(false)}
                onSelect={handleAddParticipant}
            />
        </>
    );
}
