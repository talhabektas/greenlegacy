import React, { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

interface AdminRouteProps {
    children: ReactNode;
}

// Yalnızca admin yetkisi olan kullanıcıların erişebileceği sayfalar için
const AdminRoute: React.FC<AdminRouteProps> = ({ children }) => {
    const { isAuthenticated, isAdmin, loading } = useAuth();

    // Yükleme durumunda bir şey gösterme
    if (loading) {
        return <div>Yükleniyor...</div>;
    }

    // Eğer kullanıcı giriş yapmamışsa veya admin değilse, uygun sayfaya yönlendir
    if (!isAuthenticated) {
        return <Navigate to="/login" />;
    }

    return isAdmin ? children : <Navigate to="/" />;
};

export default AdminRoute; 