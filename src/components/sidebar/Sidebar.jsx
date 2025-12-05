import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import "./Sidebar.min.css";

export default function Sidebar() {
    const location = useLocation();

    const menu = [
        {
            type: "single",
            label: "Home",
            path: "/"
        },
        {
            type: "single",
            label: "Login",
            path: "/user/login"
        },


        {
            type: "group",
            id: "user",
            title: "회원관리",
            children: [
                { label: "회원 승인", path: "/user/approve" },
                { label: "회원 정보 수정", path: "/user/edit" },
                { label: "회원 검색", path: "/user/search" }
            ]
        },
        {
            type: "group",
            id: "leave",
            title: "연차관리",
            children: [
                { label: "연차 승인", path: "/leave/approve" },
                { label: "연차 신청", path: "/leave/request" },
                { label: "연차 이력", path: "/leave/history" }
            ]
        }
    ];

    const [openMenu, setOpenMenu] = useState("user");
    // const [openMenu, setOpenMenu] = useState(null);

    const handleToggle = (id) => {
        setOpenMenu((prev) => (prev === id ? null : id));
    };

    return (
        <aside className="sidebar">
            <h2 className="sidebar-logo">Work Hive</h2>

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
        </aside>
    );
}