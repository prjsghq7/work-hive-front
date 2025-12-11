import {useReducer} from "react";
import {registerService} from "../../services/user/userService.js";
import {useApi} from "../../hooks/useApi.js";
import RegisterForm from "./RegisterForm.jsx";

const initState = {
    form: {
        name: "",
        email: "",
        password: "",
        phoneNumber: "",
        birth: ""
    },
    errors: {},
}

function registerReducer(state, action) {
    switch (action.type) {
        case "CHANGE_FIELD":
            console.log(state);
            return {
                // ...state,
                form: {
                    ...state.form,
                    [action.name]: action.value,
                },
                errors: {
                    ...state.errors,
                    [action.name]: "",
                }
            }
        case "SET_ERRORS":
            return {
                ...state,
                errors: action.errors,
            };
        case "RESET":
            return initState;
        default:
            return state;
    }
}


export default function Register() {

    const [state, dispatch] = useReducer(registerReducer, initState);
    const {form, errors} = state;
    const {run, reset, loading} = useApi();

    const handleChange = (e) => {
        const {name, value} = e.target;
        dispatch({
            type: "CHANGE_FIELD",
            name,
            value,
        });
    }
    const handleSubmit = async (e) => {
        e.preventDefault();

        const newErrors = {};
        if (!form.name) newErrors.name = "이름을 입력해주세요.";
        if (!form.email) newErrors.email = "이메일을 입력해주세요.";
        if (!form.password) newErrors.password = "비밀번호를 입력해주세요.";
        if (!form.phoneNumber) newErrors.phoneNumber = "전화번호를 입력해주세요.";
        if (!form.birth) newErrors.birth = "생년월일을 입력해주세요.";

        if (Object.keys(newErrors).length > 0) {
            dispatch({type:"SET_ERRORS", errors: newErrors});
            return;
        }

        try {
            reset();
            const res = await run(() => registerService.register(form));
            console.log(res.success);
            alert('회원가입 성공');
            dispatch({type: "RESET"});
        } catch (err) {
            if (err.response) {
                const {message, code} = err.response.data;
                //err.response.data에 있는 message,code를 자동으로 매핑
                console.log("백엔드 응답:", err.response.data);
                console.log(message || `로그인 실패 ${code || "알 수 없는 오류"}`);
            }
        }
    }
    return (
        <>
            <h1>Register</h1>
            <RegisterForm
                form={form}
                loading={loading}
                errors={errors}
                onChange={handleChange}
                onSubmit={handleSubmit}
            />
        </>
    );
}