import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useApi } from "../../../hooks/useApi.js";

import "./BoardNew.min.css"; // 페이지 전용 스타일

import axios from "axios";
import { API_BASE_URL } from "../../../configs/apiConfig.js";
import { useAuth } from "../../user/AuthContext.jsx";

import { useDialog } from "../../../contexts/modal/DialogContext.jsx";
import apiClient from "../../../services/common/apiClient.js";

function BoardNew() {
    const navigate = useNavigate();
    const { user } = useAuth();
    const { run, loading, error } = useApi();

    const [type, setType] = useState(1);
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");

    const { openDialogEx} = useDialog();

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            await run(() =>
                axios.post(`${API_BASE_URL}/board/new`, {
                    title,
                    content,
                    type: Number(type),
                    empId: user.empId,
                })
            );

            openDialogEx(
                "등록 완료",
                "게시글이 성공적으로 등록되었습니다.",
                "info",
                {
                    buttons: [
                        {
                            text: "확인",
                            color: "blue",
                            onClick: () => navigate("/board/all"),
                        }
                    ]
                }
            );

        } catch (err) {
            const message = err?.response?.data?.message || "게시글 등록에 실패했습니다.";

            openDialogEx(
                "등록 실패",
                message,
                "warning",
                {
                    buttons: [
                        {
                            text: "확인",
                            color: "red",
                        }
                    ]
                }
            );
        }
    };

    return (
        <div className="input-box height">
            <h2 className="input-title">게시글 작성</h2>

            <form className="input-form" onSubmit={handleSubmit}>
                <div className="input-fields">

                    {/* 카테고리 */}
                    <div className="input-field">
                        <label className="input-label">카테고리</label>
                        <select
                            className="input-select"
                            value={type}
                            onChange={(e) => setType(e.target.value)}
                        >
                            <option value="1">공지사항</option>
                            <option value="2">경조사</option>
                        </select>
                    </div>

                    {/* 제목 */}
                    <div className="input-field">
                        <label className="input-label">제목</label>
                        <input
                            type="text"
                            className="input-input"
                            placeholder="제목을 입력하세요"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            required
                        />
                    </div>

                    {/* 내용 */}
                    <div className="input-field input-field-full">
                        <label className="input-label">내용</label>
                        <textarea
                            className="input-textarea"
                            placeholder="내용을 입력하세요"
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            required
                        />
                    </div>

                    {/* 버튼 */}
                    <div className="input-actions">
                        <button
                            type="button"
                            className="-button --red"
                            onClick={() => navigate("/board/all")}
                        >
                            취소
                        </button>
                        <button
                            type="submit"
                            className="-button --blue"
                            disabled={loading}
                        >
                            {loading ? "작성 중..." : "작성"}
                        </button>
                    </div>

                    {/* 에러 */}
                    {error && (
                        <p className="input-error">
                            저장 중 오류가 발생했습니다.
                        </p>
                    )}
                </div>
            </form>
        </div>
    );
}

export default BoardNew;