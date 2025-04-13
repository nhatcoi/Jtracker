import React, {memo, useState} from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import PropTypes from 'prop-types';
import SideBar from '../components/home/Sidebar';
import { useLayout } from '../hooks/useLayout';
import { ROUTES } from '../constants/routes';
import { LAYOUT } from '../constants/styles';
import "bootstrap/dist/css/bootstrap.min.css";
import '../css/Home.css';
import {authApi} from "src/api/authApi.js";
import {storageService} from "src/services/storageService.js";
import {Spin} from "antd";

const Home = ({ user, setUser }) => {
    const navigate = useNavigate();
    const location = useLocation();
    const [loading, setLoading] = useState(false);
    const { sidebarWidth, setSidebarWidth } = useLayout();


    const handleSignOut = async () => {
        try {
            setLoading(true);
            await authApi.logout();
            console.log("logout ok");
            navigate(ROUTES.ROOT);
        } catch (error) {
            console.error("Logout failed:", error);
            setLoading(false);
        }
    };

    React.useEffect(() => {
        const handlePopState = () => {
            if (location.pathname === "/me" && !storageService.getUser()) {
                navigate("/auth");
            }
        };

        window.addEventListener("popstate", handlePopState);
        return () => {
            window.removeEventListener("popstate", handlePopState);
        };
    }, [navigate, location]);

    return (
        <>
            {loading && (
                <div style={{
                    position: "fixed",
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    backgroundColor: "rgba(255, 255, 255, 0.6)",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    zIndex: 9999
                }}>
                    <Spin size="large" tip="Logging out..." />
                </div>
            )}

            <div className="main-app">
                <SideBar
                    sidebarWidth={sidebarWidth}
                    setSidebarWidth={setSidebarWidth}
                    onSignOut={handleSignOut}
                />
                <div
                    className="resizable-box habit_manager"
                    style={{
                        width: `calc(100% - ${sidebarWidth})`,
                        transition: LAYOUT.SIDEBAR.TRANSITION
                    }}
                >
                    <Outlet />
                </div>
            </div>
        </>
    );
};

Home.propTypes = {
    user: PropTypes.shape({
        id: PropTypes.string,
        email: PropTypes.string,
        name: PropTypes.string
    }),
    setUser: PropTypes.func.isRequired
};

export default memo(Home);
