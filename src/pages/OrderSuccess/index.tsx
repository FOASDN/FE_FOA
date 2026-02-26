import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const OrderSuccessPage = () => {
    const [isOpen, setIsOpen] = useState(true);
    const navigate = useNavigate();
    const { t } = useTranslation(['customer', 'common']);

    if (!isOpen) return (
        <div className="flex items-center justify-center h-screen bg-gray-100 dark:bg-gray-900">
            <button onClick={() => setIsOpen(true)} className="px-6 py-3 bg-primary text-white rounded-lg font-bold">
                Mở lại Modal Thành công
            </button>
        </div>
    );

    return (
        <div className="bg-background-light dark:bg-background-dark font-display text-[#1b140d] antialiased min-h-screen relative">
            {/* Background Content (Blurred) */}
            <div className="relative flex min-h-screen w-full flex-col overflow-x-hidden">
                <div className="layout-container flex h-full grow flex-col">
                    <div className="px-4 md:px-40 flex flex-1 justify-center py-5">
                        <div className="layout-content-container flex flex-col max-w-[960px] flex-1">
                            {/* TopNavBar */}

                            {/* Page Content Mockup */}
                            <div className="py-10 px-4 md:px-10 opacity-30 grayscale pointer-events-none">
                                <div className="h-64 bg-gray-200 dark:bg-gray-800 rounded-xl mb-6"></div>
                                <div className="h-8 w-1/3 bg-gray-200 dark:bg-gray-800 rounded mb-4"></div>
                                <div className="h-4 w-full bg-gray-100 dark:bg-gray-800 rounded mb-2"></div>
                                <div className="h-4 w-5/6 bg-gray-100 dark:bg-gray-800 rounded mb-2"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {/* Modal Overlay */}
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-md bg-white/60 dark:bg-black/60">
                {/* Success Feedback Modal */}
                <div className="w-full max-w-[440px] bg-white dark:bg-[#181a1b] rounded-xl p-8 flex flex-col items-center shadow-2xl border border-[#f3ede7] dark:border-gray-700">
                    {/* Icon/Checkmark */}
                    <div className="mb-8 relative">
                        <div className="absolute inset-0 bg-green-400/20 rounded-full scale-150 blur-xl"></div>
                        <div className="relative w-20 h-20 rounded-full bg-green-400 flex items-center justify-center text-white shadow-lg shadow-green-400/30">
                            <span className="material-symbols-outlined text-[48px] font-bold">check</span>
                        </div>
                    </div>
                    {/* HeadlineText */}
                    <h1 className="text-[#1b140d] dark:text-white tracking-tight text-[28px] font-extrabold leading-tight text-center pb-2">
                        {t('customer:orderSuccess.title')}
                    </h1>
                    {/* MetaText */}
                    <p className="text-[#9a734c] dark:text-gray-400 text-base font-normal leading-relaxed text-center px-4 mb-8">
                        Mã đơn: <span className="font-bold text-[#1b140d] dark:text-primary">#ORD-992834</span>. Chúng tôi đã gửi email xác nhận đến địa chỉ đăng ký của bạn.
                    </p>
                    {/* Delivery Details Mockup */}
                    <div className="w-full bg-[#fcfaf8] dark:bg-gray-800 rounded-lg p-4 mb-8 flex items-center gap-4 border border-[#f3ede7] dark:border-gray-700">
                        <div className="size-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                            <span className="material-symbols-outlined">local_shipping</span>
                        </div>
                        <div className="flex-1">
                            <p className="text-xs font-semibold uppercase tracking-wider text-[#9a734c] dark:text-gray-500">Dự kiến giao hàng</p>
                            <p className="text-sm font-bold text-[#1b140d] dark:text-white">Hôm nay, 12:45 CH — 1:15 CH</p>
                        </div>
                    </div>
                    {/* ButtonGroup */}
                    <div className="flex flex-col gap-3 w-full">
                        <button
                            onClick={() => navigate('/order-detail')}
                            className="flex items-center justify-center rounded-lg h-14 bg-primary text-white text-base font-bold leading-normal tracking-[0.015em] w-full shadow-lg shadow-primary/20 hover:scale-[1.02] transition-transform"
                        >
                            <span className="material-symbols-outlined mr-2">visibility</span>
                            <span>{t('customer:orderSuccess.trackOrder', 'Xem đơn hàng')}</span>
                        </button>

                        <Link to="/">
                            <button className="flex items-center justify-center rounded-lg h-14 bg-[#f3ede7] dark:bg-gray-700 text-[#1b140d] dark:text-white text-base font-bold leading-normal tracking-[0.015em] w-full hover:bg-[#ebe2d9] dark:hover:bg-gray-600 transition-colors">
                                <span>{t('customer:orderSuccess.backToHome')}</span>
                            </button>
                        </Link>
                    </div>
                    {/* Close "X" Button (Top Right) */}
                    <button onClick={() => setIsOpen(false)} className="absolute top-6 right-6 text-gray-400 hover:text-gray-600 dark:hover:text-white transition-colors">
                        <span className="material-symbols-outlined">close</span>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default OrderSuccessPage;
