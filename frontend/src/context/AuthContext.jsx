import { createContext, useContext, useState, useEffect } from 'react';
import { authAPI } from '../services/api';

const AuthContext = createContext(null);

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

export const AuthProvider = ({ children }) => {
    const [admin, setAdmin] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Check for existing token on mount
    useEffect(() => {
        const token = localStorage.getItem('adminToken');
        if (token) {
            validateToken();
        } else {
            setLoading(false);
        }
    }, []);

    // Validate existing token
    const validateToken = async () => {
        try {
            const response = await authAPI.getProfile();
            setAdmin(response.data.data);
        } catch (err) {
            localStorage.removeItem('adminToken');
            setAdmin(null);
        } finally {
            setLoading(false);
        }
    };

    // Login function
    const login = async (email, password) => {
        try {
            setError(null);
            const response = await authAPI.login({ email, password });
            // API returns: { success, message, data: { id, email, name, lastLogin, token } }
            const { token, id, email: adminEmail, name, lastLogin } = response.data.data;

            localStorage.setItem('adminToken', token);
            setAdmin({ id, email: adminEmail, name, lastLogin });

            return { success: true };
        } catch (err) {
            const message = err.response?.data?.message || 'Login failed. Please try again.';
            setError(message);
            return { success: false, error: message };
        }
    };

    // Logout function
    const logout = () => {
        localStorage.removeItem('adminToken');
        setAdmin(null);
    };

    // Check if user is authenticated
    const isAuthenticated = () => {
        return !!admin && !!localStorage.getItem('adminToken');
    };

    const value = {
        admin,
        loading,
        error,
        login,
        logout,
        isAuthenticated,
        setError,
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthContext;
