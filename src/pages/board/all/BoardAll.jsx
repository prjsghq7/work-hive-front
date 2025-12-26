import "../../../assets/Common.min.css"

import {Link} from "react-router-dom";
import searchIcon from "../../../assets/images/search.png";
import {useApi} from "../../../hooks/useApi.js";
import {API_BASE_URL} from "../../../configs/apiConfig.js";
import axios from "axios";
import {useEffect} from "react";

function BoardAll() {
    const {data, loading, error, run} = useApi();

    // 전체 게시글 조회
    useEffect(() => {
        run(() => axios.get(`${API_BASE_URL}/board/all`));
    }, [run]);

    return (
        <div className="board-container">

            {/*/!* 검색창 *!/*/}
            {/*<div className="board-search-box">*/}
            {/*    <input type="text" placeholder="Search for..."/>*/}
            {/*    <button>*/}
            {/*        <img src={searchIcon} alt="검색"/>*/}
            {/*    </button>*/}
            {/*</div>*/}

            {/* 카드 형태 테이블 */}
            <div className="board-card">

                <div className="board-header">
                    <h2 className="board-card-title"></h2>

                    <Link to="/board/new" className="btn-primary">
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

                    <tbody>
                    {data?.data?.boards?.map((item) => (
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
                </table>
            </div>
        </div>
    );
}

export default BoardAll;