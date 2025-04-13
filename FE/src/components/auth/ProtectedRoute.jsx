import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import PropTypes from 'prop-types';
import { ROUTES } from '../../constants/routes';
import { storageService } from '../../services/storageService';

const ProtectedRoute = ({ children }) => {
    const location = useLocation();
    const user = storageService.getUser();
    const accessToken = storageService.getAccessToken();

    if (!user || !accessToken) {
        return <Navigate to={ROUTES.AUTH} state={{ from: location }} replace />;
    }
    return children;
};

ProtectedRoute.propTypes = {
    children: PropTypes.node.isRequired
};

export default ProtectedRoute;
