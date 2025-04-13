import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ROUTES } from '../constants/routes';
import { storageService } from '../services/storageService';

export const useLayout = () => {
    const [sidebarWidth, setSidebarWidth] = useState('20%');
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        const handlePopState = () => {
            if (location.pathname === ROUTES.ME && !storageService.getAccessToken()) {
                navigate(ROUTES.AUTH);
            }
        };

        window.addEventListener('popstate', handlePopState);
        return () => {
            window.removeEventListener('popstate', handlePopState);
        };
    }, [navigate, location]);

    return {
        sidebarWidth,
        setSidebarWidth
    };
};
