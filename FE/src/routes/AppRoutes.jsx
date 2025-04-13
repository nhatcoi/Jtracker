import React from 'react';
import { Route, Routes } from 'react-router-dom';
import GetStarted from '../pages/GetStarted';
import Auth from '../pages/Auth';
import Home from '../pages/Home';
import MainJournal from '../components/home/MainJournal';
import ManageHabit from '../components/home/ManageHabit';
import ProtectedRoute from '../components/auth/ProtectedRoute';
import { ROUTES } from '../constants/routes';
import PropTypes from 'prop-types';

const AppRoutes = ({ user, setUser }) => (
    <Routes>
        <Route path={ROUTES.ROOT} element={<GetStarted />} />
        <Route path={ROUTES.AUTH} element={<Auth setUser={setUser} />} />
        <Route 
            path={ROUTES.ME} 
            element={
                <ProtectedRoute>
                    <Home user={user} setUser={setUser} />
                </ProtectedRoute>
            }
        >
            <Route index element={<MainJournal />} />
            <Route path={ROUTES.HABITS} element={<MainJournal />} />
            <Route path={ROUTES.MANAGE} element={<ManageHabit />} />
        </Route>
    </Routes>
);

AppRoutes.propTypes = {
    user: PropTypes.object,
    setUser: PropTypes.func.isRequired
};

export default AppRoutes;
