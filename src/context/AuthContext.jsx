// src/context/AuthContext.jsx

import { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';

const AuthContext = createContext(null);
const apiUrl = import.meta.env.VITE_API_URL;

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(localStorage.getItem('token') || null);
    const [projects, setProjects] = useState([]);
    const [activeProject, setActiveProject] = useState(null);
    const [authLoading, setAuthLoading] = useState(true);

    useEffect(() => {
        const fetchUserDataOnLoad = async (currentToken) => {
            try {
                const response = await axios.get(`${apiUrl}/api/users/me`, {
                    headers: { 'Authorization': `Bearer ${currentToken}` }
                });
                setUser(response.data);
            } catch (error) {
                console.error("Token inválido ou expirado, fazendo logout.");
                logout();
            } finally {
                setAuthLoading(false);
            }
        };

        if (token) {
            fetchUserDataOnLoad(token);
        } else {
            setAuthLoading(false);
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [token]);

    const login = async (email, password) => {
        try {
            const response = await axios.post(`${apiUrl}/api/auth/login`, { email, password });
            const { token } = response.data;
            localStorage.setItem('token', token);
            setToken(token); // Dispara o useEffect acima para buscar os dados do usuário
        } catch (error) {
            console.error("Erro no contexto de login:", error);
            throw error; // Re-lança o erro para a LoginPage poder exibi-lo
        }
    };

    const logout = () => {
        localStorage.removeItem('token');
        setToken(null);
        setUser(null);
        setActiveProject(null);
        setProjects([]);
    };

    const value = {
        token,
        user,
        login,
        logout,
        projects,
        setProjects,
        activeProject,
        setActiveProject,
        authLoading
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
    return useContext(AuthContext);
};