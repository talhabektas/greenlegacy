import React, { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

interface PrivateRouteProps {
    children: ReactNode;
}

// Yalnızca giriş yapmış kullanıcıların erişebileceği sayfalar için
const PrivateRoute: React.FC<PrivateRouteProps> = ({ children }) => {
    const { isAuthenticated, loading } = useAuth();

    // Yükleme durumunda bir şey gösterme
    if (loading) {
        return <div>Yükleniyor...</div>;
    }

    // Eğer kullanıcı giriş yapmamışsa, login sayfasına yönlendir
    return isAuthenticated ? children : <Navigate to="/login" />;
};

export default PrivateRoute; 