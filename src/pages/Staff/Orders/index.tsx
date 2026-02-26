// Staff Orders Management Page

import { useState } from "react";
import { Search, Filter, X, CheckCircle, AlertTriangle, XCircle } from "lucide-react";
import { MOCK_STAFF_ORDERS, getOrdersByRiskLevel } from "../../../constants/mockStaffOrders";
import type { StaffOrder } from "../../../constants/mockStaffOrders";
import { getCustomerById } from "../../../constants/mockCustomers";
import { getRiskColor, getRiskLabel, getRiskIcon, getOrderAIInsights } from "../../../services/aiService";
import AIRiskAlert from "../../../components/Staff/AIRiskAlert";
import OrderNotesExplainer from "../../../components/Staff/OrderNotesExplainer";

type StatusFilter = 'all' | 'pending' | 'processing' | 'completed';
type RiskFilter = 'all' | 'normal' | 'attention' | 'high_risk';
type ActionType = 'confirm' | 'review' | 'cancel';

interface Toast {
    id: number;
    type: 'success' | 'warning' | 'error';
    message: string;
}

interface ConfirmationModal {
    type: ActionType;
    order: StaffOrder;
    message: string;
}

export default function StaffOrders() {
    const [searchQuery, setSearchQuery] = useState("");
    const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');
    const [riskFilter, setRiskFilter] = useState<RiskFilter>('all');
    const [selectedOrder, setSelectedOrder] = useState<StaffOrder | null>(null);
    const [toasts, setToasts] = useState<Toast[]>([]);
    const [confirmationModal, setConfirmationModal] = useState<ConfirmationModal | null>(null);
    const [orders, setOrders] = useState(MOCK_STAFF_ORDERS);

    const showToast = (type: Toast['type'], message: string) => {
        const id = Date.now();
        setToasts(prev => [...prev, { id, type, message }]);
        setTimeout(() => { setToasts(prev => prev.filter(t => t.id !== id)); }, 4000);
    };

    const sendCustomerNotification = (order: StaffOrder, actionType: ActionType) => {
        const notifications = {
            confirm: `✅ Đơn hàng ${order.orderNumber} đã được xác nhận! Món ăn của bạn đang được chuẩn bị.`,
            review: `⚠️ Đơn hàng ${order.orderNumber} Vui lòng xem lại về món ăn, đảm bảo bạn chắc chắn muốn đặt món.`,
            cancel: `❌ Đơn hàng ${order.orderNumber} đã bị hủy. Vui lòng liên hệ hotline để biết thêm chi tiết.`
        };
        console.log(`📧 Gửi thông báo đến ${order.customerName}:`, notifications[actionType]);
        return notifications[actionType];
    };

    const handleConfirmOrder = (order: StaffOrder) => {
        setConfirmationModal({ type: 'confirm', order, message: `Xác nhận đơn hàng ${order.orderNumber} và gửi thông báo cho ${order.customerName}?` });
    };
    const handleNeedReview = (order: StaffOrder) => {
        setConfirmationModal({ type: 'review', order, message: `Đánh dấu đơn ${order.orderNumber} cần xem lại và thông báo cho ${order.customerName}?` });
    };
    const handleCancelOrder = (order: StaffOrder) => {
        setConfirmationModal({ type: 'cancel', order, message: `Hủy đơn hàng ${order.orderNumber}? Khách hàng ${order.customerName} sẽ nhận được thông báo.` });
    };

    const executeAction = () => {
        if (!confirmationModal) return;
        const { type, order } = confirmationModal;
        const orderIndex = orders.findIndex(o => o.id === order.id);
        if (orderIndex === -1) return;
        const updatedOrders = [...orders];
        if (type === 'confirm') { updatedOrders[orderIndex] = { ...order, status: 'processing' }; showToast('success', `✓ Đã xác nhận đơn ${order.orderNumber}`); }
        else if (type === 'review') { updatedOrders[orderIndex] = { ...order, status: 'pending' }; showToast('warning', `⚠️ Đơn ${order.orderNumber} đã được đánh dấu cần xem lại`); }
        else if (type === 'cancel') { updatedOrders[orderIndex] = { ...order, status: 'completed' }; showToast('error', `✗ Đã hủy đơn ${order.orderNumber}`); }
        setOrders(updatedOrders);
        const notification = sendCustomerNotification(order, type);
        setTimeout(() => { showToast('success', `📧 Đã gửi thông báo: "${notification.substring(0, 50)}..."`); }, 500);
        setConfirmationModal(null);
        setSelectedOrder(null);
    };

    const filteredOrders = orders.filter(order => {
        const matchesSearch = searchQuery === '' || order.orderNumber.toLowerCase().includes(searchQuery.toLowerCase()) || order.customerName.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
        const matchesRisk = riskFilter === 'all' || order.aiRiskLevel === riskFilter;
        return matchesSearch && matchesStatus && matchesRisk;
    });

    const statusFilters = [
        { id: 'all', label: 'Tất cả', count: orders.length },
        { id: 'pending', label: 'Chờ xử lý', count: orders.filter(o => o.status === 'pending').length },
        { id: 'processing', label: 'Đang xử lý', count: orders.filter(o => o.status === 'processing').length },
        { id: 'completed', label: 'Hoàn thành', count: orders.filter(o => o.status === 'completed').length },
    ];
    const riskFilters = [
        { id: 'all', label: 'Tất cả rủi ro' },
        { id: 'high_risk', label: '🔴 Nguy cơ cao', count: getOrdersByRiskLevel('high_risk').length },
        { id: 'attention', label: '🟡 Cần chú ý', count: getOrdersByRiskLevel('attention').length },
        { id: 'normal', label: '🟢 Bình thường', count: getOrdersByRiskLevel('normal').length },
    ];

    const statusBadge = (status: string) => {
        const cls = status === 'pending' ? 'bg-[#fff8f0] text-[#ee8c2b]' : status === 'processing' ? 'bg-[#f3ede7] text-[#9a734c]' : 'bg-emerald-100 text-emerald-800';
        const label = status === 'pending' ? 'Chờ xử lý' : status === 'processing' ? 'Đang xử lý' : 'Hoàn thành';
        return <span className={`px-3 py-1.5 rounded-[10px] text-xs font-semibold ${cls}`}>{label}</span>;
    };

    return (
        <div className="max-w-[1400px] mx-auto">
            {/* Toasts */}
            <div className="fixed top-6 right-6 z-[2000] flex flex-col gap-3 pointer-events-none">
                {toasts.map(toast => (
                    <div key={toast.id} className={`flex items-center gap-3 px-5 py-4 bg-white rounded-xl shadow-[0_8px_24px_rgba(0,0,0,0.15)] pointer-events-auto min-w-[320px] max-w-[450px] border-l-4 animate-[slideInRight_0.3s_ease] ${toast.type === 'success' ? 'border-emerald-500' : toast.type === 'warning' ? 'border-amber-500' : 'border-red-500'
                        }`}>
                        {toast.type === 'success' && <CheckCircle className={`w-5 h-5 shrink-0 text-emerald-500`} />}
                        {toast.type === 'warning' && <AlertTriangle className={`w-5 h-5 shrink-0 text-amber-500`} />}
                        {toast.type === 'error' && <XCircle className={`w-5 h-5 shrink-0 text-red-500`} />}
                        <span className="text-sm font-semibold text-[#1b140d]">{toast.message}</span>
                    </div>
                ))}
            </div>

            {/* Header */}
            <div className="mb-6">
                <h1 className="text-[32px] font-extrabold text-[#1b140d] mb-1">Quản lý đơn hàng</h1>
                <p className="text-base text-[#9a734c]">Tổng cộng {filteredOrders.length} đơn hàng</p>
            </div>

            {/* Search & Filters */}
            <div className="mb-6">
                <div className="relative mb-4">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#9a734c]" />
                    <input
                        type="text"
                        placeholder="Tìm theo mã đơn hàng hoặc tên khách hàng..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full py-3.5 pl-12 pr-4 border-2 border-[#e7dbcf] rounded-xl text-[15px] transition-all focus:outline-none focus:border-[#ee8c2b] focus:shadow-[0_0_0_4px_rgba(238,140,43,0.1)]"
                    />
                </div>
                <div className="flex flex-col gap-4">
                    <div className="flex items-center gap-3 flex-wrap">
                        <span className="flex items-center gap-1.5 text-sm font-semibold text-[#1b140d]"><Filter className="w-4 h-4" /> Trạng thái:</span>
                        <div className="flex flex-wrap gap-2">
                            {statusFilters.map(f => (
                                <button key={f.id} className={`px-4 py-2 rounded-[10px] text-sm font-semibold border-2 transition-all ${statusFilter === f.id ? 'bg-[#ee8c2b] text-white border-[#ee8c2b] shadow-[0_4px_12px_rgba(238,140,43,0.3)]' : 'bg-white text-[#6b5744] border-[#e7dbcf] hover:border-[#ee8c2b] hover:text-[#ee8c2b]'}`} onClick={() => setStatusFilter(f.id as StatusFilter)}>
                                    {f.label} ({f.count})
                                </button>
                            ))}
                        </div>
                    </div>
                    <div className="flex items-center gap-3 flex-wrap">
                        <span className="flex items-center gap-1.5 text-sm font-semibold text-[#1b140d]"><Filter className="w-4 h-4" /> Risk Level:</span>
                        <div className="flex flex-wrap gap-2">
                            {riskFilters.map(f => (
                                <button key={f.id} className={`px-4 py-2 rounded-[10px] text-sm font-semibold border-2 transition-all ${riskFilter === f.id ? 'bg-[#ee8c2b] text-white border-[#ee8c2b] shadow-[0_4px_12px_rgba(238,140,43,0.3)]' : 'bg-white text-[#6b5744] border-[#e7dbcf] hover:border-[#ee8c2b] hover:text-[#ee8c2b]'}`} onClick={() => setRiskFilter(f.id as RiskFilter)}>
                                    {f.label}{'count' in f && f.count !== undefined && ` (${f.count})`}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Orders Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5 mb-8">
                {filteredOrders.map(order => (
                    <div key={order.id} className="bg-white rounded-2xl p-5 shadow-[0_4px_16px_rgba(0,0,0,0.08)] border-2 border-transparent hover:-translate-y-1 hover:shadow-[0_8px_24px_rgba(0,0,0,0.12)] hover:border-[#ee8c2b] transition-all cursor-pointer">
                        {/* Header */}
                        <div className="flex justify-between items-center mb-4">
                            <div className="text-lg font-bold text-[#1b140d]">{order.orderNumber}</div>
                            <div className="px-3 py-1.5 rounded-xl text-xs font-semibold text-white" style={{ backgroundColor: getRiskColor(order.aiRiskLevel) }}>
                                {getRiskIcon(order.aiRiskLevel)} {getRiskLabel(order.aiRiskLevel)}
                            </div>
                        </div>
                        {/* Customer */}
                        <div className="flex items-center gap-3 mb-3 pb-3 border-b border-[#e7dbcf] cursor-pointer" onClick={() => setSelectedOrder(order)}>
                            <img src={order.customerAvatar} alt={order.customerName} className="w-12 h-12 rounded-full object-cover border-2 border-[#e7dbcf]" />
                            <div className="flex-1">
                                <div className="text-[15px] font-semibold text-[#1b140d] mb-0.5">{order.customerName}</div>
                                <div className="text-xs text-[#9a734c]">{order.createdAt}</div>
                            </div>
                        </div>
                        {/* Items */}
                        <div className="text-[13px] text-[#9a734c] mb-2 cursor-pointer" onClick={() => setSelectedOrder(order)}>
                            <strong className="text-[#1b140d]">{order.items.length} món:</strong>
                            <span className="block mt-1 whitespace-nowrap overflow-hidden text-ellipsis">{order.items.map(item => item.name).join(', ')}</span>
                        </div>
                        {/* AI Insight */}
                        {order.aiRiskLevel !== 'normal' && (() => {
                            const insights = getOrderAIInsights(order, order.aiAnalysis);
                            const preview = insights.suggestions[0] || insights.summary;
                            const display = preview.length > 60 ? preview.slice(0, 60) + "…" : preview;
                            return (
                                <div className="bg-[#fff8f0] px-3 py-2 rounded-lg text-xs text-[#9a734c] mb-3 border-l-[3px] border-[#ee8c2b] cursor-pointer" onClick={() => setSelectedOrder(order)} title="Xem phân tích & đề xuất đầy đủ">
                                    ✨ Đề xuất: {display}
                                </div>
                            );
                        })()}
                        {/* Footer */}
                        <div className="flex justify-between items-center">
                            {statusBadge(order.status)}
                            <span className="text-base font-bold text-[#1b140d]">{order.totalAmount.toLocaleString('vi-VN')}đ</span>
                        </div>
                        {/* Actions */}
                        <div className="grid grid-cols-3 gap-2 pt-3 mt-3 border-t border-[#e7dbcf]">
                            <button className="py-2 px-3 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg text-[13px] font-bold transition-all hover:-translate-y-0.5 hover:shadow-[0_4px_12px_rgba(16,185,129,0.3)]" onClick={(e) => { e.stopPropagation(); handleConfirmOrder(order); }}>✓ Xác nhận</button>
                            <button className="py-2 px-3 bg-amber-500 hover:bg-amber-600 text-white rounded-lg text-[13px] font-bold transition-all hover:-translate-y-0.5 hover:shadow-[0_4px_12px_rgba(245,158,11,0.3)]" onClick={(e) => { e.stopPropagation(); handleNeedReview(order); }}>⚠️ Xem lại</button>
                            <button className="py-2 px-3 bg-red-500 hover:bg-red-600 text-white rounded-lg text-[13px] font-bold transition-all hover:-translate-y-0.5 hover:shadow-[0_4px_12px_rgba(239,68,68,0.3)]" onClick={(e) => { e.stopPropagation(); handleCancelOrder(order); }}>✗ Hủy</button>
                        </div>
                    </div>
                ))}
            </div>

            {filteredOrders.length === 0 && (
                <div className="text-center py-16 text-[#9a734c]"><p className="text-lg font-semibold">Không tìm thấy đơn hàng nào</p></div>
            )}

            {/* Order Detail Modal */}
            {selectedOrder && (
                <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-[1000] p-5 animate-[fadeIn_0.3s_ease]" onClick={() => setSelectedOrder(null)}>
                    <div className="bg-white rounded-[20px] max-w-[900px] w-full max-h-[90vh] flex flex-col shadow-[0_20px_60px_rgba(0,0,0,0.3)] animate-[slideUp_0.3s_ease]" onClick={(e) => e.stopPropagation()}>
                        <div className="px-8 py-6 border-b-2 border-[#e7dbcf] flex justify-between items-center">
                            <div>
                                <h2 className="text-2xl font-extrabold text-[#1b140d] mb-1">Chi tiết đơn hàng</h2>
                                <p className="text-sm text-[#9a734c]">{selectedOrder.orderNumber}</p>
                            </div>
                            <button className="w-10 h-10 flex items-center justify-center bg-[#f3ede7] hover:bg-[#e7dbcf] rounded-[10px] transition-colors" onClick={() => setSelectedOrder(null)}>
                                <X className="w-5 h-5 text-[#1b140d]" />
                            </button>
                        </div>
                        <div className="flex-1 overflow-y-auto px-8 py-6">
                            {/* Customer */}
                            <div className="mb-6">
                                <h3 className="text-lg font-bold text-[#1b140d] mb-4">👤 Thông tin khách hàng</h3>
                                <div className="flex items-center gap-4 p-4 bg-gradient-to-br from-[#f8f7f6] to-[#f3ede7] rounded-xl">
                                    <img src={selectedOrder.customerAvatar} alt={selectedOrder.customerName} className="w-16 h-16 rounded-full object-cover border-[3px] border-white shadow-[0_4px_12px_rgba(0,0,0,0.1)]" />
                                    <div>
                                        <div className="text-lg font-bold text-[#1b140d] mb-1">{selectedOrder.customerName}</div>
                                        <div className="text-xs text-[#9a734c]">{selectedOrder.createdAt}</div>
                                        {getCustomerById(selectedOrder.customerId) && (
                                            <div className="text-[13px] text-[#9a734c] mt-1">{getCustomerById(selectedOrder.customerId)!.orderHistory.totalOrders} đơn hàng</div>
                                        )}
                                    </div>
                                </div>
                            </div>
                            {/* Items */}
                            <div className="mb-6">
                                <h3 className="text-lg font-bold text-[#1b140d] mb-4">🍜 Các món đã đặt</h3>
                                <div className="flex flex-col gap-3 mb-4">
                                    {selectedOrder.items.map((item, index) => (
                                        <div key={index} className="grid grid-cols-[60px_1fr_auto_auto] gap-3 items-center p-3 bg-[#f3ede7] rounded-[10px]">
                                            <img src={item.image} alt={item.name} className="w-[60px] h-[60px] object-cover rounded-lg" />
                                            <div>
                                                <div className="text-[15px] font-semibold text-[#1b140d] mb-1">{item.name}</div>
                                                {item.options && <div className="text-[13px] text-[#9a734c]">{item.options}</div>}
                                            </div>
                                            <div className="text-sm font-semibold text-[#9a734c]">x{item.quantity}</div>
                                            <div className="text-[15px] font-bold text-[#1b140d]">{item.price.toLocaleString('vi-VN')}đ</div>
                                        </div>
                                    ))}
                                </div>
                                <div className="flex justify-between p-4 bg-gradient-to-br from-emerald-50 to-emerald-100 rounded-[10px] text-lg text-emerald-800 font-bold">
                                    <span>Tổng cộng:</span>
                                    <span>{selectedOrder.totalAmount.toLocaleString('vi-VN')}đ</span>
                                </div>
                            </div>
                            {/* AI Risk */}
                            <div className="mb-6"><AIRiskAlert analysis={selectedOrder.aiAnalysis} customerName={selectedOrder.customerName} /></div>
                            {/* Notes */}
                            {selectedOrder.customerNotes && (
                                <div className="mb-6"><OrderNotesExplainer originalNotes={selectedOrder.customerNotes} parsedInstructions={selectedOrder.aiParsedInstructions} /></div>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* Confirmation Modal */}
            {confirmationModal && (
                <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-[1000] p-5 animate-[fadeIn_0.3s_ease]">
                    <div className="bg-white rounded-[20px] max-w-[500px] w-full shadow-[0_20px_60px_rgba(0,0,0,0.3)] animate-[slideUp_0.3s_ease]">
                        <div className="px-6 py-6 border-b-2 border-[#e7dbcf] flex items-center gap-4">
                            {confirmationModal.type === 'confirm' && <CheckCircle className="w-12 h-12 shrink-0 text-emerald-500" />}
                            {confirmationModal.type === 'review' && <AlertTriangle className="w-12 h-12 shrink-0 text-amber-500" />}
                            {confirmationModal.type === 'cancel' && <XCircle className="w-12 h-12 shrink-0 text-red-500" />}
                            <h3 className="text-xl font-extrabold text-[#1b140d]">
                                {confirmationModal.type === 'confirm' && 'Xác nhận đơn hàng'}
                                {confirmationModal.type === 'review' && 'Cần xem lại'}
                                {confirmationModal.type === 'cancel' && 'Hủy đơn hàng'}
                            </h3>
                        </div>
                        <p className="px-6 py-5 text-[15px] text-[#6b5744] leading-relaxed">{confirmationModal.message}</p>
                        <div className="mx-6 mb-6 p-4 bg-[#f3ede7] rounded-xl border-2 border-[#e7dbcf]">
                            <strong className="block mb-2 text-[13px] text-[#9a734c] font-semibold">📧 Thông báo gửi khách hàng:</strong>
                            <p className="text-sm text-[#1b140d] leading-relaxed">
                                {confirmationModal.type === 'confirm' && `✅ Đơn hàng ${confirmationModal.order.orderNumber} đã được xác nhận! Món ăn của bạn đang được chuẩn bị.`}
                                {confirmationModal.type === 'review' && `⚠️ Đơn hàng ${confirmationModal.order.orderNumber} cần được xem lại. Chúng tôi sẽ liên hệ với bạn sớm.`}
                                {confirmationModal.type === 'cancel' && `❌ Đơn hàng ${confirmationModal.order.orderNumber} đã bị hủy. Vui lòng liên hệ hotline để biết thêm chi tiết.`}
                            </p>
                        </div>
                        <div className="grid grid-cols-2 gap-3 px-6 pb-6">
                            <button className="py-3 px-5 bg-[#f3ede7] hover:bg-[#e7dbcf] text-[#6b5744] rounded-xl text-[15px] font-bold transition-colors" onClick={() => setConfirmationModal(null)}>Hủy bỏ</button>
                            <button className="py-3 px-5 bg-[#ee8c2b] hover:bg-[#d97706] hover:shadow-[0_4px_12px_rgba(238,140,43,0.4)] text-white rounded-xl text-[15px] font-bold transition-all" onClick={executeAction}>Xác nhận</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
