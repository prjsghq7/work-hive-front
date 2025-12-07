import "../../../assets/common/Table.min.css"
import "../../../assets/Common.min.css"

function BoardAll() {
    return (
        <div className="board-container">

            {/* 검색창 */}
            <div className="board-search-box">
                <input type="text" placeholder="Search for..." />
                <button>🔍</button>
            </div>

            {/* 제목 */}
            <h2 className="board-title">게시판</h2>

            {/* 카드 형태 테이블 */}
            <div className="board-card">
                <h2 className="board-card-title">전체</h2>

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