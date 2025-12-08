import {useState, useEffect} from "react";
import {searchService} from "../../../services/user/userService.js";
import {useApi} from "../../../hooks/useApi.js";

import "./UserSearch.min.css";

export default function UserSearch() {
    const [name, setName] = useState("");
    const [teamCode, setTeamCode] = useState("");
    const [userState, setUserState] = useState("");

    const [teamList, setTeamList] = useState([]);
    const [stateList, setStateList] = useState([]);
    useEffect(() => {
        const fetchFilterList = async () => {
            try {
                const [teamRes, stateRes] = await Promise.all([
                    searchService.getTeamList(),
                    searchService.getUserStateList()
                ]);

                setTeamList(teamRes.data.data.codes);
                setStateList(stateRes.data.data.codes);

            } catch (e) {
                console.error("필터 목록 로딩 실패:", e);
            }
        };

        fetchFilterList();
    }, []);


    const {run, reset, loading} = useApi();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            reset();
            const res = await run(() => searchService.search(name, teamCode, teamCode));
            alert(res.success);
        } catch (err) {
            if (err.response) {
                const {message,code}= err.response.data;
                //err.response.data에 있는 message,code를 자동으로 매핑
                console.log("백엔드 응답:", err.response.data);
                console.log(message || `검색 실패 ${code || "알 수 없는 오류"}`);
            }
        }
    }

    const handleReset = () => {
        setName("");
        setTeamCode("");
        setUserState("");
        reset();
    };

    const isAdmin = true;

    return (
        <div className="filter-box">
            <h1 className="filter-title">회원 검색</h1>

            <form className="filter-form" onSubmit={handleSubmit}>
                <div className="filter-fields">
                    <div className="filter-field">
                        <label htmlFor="name" className="filter-label">
                            이름
                        </label>
                        <input
                            id="name"
                            type="text"
                            className="filter-input"
                            placeholder="이름을 입력하세요"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        />
                    </div>

                    <div className="filter-field">
                        <label htmlFor="teamCode" className="filter-label">
                            팀
                        </label>
                        <select
                            id="teamCode"
                            className="filter-select"
                            value={teamCode}
                            onChange={(e) => setTeamCode(e.target.value)}
                        >
                            <option value="">전체</option>
                            {teamList.map((team) => (
                                <option key={team.code} value={team.code}>
                                    {team.displayText}
                                </option>
                            ))}
                        </select>
                    </div>

                    {isAdmin && (
                        <div className="filter-field">
                            <label htmlFor="userState" className="filter-label">
                                재직 상태
                            </label>
                            <select
                                id="userState"
                                className="filter-select"
                                value={userState}
                                onChange={(e) => setUserState(e.target.value)}
                            >
                                <option value="">전체</option>
                                {stateList.map((state) => (
                                    <option key={state.code} value={state.code}>
                                        {state.displayText}
                                    </option>
                                ))}
                            </select>
                        </div>
                    )}
                </div>

                <div className="filter-actions">
                    <button
                        type="button"
                        className="filter-button filter-button--secondary"
                        onClick={handleReset}
                        disabled={loading}
                    >
                        초기화
                    </button>
                    <button
                        type="submit"
                        className="filter-button filter-button--primary"
                        disabled={loading}
                    >
                        {loading ? "검색 중..." : "검색"}
                    </button>
                </div>
            </form>
        </div>
    );
}