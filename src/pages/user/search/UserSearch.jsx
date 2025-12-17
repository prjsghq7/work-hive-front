import {useState, useEffect} from "react";
import {subTableListService, searchService} from "../../../services/user/userService.js";
import {useApi} from "../../../hooks/useApi.js";

import UserEditModal from "../../../components/user/UserEditModal.jsx";
import UserDetailModal from "../../../components/user/UserDetailModal.jsx";

import "./UserSearch.min.css";

export default function UserSearch() {
    const ROLE_COLOR_MAP = {
        사장: "dark",
        이사: "navy",
        부장: "purple",
        차장: "blue",
        과장: "cyan",
        대리: "mint",
        주임: "green",
        사원: "gray",
        인턴: "amber"
    };

    const USER_STATE_COLOR_MAP = {
        재직: "green",
        대기: "yellow",
        퇴사: "wine"
    };

    const [name, setName] = useState("");
    const [teamCode, setTeamCode] = useState("");
    const [userState, setUserState] = useState("");

    const [teamList, setTeamList] = useState([]);
    const [stateList, setStateList] = useState([]);

    const [userList, setUserList] = useState([]);

    useEffect(() => {
        const fetchFilterList = async () => {
            try {
                const [teamRes, stateRes] = await Promise.all([
                    subTableListService.getTeamList(),
                    subTableListService.getUserStateList()
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
            const res = await run(() => searchService.search(name, teamCode, userState));

            console.log(res);
            setUserList(res.data.userList);
        } catch (err) {
            if (err.response) {
                const {message, code} = err.response.data;
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

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [targetIndex, setTargetIndex] = useState(null);

    const openModal = (index) => {
        setTargetIndex(index);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setTargetIndex(null);
        setIsModalOpen(false);
    };

    return (
        <>
            <div className="filter-box">
                {/*<h1 className="filter-title">회원 검색</h1>*/}

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

                    <div className="button-wrapper">
                        <button
                            type="button"
                            className="-object-button --blue"
                            onClick={handleReset}
                            disabled={loading}
                        >
                            초기화
                        </button>
                        <button
                            type="submit"
                            className="-object-button --white"
                            disabled={loading}
                        >
                            {loading ? "검색 중..." : "검색"}
                        </button>
                    </div>
                </form>
            </div>


            {/* ===== 검색 결과 테이블 영역 ===== */}
            <div className="board-container">

                {/*<h1 className="board-title">회원 목록</h1>*/}

                <div className="board-card">
                    <div className="board-header">
                        {/*<h2 className="board-card-title">검색 결과</h2>*/}
                    </div>

                    <table className="board-table">
                        <thead>
                        <tr>
                            <th className="first">이름</th>
                            <th>팀</th>
                            <th>직급</th>
                            <th className="col-flex">이메일</th>
                            <th className="last">재직상태</th>
                        </tr>
                        </thead>

                        <tbody>
                        {userList.length === 0 ? (
                            <tr>
                                <td colSpan={7}>검색 결과가 없습니다.</td>
                            </tr>
                        ) : (
                            userList.map((user) => (
                                <tr key={user.index}
                                    onClick={() => openModal(user.index)}
                                    style={{ cursor: "pointer" }}>
                                    <td>{user.name}</td>
                                    <td>{user.teamName}</td>
                                    <td>
                                        <span className={`tag-label ${ROLE_COLOR_MAP[user.roleName] ?? "gray"}`}>
                                            {user.roleName}
                                        </span>
                                    </td>
                                    <td className="col-flex">{user.email}</td>
                                    <td className="last">
                                        <span className={`tag-label ${USER_STATE_COLOR_MAP[user.userStateName] ?? "gray"}`}>
                                            {user.userStateName}
                                        </span>
                                    </td>
                                </tr>
                            ))
                        )}
                        </tbody>
                    </table>
                </div>
            </div>

            {isModalOpen && isAdmin && (
                <UserEditModal targetIndex={targetIndex} onClose={closeModal} />
            )}

            {isModalOpen && !isAdmin && (
                <UserDetailModal targetIndex={targetIndex} onClose={closeModal} />
            )}
        </>
    );
}