import { test } from "../services/test/testService.js";

function Home() {
    const handleTestClick = async () => {
        try {
            const res = await test();
            console.log("test 응답:", res);
            alert("요청 성공 콘솔 확인");
        } catch (err) {
            console.error("test 요청 실패:", err);
            alert("요청 실패");
        }
    };


    return (
        <div style={{ textAlign: 'center', marginTop: '100px' }}>
            <h1>Home Page</h1>
            <p>home first page</p>

            <button onClick={handleTestClick}>
                TEST API 호출
            </button>
        </div>
    );
}

export default Home;