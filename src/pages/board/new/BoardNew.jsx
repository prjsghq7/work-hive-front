import { useState } from "react";
import { useNavigate } from "react-router-dom";

import "../../../assets/common/Table.min.css";
import "../../../assets/Common.min.css";
import "./BoardNew.min.css";

import { useApi } from "../../../hooks/useApi.js";
import axios from "axios";
import {API_BASE_URL} from "../../../configs/apiConfig.js"; // axios import 필요함

function BoardNew() {
    const navigate = useNavigate();
    const { run, loading, error } = useApi();

    // 입력값 상태
    const [type, setType] = useState(1);        // 공지사항 기본값
    const [title, setTitle] = useState("");     // 제목
    const [content, setContent] = useState(""); // 내용

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            await run(() =>
                axios.post(`${API_BASE_URL}/boards`, {
                    title,
                    content,
                    type: Number(type),
                    empId: 1
                })
            );

            alert("게시글이 등록되었습니다!");
            navigate("/board/all"); // 목록으로 이동
        } catch (error) {
            console.error(error);
            alert("게시글 등록 실패");
        }
    };

    return (
        <div className="board-container">
            <h2 className="board-title">게시글 작성</h2>

            <form className="board-card" onSubmit={handleSubmit}>

                {/* 카테고리 선택 */}
                <label>카테고리</label>
                <select value={type} onChange={(e) => setType(e.target.value)}>
                    <option value="1">공지사항</option>
                    <option value="2">경조사</option>
                </select>

                {/* 제목 */}
                <label>제목</label>
                <input
                    type="text"
                    className="input"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                />

                {/* 내용 */}
                <label>내용</label>
                <textarea
                    className="textarea"
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    required
                />

                <button type="submit" className="btn-primary">
                    저장
                </button>
            </form>
        </div>
    );
}

export default BoardNew;