import {useEffect, useState} from "react";
import {userService} from "../../services/user/userService.js";
import {useApi} from "../../hooks/useApi.js";

export default function Mypage() {
    const [me, setMe] = useState(null);
    const [loading, setLoading] = useState(true);
    const [run] = useApi();
    useEffect(() => {
        async function fetchMe() {
            try {
                const res = await run(() => userService.getMyInfo());
                setMe(res.data);
            } catch (e) {
                console.error(e)
            } finally {
                setLoading(false);
            }
        }

        fetchMe();
    }, []);
    if (!loading) return <div>로딩중</div>
    if (!me) return <div>정보가 없습니다.</div>
    return (
        <div>
            <h2>내 정보</h2>
            <div>{me.name}</div>
        </div>
    )

}

