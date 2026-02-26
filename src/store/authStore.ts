import { create } from 'zustand';

// ---- Types (aligned with BE) ----

export type UserRole = 'ADMIN' | 'STAFF' | 'CUSTOMER';

export interface AuthUser {
    _id: string;
    username: string;
    email: string;
    phone?: string;
    role: UserRole;
    isActive: boolean;
    verified_at: string | null;
    collected_points: number;
}

interface AuthState {
    user: AuthUser | null;
    isAuthenticated: boolean;
    role: UserRole | null;

    // Actions
    login: (user: AuthUser) => void;
    logout: () => void;
    setUser: (user: AuthUser) => void;
    hydrate: () => void;
}

// ---- Helpers ----

const STORAGE_KEY = 'foodiedash_user';

function getStoredUser(): AuthUser | null {
    try {
        const raw = localStorage.getItem(STORAGE_KEY);
        return raw ? JSON.parse(raw) : null;
    } catch {
        return null;
    }
}

function setStoredUser(user: AuthUser) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
}

function clearStoredUser() {
    localStorage.removeItem(STORAGE_KEY);
}

// ---- Store ----

/**
 * Cookie-based auth store.
 * Tokens are managed by httpOnly cookies (set by BE).
 * We only store user info in localStorage for quick hydration.
 */
export const useAuthStore = create<AuthState>((set) => ({
    user: null,
    isAuthenticated: false,
    role: null,

    login: (user) => {
        setStoredUser(user);
        set({
            user,
            isAuthenticated: true,
            role: user.role,
        });
    },

    logout: () => {
        clearStoredUser();
        set({
            user: null,
            isAuthenticated: false,
            role: null,
        });
    },

    setUser: (user) => {
        setStoredUser(user);
        set({ user, role: user.role });
    },

    /**
     * Call once on app init to restore auth state from localStorage.
     * Token is in httpOnly cookie, so we only restore user info.
     */
    hydrate: () => {
        const user = getStoredUser();
        if (user) {
            set({
                user,
                isAuthenticated: true,
                role: user.role,
            });
        }
    },
}));
