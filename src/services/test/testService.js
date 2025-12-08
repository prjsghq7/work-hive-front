import apiClient from "../common/apiClient.js";


export const testApiInfo={
    api:"/test/requestTest",
    method:"GET",
}

export const loginApi={
    api:"/user/login",
    method:"POST",
}

export const testService={
    test(){
        return apiClient.get("/test/requestTest");
    }
}


