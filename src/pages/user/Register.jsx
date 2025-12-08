import {useState} from "react";
import {registerService} from "../../services/user/userService.js";
import {useApi} from "../../hooks/useApi.js";


export default function Register() {
    const [id, setId] = useState("");
    const [password, setPassword] = useState("");
    const {run, reset, loading} = useApi();
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            reset();
            const res = await run(() => registerService.register( id, password));
            console.log(res.success);
            alert('회원가입 성공');
        } catch (err) {
            if (err.response) {
                const {message,code}= err.response.data;
                //err.response.data에 있는 message,code를 자동으로 매핑
                console.log("백엔드 응답:", err.response.data);
                console.log(message || `로그인 실패 ${code || "알 수 없는 오류"}`);
            }
        }
    }
    return (
        <>
            <h1>Register</h1>
            <form onSubmit={handleSubmit}>
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
                    {loading ? "회원가입 중" : "회원가입"}
                </button>
            </form>
        </>
    );
}