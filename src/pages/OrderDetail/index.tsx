import { useState } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { MOCK_ORDER_DETAIL_ITEMS, MOCK_ORDER_INFO, MOCK_DELIVERY_INFO, calculateOrderTotal, MOCK_CUSTOMER_ORDERS, type OrderMessage } from "../../constants/mockOrders";
import OrderMessages from "../../components/OrderMessages";

const OrderDetailPage = () => {
    const { subtotal, deliveryFee, total } = calculateOrderTotal(MOCK_ORDER_DETAIL_ITEMS);
    const { t } = useTranslation(['customer', 'common']);
    const tax = 0; // Mock tax
    const finalTotal = total + tax;

    // Get order details - in real app, this would come from route params
    // For demo, using the first order that needs review
    const currentOrder = MOCK_CUSTOMER_ORDERS.find(o => o.status === 'needs_review') || MOCK_CUSTOMER_ORDERS[0];
    const [messages, setMessages] = useState<OrderMessage[]>(currentOrder.messages || []);

    const handleSendMessage = (message: string) => {
        const newMessage: OrderMessage = {
            id: `msg-${Date.now()}`,
            sender: 'customer',
            senderName: 'Bạn',
            message,
            timestamp: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })
        };
        setMessages([...messages, newMessage]);

        // Simulate staff auto-reply after 2 seconds
        setTimeout(() => {
            const staffReply: OrderMessage = {
                id: `msg-staff-${Date.now()}`,
                sender: 'staff',
                senderName: 'Nhân viên',
                message: 'Cảm ơn bạn đã phản hồi! Chúng tôi đã ghi nhận yêu cầu của bạn.',
                timestamp: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })
            };
            setMessages(prev => [...prev, staffReply]);
        }, 2000);
    };

    return (
        <div className="bg-background-light dark:bg-background-dark text-[#1c130d] dark:text-white transition-colors duration-300 min-h-screen font-display">

            <main className="flex-1 max-w-7xl mx-auto w-full px-6 md:px-10 py-10">
                <div className="flex flex-col gap-2 mb-8">
                    <h1 className="text-3xl font-extrabold text-black dark:text-white">{t('customer:tracking.title', 'Chi tiết đơn hàng')}</h1>
                    <p className="text-gray-500 text-sm">Đơn hàng #{MOCK_ORDER_INFO.orderId} • Đặt lúc {MOCK_ORDER_INFO.orderTime}, {MOCK_ORDER_INFO.orderDate}</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
                    <div className="lg:col-span-2 flex flex-col gap-6">
                        {/* Order Items */}
                        <div className="bg-white dark:bg-white/5 border border-gray-100 dark:border-white/10 rounded-2xl overflow-hidden">
                            <div className="px-6 py-5 border-b border-gray-100 dark:border-white/10">
                                <h3 className="font-bold text-lg">Món ăn đã đặt</h3>
                            </div>
                            <div className="divide-y divide-gray-50 dark:divide-white/5">
                                {MOCK_ORDER_DETAIL_ITEMS.map(item => (
                                    <div key={item.id} className="p-6 flex items-center justify-between">
                                        <div className="flex items-center gap-4">
                                            <div className="size-16 rounded-xl bg-gray-100 bg-cover bg-center" style={{ backgroundImage: `url("${item.image}")` }}></div>
                                            <div>
                                                <h4 className="font-bold text-gray-900 dark:text-white">{item.name}</h4>
                                                <p className="text-sm text-gray-500">SL: {item.quantity}{item.options && ` • ${item.options}`}</p>
                                            </div>
                                        </div>
                                        <p className="font-semibold text-gray-900 dark:text-white">{(item.price * item.quantity).toLocaleString('vi-VN')}đ</p>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Bill Summary */}
                        <div className="bg-white dark:bg-white/5 border border-gray-100 dark:border-white/10 rounded-2xl p-6">
                            <h3 className="font-bold text-lg mb-4">Tóm tắt thanh toán</h3>
                            <div className="flex flex-col gap-3">
                                <div className="flex justify-between text-gray-600 dark:text-gray-400">
                                    <span>{t('customer:cart.subtotal')}</span>
                                    <span>{subtotal.toLocaleString('vi-VN')}đ</span>
                                </div>
                                <div className="flex justify-between text-gray-600 dark:text-gray-400">
                                    <span>{t('customer:cart.deliveryFee')}</span>
                                    <span>{deliveryFee.toLocaleString('vi-VN')}đ</span>
                                </div>
                                <div className="flex justify-between text-gray-600 dark:text-gray-400">
                                    <span>Thuế & Phí</span>
                                    <span>{tax.toLocaleString('vi-VN')}đ</span>
                                </div>
                                <div className="h-px bg-gray-100 dark:bg-white/10 my-1"></div>
                                <div className="flex justify-between items-center mt-2">
                                    <span className="text-lg font-bold">{t('customer:cart.grandTotal')}</span>
                                    <span className="text-2xl font-extrabold text-primary">{finalTotal.toLocaleString('vi-VN')}đ</span>
                                </div>
                            </div>
                        </div>

                        {/* Delivery Details */}
                        <div className="bg-white dark:bg-white/5 border border-gray-100 dark:border-white/10 rounded-2xl p-6">
                            <h3 className="font-bold text-lg mb-4">Thông tin giao hàng</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div>
                                    <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Địa chỉ giao hàng</p>
                                    <p className="text-gray-900 dark:text-white font-medium">{MOCK_DELIVERY_INFO.address}</p>
                                    <p className="text-gray-500 text-sm">{MOCK_DELIVERY_INFO.district}</p>
                                    <p className="text-gray-500 text-sm">Mã cổng: {MOCK_DELIVERY_INFO.gateCode}</p>
                                </div>
                                <div>
                                    <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Thông tin người nhận</p>
                                    <p className="text-gray-900 dark:text-white font-medium">{MOCK_DELIVERY_INFO.recipientName}</p>
                                    <p className="text-gray-500 text-sm">{MOCK_DELIVERY_INFO.recipientPhone}</p>
                                </div>
                            </div>
                        </div>

                        {/* Staff-Customer Messaging - Only show for orders needing review */}
                        {currentOrder.status === 'needs_review' && currentOrder.staffMessage && (
                            <div className="space-y-4">
                                {/* Staff Alert Banner */}
                                <div className="bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 rounded-2xl p-5">
                                    <div className="flex items-start gap-3">
                                        <div className="size-10 rounded-full bg-orange-100 dark:bg-orange-900/40 text-orange-600 dark:text-orange-400 flex items-center justify-center flex-shrink-0">
                                            <span className="material-symbols-outlined text-[20px]">warning</span>
                                        </div>
                                        <div className="flex-1">
                                            <h4 className="font-bold text-orange-900 dark:text-orange-300 mb-1">
                                                Đơn hàng cần xác nhận
                                            </h4>
                                            <p className="text-orange-800 dark:text-orange-400 text-sm">
                                                {currentOrder.staffMessage}
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {/* Messaging Component */}
                                <OrderMessages
                                    orderId={currentOrder.orderId}
                                    messages={messages}
                                    onSendMessage={handleSendMessage}
                                />
                            </div>
                        )}
                    </div>

                    {/* Sidebar Tracker */}
                    <div className="flex flex-col gap-6">
                        <div className="bg-white dark:bg-white/5 border border-gray-100 dark:border-white/10 rounded-2xl p-6">
                            <div className="flex justify-between items-center mb-6">
                                <h3 className="font-bold text-lg">{t('customer:tracking.title')}</h3>
                                <Link to="/track-order" className="text-primary text-sm font-bold hover:underline">Xem chi tiết</Link>
                            </div>
                            <div className="flex flex-col gap-8">
                                <div className="relative flex gap-4 step-active">
                                    <div className="z-10 size-6 rounded-full bg-green-500 flex items-center justify-center text-white">
                                        <span className="material-symbols-outlined text-[16px] font-bold">check</span>
                                    </div>
                                    <div>
                                        <p className="text-sm font-bold text-gray-900 dark:text-white">Đã đặt hàng</p>
                                        <p className="text-xs text-gray-500">12:15 PM</p>
                                    </div>
                                </div>
                                <div className="relative flex gap-4 step-active">
                                    <div className="z-10 size-6 rounded-full bg-primary flex items-center justify-center text-white ring-4 ring-primary/20">
                                        <div className="size-2 bg-white rounded-full"></div>
                                    </div>
                                    <div>
                                        <p className="text-sm font-bold text-primary">Đang chuẩn bị</p>
                                        <p className="text-xs text-primary/70">Món ăn đang được nấu</p>
                                    </div>
                                </div>
                                <div className="relative flex gap-4 step-active">
                                    <div className="z-10 size-6 rounded-full bg-gray-100 dark:bg-white/10 flex items-center justify-center text-gray-400">
                                        <span className="material-symbols-outlined text-[16px]">moped</span>
                                    </div>
                                    <div>
                                        <p className="text-sm font-bold text-gray-400">Đang giao hàng</p>
                                        <p className="text-xs text-gray-400">Chưa bắt đầu</p>
                                    </div>
                                </div>
                                <div className="relative flex gap-4">
                                    <div className="z-10 size-6 rounded-full bg-gray-100 dark:bg-white/10 flex items-center justify-center text-gray-400">
                                        <span className="material-symbols-outlined text-[16px]">home</span>
                                    </div>
                                    <div>
                                        <p className="text-sm font-bold text-gray-400">Đã giao</p>
                                    </div>
                                </div>
                            </div>

                            <style>{`
                            .step-active::before {
                                content: '';
                                position: absolute;
                                left: 11.5px;
                                top: 24px;
                                bottom: -8px;
                                width: 2px;
                                background-color: #e5e7eb;
                            }
                            .dark .step-active::before {
                                background-color: rgba(255,255,255,0.1);
                            }
                            .step-active:last-child::before {
                                display: none;
                            }
                            `}</style>
                        </div>

                        <div className="bg-green-500/5 border border-green-500/20 rounded-2xl p-5">
                            <div className="flex items-center gap-3 mb-3">
                                <div className="size-8 rounded-lg bg-green-500/20 text-green-500 flex items-center justify-center">
                                    <span className="material-symbols-outlined text-[20px]">verified_user</span>
                                </div>
                                <h4 className="font-bold text-green-500 text-sm uppercase tracking-wide">AI Health Guard</h4>
                            </div>
                            <p className="text-gray-800 dark:text-white/90 text-sm font-medium">Đã xác minh: Đơn hàng này phù hợp với hồ sơ dị ứng của bạn (Không đậu phộng, Không sữa).</p>
                        </div>

                        <div className="bg-teal-50 border border-teal-100 dark:bg-teal-900/10 dark:border-teal-900/30 rounded-2xl p-5">
                            <div className="flex items-center gap-3 mb-2">
                                <span className="material-symbols-outlined text-teal-600 text-[20px]">eco</span>
                                <h4 className="font-bold text-teal-800 dark:text-teal-400 text-sm">Lựa chọn xanh</h4>
                            </div>
                            <p className="text-teal-700 dark:text-teal-500/80 text-xs">Bạn đã chọn bao bì không nhựa. Chúng tôi đã trồng một cây thay bạn cho đơn hàng này!</p>
                        </div>
                    </div>
                </div>

                <div className="mt-12 flex flex-col sm:flex-row gap-4 justify-center items-center">
                    <button className="w-full sm:w-auto px-8 py-3 bg-primary hover:bg-primary/90 text-white font-bold rounded-xl transition-all shadow-lg shadow-primary/20 flex items-center justify-center gap-2">
                        <span className="material-symbols-outlined text-[20px]">download</span>
                        Tải hóa đơn
                    </button>
                    <button className="w-full sm:w-auto px-8 py-3 bg-transparent hover:bg-gray-100 dark:hover:bg-white/5 text-gray-600 dark:text-gray-400 font-bold rounded-xl transition-all border border-gray-200 dark:border-white/10 flex items-center justify-center gap-2">
                        <span className="material-symbols-outlined text-[20px]">support_agent</span>
                        Liên hệ hỗ trợ
                    </button>
                </div>
            </main>
        </div>
    );
};

export default OrderDetailPage;
