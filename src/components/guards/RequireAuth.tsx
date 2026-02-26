import { Navigate, useLocation, Outlet } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';

/**
 * Route guard that ensures user is authenticated.
 * Wraps protected routes — redirects to /login if not authenticated.
 * 
 * Usage in App.tsx:
 * ```tsx
 * <Route element={<RequireAuth />}>
 *   <Route path="/profile" element={<ProfilePage />} />
 * </Route>
 * ```
 */
const RequireAuth = () => {
    const { isAuthenticated } = useAuth();
    const location = useLocation();

    if (!isAuthenticated) {
        // Redirect to login, preserving the intended destination
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    return <Outlet />;
};

export default RequireAuth;
