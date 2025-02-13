import React, { useEffect, useState } from "react";
import { auth } from "./util/firebase.js";
import { onAuthStateChanged } from "firebase/auth";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import GetStarted from "./pages/GetStarted.jsx";
import Auth from "./pages/Auth";
import Home from "./pages/Home";
import api from "./util/api.js";
import HabitList from "./components/home/HabitList";
import MainJournal from "./components/home/MainJournal";
import HabitLogProgress from "./components/home/HabitLogProgress";
import ManageHabit from "src/components/home/ManageHabit.jsx";

const App = () => {
    const [user, setUser] = useState(null);

    const fetchUserData = async () => {
        const storedUser = sessionStorage.getItem("user");
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        } else {
            try {
                const userMe = await api.get("/users/me");
                console.log("User from API:", userMe);
                setUser(userMe);
                sessionStorage.setItem("user", JSON.stringify(userMe));
            } catch (error) {
                console.error("Error fetching user data:", error);
            }
        }
    };

    const authGoogle = () => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            if (currentUser) {
                setUser(currentUser);
                sessionStorage.setItem("user", JSON.stringify(currentUser));
            }
        });
        return () => unsubscribe();
    };

    useEffect(() => {
        authGoogle();
        fetchUserData().then(r => r);
    }, []);

    return (
        <Router>
            <Routes>
                <Route path="/" element={<GetStarted />} />
                <Route path="/auth" element={<Auth setUser={setUser} />} />
                <Route path="/me" element={user ? <Home user={user} /> : <Auth setUser={setUser} />}>
                    <Route index element={<MainJournal />} /> {/* /me -> Dashboard mặc định */}
                    <Route path="habits" element={<MainJournal />} />
                    <Route path="manage" element={<ManageHabit />} />
                    {/*<Route path="settings" element={<Settings />} />*/}
                </Route>
            </Routes>
        </Router>
    );
};

export default App;
