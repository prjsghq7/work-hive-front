import { useState } from "react";
import {useApi} from "../../hooks/useApi";
import { searchService } from "../../services/user/userService.js";
import { useDialog } from "../../contexts/modal/DialogContext.jsx";

import "./UserSearchModal.min.css";

function UserSearchModal({ isOpen, onClose, onSelect }) {
    const { openDialog } = useDialog();
    const [searchName, setSearchName] = useState("");
    const [searchResults, setSearchResults] = useState([]);
    const [hasSearched, setHasSearched] = useState(false); // 검색 실행 여부 추적
    const { run: runSearch, loading: searchLoading } = useApi();

    // 모달이 닫힐 때 상태 초기화
    const handleClose = () => {
        setSearchName("");
        setSearchResults([]);
        setHasSearched(false);
        onClose();
    };

    // 승인자 검색 함수
    const handleSearch = async () => {
        if (!searchName.trim()) {
            openDialog("검색", "이름을 입력해주세요.", "warning");
            return;
        }

        try {
            const res = await runSearch(() => searchService.search(searchName, 0, 0));
            setSearchResults(res.data.userList || []);
            setHasSearched(true); // 검색 실행 표시
        } catch (err) {
            const errorMessage = err?.response?.data?.message || "검색에 실패했습니다.";
            openDialog("검색 실패", errorMessage, "warning");
            setSearchResults([]);
            setHasSearched(true); // 에러가 나도 검색 시도는 했으므로 true
        }
    };

    // 승인자 선택 함수
    const handleSelectUser = (user) => {
        onSelect(user);
        handleClose();
    };

    if (!isOpen) return null;

    return (
        <div className="modal-overlay" onClick={handleClose}>
            <div className="modal user-search-modal" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                    <h3 className="modal-title">승인자 검색</h3>
                    <span className="modal-stretch"></span>
                    <button
                        className="modal-close"
                        type="button"
                        onClick={handleClose}
                    >
                        ×
                    </button>
                </div>

                <div className="modal-body">
                    <div className="user-search-search-box">
                        <input
                            className="user-search-search-input"
                            type="text"
                            placeholder="이름을 입력하세요"
                            value={searchName}
                            onChange={(e) => setSearchName(e.target.value)}
                            onKeyPress={(e) => {
                                if (e.key === "Enter") {
                                    e.preventDefault();
                                    handleSearch();
                                }
                            }}
                        />
                        <button
                            className="user-search-search-button"
                            type="button"
                            onClick={handleSearch}
                            disabled={searchLoading}
                        >
                            {searchLoading ? "검색 중..." : "찾아보기"}
                        </button>
                    </div>

                    <div className="user-search-search-results">
                        {!hasSearched ? (
                            <div className="user-search-no-results">
                                이름을 입력하고 찾아보기를 클릭하세요.
                            </div>
                        ) : searchResults.length === 0 ? (
                            <div className="user-search-no-results">
                                검색 결과가 없습니다.
                            </div>
                        ) : (
                            <ul className="user-search-results-list">
                                {searchResults.map((user) => {
                                    const empId = (user.empId || user.index) ? String(user.empId || user.index) : "없음";
                                    const name = (user.name && user.name.trim()) ? user.name : "없음";
                                    const email = (user.email && user.email.trim()) ? user.email : "없음";
                                    const teamName = (user.teamName && user.teamName.trim()) ? user.teamName : "없음";
                                    const roleName = (user.roleName && user.roleName.trim()) ? user.roleName : "없음";
                                    
                                    return (
                                        <li
                                            key={user.index}
                                            className="user-search-result-item"
                                            onClick={() => handleSelectUser(user)}
                                        >
                                            <div className="user-search-result-content">
                                                <span className="user-search-emp-id">{empId}</span>
                                                <span className="user-search-name">{name}</span>
                                                <span className="user-search-email">{email}</span>
                                                <span className="user-search-team">{teamName}</span>
                                                <span className="user-search-role">{roleName}</span>
                                            </div>
                                        </li>
                                    );
                                })}
                            </ul>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default UserSearchModal;
