// Staff Customer Profile Page

import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, AlertTriangle, TrendingUp, Calendar, Sparkles } from "lucide-react";
import { getCustomerById, MOCK_CUSTOMER_PROFILES } from "../../../constants/mockCustomers";
import { MOCK_STAFF_ORDERS } from "../../../constants/mockStaffOrders";
import { generateCustomerInsights } from "../../../services/aiService";

export default function StaffCustomerProfile() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [selectedCustomer, setSelectedCustomer] = useState(
        id ? getCustomerById(id) : MOCK_CUSTOMER_PROFILES[0]
    );

    if (!selectedCustomer) {
        return (
            <div className="max-w-[1200px] mx-auto">
                <div className="text-center py-16">
                    <h2 className="text-xl font-bold text-[#1b140d] mb-4">Không tìm thấy khách hàng</h2>
                    <button className="px-6 py-3 bg-[#ee8c2b] text-white rounded-xl font-bold hover:bg-[#d97706] transition-colors" onClick={() => navigate('/staff')}>Quay lại Dashboard</button>
                </div>
            </div>
        );
    }

    const customerOrders = MOCK_STAFF_ORDERS.filter(order => order.customerId === selectedCustomer.id);
    const insights = generateCustomerInsights(selectedCustomer);

    return (
        <div className="max-w-[1200px] mx-auto">
            {/* Back */}
            <button className="inline-flex items-center gap-2 px-[18px] py-2.5 bg-white border-2 border-[#e7dbcf] rounded-[10px] font-semibold text-[#6b5744] hover:border-[#ee8c2b] hover:text-[#ee8c2b] transition-all mb-6" onClick={() => navigate('/staff')}>
                <ArrowLeft className="w-[18px] h-[18px]" />
                <span>Quay lại</span>
            </button>

            {/* Customer Header */}
            <div className="flex flex-col sm:flex-row items-center gap-6 bg-[#ee8c2b] rounded-[20px] p-8 shadow-[0_8px_24px_rgba(238,140,43,0.3)] mb-6 text-white">
                <img src={selectedCustomer.avatar} alt={selectedCustomer.name} className="w-[120px] h-[120px] rounded-full object-cover border-4 border-white shadow-[0_8px_24px_rgba(0,0,0,0.2)]" />
                <div className="flex-1 text-center sm:text-left">
                    <h1 className="text-4xl font-extrabold mb-3">{selectedCustomer.name}</h1>
                    <div className="flex flex-col sm:flex-row gap-2 sm:gap-5 mb-3 opacity-95 text-sm">
                        <span>✉️ {selectedCustomer.email}</span>
                        <span>📞 {selectedCustomer.phone}</span>
                    </div>
                    <div className="flex gap-2.5 justify-center sm:justify-start">
                        {selectedCustomer.orderHistory.totalOrders > 50 && <span className="px-3.5 py-1.5 rounded-xl text-[13px] font-bold bg-white text-orange-600">⭐ VIP Customer</span>}
                        {selectedCustomer.orderHistory.totalOrders > 20 && <span className="px-3.5 py-1.5 rounded-xl text-[13px] font-bold bg-white text-red-600">🔥 Khách quen</span>}
                    </div>
                </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
                <div className="flex items-center gap-4 p-5 bg-white rounded-2xl shadow-[0_4px_16px_rgba(0,0,0,0.08)]">
                    <TrendingUp className="w-10 h-10 text-[#ee8c2b]" />
                    <div>
                        <div className="text-[32px] font-extrabold text-[#1b140d] leading-none mb-1">{selectedCustomer.orderHistory.totalOrders}</div>
                        <div className="text-sm text-[#9a734c] font-semibold">Tổng đơn hàng</div>
                    </div>
                </div>
                <div className="flex items-center gap-4 p-5 bg-white rounded-2xl shadow-[0_4px_16px_rgba(0,0,0,0.08)]">
                    <Calendar className="w-10 h-10 text-[#ee8c2b]" />
                    <div>
                        <div className="text-[32px] font-extrabold text-[#1b140d] leading-none mb-1">{customerOrders.length}</div>
                        <div className="text-sm text-[#9a734c] font-semibold">Đơn trong hệ thống</div>
                    </div>
                </div>
            </div>

            {/* Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-[1.2fr_1fr] gap-6 mb-8">
                {/* Allergies & Health */}
                <div className="bg-white rounded-[20px] p-7 shadow-[0_4px_20px_rgba(0,0,0,0.08)]">
                    <h2 className="flex items-center gap-3 text-[22px] font-extrabold text-[#1b140d] mb-6">
                        <AlertTriangle className="w-6 h-6 text-red-500" /> Dị ứng & Sức khỏe
                    </h2>

                    {selectedCustomer.allergies.length > 0 && (
                        <div className="p-5 rounded-[14px] border-2 border-red-500 bg-red-50 text-red-900 mb-4">
                            <h3 className="text-base font-bold mb-3.5">⚠️ Dị ứng</h3>
                            <div className="flex flex-wrap gap-2.5">
                                {selectedCustomer.allergies.map((a, i) => <span key={i} className="px-4 py-2 rounded-xl font-bold text-sm bg-white">{a}</span>)}
                            </div>
                        </div>
                    )}
                    {selectedCustomer.healthConditions.length > 0 && (
                        <div className="p-5 rounded-[14px] border-2 border-[#ee8c2b] bg-[#f3ede7] text-[#9a734c] mb-4">
                            <h3 className="text-base font-bold mb-3.5">💊 Tình trạng sức khỏe</h3>
                            <div className="flex flex-wrap gap-2.5">
                                {selectedCustomer.healthConditions.map((c, i) => <span key={i} className="px-4 py-2 rounded-xl font-bold text-sm bg-white">{c}</span>)}
                            </div>
                        </div>
                    )}
                    {selectedCustomer.dietaryPreferences.length > 0 && (
                        <div className="p-5 rounded-[14px] border-2 border-emerald-500 bg-emerald-50 text-emerald-900 mb-4">
                            <h3 className="text-base font-bold mb-3.5">🥗 Chế độ ăn</h3>
                            <div className="flex flex-wrap gap-2.5">
                                {selectedCustomer.dietaryPreferences.map((p, i) => <span key={i} className="px-4 py-2 rounded-xl font-bold text-sm bg-white">{p}</span>)}
                            </div>
                        </div>
                    )}
                    {selectedCustomer.specialNotes.length > 0 && (
                        <div className="p-5 rounded-[14px] border-2 border-amber-500 bg-amber-50 text-amber-900 mb-4">
                            <h3 className="text-base font-bold mb-3.5">📝 Ghi chú đặc biệt</h3>
                            <ul className="space-y-1.5">
                                {selectedCustomer.specialNotes.map((n, i) => <li key={i} className="p-2 px-3 bg-white rounded-lg text-sm">{n}</li>)}
                            </ul>
                        </div>
                    )}
                    {selectedCustomer.orderHistory.lastIncident && (
                        <div className="p-5 rounded-[14px] border-2 border-red-600 bg-red-50 text-red-900">
                            <h3 className="text-base font-bold mb-3.5">🚨 Sự cố gần nhất</h3>
                            <p className="p-3 bg-white rounded-lg text-sm font-semibold">{selectedCustomer.orderHistory.lastIncident}</p>
                        </div>
                    )}
                </div>

                {/* AI Insights */}
                <div className="bg-white rounded-[20px] p-7 shadow-[0_4px_20px_rgba(0,0,0,0.08)]">
                    <h2 className="flex items-center gap-3 text-[22px] font-extrabold text-[#1b140d] mb-6">
                        <Sparkles className="w-6 h-6 text-[#ee8c2b] animate-pulse" /> AI Insights
                    </h2>
                    <div className="flex flex-col gap-3 mb-5">
                        {insights.map((insight, i) => (
                            <div key={i} className={`p-4 rounded-xl border-l-4 ${insight.type === 'warning' ? 'bg-red-50 border-l-red-500' :
                                    insight.type === 'pattern' ? 'bg-[#f3ede7] border-l-[#ee8c2b]' :
                                        'bg-emerald-50 border-l-emerald-500'
                                }`}>
                                <div className="flex items-center gap-2 mb-2 text-[13px] font-bold">
                                    {insight.type === 'warning' && '⚠️'}
                                    {insight.type === 'pattern' && '📊'}
                                    {insight.type === 'preference' && '⭐'}
                                    <span className="uppercase tracking-wide">
                                        {insight.type === 'warning' && 'Cảnh báo'}
                                        {insight.type === 'pattern' && 'Pattern'}
                                        {insight.type === 'preference' && 'Thông tin'}
                                    </span>
                                    <span className="ml-auto px-2.5 py-1 bg-black/10 rounded-lg text-[11px]">{insight.confidence}% Confidence</span>
                                </div>
                                <p className="text-sm text-[#6b5744] font-medium">{insight.message}</p>
                            </div>
                        ))}
                    </div>

                    {/* Common Requests */}
                    <div className="p-5 bg-[#fff8f0] rounded-[14px] border-2 border-[#ee8c2b]">
                        <h3 className="text-base font-bold text-[#ee8c2b] mb-3">🔄 Yêu cầu thường gặp</h3>
                        <div className="flex flex-wrap gap-2">
                            {selectedCustomer.orderHistory.commonRequests.map((req, i) => (
                                <span key={i} className="px-3 py-1.5 bg-white rounded-[10px] text-[13px] font-semibold text-[#d97706]">{req}</span>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Customer Selection */}
            <div className="bg-white rounded-[20px] p-7 shadow-[0_4px_20px_rgba(0,0,0,0.08)]">
                <h2 className="text-[22px] font-extrabold text-[#1b140d] mb-5">👥 Tất cả khách hàng</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3">
                    {MOCK_CUSTOMER_PROFILES.map(customer => (
                        <div
                            key={customer.id}
                            className={`flex items-center gap-3 p-3 rounded-xl border-2 cursor-pointer transition-all ${selectedCustomer.id === customer.id
                                    ? 'bg-[#fff8f0] border-[#ee8c2b]'
                                    : 'bg-[#f8f7f6] border-transparent hover:bg-white hover:border-[#ee8c2b] hover:shadow-[0_4px_12px_rgba(238,140,43,0.2)]'
                                }`}
                            onClick={() => setSelectedCustomer(customer)}
                        >
                            <img src={customer.avatar} alt={customer.name} className="w-12 h-12 rounded-full object-cover border-2 border-[#e7dbcf]" />
                            <div className="flex-1 min-w-0">
                                <div className="text-sm font-bold text-[#1b140d] mb-0.5 truncate">{customer.name}</div>
                                <div className="text-xs text-[#9a734c]">{customer.orderHistory.totalOrders} đơn</div>
                            </div>
                            {(customer.allergies.length > 0 || customer.healthConditions.length > 0) && (
                                <AlertTriangle className="w-5 h-5 text-red-500 shrink-0" />
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
