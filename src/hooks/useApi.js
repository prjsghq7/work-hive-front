import {useState, useCallback} from "react";
import {API_BASE_URL} from "../configs/apiConfig.js";

export function useApi() {
    const [data, setData] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);

    // promiseFn: () => Promise(axios 요청)
    const run = useCallback(async (promiseFn) => {
        setLoading(true);
        setError(null);
        try {
            const res = await promiseFn(); // loginService.login -> localhost:8080/user/login
            // axios면 res.data, fetch면 res 이런 식으로 알아서 맞춰 써도 됨
            setData(res.data);
            return res.data;
        } catch (err) {
            setError(err);
            throw err;
        } finally {
            setLoading(false);
        }
    }, []);

    const reset = useCallback(() => {
        setData(null);
        setError(null);
    }, []);

    return {data, error, loading, run, reset};
}