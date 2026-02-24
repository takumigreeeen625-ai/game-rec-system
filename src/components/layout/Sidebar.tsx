import { NavLink } from 'react-router-dom';
import { Home, Sparkles, Library, Upload, Settings, X, Gamepad2, LogOut } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

interface SidebarProps {
    isOpen: boolean;
    setIsOpen: (isOpen: boolean) => void;
}

export default function Sidebar({ isOpen, setIsOpen }: SidebarProps) {
    const { user, logout } = useAuth();

    const navItems = [
        { path: '/', name: 'ダッシュボード', icon: Home },
        { path: '/recommendations', name: 'おすすめ', icon: Sparkles },
        { path: '/library', name: 'ライブラリ', icon: Library },
        { path: '/import', name: '取り込み', icon: Upload },
        { path: '/settings', name: '設定', icon: Settings },
    ];

    return (
        <aside className={`sidebar ${isOpen ? 'open' : ''}`}>
            <div className="sidebar-header">
                <div className="logo">
                    <div className="logo-icon">
                        <Gamepad2 size={24} />
                    </div>
                    <span className="logo-text">GameRec</span>
                </div>
                <button
                    className="close-btn mobile-only"
                    onClick={() => setIsOpen(false)}
                    aria-label="Close menu"
                >
                    <X size={24} />
                </button>
            </div>

            <nav className="sidebar-nav">
                <ul>
                    {navItems.map((item) => (
                        <li key={item.path}>
                            <NavLink
                                to={item.path}
                                className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
                                onClick={() => setIsOpen(false)}
                                end={item.path === '/'}
                            >
                                <item.icon size={20} className="nav-icon" />
                                <span>{item.name}</span>
                            </NavLink>
                        </li>
                    ))}
                </ul>
            </nav>

            <div className="sidebar-footer">
                <div className="user-profile-mini" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <div className="avatar" style={{ textTransform: 'uppercase' }}>{user?.displayName?.[0] || 'U'}</div>
                        <div className="user-info">
                            <span className="user-name">{user?.displayName || 'Guest'}</span>
                            <span className="user-plan">Free Plan</span>
                        </div>
                    </div>
                    <button
                        onClick={logout}
                        style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: '0.25rem' }}
                        title="ログアウト"
                    >
                        <LogOut size={16} />
                    </button>
                </div>
            </div>
        </aside>
    );
}
