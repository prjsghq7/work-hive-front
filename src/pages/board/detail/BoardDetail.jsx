import "../../../assets/common/Table.min.css";
import "../../../assets/Common.min.css";
import "./BoardDetail.min.css";

import { useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";

import { useApi } from "../../../hooks/useApi.js";
import { useAuth } from "../../user/AuthContext.jsx";
import { useDialog } from "../../../contexts/modal/DialogContext.jsx";

import apiClient from "../../../services/common/apiClient.js";

function BoardDetail() {
    const navigate = useNavigate();
    const { id } = useParams();

    const { data, loading, error, run } = useApi();
    const { user } = useAuth();
    const { openDialogEx } = useDialog();

    useEffect(() => {
        run(() => apiClient.get(`/board/detail/${id}`));
        console.log(board)
    }, [id, run]);

    if (loading) return <div>로딩중...</div>;
    if (error) return <div>에러 발생: {error.message}</div>;

    const board = data?.data?.board;

    if (!board) return <div>게시글이 없습니다.</div>;

    const [date, time] = board.createdAt?.split("T") ?? ["", ""];
    const isOwner = user && Number(board.empId) === Number(user.empId);

    const deleteBoard = async () => {
        await run(() =>
            apiClient.patch(`/board/detail/${id}`)
        );

        openDialogEx(
            "삭제 완료",
            "게시글이 삭제되었습니다.",
            "info",
            {
                buttons: [
                    {
                        text: "확인",
                        color: "blue",
                        onClick: () => {
                            navigate("/board/all");
                        }
                    }
                ]
            }
        );
    };

    const handleDeleteClick = () => {
        openDialogEx(
            "게시글 삭제",
            "정말 이 게시글을 삭제하시겠습니까?",
            "warning",
            {
                buttons: [
                    {
                        text: "취소",
                        color: "white",
                    },
                    {
                        text: "삭제",
                        color: "red",
                        onClick: deleteBoard,
                    }
                ]
            }
        );
    };

    const handleModifyClick = () => {
        openDialogEx(
            "게시글 수정",
            "게시글을 수정하시겠습니까?",
            "info",
            {
                buttons: [
                    {
                        text: "취소",
                        color: "white",
                    },
                    {
                        text: "수정",
                        color: "blue",
                        onClick: () => {
                            navigate(`/board/modify/${id}`);
                        }
                    }
                ]
            }
        );
    };

    return (
        <div className="board-container">
            <div className="board-card">

                <div className="board-title-box">
                    <h2 className="board-title">{board.title}</h2>
                    <div className="flex-1"></div>
                    <Link to="/board/all" className="-button --blue">
                        목록
                    </Link>
                </div>

                <div className="detail-info">
                    <p><span className="board-text">작성자</span> : {board.name}</p>
                    <p><span className="board-text">조회수</span> : {board.view}</p>
                    <p><span className="board-text">작성일</span> : {date} {time}</p>
                </div>

                <div className="detail-content">
                    {board.content}
                </div>

                <div className="button-wrapper">
                    {isOwner && (
                        <button
                            type="button"
                            className="-button --red"
                            onClick={handleDeleteClick}
                        >
                            삭제
                        </button>
                    )}

                    {isOwner && (
                        <button
                            type="button"
                            className="-button --blue"
                            onClick={handleModifyClick}
                        >
                            수정
                        </button>
                    )}
                </div>

            </div>
        </div>
    );
}

export default BoardDetail;