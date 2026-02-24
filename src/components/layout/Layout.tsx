import { ReactNode, useState } from 'react';
import Sidebar from './Sidebar';
import Header from './Header';
import './layout.css';

interface LayoutProps {
    children: ReactNode;
    title?: string;
}

export default function Layout({ children, title }: LayoutProps) {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    return (
        <div className="layout-container">
            <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />

            <div className="layout-main">
                <Header
                    title={title}
                    onMenuToggle={() => setIsSidebarOpen(!isSidebarOpen)}
                />
                <main className="layout-content">
                    <div className="content-inner">
                        {children}
                    </div>
                </main>
            </div>

            {/* Overlay for mobile sidebar */}
            {isSidebarOpen && (
                <div
                    className="sidebar-overlay"
                    onClick={() => setIsSidebarOpen(false)}
                />
            )}
        </div>
    );
}
