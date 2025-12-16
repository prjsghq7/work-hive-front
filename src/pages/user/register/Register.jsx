import {useReducer} from "react";
import {userService} from "../../../services/user/userService.js";
import {useApi} from "../../../hooks/useApi.js";
import RegisterForm from "./RegisterForm.jsx";
import {useNavigate} from "react-router-dom";
import "./Register.min.css"

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
                ...state,
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
    const navigate = useNavigate();

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
        if (!form.name) {
            newErrors.name = "이름을 입력해주세요.";
        }
        if (!form.email) {
            newErrors.email = "이메일을 입력해주세요.";
        }
        if (!form.password) {
            newErrors.password = "비밀번호를 입력해주세요.";
        }
        if (!form.phoneNumber) {
            newErrors.phoneNumber = "전화번호를 입력해주세요.";
        }
        if (!form.birth) {
            newErrors.birth = "생년월일을 입력해주세요.";
        }
        if (Object.keys(newErrors).length > 0) {
            dispatch({type: "SET_ERRORS", errors: newErrors});
            return;
        }
        try {
            reset();
            await run(() => userService.register(form));
            navigate("/user/login");
            dispatch({type: "RESET"})
        } catch (err) {
            if (err.response) {
                const {message, code} = err.response.data;
                console.log("code:", code, "message: ", message);

            }
        }

    }
    return (
        <div className="container">
            <h1>회원가입</h1>
            <p className="subtitle">WorkHive 계정을 만들고 서비스를 시작해요.</p>
            <RegisterForm
                form={form}
                loading={loading}
                errors={errors}
                onChange={handleChange}
                onSubmit={handleSubmit}
            />
        </div>
    );
}