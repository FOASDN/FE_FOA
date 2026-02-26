// Staff Dashboard Page

import { useNavigate } from "react-router-dom";
import {
    Clock,
    AlertCircle,
    AlertTriangle,
    CheckCircle2,
    TrendingUp,
    Users as UsersIcon
} from "lucide-react";
import { MOCK_STAFF_ORDERS, getOrdersByStatus, getOrdersByRiskLevel } from "../../../constants/mockStaffOrders";
import { getRiskColor, getRiskLabel, getRiskIcon } from "../../../services/aiService";

export default function StaffDashboard() {
    const navigate = useNavigate();

    const pendingOrders = getOrdersByStatus('pending');
    const processOrders = getOrdersByStatus('processing');
    const completedToday = getOrdersByStatus('completed');
    const highRiskOrders = getOrdersByRiskLevel('high_risk');
    const attentionOrders = getOrdersByRiskLevel('attention');
    const recentOrders = MOCK_STAFF_ORDERS.slice(0, 5);

    const stats = [
        { label: "Chờ xử lý", value: pendingOrders.length, icon: Clock, color: "#ee8c2b" },
        { label: "Đang xử lý", value: processOrders.length, icon: TrendingUp, color: "#ee8c2b" },
        { label: "Hoàn thành hôm nay", value: completedToday.length, icon: CheckCircle2, color: "#10b981" },
        { label: "Nguy cơ cao", value: highRiskOrders.length, icon: AlertTriangle, color: "#ef4444", bg: "bg-red-50" },
    ];

    return (
        <div className="max-w-[1400px] mx-auto">
            {/* Welcome */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8 p-6 bg-white rounded-2xl border-2 border-[#e7dbcf]">
                <div>
                    <h1 className="text-[32px] font-extrabold text-[#1b140d] mb-2">Chào mừng đến Staff Portal! 👋</h1>
                    <p className="text-base text-[#9a734c]">Quản lý đơn hàng với sự hỗ trợ của AI</p>
                </div>
                <button
                    className="px-6 py-3 bg-[#ee8c2b] hover:bg-[#d97706] text-white rounded-xl font-bold text-[15px] transition-all duration-300 shrink-0"
                    onClick={() => navigate('/staff/orders')}
                >
                    Xem tất cả đơn hàng
                </button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5 mb-8">
                {stats.map((stat, i) => (
                    <div
                        key={i}
                        className={`flex items-center gap-5 p-6 rounded-2xl border border-[#e7dbcf] bg-white hover:border-[#ee8c2b] hover:shadow-[0_4px_16px_rgba(238,140,43,0.15)] transition-all duration-300 cursor-pointer ${stat.bg || ''}`}
                    >
                        <div className="w-14 h-14 flex items-center justify-center bg-white rounded-[14px] shadow-[0_4px_12px_rgba(0,0,0,0.1)]" style={{ color: stat.color }}>
                            <stat.icon className="w-7 h-7" />
                        </div>
                        <div>
                            <div className="text-4xl font-extrabold text-[#1b140d] leading-none mb-1.5">{stat.value}</div>
                            <div className="text-sm font-semibold text-[#9a734c]">{stat.label}</div>
                        </div>
                    </div>
                ))}
            </div>

            {/* AI Alerts */}
            {(highRiskOrders.length > 0 || attentionOrders.length > 0) && (
                <div className="mb-8">
                    <h2 className="flex items-center gap-3 text-[22px] font-bold text-[#1b140d] mb-5">
                        <AlertCircle className="w-6 h-6 text-[#ee8c2b]" />
                        AI Cảnh báo - Cần chú ý
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        {highRiskOrders.length > 0 && (
                            <div className="p-5 rounded-2xl border-2 border-red-500 bg-red-50 shadow-[0_4px_16px_rgba(0,0,0,0.08)]">
                                <div className="flex items-center gap-2 text-base font-bold text-red-900 mb-4 pb-3 border-b-2 border-red-500">
                                    <AlertTriangle className="w-5 h-5" />
                                    <span>Nguy cơ cao ({highRiskOrders.length})</span>
                                </div>
                                <ul className="space-y-2">
                                    {highRiskOrders.slice(0, 3).map(order => (
                                        <li
                                            key={order.id}
                                            onClick={() => navigate('/staff/orders')}
                                            className="p-3 bg-white rounded-[10px] cursor-pointer hover:shadow-[0_2px_8px_rgba(0,0,0,0.1)] transition-all text-sm"
                                        >
                                            <strong className="text-[#1b140d]">{order.orderNumber}</strong> - {order.customerName}
                                            <span className="block text-xs text-gray-500 mt-1">{order.aiAnalysis.reasons[0]}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}
                        {attentionOrders.length > 0 && (
                            <div className="p-5 rounded-2xl border-2 border-amber-500 bg-amber-50 shadow-[0_4px_16px_rgba(0,0,0,0.08)]">
                                <div className="flex items-center gap-2 text-base font-bold text-amber-900 mb-4 pb-3 border-b-2 border-amber-500">
                                    <AlertCircle className="w-5 h-5" />
                                    <span>Cần chú ý ({attentionOrders.length})</span>
                                </div>
                                <ul className="space-y-2">
                                    {attentionOrders.slice(0, 3).map(order => (
                                        <li
                                            key={order.id}
                                            onClick={() => navigate('/staff/orders')}
                                            className="p-3 bg-white rounded-[10px] cursor-pointer hover:shadow-[0_2px_8px_rgba(0,0,0,0.1)] transition-all text-sm"
                                        >
                                            <strong className="text-[#1b140d]">{order.orderNumber}</strong> - {order.customerName}
                                            <span className="block text-xs text-gray-500 mt-1">{order.aiAnalysis.reasons[0]}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* Recent Orders Table */}
            <div className="mb-8">
                <h2 className="flex items-center gap-3 text-[22px] font-bold text-[#1b140d] mb-5">
                    <Clock className="w-6 h-6 text-[#ee8c2b]" />
                    Đơn hàng gần đây
                </h2>
                <div className="bg-white rounded-2xl shadow-[0_4px_16px_rgba(0,0,0,0.08)] overflow-hidden">
                    {/* Header */}
                    <div className="hidden lg:grid grid-cols-[120px_1fr_100px_150px_120px_150px] gap-4 px-5 py-4 bg-[#f3ede7] text-[13px] font-bold text-[#9a734c] uppercase tracking-wide">
                        <div>Đơn hàng</div><div>Khách hàng</div><div>Món</div><div>Risk Level</div><div>Trạng thái</div><div>Thời gian</div>
                    </div>
                    {/* Rows */}
                    {recentOrders.map(order => (
                        <div
                            key={order.id}
                            onClick={() => navigate('/staff/orders')}
                            className="grid grid-cols-2 lg:grid-cols-[120px_1fr_100px_150px_120px_150px] gap-4 px-5 py-4 border-b border-[#e7dbcf] last:border-b-0 cursor-pointer hover:bg-[#f3ede7] transition-all items-center text-sm text-[#1b140d]"
                        >
                            <div className="font-bold">{order.orderNumber}</div>
                            <div className="flex items-center gap-2.5">
                                <img src={order.customerAvatar} alt={order.customerName} className="w-8 h-8 rounded-full object-cover border-2 border-[#e7dbcf]" />
                                <span>{order.customerName}</span>
                            </div>
                            <div className="hidden lg:block">{order.items.length} món</div>
                            <div>
                                <span className="px-2.5 py-1 rounded-xl text-xs font-semibold text-white" style={{ backgroundColor: getRiskColor(order.aiRiskLevel) }}>
                                    {getRiskIcon(order.aiRiskLevel)} {getRiskLabel(order.aiRiskLevel)}
                                </span>
                            </div>
                            <div>
                                <span className={`px-2.5 py-1 rounded-xl text-xs font-semibold ${order.status === 'pending' ? 'bg-[#fff8f0] text-[#ee8c2b]' :
                                        order.status === 'processing' ? 'bg-[#f3ede7] text-[#9a734c]' :
                                            'bg-emerald-100 text-emerald-800'
                                    }`}>
                                    {order.status === 'pending' && 'Chờ xử lý'}
                                    {order.status === 'processing' && 'Đang xử lý'}
                                    {order.status === 'completed' && 'Hoàn thành'}
                                </span>
                            </div>
                            <div className="hidden lg:block text-[#9a734c]">{order.createdAt}</div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Quick Actions */}
            <div className="mb-8">
                <h2 className="flex items-center gap-3 text-[22px] font-bold text-[#1b140d] mb-5">
                    <UsersIcon className="w-6 h-6 text-[#ee8c2b]" />
                    Quick Actions
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <button
                        className="flex flex-col items-center gap-3 p-6 bg-white border-2 border-[#e7dbcf] rounded-2xl hover:border-[#ee8c2b] hover:shadow-[0_4px_16px_rgba(238,140,43,0.15)] transition-all text-[15px] font-semibold text-[#1b140d]"
                        onClick={() => navigate('/staff/orders')}
                    >
                        <Clock className="w-8 h-8 text-[#ee8c2b]" />
                        <span>Xem đơn chờ</span>
                        <div className="text-2xl font-extrabold">{pendingOrders.length}</div>
                    </button>
                    <button
                        className="flex flex-col items-center gap-3 p-6 bg-white border-2 border-[#e7dbcf] rounded-2xl hover:border-red-500 hover:shadow-[0_4px_16px_rgba(239,68,68,0.15)] transition-all text-[15px] font-semibold text-[#1b140d]"
                        onClick={() => navigate('/staff/orders')}
                    >
                        <AlertTriangle className="w-8 h-8 text-red-500" />
                        <span>Đơn nguy cơ cao</span>
                        <div className="text-2xl font-extrabold">{highRiskOrders.length}</div>
                    </button>
                    <button
                        className="flex flex-col items-center gap-3 p-6 bg-white border-2 border-[#e7dbcf] rounded-2xl hover:border-[#ee8c2b] hover:shadow-[0_4px_16px_rgba(238,140,43,0.15)] transition-all text-[15px] font-semibold text-[#1b140d]"
                        onClick={() => navigate('/staff/customers')}
                    >
                        <UsersIcon className="w-8 h-8 text-[#ee8c2b]" />
                        <span>Khách hàng</span>
                    </button>
                </div>
            </div>
        </div>
    );
}
