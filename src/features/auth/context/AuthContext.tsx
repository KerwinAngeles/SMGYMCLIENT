import { createContext, useEffect, useState } from 'react';
import type { ReactNode } from 'react';
import { type User, type AuthContextType, type AuthRequest, type RegisterRequest, ContextInitialValues } from '@/features/auth/types';
import { authService } from '@/features/auth/services/authService'
import { tokenStorage } from '@/features/auth/services/tokenStorage'
import { toast } from 'sonner';

interface AuthProviderProps {
    children: ReactNode;
}

export const UserAuthContext = createContext<AuthContextType>(ContextInitialValues);

export const AuthProvider = (authProviderProps: AuthProviderProps) => {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    const logout = async () => {
        setIsLoading(true);
        try {
            await authService.logout();
        } catch (error) {
            console.error('Logout error:', error);
        } finally {
            setUser(null);
            setIsLoading(false);
            localStorage.removeItem('userPreferences');
            sessionStorage.clear();
            window.dispatchEvent(new CustomEvent('auth:logout'));
        }
    };

    useEffect(() => {
        const handleLogoutEvent = () => {
            setUser(null);
            setIsLoading(false);
        };
        window.addEventListener('auth:logout', handleLogoutEvent);
        return () => window.removeEventListener('auth:logout', handleLogoutEvent);
    }, []);

    useEffect(() => {
        initializeAuth();
    }, []);


    const initializeAuth = async () => {
        setIsLoading(true);
        try {
            const token = tokenStorage.getToken();
            const refreshToken = tokenStorage.getRefreshToken();

            if (token && !tokenStorage.isTokenExpired()) {
                const userData = await authService.getCurrentUser();
                setUser(userData);
            }
            else if (refreshToken) {
                await authService.refreshTokens();
                const userData = await authService.getCurrentUser();
                setUser(userData);
            }
            else {
                tokenStorage.clearTokens();
                setUser(null);
            }
        } catch (error) {
            tokenStorage.clearTokens();
            setUser(null);
        } finally {
            setIsLoading(false);
        }
    };

    const register = async (credentials: RegisterRequest) => {
        setIsLoading(true);
        try {
            const response = await authService.register(credentials);
            setUser(response.user);
        } catch (error) {
            throw error;
        } finally {
            setIsLoading(false);
        }
    }

    const registerStaff = async (credentials: RegisterRequest) => {

        try {

            if (!credentials.name || !credentials.email || !credentials.username || !credentials.password || !credentials.confirmPassword) {
                await authService.registerStaff(credentials);

            } else {
                setIsLoading(true);
                await authService.registerStaff(credentials);
            }
        } catch (error) {
            throw error;
        } finally {
            setTimeout(() => {
                setIsLoading(false);
            }, 1000);
        }
    }

    const login = async (credentials: AuthRequest) => {
        setIsLoading(true);
        try {
            const response = await authService.login(credentials);
            const userData = {
                name: response.name,
                userName: response.userName,
                email: response.email,
                roles: response.roles
            };
            setUser(userData);
        
            toast.success("Welcome back!", {
                description: `Hello ${userData.name}, you have signed in successfully`,
                duration: 4000
            });
        } catch (error) {
            throw error;
        } finally {
            setIsLoading(false);
        }
    };

    const refreshAuth = async () => {
        try {
            const response = await authService.refreshTokens();
            setUser({
                name: response.name,
                userName: response.userName,
                email: response.email,
                roles: response.roles
            });
        } catch (error) {
            setUser(null);
            tokenStorage.clearTokens();
        }
    };

    const hasRole = (role: string) => user?.roles?.includes(role) || false;
    const hasAnyRole = (roles: string[]) => roles.some(hasRole);

    useEffect(() => {
        if (!user) return;
        const interval = setInterval(() => {
            if (tokenStorage.isTokenExpired()) {
                refreshAuth();
            }
        }, 40 * 60 * 1000);
        return () => clearInterval(interval);
    }, [user]);

    useEffect(() => {
        return () => {
            const intervals = (window as any).authIntervals || [];
            intervals.forEach((interval: any) => clearInterval(interval));
        };
    }, []);

    const value: AuthContextType = {
        user,
        token: tokenStorage.getToken(),
        login,
        register,
        logout,
        refreshAuth,
        isLoading,
        hasRole,
        hasAnyRole,
        registerStaff,
    };

    return (
        <UserAuthContext.Provider value={value}>
            {authProviderProps.children}
        </UserAuthContext.Provider>
    )
};
