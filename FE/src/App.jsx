import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import AppRoutes from './routes/AppRoutes';
import { useAuth } from './hooks/useAuth';
import PropTypes from 'prop-types';
import { Spin } from 'antd';

const App = () => {
    const { user, setUser, loading, error } = useAuth();

    if (loading) {
        return <Spin />;
    }

    if (error) {
        return <div>Error: {error.message}</div>;
    }

    return (
        <Router>
            <AppRoutes user={user} setUser={setUser} />
        </Router>
    );
};

App.propTypes = {
    user: PropTypes.object,
    setUser: PropTypes.func
};

export default App;
