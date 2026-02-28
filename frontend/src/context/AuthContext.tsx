import { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import axios from 'axios';

export interface User {
    _id: string;
    name: string;
    email: string;
    role: 'user' | 'admin';
    // NOTE: 'token' field intentionally removed — token lives in an HttpOnly cookie
    //       and is never accessible to JavaScript.
}

interface AuthContextType {
    user: User | null;
    login: (userData: User) => void;
    logout: () => Promise<void>;
    isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // Restore session from sessionStorage (user identity only — no token)
        // The actual auth token is in an HttpOnly cookie managed by the browser.
        const storedUser = sessionStorage.getItem('foodipe_user');
        if (storedUser) {
            try {
                setUser(JSON.parse(storedUser));
            } catch {
                sessionStorage.removeItem('foodipe_user');
            }
        }
        setIsLoading(false);
    }, []);

    const login = (userData: User) => {
        setUser(userData);
        // Store only non-sensitive user identity (no token!) for UI hydration across refreshes
        sessionStorage.setItem('foodipe_user', JSON.stringify(userData));
    };

    const logout = async () => {
        try {
            // Ask server to clear the HttpOnly cookie
            await axios.post('/api/users/logout', {}, { withCredentials: true });
        } catch {
            // Proceed with client-side cleanup even if server call fails
        }
        setUser(null);
        sessionStorage.removeItem('foodipe_user');
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, isLoading }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
