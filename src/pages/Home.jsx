import "./Home.min.css";
import {useApi} from "../hooks/useApi.js";
import { testService} from "../services/test/testService.js";
function Home() {
    // const {data,error,loading,callApi,reset} = useApi();
    const {data,error,loading,run,reset} = useApi();
    const handleTestClick = async () => {
        try {
            reset();
            const res = await run(() => testService.test());
            // const res = await callApi(testApiInfo.api, testApiInfo.method);
            console.log("test 응답:", res);
            alert("요청 성공 콘솔 확인");
        } catch (err) {
            console.error("test 요청 실패:", err);
            alert("요청 실패");
        }
    };


    return (
        <div style={{textAlign: 'center', marginTop: '100px'}}>
            <h1>Home Page</h1>
            <p>home first page</p>

            <button onClick={handleTestClick} disabled={loading}>
                {loading ? "요청중 ..." : "Test api 호출"}
            </button>
            {error && <p style={{ color: "red" }}>에러 발생: {error.message}</p>}
            {data && <p>응답 데이터: {JSON.stringify(data)}</p>}
        </div>
    );
}

export default Home;