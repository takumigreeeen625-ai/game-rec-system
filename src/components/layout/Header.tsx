import { Menu, Search, Bell } from 'lucide-react';

interface HeaderProps {
    title?: string;
    onMenuToggle: () => void;
}

export default function Header({ title, onMenuToggle }: HeaderProps) {
    return (
        <header className="header glass-panel">
            <div className="header-left">
                <button
                    className="menu-btn mobile-only"
                    onClick={onMenuToggle}
                    aria-label="Open menu"
                >
                    <Menu size={24} />
                </button>
                {title && <h1 className="page-title">{title}</h1>}
            </div>

            <div className="header-right">
                <div className="search-bar hidden-mobile">
                    <Search size={18} className="search-icon" />
                    <input type="text" placeholder="ゲームを検索..." />
                </div>

                <button className="icon-btn notification-btn">
                    <Bell size={20} />
                    <span className="notification-badge"></span>
                </button>
            </div>
        </header>
    );
}
