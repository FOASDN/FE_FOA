import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { MOCK_ORDER_DETAIL_ITEMS, MOCK_ORDER_INFO, calculateOrderTotal } from "../../constants/mockOrders";
import { OrderTimeline } from "@/components/shared/OrderTimeline";

const TrackOrderPage = () => {
    const { subtotal, deliveryFee, total } = calculateOrderTotal(MOCK_ORDER_DETAIL_ITEMS);
    const { t } = useTranslation(['customer', 'common']);
    return (
        <div className="bg-background-light dark:bg-background-dark text-[#1c130d] dark:text-white transition-colors duration-300 min-h-screen font-display">

            <main className="flex-1 max-w-[1200px] mx-auto w-full py-12 px-6">
                <section className="flex flex-col items-center text-center mb-16">
                    <div className="relative mb-6">
                        <div className="size-32 bg-primary/5 dark:bg-primary/10 rounded-full flex items-center justify-center animate-bounce">
                            <span className="material-symbols-outlined text-primary text-6xl">cooking</span>
                        </div>
                        <div className="absolute -bottom-2 -right-2 bg-green-500 text-white size-10 rounded-full flex items-center justify-center ring-4 ring-background-light dark:ring-background-dark">
                            <span className="material-symbols-outlined text-[20px]">check</span>
                        </div>
                    </div>
                    <h1 className="text-3xl md:text-5xl font-extrabold text-[#1c130d] dark:text-white mb-3">Món ăn của bạn đang được chuẩn bị</h1>
                    <p className="text-[#9e6b47] dark:text-white/60 text-lg">Dự kiến giao hàng: <span className="font-bold text-[#1c130d] dark:text-white">{MOCK_ORDER_INFO.estimatedDelivery}</span> ({MOCK_ORDER_INFO.estimatedDuration})</p>
                </section>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                    {/* Left Column: Timeline */}
                    <div className="lg:col-span-2 space-y-10">
                        {/* Progress — using shared OrderTimeline */}
                        <div className="bg-white dark:bg-white/5 p-8 rounded-3xl shadow-sm border border-[#f4ece6] dark:border-white/10">
                            <OrderTimeline currentStep="preparing" />
                        </div>

                        {/* Detailed Timeline */}
                        <div className="space-y-6">
                            <h3 className="text-xl font-bold flex items-center gap-2">
                                <span className="material-symbols-outlined text-primary">history</span>
                                Dòng thời gian trực tiếp
                            </h3>
                            <div className="relative pl-8 border-l-2 border-[#f4ece6] dark:border-white/10 space-y-10 ml-4">
                                <div className="relative">
                                    <div className="absolute -left-[41px] top-0 size-5 rounded-full bg-primary ring-4 ring-background-light dark:ring-background-dark"></div>
                                    <div className="flex flex-col gap-1">
                                        <span className="text-xs font-bold text-primary">12:05 PM</span>
                                        <p className="font-bold text-[#1c130d] dark:text-white">Bếp bắt đầu chuẩn bị món ăn</p>
                                        <p className="text-sm text-[#9e6b47] dark:text-white/60">Đầu bếp của chúng tôi đang đảm bảo mọi thứ hoàn hảo.</p>
                                    </div>
                                </div>
                                <div className="relative">
                                    <div className="absolute -left-[41px] top-0 size-5 rounded-full bg-[#e9d9ce] dark:bg-white/20 ring-4 ring-background-light dark:ring-background-dark"></div>
                                    <div className="flex flex-col gap-1 opacity-60">
                                        <span className="text-xs font-bold">11:58 AM</span>
                                        <p className="font-bold text-[#1c130d] dark:text-white">Đơn hàng được nhà hàng chấp nhận</p>
                                        <p className="text-sm">Nhà hàng đã nhận đơn và xếp hàng chờ nấu.</p>
                                    </div>
                                </div>
                                <div className="relative">
                                    <div className="absolute -left-[41px] top-0 size-5 rounded-full bg-[#e9d9ce] dark:bg-white/20 ring-4 ring-background-light dark:ring-background-dark"></div>
                                    <div className="flex flex-col gap-1 opacity-60">
                                        <span className="text-xs font-bold">11:55 AM</span>
                                        <p className="font-bold text-[#1c130d] dark:text-white">Đặt hàng thành công</p>
                                        <p className="text-sm">Chúng tôi đã nhận được thanh toán cho đơn hàng #{MOCK_ORDER_INFO.orderId}.</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Order Summary */}
                    <div className="space-y-6">
                        <div className="bg-white dark:bg-white/5 p-8 rounded-3xl shadow-sm border border-[#f4ece6] dark:border-white/10 sticky top-28">
                            <h3 className="text-lg font-bold mb-6">{t('customer:cart.grandTotal', 'Tóm tắt đơn hàng')}</h3>
                            <div className="space-y-4 mb-6">
                                {MOCK_ORDER_DETAIL_ITEMS.map(item => (
                                    <div key={item.id} className="flex justify-between items-start gap-4">
                                        <div className="flex flex-col">
                                            <span className="text-sm font-bold text-[#1c130d] dark:text-white">{item.quantity}x {item.name}</span>
                                            {item.options && <span className="text-xs text-[#9e6b47]">{item.options}</span>}
                                        </div>
                                        <span className="text-sm font-bold">{(item.price * item.quantity).toLocaleString('vi-VN')}đ</span>
                                    </div>
                                ))}
                                <div className="pt-4 border-t border-[#f4ece6] dark:border-white/10 space-y-2">
                                    <div className="flex justify-between text-sm">
                                        <span className="text-[#9e6b47]">{t('customer:cart.subtotal')}</span>
                                        <span className="font-medium">{subtotal.toLocaleString('vi-VN')}đ</span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span className="text-[#9e6b47]">{t('customer:cart.deliveryFee')}</span>
                                        <span className="font-medium">{deliveryFee.toLocaleString('vi-VN')}đ</span>
                                    </div>
                                    <div className="flex justify-between text-lg font-extrabold pt-2">
                                        <span>{t('customer:cart.grandTotal')}</span>
                                        <span className="text-primary">{total.toLocaleString('vi-VN')}đ</span>
                                    </div>
                                </div>
                            </div>
                            <div className="space-y-3">
                                <button className="w-full py-4 bg-primary text-white font-bold rounded-full hover:bg-primary/90 transition-all flex items-center justify-center gap-2 shadow-lg shadow-primary/20">
                                    <span className="material-symbols-outlined text-[20px]">support_agent</span>
                                    Liên hệ hỗ trợ
                                </button>
                                <Link to="/" className="w-full py-4 bg-[#f4ece6] dark:bg-white/10 text-[#1c130d] dark:text-white font-bold rounded-full hover:bg-[#e9d9ce] dark:hover:bg-white/20 transition-all flex items-center justify-center gap-2">
                                    <span className="material-symbols-outlined text-[20px]">home</span>
                                    {t('customer:orderSuccess.backToHome')}
                                </Link>
                            </div>
                            <div className="mt-8 p-4 bg-green-500/5 rounded-2xl border border-green-500/20">
                                <div className="flex items-center gap-3 mb-2">
                                    <span className="material-symbols-outlined text-green-500 text-[20px]">verified_user</span>
                                    <span className="text-xs font-bold text-green-500 uppercase tracking-wider">Xác minh bởi AI</span>
                                </div>
                                <p className="text-xs text-[#1c130d] dark:text-white/80 leading-relaxed">Bữa ăn này an toàn 100% dựa trên sở thích sức khỏe trong hồ sơ của bạn.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default TrackOrderPage;
