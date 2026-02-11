import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";

import "../../../assets/Common.min.css";
import "../../../assets/common/Input.min.css";
import "./BoardModify.min.css";

import axios from "axios";
import { useApi } from "../../../hooks/useApi";
import { API_BASE_URL } from "../../../configs/apiConfig";

function BoardModify() {
    const navigate = useNavigate();
    const { id } = useParams();
    const { data, run } = useApi();

    const [type, setType] = useState("");
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");

    // 상세 데이터 조회
    useEffect(() => {
        run(() => axios.get(`${API_BASE_URL}/board/detail/${id}`));
    }, [id, run]);

    // 데이터 세팅
    useEffect(() => {
        if (data?.data?.board) {

            // console.log("API raw data:", data);
            const b = data.data.board;
            setType(b.type);
            setTitle(b.title);
            setContent(b.content);
        }
    }, [data]);

    const board = data?.data?.board;

    // 수정 저장
    const handleModify = async (e) => {
        e.preventDefault();

        await run(() =>
            axios.patch(`${API_BASE_URL}/board/modify/${id}`, {
                title,
                content,
                type,
            })
        );

        alert("게시글이 수정되었습니다.");
        navigate(`/board/detail/${id}`);
    };

    return (
        <form className="input-box input-form height" onSubmit={handleModify}>
            <h2 className="input-title">게시글 수정</h2>

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
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="제목을 입력하세요"
                    />
                </div>

                {/* 내용 */}
                <div className="input-field-full">
                    <label className="input-label">내용</label>
                    <textarea
                        className="input-textarea"
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        placeholder="내용을 입력하세요"
                    />
                </div>
            </div>

            {/* 버튼 */}
            <div className="button-wrapper">
                <button
                    type="button"
                    className="-button --white"
                    onClick={() => navigate(-1)}
                >
                    취소
                </button>
                <button type="submit" className="-button --blue">
                    수정하기
                </button>
            </div>
        </form>
    );
}

export default BoardModify;