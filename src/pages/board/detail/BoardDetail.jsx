import "../../../assets/common/Table.min.css";
import "../../../assets/Common.min.css";
import "./BoardDetail.min.css"

import axios from "axios";
import {useApi} from "../../../hooks/useApi.js";
import {API_BASE_URL} from "../../../configs/apiConfig.js";

import {useParams, Link, useNavigate} from "react-router-dom";
import {useEffect} from "react";

function BoardDetail() {
    const navigate = useNavigate();
    const { id } = useParams();
    const { data, loading, error, run } = useApi();

    useEffect(() => {
        run(async () => {
            const response = await axios.get(`${API_BASE_URL}/board/${id}`);
            console.log("📌 전체 응답(response):", response);
            console.log("📌 서버 JSON (response.data):", response.data);
            return response;
        });
    }, [id, run]);

    if (loading) return <div>로딩중...</div>;
    if (error) return <div>에러 발생: {error.message}</div>;

    // 진짜 게시글 데이터 꺼내기
    const board = data?.data?.board;

    if (!board) return <div>게시글이 없습니다.</div>;

    const [date, time] = board.createdAt?.split("T") ?? ["", ""];

    const deleteSubmit = async (e) => {
        e.preventDefault();

        await run(() => {
            return axios.patch(`${API_BASE_URL}/board/detail/${id}`)
        });

        alert("게시글이 삭제되었습니다!")
        navigate('/board/all')
    };

    return (
        <div className="board-container">
            <div className="board-card">
                <div className="board-title-box">
                    <h2 className="board-title">{board.title}</h2>
                    <div className="flex-1"></div>
                    <form className="" onSubmit={deleteSubmit}>
                        <button type="submit" className="-button --red">삭제</button>
                    </form>
                </div>


                <div className="detail-info">
                    <span>작성자: {board.empId}</span>
                    <span>조회수: {board.view}</span>
                    <span>작성일: {date} {time}</span>
                </div>

                <div className="detail-content">
                    {board.content}
                </div>

                <div className="button-wrapper">
                    <Link to={`/board/modify/${id}`} className="-button --blue">
                        수정
                    </Link>
                    <Link to="/board/all" className="-button --blue">
                        목록
                    </Link>
                </div>
            </div>
        </div>
    );
}

export default BoardDetail;