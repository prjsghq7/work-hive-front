import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import MainLayout from "./layouts/main/MainLayout.jsx";

import Home from "./pages/Home";

import Login from "./pages/user/Login.jsx";

function App() {
    return (
        <Router>
            <Routes>

                {/* 사이드 있는 화면 */}
                <Route path="/" element={<MainLayout />}>
                    <Route index element={<Home />} />
                </Route>

                <Route path="/user/login" element={<Login />} />

            </Routes>
        </Router>
    );
}

export default App;