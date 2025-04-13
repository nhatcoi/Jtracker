import {useEffect, useState} from 'react';
import {storageService} from '../services/storageService';
import {userApi} from "src/api/userApi.js";

export const useAuth = () => {
    const [user, setUser] = useState(storageService.getUser());
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchUserData = async () => {
        try {
            const accessToken = storageService.getAccessToken();
            if (!accessToken) {
                setUser(null);
                setLoading(false);
                return;
            }

            const userData = await userApi.getMe();
            setUser(userData);
            storageService.setUser(userData);
        } catch (error) {
            console.error('Error fetching user data:', error);
            setError(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        let mounted = true;

        const initAuth = async () => {
            try {
                await fetchUserData();
            } catch (error) {
                console.error('Error in initial auth:', error);
                if (mounted) {
                    setLoading(false);
                }
            }
        };

        initAuth();
        
        return () => {
            mounted = false;
        };
    }, []);

    const updateUser = (newUser) => {
        setUser(newUser);
        if (newUser) {
            storageService.setUser(newUser);
        }
    };

    return { 
        user, 
        setUser: updateUser, 
        loading, 
        error 
    };
};
