import Sidebar from "../../components/sidebar/Sidebar.jsx";
import {Outlet} from "react-router-dom";

import "./MainLayout.min.css";

export default function MainLayout() {
    return (
        <div className="layout">
            <Sidebar />

            <main className="content">
                <Outlet />
            </main>
        </div>
    );
}