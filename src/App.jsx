import "./assets/Common.min.css";
import "./assets/common/Button.min.css";
import "./assets/common/Filter.min.css";
import "./assets/common/Input.min.css";
import "./assets/common/Modal.min.css";
import "./assets/common/RadioButton.min.css";
import "./assets/common/Table.min.css";
import "./assets/common/TagLabel.min.css";

import {BrowserRouter as Router, Routes, Route} from "react-router-dom";
import {lazy, Suspense} from "react";
import MainLayout from "./layouts/main/MainLayout.jsx";
import RequireAuth from "./pages/user/RequireAuth.jsx";

import {DialogProvider} from "./contexts/modal/DialogContext.jsx";

const Mypage = lazy(() => import( "./pages/user/mypage/Mypage.jsx"));
const Home = lazy(() => import("./pages/Home"));

const Login = lazy(() => import("./pages/user/login/Login.jsx"));
const Register = lazy(() => import("./pages/user/register/Register.jsx"));
const UserSearch = lazy(() => import("./pages/user/search/UserSearch.jsx"));

const ChatStompTest = lazy(() => import("./pages/chat/ChatStompTest.jsx"));

const LeaveMain = lazy(() => import("./pages/leave/main/LeaveMain.jsx"));
const LeaveRequest = lazy(() => import("./pages/leave/request/LeaveRequest.jsx"));
const LeaveList = lazy(() => import("./pages/leave/list/LeaveList.jsx"));

const BoardAll = lazy(() => import("./pages/board/all/BoardAll.jsx"));
const BoardNotice = lazy(() => import("./pages/board/notice/BoardNotice.jsx"));
const BoardFamilyEvent = lazy(() => import("./pages/board/familyEvent/BoardFamilyEvent.jsx"));
const BoardNew = lazy(() => import("./pages/board/new/BoardNew.jsx"));
const BoardDetail = lazy(() => import("./pages/board/detail/BoardDetail.jsx"));
const BoardModify = lazy(() => import("./pages/board/modify/BoardModify.jsx"));

function App() {
    return (
        <DialogProvider>
            <Suspense fallback={<div className="loading">로딩중...</div>}>
                <Routes>

                    <Route path="/" element={<Login/>}/>
                    <Route path="/user/register" element={<Register/>}/>

                    {/* 사이드 있는 화면 */}
                    <Route path="/" element={<MainLayout/>}>
                        <Route path={"home/"} element={<Home/>}/>

                        <Route path="user/search" element={<UserSearch/>}/>

                        <Route path="chat/test" element={<ChatStompTest/>}/>

                        <Route path="leave/main" element={<LeaveMain/>}></Route>
                        <Route path="leave/request" element={<LeaveRequest/>}></Route>
                        <Route path="leave/list" element={<LeaveList/>}></Route>

                        <Route path="board/all" element={<BoardAll/>}></Route>
                        <Route path="board/notice" element={<BoardNotice/>}></Route>
                        <Route path="board/family-event" element={<BoardFamilyEvent/>}></Route>
                        <Route path="board/new" element={<BoardNew/>}></Route>
                        <Route path="board/detail/:id" element={<BoardDetail/>}></Route>
                        <Route path="board/modify/:id" element={<BoardModify/>}></Route>
                        <Route
                            path="/user/edit"
                            element={
                                <RequireAuth>
                                    <Mypage/>
                                </RequireAuth>
                            }
                        />
                    </Route>
                </Routes>
            </Suspense>
        </DialogProvider>
    );
}

export default App;