import { Outlet, NavLink, useNavigate } from "react-router-dom";
import {
    LayoutDashboard,
    ShoppingBag,
    Users,
    Sparkles,
    LogOut,
    Menu,
    X,
    UtensilsCrossed,
    Bell
} from "lucide-react";
import { useState } from "react";
import { useNotificationSound } from "@/hooks/useNotificationSound";

export default function StaffLayout() {
    const navigate = useNavigate();
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const { playNotification } = useNotificationSound();

    const handleLogout = () => {
        navigate('/login');
    };

    const navItems = [
        { path: '/staff', label: 'Dashboard', icon: LayoutDashboard, exact: true },
        { path: '/staff/orders', label: 'Đơn hàng', icon: ShoppingBag },
        { path: '/staff/menu', label: 'Thực đơn', icon: UtensilsCrossed },
        { path: '/staff/customers', label: 'Khách hàng', icon: Users },
    ];

    return (
        <div className="flex h-screen bg-[#f8f7f6] overflow-hidden">
            {/* Sidebar */}
            <div className={`w-[280px] bg-white border-r border-[#e7dbcf] flex flex-col z-[100] transition-transform duration-300 max-lg:fixed max-lg:top-0 max-lg:left-0 max-lg:h-screen ${sidebarOpen ? 'max-lg:translate-x-0' : 'max-lg:-translate-x-full'}`}>
                <div className="px-5 py-6 border-b border-[#e7dbcf] flex justify-between items-center">
                    <div
                        onClick={() => navigate("/")}
                        className="flex items-center gap-2.5 text-orange-600 cursor-pointer group"
                    >
                        <div className="bg-orange-600 text-white p-2 rounded-xl group-hover:rotate-12 transition-transform duration-300 flex items-center justify-center">
                            <span className="material-symbols-outlined text-[20px]">restaurant_menu</span>
                        </div>
                        <div className="flex flex-col">
                            <span className="text-2xl font-black tracking-tighter m-0 leading-none">FoodieDash</span>
                            <span className="text-[10px] font-bold uppercase tracking-wider text-orange-600/80 mt-1">Staff Portal</span>
                        </div>
                    </div>
                    <button className="hidden max-lg:block bg-transparent border-none text-[#1b140d] cursor-pointer p-2" onClick={() => setSidebarOpen(false)}>
                        <X className="w-6 h-6" />
                    </button>
                </div>

                <nav className="flex-1 p-4 overflow-y-auto scrollbar-thin scrollbar-thumb-[#e7dbcf]">
                    {navItems.map((item) => (
                        <NavLink
                            key={item.path}
                            to={item.path}
                            end={item.exact}
                            className={({ isActive }) =>
                                `flex items-center gap-3 px-4 py-3.5 rounded-xl mb-2 text-[15px] font-medium transition-all ${isActive
                                    ? 'bg-[#ee8c2b]/10 text-[#ee8c2b]'
                                    : 'text-[#9a734c] hover:bg-[#f3ede7] hover:text-[#1b140d]'
                                }`
                            }
                            onClick={() => setSidebarOpen(false)}
                        >
                            <item.icon className="w-5 h-5" />
                            <span>{item.label}</span>
                        </NavLink>
                    ))}
                </nav>

                <div className="p-5 border-t border-[#e7dbcf]">
                    <div className="flex items-center gap-3 p-4 bg-[#f3ede7] rounded-xl mb-3 border border-[#e7dbcf]">
                        <Sparkles className="w-6 h-6 text-[#ee8c2b]" />
                        <div>
                            <div className="text-xs text-[#9a734c] font-medium">AI Assistant</div>
                            <div className="text-sm text-[#ee8c2b] font-bold">Active</div>
                        </div>
                        <div className="w-2 h-2 rounded-full ml-auto bg-emerald-500 shadow-[0_0_10px_#10b981] animate-pulse" />
                    </div>
                    <button className="w-full flex items-center justify-center gap-2 py-3 bg-white border border-[#e7dbcf] text-[#9a734c] rounded-[10px] font-semibold hover:bg-[#f3ede7] hover:text-[#1b140d] transition-all" onClick={handleLogout}>
                        <LogOut className="w-[18px] h-[18px]" />
                        <span>Đăng xuất</span>
                    </button>
                </div>
            </div>

            {/* Main */}
            <div className="flex-1 flex flex-col overflow-hidden">
                {/* Topbar */}
                <div className="bg-white px-8 py-5 max-lg:px-5 max-lg:py-4 flex items-center justify-between border-b border-[#e7dbcf] z-50">
                    <button className="hidden max-lg:block bg-transparent border-none cursor-pointer p-2 text-[#1b140d]" onClick={() => setSidebarOpen(true)}>
                        <Menu className="w-6 h-6" />
                    </button>
                    <div>
                        <h1 className="text-2xl max-lg:text-lg font-bold text-[#1b140d] m-0">Food Order Staff Portal</h1>
                        <p className="text-sm max-lg:text-xs text-[#9a734c] mt-1">AI-Powered Order Management</p>
                    </div>
                    <div className="flex items-center gap-3">
                        <button onClick={playNotification} className="relative p-2 rounded-xl hover:bg-[#f3ede7] transition-colors" title="Kiểm tra âm thanh thông báo">
                            <Bell className="w-5 h-5 text-[#1b140d]" />
                            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                        </button>
                        <div className="flex items-center gap-3">
                            <img src="https://i.pravatar.cc/150?img=8" alt="Staff" className="w-12 h-12 max-sm:w-10 max-sm:h-10 rounded-full border-2 border-[#ee8c2b] object-cover" />
                            <div className="text-right max-lg:hidden">
                                <div className="text-sm font-semibold text-[#1b140d]">Nhân viên #001</div>
                                <div className="text-xs text-[#9a734c]">Staff</div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-8 max-lg:p-5">
                    <Outlet />
                </div>
            </div>

            {/* Mobile Overlay */}
            {sidebarOpen && (
                <div className="fixed inset-0 bg-black/50 z-[90] lg:hidden" onClick={() => setSidebarOpen(false)} />
            )}
        </div>
    );
}
