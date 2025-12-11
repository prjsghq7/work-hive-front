import {useState} from "react";
import {Link} from "react-router-dom";
import "./Login.min.css";

import {useApi} from "../../hooks/useApi.js";
import {loginService} from "../../services/user/userService.js";

function Login() {
    const [id, setId] = useState("");
    const [password, setPassword] = useState("");
    const {run, reset, loading} = useApi();
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            reset();
            const res = await run(() => loginService.login(id, password));
            //
            console.log("test응답: ", res);
            if (res.success) {
                alert('로그인성공');
                const {id, accessToken} = res.data;
                localStorage.setItem("accessToken"
                    , accessToken);
                localStorage.setItem("empId", id);
                console.log(res.data.id);
            }
        } catch (err) {
            if (err.response) {
                const {message, code} = err.response.data;
                console.log("백엔드 응답:", err.response.data);
                console.log(message || `로그인 실패 ${code || "알 수 없는 오류"}`);
            } else {
                alert("네트워크 오류 또는 알 수 없는 오류가 발생했습니다.");
            }
        }
    };

    return (
        <div style={{maxWidth: "320px", margin: "80px auto", textAlign: "center"}}>
            <h1>Login</h1>
            <form
                onSubmit={handleSubmit}
                style={{display: "flex", flexDirection: "column", gap: "10px", marginTop: "20px"}}
            >
                <input
                    type="text"
                    placeholder="이메일"
                    value={id}
                    onChange={(e) => setId(e.target.value)}
                />
                <input
                    type="password"
                    placeholder="비밀번호"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
                <button type="submit" disabled={loading}>
                    {loading ? "로그인 중" : "로그인"}
                </button>
            </form>

            <div style={{marginTop: "20px"}}>
                <Link to="/">⬅ Back to Home</Link>
            </div>
        </div>
    );
}

export default Login;
