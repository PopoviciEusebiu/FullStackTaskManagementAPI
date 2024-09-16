// App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Register from "./pages/Log-in/Register";
import Login from "./pages/Log-in/Login";
import FindUsers from "./pages/Admin/FindUsers";
import UpdateUser from "./pages/Admin/UpdateUser";
import DeleteUser from "./pages/Admin/DeleteUser";
import CreateUser from "./pages/Admin/CreateUser";
import GetUsersForUpdate from "./pages/Admin/GetUsersForUpdate";
import AdminHome from "./pages/Admin/AdminProfile";
import SeeUserTasks from "./pages/Admin/SeeUserTasks";
import UserProfile from "./pages/User/UserProfile";
import UserHome from "./pages/User/UserHome";
import AddTask from "./pages/User/AddTask";
import Tasks from "./pages/User/Tasks";
import UpdateTask from "./pages/User/UpdateTask";
import AddComment from "./pages/User/AddComment";
import Comments from "./pages/User/Comments";
import History from "./pages/User/History";
import FileExport from "./pages/Admin/FileExport";
import Support from "./pages/User/Support";
import Logout from "./pages/Log-in/Logout"
import ConfirmationAccount from "./pages/Log-in/ConfirmationAccount";
import CreateGroup from "./pages/User/CreateGroup";
import Groups from "./pages/User/Groups";
import GroupDetails from "./pages/User/GroupDetails";
import UpdateGroupTask from "./pages/User/UpdateGroupTask";
import AddGroupTask from "./pages/User/AddGroupTask";
import { AddTaskProvider } from "./utils/AddTaskContext";
import MyGroups from "./pages/User/MyGroups";
import Chat from "./pages/User/Chat";

function App() {
    const defaultRoute = window.location.pathname === "/" ? <Navigate to="/login" replace={true} /> : null;

    return (
        <AddTaskProvider>
            <Router>
                <Routes>
                    <Route path="/home" element={<FindUsers />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/find" element={<FindUsers />} />
                    <Route path="/create" element={<CreateUser />} />
                    <Route path="/update/:id" element={<UpdateUser />} />
                    <Route path="/delete" element={<DeleteUser />} />
                    <Route path="/usersUpdate" element={<GetUsersForUpdate />} />
                    <Route path="/profile" element={<AdminHome />} />
                    <Route path="/:adminId/tasks/:userId" element={<SeeUserTasks />} />
                    <Route path="/userProfile" element={<UserProfile  />} />
                    <Route path="/userHome" element={<UserHome />} />
                    <Route path="/addTask" element={<AddTask />} />
                    <Route path="/updateTask/:id" element={<UpdateTask />} />
                    <Route path="/tasks" element={<Tasks />} />
                    <Route path="/addComment" element={<AddComment />} />
                    <Route path="/history" element={<History />} />
                    <Route path="/comment/fromTask/:taskId" element={<Comments />}/>
                    <Route path="/export" element={<FileExport />}/>
                    <Route path="/support" element={<Support />}/>
                    <Route path="/logout" element={<Logout />}/>
                    <Route path="/confirm/:confirmationToken" element={<ConfirmationAccount />}/>
                    <Route path="/createGroup" element={<CreateGroup />} />
                    <Route path="/groups" element={<Groups />}/>
                    <Route path="/group/:groupId" element={<GroupDetails />}/>
                    <Route path="/updateGroupTask/:id" element={<UpdateGroupTask />} />
                    <Route path="/addGroupTask" element={<AddGroupTask />} />
                    <Route path="/myGroups" element={<MyGroups />} />
                    <Route path="/group/:groupId/chat" element={<Chat />} />
                    <Route path="/" element={defaultRoute} />
                </Routes>
            </Router>
        </AddTaskProvider>
    );
}

export default App;
