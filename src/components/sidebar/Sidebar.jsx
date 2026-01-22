import { useState } from "react";
import {Link, useLocation, useNavigate} from "react-router-dom";
import "./Sidebar.min.css";
import {useAuth} from "./../../pages/user/AuthContext.jsx";

export default function Sidebar() {
    const location = useLocation();

    const menu = [
        {
            type: "group",
            id: "user",
            title: "회원",
            children: [
                { label: "프로필", path: "/user/edit" },
                { label: "검색", path: "/user/search" }
            ]
        },
        {
            type: "single",
            label: "채팅",
            path: "/chat"
        },
        {
            type: "single",
            label: "채팅 Test",
            path: "/chat/test"
        },
        {
            type: "single",
            label: "근태",
            path: "/attendance"
        },
        {
            type: "group",
            id: "schedule",
            title: "일정",
            children: [
                { label: "메인", path: "/schedule/main" },
                { label: "신청", path: "/schedule/request" },
                { label: "이력", path: "/schedule/list" }
            ]
        },
        {
            type: "group",
            id: "leave",
            title: "연차",
            children: [
                { label: "메인", path: "/leave/main" },
                { label: "이력", path: "/leave/list" }
            ]
        },
        {
            type: "group",
            id: "board",
            title: "게시판",
            children: [
                { label: "전체보기", path: "/board/all" },
                { label: "공지사항", path: "/board/notice" },
                { label: "경조사", path: "/board/family-event" }
            ]
        }
    ];

    const navigate = useNavigate();
    const [openMenu, setOpenMenu] = useState("user");
    // const [openMenu, setOpenMenu] = useState(null);

    const handleToggle = (id) => {
        setOpenMenu((prev) => (prev === id ? null : id));
    };

    const {logout, isLoggedIn} = useAuth();
    const handleLogout = () => {
        if (!isLoggedIn) {
            alert("로그인 부터 해주세요.");
            navigate("/user/login");
            return;
        } else {
            logout();
        }
    }

    return (
        <aside className="sidebar">
            <a href="/home" className="sidebar-logo">Work Hive</a>

            <nav className="sidebar-nav">
                {menu.map((item) => {
                    if (item.type === "single") {
                        return (
                            <Link
                                key={item.path}
                                to={item.path}
                                className={
                                    location.pathname === item.path
                                        ? "sidebar-main-item active"
                                        : "sidebar-main-item"
                                }
                            >
                                {item.label}
                            </Link>
                        );
                    }

                    if (item.type === "group") {
                        return (
                            <div key={item.id} className="sidebar-group">
                                <button
                                    type="button"
                                    className={`sidebar-main-item ${
                                        openMenu === item.id ? "open" : ""
                                    }`}
                                    onClick={() => handleToggle(item.id)}
                                >
                                    <span>{item.title}</span>
                                    <span className="sidebar-arrow">
                    {openMenu === item.id ? "▾" : "▸"}
                  </span>
                                </button>

                                {openMenu === item.id && (
                                    <div className="sidebar-submenu">
                                        {item.children.map((sub) => (
                                            <Link
                                                key={sub.path}
                                                to={sub.path}
                                                className={
                                                    location.pathname === sub.path
                                                        ? "sidebar-sub-item active"
                                                        : "sidebar-sub-item"
                                                }
                                            >
                                                {sub.label}
                                            </Link>
                                        ))}
                                    </div>
                                )}
                            </div>
                        );
                    }

                    return null;
                })}
            </nav>

            <div className="sidebar-footer">
                <button type="button" className="sidebar-logout" onClick={handleLogout}>로그아웃</button>
            </div>
        </aside>
    );
}