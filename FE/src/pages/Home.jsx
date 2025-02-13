import React, { useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { auth } from "../util/firebase.js";
import { signOut } from "firebase/auth";
import "bootstrap/dist/css/bootstrap.min.css";
import SideBar from "../components/home/Sidebar.jsx";
import "../css/Home.css";
import apiDefault from "../util/apiDefault"

const Home = ({ user }) => {
    const [sidebarWidth, setSidebarWidth] = useState("20%");
    const navigate = useNavigate();

    const handleSignOut = async () => {
        try {
            const accessToken = sessionStorage.getItem("accessToken");
            console.log("accesstoken: ", accessToken);
            if (accessToken) {
                await apiDefault.post("/auth/logout", {}, {
                    headers: { Authorization: `Bearer ${accessToken}` },
                });
                sessionStorage.removeItem("accessToken");
            }
            navigate("/");
            await signOut(auth);

        } catch (error) {
            console.error("Lỗi đăng xuất:", error);
        }
    };


    return (
        <div className="main-app">
            {/* Sidebar */}
            <SideBar
                user={user}
                sidebarWidth={sidebarWidth}
                setSidebarWidth={setSidebarWidth}
                onSignOut={handleSignOut}
            />

            {/* Main Journal Area */}
            <div
                className="resizable-box habit_manager"
                style={{
                    width: `calc(100% - ${sidebarWidth})`, // Cập nhật width dựa theo sidebarWidth
                    transition: "width 0.4s ease-in-out"
                }}
            >
                <Outlet /> {/* Hiển thị nội dung từ các route con */}
            </div>
        </div>
    );
};

export default Home;
