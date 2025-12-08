import "../../../assets/common/Table.min.css"
import "../../../assets/Common.min.css"
import { Link } from "react-router-dom";
import searchIcon from "../../../assets/images/search.png";

function BoardAll() {
    return (
        <div className="board-container">

            {/* 검색창 */}
            <div className="board-search-box">
                <input type="text" placeholder="Search for..." />
                <button>
                    <img src={searchIcon} alt="검색" />
                </button>
            </div>

            {/* 제목 */}
            <h2 className="board-title">게시판 전체</h2>

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
                        <th className="last">날짜</th>
                    </tr>
                    </thead>

                    <tbody>
                    <tr>
                        <td>1</td>
                        <td className="col-flex"><a href="">1번 내용내용내용내용내용내용내용내용내용내용내용내용</a></td>
                        <td>2025.12.02</td>
                    </tr>
                    <tr>
                        <td>2</td>
                        <td className="col-flex"><a href="">2번 내용내용내용내용내용내용내용내용내용내용내용내용</a></td>
                        <td>2025.12.02</td>
                    </tr>
                    <tr>
                        <td>3</td>
                        <td className="col-flex"><a href="">3번 내용내용내용내용내용내용내용내용내용내용내용내용</a></td>
                        <td>2025.12.02</td>
                    </tr>
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default BoardAll;