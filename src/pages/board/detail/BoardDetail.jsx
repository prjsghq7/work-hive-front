import "../../../assets/common/Table.min.css";
import "../../../assets/Common.min.css";
import "./BoardDetail.min.css"

import axios from "axios";
import { useApi } from "../../../hooks/useApi.js";
import { API_BASE_URL } from "../../../configs/apiConfig.js";

import { useParams, Link } from "react-router-dom";
import { useEffect } from "react";

function BoardDetail() {
    const { id } = useParams();
    const { data, loading, error, run } = useApi();

    // 상세 조회 API 호출
    useEffect(() => {
        run(() => axios.get(`${API_BASE_URL}/boards/${id}`));
    }, [id, run]);

    if (loading) return <div>로딩중...</div>;
    if (error) return <div>에러 발생: {error.message}</div>;
    if (!data) return null;

    return (
        <div className="board-container">

            <div className="board-card">
                <h2 className="board-title">{data.title}</h2>

                <div className="detail-info">
                    <span>작성자: {data.empId}</span>
                    <span>조회수: {data.view}</span>
                    <span>작성일: {data.createdAt}</span>
                </div>

                <div className="detail-content">
                    {data.content}
                </div>

                <div className="detail-actions">
                    <Link to="/board/all" className="btn-primary">
                        목록으로
                    </Link>
                </div>
            </div>

        </div>
    );
}

export default BoardDetail;