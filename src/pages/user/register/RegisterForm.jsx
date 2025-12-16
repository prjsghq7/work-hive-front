import React from "react";
import "../../../assets/Common.min.css";
import "./RegisterForm.min.css";

export default function RegisterForm({form, errors, loading, onChange, onSubmit}) {

    const FIELDS = [
        {name: "name", type: "text", placeholder: "이름을 입력해주세요."},
        {name: "email", type: "email", placeholder: "이메일을 입력해주세요."},
        {name: "password", type: "password", placeholder: "비밀번호를 입력해주세요."},
        {name: "phoneNumber", type: "text", placeholder: "전화번호를 입력해주세요."},
        {name: "birth", type: "date", placeholder: "생년월일"},
    ];

    return (
        <form onSubmit={onSubmit} noValidate>
            {FIELDS.map((field) => (
                <div key={field.name} className="input-wrap">
                    <input name={field.name}
                           type={field.type}
                           placeholder={field.placeholder}
                           value={form[field.name]}
                           onChange={onChange}

                    />
                    {/* ?. -> 앞에 값이 없으면 undefined로 처리해라 라는 문법 */}
                    {/* && : 조건부 렌더링이다. && 앞에 조건이고 참일경우 뒤에꺼 반환 */}
                    {errors?.[field.name] && (
                        <p className={`error ${errors?.[field.name] ? "show" : "error"}`}>
                            {errors[field.name]}
                        </p>
                    )}
                </div>
            ))}
            <button type="submit" disabled={loading}>
                {loading ? "회원가입 중..." : "회원가입"}
            </button>
        </form>

    );
}