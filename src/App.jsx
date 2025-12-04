import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import MainLayout from "./layouts/main/MainLayout.jsx";

import Home from "./pages/Home";
import About from "./pages/About";
import Login from "./pages/Login";

function App() {
    return (
        <Router>
            <Routes>

                {/* 사이드 있는 화면 */}
                <Route path="/" element={<MainLayout />}>
                    <Route index element={<Home />} />
                    <Route path="about" element={<About />} />
                    <Route path="Mypage" element={<About />} />
                </Route>

                {/* 사이드 없는 화면 */}
                <Route path="/login" element={<Login />} />

            </Routes>
        </Router>
    );
}

export default App;