import {API_BASE_URL} from "./apiConfig.js";

export function call(api, method, request) {
    let headers = new Headers({
        "Content-Type": "application/json",
    });

    //토큰을 localstorage에서 가지고 오기
    const accessToken = localStorage.getItem("accessToken");

    //토큰이 있을 경우 Authorization 헤더에 추가
    if(accessToken && accessToken!==null) {
        headers.append("Authorization", "Bearer "+accessToken);
    }

    let options = {
        headers: headers,
        url: API_BASE_URL + api,
        method: method,
    }

    if(request) {
        options.body = JSON.stringify(request);
    }

    //fetch는 낫배드
    return fetch(options.url,options)
        .then((res)=>{
            if(res.status === 200){
                return res.json();
            }
            else if(res.status === 404){
                console.log("404 not found");
            }
            else{
                new Error(res);
            }
        })
        .catch((err)=>{
            console.log("http error");
            console.log(err);
        });

}


