import "../../../assets/Common.min.css"
import {useApi} from "../../../hooks/useApi.js";
import {useEffect} from "react";
import axios from "axios";
import {API_BASE_URL} from "../../../configs/apiConfig.js";
import {Link} from "react-router-dom";

function BoardNotice() {
    const {data, loading, error, run} = useApi();

    // 전체 게시글 조회
    useEffect(() => {
        run(() => axios.get(`${API_BASE_URL}/board/notice`));
    }, [run]);

    const boards = data?.data?.boards ?? [];

    return (
        <div className="board-container">

            {/* 카드 형태 테이블 */}
            <div className="board-card">

                <div className="button-wrapper">
                    <Link to="/board/new" className="-button --blue">
                        NEW
                    </Link>
                </div>

                <table className="board-table">
                    <thead>
                    <tr>
                        <th className="first">번호</th>
                        <th className="col-flex title">제목</th>
                        <th className="last">작성자</th>
                        <th className="last">조회수</th>
                        <th className="last">날짜</th>
                    </tr>
                    </thead>

                    {boards.length > 0 && (
                        <tbody>
                        {boards.map((item) => (
                            <tr key={item.index}>
                                <td>{item.index}</td>
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
            </div>
        </div>
    );
}

export default BoardNotice;