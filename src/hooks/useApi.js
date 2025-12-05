import {useState,useCallback} from "react";
import {API_BASE_URL} from "../configs/apiConfig.js";
import axios from "axios";

export function useApi(){
    const [data, setData] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);

    const callApi = useCallback(
        async (api, method="GET", request= null)=>{
            setLoading(true);
            setError(null);
            try{
                const accessToken = localStorage.getItem("accessToken");
                const config = {
                    method :method,
                    url:API_BASE_URL+api,
                    headers:{
                        "Content-Type": "application/json",
                        ...(accessToken&&{Authorization:`Bearer ${accessToken}`}),
                    },
                };

                if(request){
                    config.data = JSON.stringify(request);
                }

                const response = await axios(config);

                alert("요청 완료");
                setData(response.data);
                return response.data;
            }catch(err){
                console.log("Http error");
                console.log(err);

                if(err.response) {
                    console.log("Status:", err.response.status);
                    console.log("Data:", err.response.data);
                }else if(err.request){
                    console.log("No response: ", err.request);
                }else{
                    console.log("Error message", err.message);
                }
                setError(err);
                throw err;
            }finally{
                setLoading(false);
            }
        },[]
    );

    const reset = useCallback(()=>{
        setData(null);
        setError(null);
    },[]);

    return {data,error,loading, callApi,reset}

}