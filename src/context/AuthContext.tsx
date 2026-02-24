import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { fetchApi, setAuthToken, clearAuthToken, getAuthToken } from '../api/client';

export interface User {
    id: string;
    email: string;
    displayName: string;
    salePriority?: number;
    ratingPriority?: number;
    topicPriority?: number;
}

interface AuthContextType {
    user: User | null;
    isLoading: boolean;
    login: (token: string, userData: User) => void;
    logout: () => void;
    updateUser: (data: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType>({
    user: null,
    isLoading: true,
    login: () => { },
    logout: () => { },
    updateUser: () => { }
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const initAuth = async () => {
            const token = getAuthToken();
            if (token) {
                try {
                    // Verify token and fetch user
                    const userData = await fetchApi('/users/me');
                    setUser(userData);
                } catch (error) {
                    console.error('Failed to restore session', error);
                    clearAuthToken();
                }
            }
            setIsLoading(false);
        };

        initAuth();
    }, []);

    const login = (token: string, userData: User) => {
        setAuthToken(token);
        setUser(userData);
    };

    const logout = () => {
        clearAuthToken();
        setUser(null);
    };

    const updateUser = (data: Partial<User>) => {
        setUser(prev => prev ? { ...prev, ...data } : null);
    };

    return (
        <AuthContext.Provider value={{ user, isLoading, login, logout, updateUser }}>
            {children}
        </AuthContext.Provider>
    );
};
