import apiClient from "../common/apiClient.js";

//dto로 받을경우 밑의 방식으로 사용
export const loginService = {
    login(id, password) {
        return apiClient.post("/user/login", {id, password});
    }
}
//axios.post(url, data, config) 기본적인 형태
//첫번째 인자: url, 두번쨰 인자: body(JSON,Form등),세번째 인자:추가설정(config)
//@RequestParam을 사용할 경우 body가 필요 없어서 null로 처리하고, axios에서는 params를 사용한다.
//params는 URL 쿼리스트링을 자동으로 만들어준다.
export const registerService = {
    register(id, password) {
        return apiClient.post("/user/register", null, {params: {id, password}});
    }
}
