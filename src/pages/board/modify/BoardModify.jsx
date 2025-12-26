import {useState, useEffect} from "react";
import {useNavigate, useParams} from "react-router-dom";

import "../../../assets/common/Table.min.css";
import "../../../assets/Common.min.css";
import "./BoardModify.min.css"

import axios from "axios";
import {useApi} from "../../../hooks/useApi";
import {API_BASE_URL} from "../../../configs/apiConfig";

function BoardModify() {
    const navigate = useNavigate();
    const {id} = useParams();

    const {data, run} = useApi();

    const [type, setType] = useState("");
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");

    // 상세 정보 불러오기
    useEffect(() => {
        run(() => axios.get(`${API_BASE_URL}/board/${id}`));
    }, [id, run]);

    // 데이터가 들어오면 input에 자동 세팅
    useEffect(() => {
        if (data?.data?.board) {
            const b = data.data.board;
            console.log(data)

            setType(b.type);
            setTitle(b.title);
            setContent(b.content);
        }
    }, [data]);

    // 저장하기
    const handleModify = async (e) => {
        e.preventDefault();

        await run(() =>
            axios.patch(`${API_BASE_URL}/board/modify/${id}`, {
                title,
                content,
                type,
            })
        );

        alert("게시글이 수정되었습니다!");
        navigate(`/board/detail/${id}`);
    };

    return (
        <form className="filter-box filter-form" onSubmit={handleModify}>
            <div className="filter-fields">

                <div className="filter-field">
                    <label className="filter-input-label">카테고리</label>
                    <select
                        className="filter-select"
                        value={type}
                        onChange={(e) => setType(e.target.value)}
                    >
                        <option value="1">공지사항</option>
                        <option value="2">경조사</option>
                    </select>
                </div>

                <div className="filter-field">
                    <label className="filter-input-label">제목</label>
                    <input
                        type="text"
                        className="filter-input"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                    />
                </div>

                <div className="filter-field" style={{gridColumn: "1 / -1"}}>
                    <label className="filter-input-label">내용</label>
                    <textarea
                        className="filter-input textarea-box"
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                    />
                </div>

            </div>

            <div className="button-wrapper">
                <button type="button" className="-button --white" onClick={() => navigate(-1)}>
                    뒤로가기
                </button>
                <button type="submit" className="-button --blue">수정하기</button>
            </div>
        </form>
    );
}

export default BoardModify;