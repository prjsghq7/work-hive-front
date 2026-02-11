import "./BoardAll.min.css"

import { Link } from "react-router-dom";
import { useApi } from "../../../hooks/useApi.js";
import { useAuth } from "../../user/AuthContext.jsx";
import apiClient from "../../../services/common/apiClient.js";
import { useEffect, useState } from "react";

function BoardAll() {
    const { data, loading, error, run } = useApi();
    const { user } = useAuth();

    const [page, setPage] = useState(1);

    useEffect(() => {
        run(() => apiClient.get(`/board/all?page=${page}`));
    }, [run, page]);

    const canCreate = user && Number(user.roleCode) <= 5;

    const boards = data?.data?.boards ?? [];
    const totalCount = data?.data?.totalCount ?? 0;

    const totalPages = Math.ceil(totalCount / 10);

    const getTypeName = (type) => {
        if (type === 1) return "공지사항";
        if (type === 2) return "경조사";
        return "기타";
    };

    if (loading) return <div>로딩중...</div>;
    if (error) return <div>에러 발생</div>;

    return (
        <div className="board-container">
            <div className="board-card">

                <div className="button-wrapper">
                    {canCreate && (
                        <Link to="/board/new" className="-button --blue">
                            NEW
                        </Link>
                    )}
                </div>

                <table className="board-table">
                    <thead>
                    <tr>
                        <th>카테고리</th>
                        <th className="col-flex">제목</th>
                        <th>작성자</th>
                        <th>조회수</th>
                        <th>날짜</th>
                    </tr>
                    </thead>

                    {boards.length > 0 && (
                        <tbody>
                        {boards.map((item) => (
                            <tr key={item.index}>
                                <td>{getTypeName(item.type)}</td>
                                <td>
                                    <Link to={`/board/detail/${item.index}`}>
                                        {item.title}
                                    </Link>
                                </td>
                                <td>{item.name}</td>
                                <td>{item.view}</td>
                                <td>{item.createdAt?.split("T")[0]}</td>
                            </tr>
                        ))}
                        </tbody>
                    )}
                </table>

                {boards.length === 0 && (
                    <div className="board-empty">
                        등록된 게시물이 없습니다.
                    </div>
                )}
                <div className="flex-grow"></div>
                {/* ===== 페이지네이션 ===== */}
                {totalPages >= 1 && (
                    <div className="pagination">
                        <button
                            disabled={page === 1}
                            onClick={() => setPage(page - 1)}
                        >
                            이전
                        </button>

                        {Array.from({ length: totalPages }).map((_, i) => {
                            const p = i + 1;
                            return (
                                <button
                                    key={p}
                                    className={page === p ? "active" : ""}
                                    onClick={() => setPage(p)}
                                >
                                    {p}
                                </button>
                            );
                        })}

                        <button
                            disabled={page === totalPages}
                            onClick={() => setPage(page + 1)}
                        >
                            다음
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}

export default BoardAll;