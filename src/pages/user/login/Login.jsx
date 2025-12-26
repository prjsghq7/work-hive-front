import { useState } from "react";
import { useNavigate,Link } from "react-router-dom";

import { useAuth } from "../AuthContext.jsx";
import "../../../assets/Common.min.css";
import "./Login.min.css";

import { useApi } from "../../../hooks/useApi.js";
import { loginService } from "../../../services/user/userService.js";

function Login() {
    const [empId, setEmpId] = useState("");
    const [password, setPassword] = useState("");

    const navigate = useNavigate();
    const { getMyInfo } = useAuth();
    const { run, reset, loading } = useApi();

    const handleSubmit = async (e) => {
        e.preventDefault();

        // 간단한 프론트 유효성
        if (!empId || !password) {
            alert("사번과 비밀번호를 입력해주세요.");
            return;
        }

        try {
            reset();

            // 백엔드가 emp_id를 받는 구조면 여기 키도 맞춰주는 게 안전함
            const res = await run(() => loginService.login(empId, password));

            if (res?.success) {
                // res.data = { emp_id, accessToken } 형태라고 가정
                await getMyInfo(res.data);
                navigate("/", { replace: true });
                return;
            }

            // success가 false로 오는 케이스(서버가 그런 규격이면)
            alert(res?.message || "로그인에 실패했습니다.");
        } catch (err) {
            if (err.response?.data) {
                const { message, code } = err.response.data;
                alert(message || `로그인 실패: ${code || "UNKNOWN"}`);
            } else {
                alert("네트워크 오류 또는 알 수 없는 오류가 발생했습니다.");
            }
        }
    };

    return (
        <div className="container">
            <h1>WorkHive</h1>
            <p className="subtitle">사번으로 로그인해 WorkHive에 접속하세요.</p>
            <form onSubmit={handleSubmit}>
                <div className="form-box">
                    <div className="input-wrap">
                        <input
                            type="text"
                            placeholder="사번"
                            value={empId}
                            onChange={(e) => setEmpId(e.target.value)}
                            autoComplete="username"
                        />
                    </div>

                    <div className="input-wrap">
                        <input
                            type="password"
                            placeholder="비밀번호"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            autoComplete="current-password"
                        />
                    </div>
                </div>
                <Link to="/user/register" className="register-link">
                    회원가입
                </Link>
                <button className="-object-button --blue" type="submit" disabled={loading}>
                    {loading ? "로그인 중" : "로그인"}
                </button>
            </form>
        </div>
    );
}

export default Login;