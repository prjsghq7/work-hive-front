import { useState } from "react";
import { Link } from "react-router-dom";

function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();

        // @RequestParam 대응 → form 방식으로 전송
        const params = new URLSearchParams();
        params.append("email", email);
        params.append("password", password);

        try {
            const res = await fetch("/user/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
                },
                body: params.toString(),
            });

            const text = await res.text();   // 응답 내용을 항상 받아보기

            console.log("status:", res.status);
            console.log("body:", text);

            if (!res.ok) {
                alert("서버 오류");
                return;
            }
            
            alert("로그인 요청 전송 완료");

        } catch (err) {
            console.error(err);
            alert("통신 에러");
        }
    };

    return (
        <div style={{ maxWidth: "320px", margin: "80px auto", textAlign: "center" }}>
            <h1>Login</h1>
            <form
                onSubmit={handleSubmit}
                style={{ display: "flex", flexDirection: "column", gap: "10px", marginTop: "20px" }}
            >
                <input
                    type="email"
                    placeholder="이메일"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
                <input
                    type="password"
                    placeholder="비밀번호"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
                <button type="submit">로그인</button>
            </form>

            <div style={{ marginTop: "20px" }}>
                <Link to="/">⬅ Back to Home</Link>
            </div>
        </div>
    );
}

export default Login;
