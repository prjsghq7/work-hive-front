import "./assets/Common.min.css";

import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { lazy, Suspense } from "react";
import MainLayout from "./layouts/main/MainLayout.jsx";

const Mypage =lazy(()=>import( "./pages/user/Mypage.jsx"));
const Home = lazy(() => import("./pages/Home"));

const Login = lazy(() => import("./pages/user/Login.jsx"));
const Register = lazy(() => import("./pages/user/Register.jsx"));
const UserSearch = lazy(() => import("./pages/user/search/UserSearch.jsx"));

const LeaveMain = lazy(() => import("./pages/leave/main/LeaveMain.jsx"));
const LeaveRequest = lazy(() => import("./pages/leave/request/LeaveRequest.jsx"));
const LeaveList = lazy(() => import("./pages/leave/list/LeaveList.jsx"));

const BoardAll = lazy(() => import("./pages/board/all/BoardAll.jsx"));
const BoardNotice = lazy(() => import("./pages/board/notice/BoardNotice.jsx"));
const BoardFamilyEvent = lazy(() => import("./pages/board/familyEvent/BoardFamilyEvent.jsx"));
const BoardNew = lazy(() => import("./pages/board/new/BoardNew.jsx"));
const BoardDetail = lazy(() => import("./pages/board/detail/BoardDetail.jsx"));

function App() {
    return (
        <Router>
            <Suspense fallback={<div className="loading">로딩중...</div>}>
            <Routes>

                {/* 사이드 있는 화면 */}
                <Route path="/" element={<MainLayout />}>
                    <Route index element={<Home />} />

                    <Route path="user/search" element={<UserSearch />} />

                    <Route path="leave/main" element={<LeaveMain/>}></Route>
                    <Route path="leave/request" element={<LeaveRequest/>}></Route>
                    <Route path="leave/list" element={<LeaveList/>}></Route>

                    <Route path="board/all" element={<BoardAll/>}></Route>
                    <Route path="board/notice" element={<BoardNotice/>}></Route>
                    <Route path="board/family-event" element={<BoardFamilyEvent/>}></Route>
                    <Route path="board/new" element={<BoardNew/>}></Route>
                    <Route path="board/detail/:id" element={<BoardDetail/>}></Route>
                </Route>

                <Route path="/user/login" element={<Login />} />
                <Route path="/user/register" element={<Register />} />
                <Route path="/user/me" element={<Mypage />} />

            </Routes>
            </Suspense>
        </Router>
    );
}

export default App;