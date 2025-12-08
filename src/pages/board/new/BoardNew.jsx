import { useState } from "react";
import "../../../assets/common/Table.min.css";
import "../../../assets/Common.min.css"

function BoardNew() {
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log("제출 데이터:", { title, content });

        // TODO: spring backend로 POST 요청 보내기
        // axios.post("/api/board", { title, content })
    };

    return (
        <div className="board-container">
            <h2 className="board-title">게시글 작성</h2>

            <div className="board-card">
                <form onSubmit={handleSubmit}>
                    <div className="form-item">
                        <label>제목</label>
                        <input
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            required
                        />
                    </div>

                    <div className="form-item">
                        <label>내용</label>
                        <textarea
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            required
                        />
                    </div>

                    <button type="submit" className="btn-primary">
                        등록하기
                    </button>
                </form>
            </div>
        </div>
    );
}

export default BoardNew;