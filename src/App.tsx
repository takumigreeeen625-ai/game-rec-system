import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Settings from './pages/Settings';
import Dashboard from './pages/Dashboard';
import Library from './pages/Library';
import GameDetail from './pages/GameDetail';
import MatchCorrection from './pages/MatchCorrection';
import Import from './pages/Import';
import ManualRegister from './pages/ManualRegister';
import Recommendations from './pages/Recommendations';
import BookmarkletReceiver from './pages/BookmarkletReceiver';
import { useAuth } from './context/AuthContext';

function ProtectedRoute({ children }: { children: React.ReactNode }) {
    const { user, isLoading } = useAuth();

    if (isLoading) {
        return <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>Loading session...</div>;
    }

    if (!user) {
        return <Navigate to="/login" replace />;
    }

    return <>{children}</>;
}

function App() {
    return (
        <Router>
            <Routes>
                {/* Auth routes don't use Layout */}
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />

                {/* Main app pages - Protected */}
                <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
                <Route path="/" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
                <Route path="/recommendations" element={<ProtectedRoute><Recommendations /></ProtectedRoute>} />
                <Route path="/library" element={<ProtectedRoute><Library /></ProtectedRoute>} />
                <Route path="/game/:id" element={<ProtectedRoute><GameDetail /></ProtectedRoute>} />
                <Route path="/match-correction" element={<ProtectedRoute><MatchCorrection /></ProtectedRoute>} />
                <Route path="/import" element={<ProtectedRoute><Import /></ProtectedRoute>} />
                <Route path="/import/bookmarklet" element={<ProtectedRoute><BookmarkletReceiver /></ProtectedRoute>} />
                <Route path="/manual-register" element={<ProtectedRoute><ManualRegister /></ProtectedRoute>} />

                {/* Fallback component logic could go here */}
                <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
        </Router>
    );
}

export default App;
