// components/Sidebar.tsx
import { Inertia } from '@inertiajs/inertia';
import { BarChart3, LogOut, Receipt, Settings, TrendingUp, User, Menu, X, AlertTriangle } from 'lucide-react';
import React, { useState, useEffect } from 'react';

interface SidebarProps {
    activeTab: string;
    setActiveTab: (tab: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab }) => {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [showLogoutModal, setShowLogoutModal] = useState(false);
    
    const menuItems = [
        { id: 'overview', label: 'Dashboard', icon: BarChart3, route: '/' },
        { id: 'expenses', label: 'Transactions', icon: Receipt, route: '/transactions' },
        { id: 'analytics', label: 'Analytics', icon: TrendingUp, route: '/analytics' }, // optional
        { id: 'profile', label: 'Profile', icon: User, route: '/settings/profile' },
    ];

    const handleLogout = () => {
        Inertia.post('/logout', {}, {});
        setShowLogoutModal(false);
    };

    const handleLogoutClick = () => {
        setShowLogoutModal(true);
    };

    const handleCancelLogout = () => {
        setShowLogoutModal(false);
    };

    const handleMenuItemClick = (itemId: string, route: string) => {
        setActiveTab(itemId);
        Inertia.visit(route);
        setIsMobileMenuOpen(false);
    };

    // Close mobile menu when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            const sidebar = document.getElementById('mobile-sidebar');
            const menuButton = document.getElementById('mobile-menu-button');
            
            if (isMobileMenuOpen && 
                sidebar && 
                !sidebar.contains(event.target as Node) &&
                menuButton &&
                !menuButton.contains(event.target as Node)) {
                setIsMobileMenuOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [isMobileMenuOpen]);

    // Prevent body scroll when mobile menu or modal is open
    useEffect(() => {
        if (isMobileMenuOpen || showLogoutModal) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isMobileMenuOpen, showLogoutModal]);

    // Handle ESC key to close modal
    useEffect(() => {
        const handleEscKey = (event: KeyboardEvent) => {
            if (event.key === 'Escape' && showLogoutModal) {
                setShowLogoutModal(false);
            }
        };

        document.addEventListener('keydown', handleEscKey);
        return () => document.removeEventListener('keydown', handleEscKey);
    }, [showLogoutModal]);

    return (
        <>
            {/* Mobile Menu Button */}
            <button
                id="mobile-menu-button"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="fixed top-4 left-4 z-50 flex h-12 w-12 items-center justify-center rounded-xl bg-white shadow-lg border border-gray-200 lg:hidden"
            >
                {isMobileMenuOpen ? (
                    <X className="h-6 w-6 text-gray-600" />
                ) : (
                    <Menu className="h-6 w-6 text-gray-600" />
                )}
            </button>

            {/* Mobile Overlay */}
            {isMobileMenuOpen && (
                <div className="fixed inset-0 z-30 bg-black/50 lg:hidden" />
            )}

            {/* Logout Confirmation Modal */}
            {showLogoutModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
                    <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl">
                        <div className="flex items-center gap-4 mb-4">
                            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
                                <AlertTriangle className="h-6 w-6 text-red-600" />
                            </div>
                            <div>
                                <h3 className="text-lg font-semibold text-gray-900">Confirm Logout</h3>
                                <p className="text-sm text-gray-500">Are you sure you want to sign out?</p>
                            </div>
                        </div>
                        
                        <p className="text-gray-600 mb-6">
                            You will be logged out of your CuanKu account and redirected to the login page.
                        </p>
                        
                        <div className="flex gap-3">
                            <button
                                onClick={handleCancelLogout}
                                className="flex-1 rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleLogout}
                                className="flex-1 rounded-xl bg-red-600 px-4 py-3 text-sm font-medium text-white transition-colors hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                            >
                                Logout
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Sidebar */}
            <div
                id="mobile-sidebar"
                className={`fixed top-0 left-0 z-40 h-full w-80 transform border-r border-gray-200 bg-white shadow-lg transition-transform duration-300 ease-in-out lg:translate-x-0 lg:w-64 ${
                    isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
                }`}
            >
                <div className="flex h-full flex-col p-6">
                    {/* Logo */}
                    <div className="mb-8 flex items-center gap-3 pt-12 lg:pt-0">
                        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-blue-700 shadow-lg">
                            <Receipt className="h-7 w-7 text-white" />
                        </div>
                        <div>
                            <span className="text-xl font-bold text-gray-900">CuanKu</span>
                            <p className="text-xs text-gray-500">Expense Tracker</p>
                        </div>
                    </div>

                    {/* Navigation */}
                    <nav className="flex-1 space-y-1">
                        {menuItems.map((item) => {
                            const Icon = item.icon;
                            const isActive = activeTab === item.id;

                            return (
                                <button
                                    key={item.id}
                                    onClick={() => handleMenuItemClick(item.id, item.route)}
                                    className={`group flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left transition-all duration-200 ${
                                        isActive
                                            ? 'border-r-4 border-blue-600 bg-gradient-to-r from-blue-50 to-blue-100 text-blue-700 shadow-sm'
                                            : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                                    }`}
                                >
                                    <Icon className={`h-5 w-5 transition-transform duration-200 ${isActive ? 'scale-110' : 'group-hover:scale-105'}`} />
                                    <span className="font-medium">{item.label}</span>
                                </button>
                            );
                        })}
                        
                        {/* Logout Button */}
                        <button
                            onClick={handleLogoutClick}
                            className="group flex w-full items-center gap-3 rounded-xl border border-red-200 px-4 py-3 text-left text-red-600 transition-all duration-200 hover:border-red-300 hover:bg-red-50 hover:text-red-700"
                        >
                            <LogOut className="h-5 w-5 transition-transform duration-200 group-hover:scale-105" />
                            <span className="font-medium">Logout</span>
                        </button>
                    </nav>

                    {/* Bottom section */}
                    <div className="mt-auto space-y-4">
                        {/* Pro Tip */}
                        <div className="rounded-xl bg-gradient-to-r from-blue-50 to-indigo-50 p-4">
                            <h4 className="mb-2 font-semibold text-gray-900">Pro Tip</h4>
                            <p className="text-sm text-gray-600">Set monthly budgets to better track your spending habits.</p>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Sidebar;