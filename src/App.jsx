import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import MainLayout from "./layouts/main/MainLayout.jsx";

import Home from "./pages/Home";

import Login from "./pages/user/Login.jsx";
import BoardAll from "./pages/board/all/BoardAll.jsx";
import BoardNotice from "./pages/board/notice/BoardNotice.jsx";
import BoardFamilyEvent from "./pages/board/familyEvent/BoardFamilyEvent.jsx";

function App() {
    return (
        <Router>
            <Routes>

                {/* 사이드 있는 화면 */}
                <Route path="/" element={<MainLayout />}>
                    <Route index element={<Home />} />

                    <Route path="board/all" element={<BoardAll/>}></Route>
                    <Route path="board/notice" element={<BoardNotice/>}></Route>
                    <Route path="board/family-event" element={<BoardFamilyEvent/>}></Route>
                </Route>

                <Route path="/user/login" element={<Login />} />

            </Routes>
        </Router>
    );
}

export default App;