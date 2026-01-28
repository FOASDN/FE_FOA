import React, { useRef, useState, useEffect } from "react";
import {
    MapPin,
    Search,
    ChevronRight,
    ShoppingCart,
    Utensils,
    Heart,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

interface HomeHeaderProps {
    searchQuery?: string;
    onSearchChange?: (query: string) => void;
    cartCount?: number;
}

const HomeHeader = ({ searchQuery, onSearchChange, cartCount = 2 }: HomeHeaderProps) => {
    const navigate = useNavigate();
    const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsUserMenuOpen(false);
            }
        };

        if (isUserMenuOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isUserMenuOpen]);

    return (
        <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-gray-100 px-4 md:px-8 py-4 transition-all duration-300">
            <div className="max-w-7xl mx-auto flex items-center justify-between gap-6">
                {/* Logo */}
                <div className="flex items-center gap-6 md:gap-10">
                    <div
                        onClick={() => navigate("/")}
                        className="flex items-center gap-2.5 text-orange-600 cursor-pointer group"
                    >
                        <div className="bg-orange-600 text-white p-2 rounded-xl group-hover:rotate-12 transition-transform duration-300">
                            <Utensils className="w-5 h-5" />
                        </div>
                        <h2 className="text-2xl font-black tracking-tighter">FoodieDash</h2>
                    </div>
                </div>

                {/* Search */}
                <div className="flex-1 max-w-xl hidden md:block">
                    <div className="relative group">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-orange-500 transition-colors" />
                        <input
                            type="text"
                            placeholder="Bạn thèm món gì hôm nay?"
                            value={searchQuery}
                            onChange={(e) => onSearchChange?.(e.target.value)}
                            className="w-full bg-gray-100/50 border border-transparent group-hover:bg-white group-hover:border-gray-200 focus:bg-white focus:border-orange-500/50 focus:ring-4 focus:ring-orange-500/10 rounded-full py-3 pl-12 pr-6 text-sm font-medium outline-none transition-all duration-300"
                        />
                    </div>
                </div>

                {/* Menu & Actions */}
                <div className="flex items-center gap-1 md:gap-4">
                    <nav className="hidden lg:flex items-center gap-6 mr-4 font-bold text-sm text-slate-600">
                        <a href="/menu" className="hover:text-orange-600 transition-colors">Thực đơn</a>
                        <a href="#" className="hover:text-orange-600 transition-colors">Đặt bàn</a>
                        <a href="#" className="hover:text-orange-600 transition-colors">Về chúng tôi</a>
                        <a href="#" className="flex items-center gap-1 hover:text-orange-600 transition-colors">
                            Theo dõi đơn <span className="bg-red-100 text-red-600 text-[10px] px-1.5 py-0.5 rounded-full">1</span>
                        </a>
                    </nav>

                    <div className="h-6 w-px bg-gray-200 hidden lg:block mx-2"></div>

                    {/* Cart Button */}
                    <button className="relative p-2.5 rounded-full bg-white border border-gray-200 text-gray-700 hover:border-orange-200 hover:text-orange-600 hover:shadow-lg hover:shadow-orange-500/20 transition-all duration-300 group">
                        <ShoppingCart className="w-5 h-5 group-hover:scale-110 transition-transform" />
                        <span className="absolute -top-0.5 -right-0.5 bg-orange-600 text-white text-[10px] font-bold h-5 w-5 flex items-center justify-center rounded-full border-2 border-white">{cartCount}</span>
                    </button>

                    {/* User Avatar with Dropdown */}
                    <div className="relative" ref={dropdownRef}>
                        <button
                            onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                            className="w-10 h-10 rounded-full p-0.5 bg-gradient-to-tr from-orange-500 to-yellow-400 cursor-pointer hover:scale-105 transition-transform"
                        >
                            <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix" alt="User" className="w-full h-full object-cover rounded-full border-2 border-white" />
                        </button>

                        {/* Dropdown Menu */}
                        {isUserMenuOpen && (
                            <div className="absolute right-0 top-full mt-2 w-64 bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                                {/* User Info */}
                                <div className="p-4 bg-gradient-to-br from-orange-50 to-yellow-50 border-b border-gray-100">
                                    <div className="flex items-center gap-3">
                                        <div className="w-12 h-12 rounded-full p-0.5 bg-gradient-to-tr from-orange-500 to-yellow-400">
                                            <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix" alt="User" className="w-full h-full object-cover rounded-full border-2 border-white" />
                                        </div>
                                        <div className="flex-1">
                                            <h4 className="font-bold text-slate-900">Nguyễn Văn A</h4>
                                            <p className="text-xs text-slate-500">nguyenvana@email.com</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Menu Items */}
                                <div className="p-2">
                                    <a href="#" className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-orange-50 transition-colors group">
                                        <div className="w-9 h-9 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center group-hover:bg-orange-600 group-hover:text-white transition-colors">
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                            </svg>
                                        </div>
                                        <div className="flex-1">
                                            <p className="font-semibold text-sm text-slate-800">Tài khoản</p>
                                            <p className="text-xs text-slate-500">Quản lý thông tin cá nhân</p>
                                        </div>
                                    </a>

                                    <a href="#" className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-orange-50 transition-colors group">
                                        <div className="w-9 h-9 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-colors">
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                                            </svg>
                                        </div>
                                        <div className="flex-1">
                                            <p className="font-semibold text-sm text-slate-800">Đơn hàng</p>
                                            <p className="text-xs text-slate-500">Xem lịch sử đặt hàng</p>
                                        </div>
                                    </a>

                                    <a href="#" className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-orange-50 transition-colors group">
                                        <div className="w-9 h-9 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center group-hover:bg-purple-600 group-hover:text-white transition-colors">
                                            <Heart className="w-5 h-5" />
                                        </div>
                                        <div className="flex-1">
                                            <p className="font-semibold text-sm text-slate-800">Yêu thích</p>
                                            <p className="text-xs text-slate-500">Món ăn đã lưu</p>
                                        </div>
                                    </a>

                                    <a href="#" className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-orange-50 transition-colors group">
                                        <div className="w-9 h-9 rounded-full bg-green-100 text-green-600 flex items-center justify-center group-hover:bg-green-600 group-hover:text-white transition-colors">
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                            </svg>
                                        </div>
                                        <div className="flex-1">
                                            <p className="font-semibold text-sm text-slate-800">Cài đặt</p>
                                            <p className="text-xs text-slate-500">Tùy chỉnh ứng dụng</p>
                                        </div>
                                    </a>
                                </div>

                                {/* Logout */}
                                <div className="p-2 border-t border-gray-100">
                                    <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-red-50 transition-colors group">
                                        <div className="w-9 h-9 rounded-full bg-red-100 text-red-600 flex items-center justify-center group-hover:bg-red-600 group-hover:text-white transition-colors">
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                                            </svg>
                                        </div>
                                        <p className="font-semibold text-sm text-slate-800">Đăng xuất</p>
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </header>
    );
};

export default HomeHeader;
