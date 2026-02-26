import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { MOCK_CART_ITEMS, calculateOrderTotal } from "../../constants/mockOrders";

const CheckoutPage = () => {
    const navigate = useNavigate();
    const { t } = useTranslation(['customer', 'common']);
    const [paymentMethod, setPaymentMethod] = useState<'card' | 'cash'>('card');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handlePlaceOrder = async () => {
        if (isSubmitting) return;
        setIsSubmitting(true);
        try {
            // TODO: call orderService.createOrder()
            await new Promise(r => setTimeout(r, 1500));
            navigate("/success");
        } catch {
            setIsSubmitting(false);
        }
    };

    // Calculated based on synchronized cart sync (using shared constants)
    const { subtotal, deliveryFee, discount, total } = calculateOrderTotal(MOCK_CART_ITEMS);

    return (
        <div className="bg-background-light dark:bg-background-dark text-[#1b140d] dark:text-white min-h-screen font-display">
            <div className="layout-container flex h-full grow flex-col">
                {/* Main Content */}
                <main className="max-w-[1200px] mx-auto w-full px-6 py-8">
                    {/* Progress Section */}
                    <div className="w-full mb-8">
                        <div className="flex flex-col gap-3">
                            <div className="flex gap-6 justify-between items-end">
                                <div className="flex items-center gap-3">
                                    <button
                                        onClick={() => navigate("/cart")}
                                        className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 dark:bg-zinc-800 hover:bg-gray-200 dark:hover:bg-zinc-700 transition-colors"
                                    >
                                        <span className="material-symbols-outlined text-[18px]">arrow_back</span>
                                    </button>
                                    <h1 className="text-[32px] font-bold leading-tight">{t('customer:checkout.title')}</h1>
                                </div>
                                <p className="text-sm font-normal leading-normal opacity-70">Bước 2 trên 3 (66%)</p>
                            </div>
                            <div className="rounded-full bg-gray-200 dark:bg-gray-700 h-2 overflow-hidden">
                                <div className="h-full rounded-full bg-primary" style={{ width: '66%' }}></div>
                            </div>
                        </div>
                    </div>
                    {/* Two Column Layout */}
                    <div className="flex flex-col lg:flex-row gap-8 items-start">
                        {/* Left Column: Forms */}
                        <div className="flex-1 flex flex-col gap-8 w-full">
                            {/* Delivery Address Section */}
                            <section className="bg-white dark:bg-zinc-900 rounded-xl shadow-sm border border-gray-100 dark:border-gray-800 overflow-hidden">
                                <div className="flex flex-wrap justify-between gap-3 p-6 border-b border-gray-100 dark:border-gray-800">
                                    <div className="flex items-center gap-2">
                                        <span className="material-symbols-outlined text-primary">location_on</span>
                                        <p className="text-xl font-bold">{t('customer:checkout.deliveryAddress')}</p>
                                    </div>
                                    <button className="flex min-w-[84px] cursor-pointer items-center justify-center rounded-lg h-9 px-4 bg-primary/10 text-primary text-sm font-semibold hover:bg-primary/20 transition-all">
                                        <span>{t('customer:checkout.addAddress')}</span>
                                    </button>
                                </div>
                                <div className="p-6 flex flex-col gap-4 radio-dot">
                                    <label className="flex items-center gap-4 rounded-xl border-2 border-primary p-4 bg-primary/5 cursor-pointer">
                                        <input defaultChecked className="h-5 w-5 border-2 border-gray-300 text-primary focus:ring-primary focus:ring-offset-0" name="address" type="radio" />
                                        <div className="flex grow flex-col">
                                            <div className="flex items-center gap-2">
                                                <p className="text-sm font-bold">Nhà riêng</p>
                                                <span className="text-[10px] bg-primary text-white px-2 py-0.5 rounded-full uppercase">Mặc định</span>
                                            </div>
                                            <p className="text-gray-600 dark:text-gray-400 text-sm">123 Đường Maple, Springfield, IL 62704</p>
                                        </div>
                                    </label>
                                    <label className="flex items-center gap-4 rounded-xl border border-gray-200 dark:border-gray-800 p-4 hover:border-primary/50 transition-all cursor-pointer">
                                        <input className="h-5 w-5 border-2 border-gray-300 text-primary focus:ring-primary focus:ring-offset-0" name="address" type="radio" />
                                        <div className="flex grow flex-col">
                                            <p className="text-sm font-bold">Văn phòng</p>
                                            <p className="text-gray-600 dark:text-gray-400 text-sm">456 Business Plaza, Suite 200, Springfield, IL 62701</p>
                                        </div>
                                    </label>
                                </div>
                                <div className="px-6 pb-6">
                                    <label className="block text-sm font-medium mb-2">{t('customer:checkout.orderNote')}</label>
                                    <textarea className="w-full rounded-lg border-gray-200 dark:border-gray-800 dark:bg-zinc-800 focus:border-primary focus:ring-primary text-sm" placeholder={t('customer:checkout.orderNotePlaceholder')} rows={2}></textarea>
                                </div>
                            </section>
                            {/* Payment Method Section */}
                            <section className="bg-white dark:bg-zinc-900 rounded-xl shadow-sm border border-gray-100 dark:border-gray-800 overflow-hidden">
                                <div className="p-6 border-b border-gray-100 dark:border-gray-800 flex items-center gap-2">
                                    <span className="material-symbols-outlined text-primary">payments</span>
                                    <p className="text-xl font-bold">{t('customer:checkout.paymentMethod')}</p>
                                </div>
                                <div className="p-6">
                                    <div className="flex gap-4 mb-6">
                                        <button
                                            onClick={() => setPaymentMethod('card')}
                                            className={`flex-1 flex flex-col items-center justify-center p-4 rounded-xl gap-2 transition-all ${paymentMethod === 'card'
                                                ? 'border-2 border-primary bg-primary/5'
                                                : 'border border-gray-200 dark:border-gray-800 hover:border-primary/50'
                                                }`}
                                        >
                                            <span className="material-symbols-outlined">credit_card</span>
                                            <span className="text-sm font-bold">{t('customer:checkout.cardPayment', 'Thẻ tín dụng/Ghi nợ')}</span>
                                        </button>
                                        <button
                                            onClick={() => setPaymentMethod('cash')}
                                            className={`flex-1 flex flex-col items-center justify-center p-4 rounded-xl gap-2 transition-all ${paymentMethod === 'cash'
                                                ? 'border-2 border-primary bg-primary/5'
                                                : 'border border-gray-200 dark:border-gray-800 hover:border-primary/50'
                                                }`}
                                        >
                                            <span className="material-symbols-outlined">account_balance_wallet</span>
                                            <span className="text-sm font-bold">{t('customer:checkout.cod')}</span>
                                        </button>
                                    </div>

                                    {/* Card Form - Only show when card payment is selected */}
                                    {paymentMethod === 'card' && (
                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="col-span-2">
                                                <label className="block text-sm font-medium mb-2">Số thẻ</label>
                                                <div className="relative">
                                                    <input className="w-full rounded-lg border-gray-200 dark:border-gray-800 dark:bg-zinc-800 focus:border-primary focus:ring-primary pl-10" placeholder="0000 0000 0000 0000" type="text" />
                                                    <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">credit_card</span>
                                                </div>
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium mb-2">Ngày hết hạn</label>
                                                <input className="w-full rounded-lg border-gray-200 dark:border-gray-800 dark:bg-zinc-800 focus:border-primary focus:ring-primary" placeholder="MM/YY" type="text" />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium mb-2">CVV</label>
                                                <input className="w-full rounded-lg border-gray-200 dark:border-gray-800 dark:bg-zinc-800 focus:border-primary focus:ring-primary" placeholder="123" type="text" />
                                            </div>
                                            <div className="col-span-2 flex items-center gap-2 mt-2">
                                                <input className="rounded border-gray-300 text-primary focus:ring-primary" id="save-card" type="checkbox" />
                                                <label className="text-sm text-gray-600 dark:text-gray-400" htmlFor="save-card">Lưu thẻ cho lần thanh toán sau</label>
                                            </div>
                                        </div>
                                    )}

                                    {/* Cash on Delivery Info - Only show when cash payment is selected */}
                                    {paymentMethod === 'cash' && (
                                        <div className="bg-amber-50 dark:bg-amber-900/10 border border-amber-200 dark:border-amber-800/30 rounded-xl p-4">
                                            <div className="flex items-start gap-3">
                                                <span className="material-symbols-outlined text-amber-600 dark:text-amber-400 text-2xl">info</span>
                                                <div>
                                                    <h4 className="font-bold text-amber-900 dark:text-amber-400 mb-1">Thanh toán khi nhận hàng</h4>
                                                    <p className="text-sm text-amber-800 dark:text-amber-500/80">
                                                        Vui lòng chuẩn bị số tiền <strong>{total.toLocaleString('vi-VN')}đ</strong> khi nhận hàng.
                                                        Shipper sẽ thu tiền mặt và đưa hóa đơn cho bạn.
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                                {paymentMethod === 'card' && (
                                    <div className="bg-gray-50 dark:bg-zinc-800/50 p-4 flex justify-center gap-6 opacity-60">
                                        <span className="material-symbols-outlined text-2xl">shield_lock</span>
                                        <p className="text-xs flex items-center gap-1 font-medium">SECURE CHECKOUT SSL ENCRYPTED</p>
                                    </div>
                                )}
                            </section>
                        </div>
                        {/* Right Column: Order Summary (Sticky) */}
                        <aside className="w-full lg:w-[380px] lg:sticky lg:top-24">
                            <div className="bg-white dark:bg-zinc-900 rounded-xl shadow-lg border border-gray-100 dark:border-gray-800 overflow-hidden">
                                <div className="p-6 border-b border-gray-100 dark:border-gray-800">
                                    <h3 className="text-lg font-bold mb-4">{t('customer:cart.grandTotal', 'Tóm tắt đơn hàng')}</h3>
                                    {/* Item List */}
                                    <div className="flex flex-col gap-4 mb-6">
                                        {MOCK_CART_ITEMS.map(item => (
                                            <div key={item.id} className="flex justify-between items-start">
                                                <div className="flex gap-3">
                                                    <div
                                                        className="size-12 rounded-lg bg-gray-100 bg-cover bg-center"
                                                        style={{ backgroundImage: `url('${item.image}')` }}
                                                    ></div>
                                                    <div>
                                                        <p className="text-sm font-bold">{item.quantity}x {item.name}</p>
                                                        <p className="text-xs text-gray-500">{item.options}</p>
                                                    </div>
                                                </div>
                                                <p className="text-sm font-bold">{(item.price * item.quantity).toLocaleString('vi-VN')}đ</p>
                                            </div>
                                        ))}
                                    </div>
                                    {/* Promo Code */}
                                    <div className="mb-6">
                                        <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">{t('customer:cart.voucherCode')}</label>
                                        <div className="flex gap-2">
                                            <input className="flex-1 rounded-lg border-gray-200 dark:border-gray-800 dark:bg-zinc-800 focus:border-primary focus:ring-primary text-sm uppercase font-bold" placeholder={t('customer:cart.voucherCode')} type="text" />
                                            <button className="bg-primary text-white px-4 py-2 rounded-lg font-bold text-sm hover:brightness-110 transition-all">{t('customer:cart.applyVoucher')}</button>
                                        </div>
                                    </div>
                                    {/* Cost Breakdown */}
                                    <div className="flex flex-col gap-2 border-t border-dashed border-gray-200 dark:border-gray-800 pt-4">
                                        <div className="flex justify-between text-sm">
                                            <span className="text-gray-500">{t('customer:cart.subtotal')}</span>
                                            <span>{subtotal.toLocaleString('vi-VN')}đ</span>
                                        </div>
                                        <div className="flex justify-between text-sm">
                                            <span className="text-gray-500">{t('customer:cart.deliveryFee')}</span>
                                            <span className="text-green-600">{deliveryFee === 0 ? 'MIỄN PHÍ' : deliveryFee.toLocaleString('vi-VN') + 'đ'}</span>
                                        </div>
                                        {/* <div className="flex justify-between text-sm">
                                            <span className="text-gray-500">Giảm giá</span>
                                            <span className="text-red-500">-{discount.toLocaleString('vi-VN')}đ</span>
                                        </div> */}
                                        <div className="flex justify-between text-xl font-bold mt-2 pt-4 border-t border-gray-100 dark:border-gray-800">
                                            <span>{t('customer:cart.grandTotal')}</span>
                                            <span className="text-primary">{total.toLocaleString('vi-VN')}đ</span>
                                        </div>
                                    </div>
                                </div>
                                {/* CTA Button */}
                                <div className="p-6">
                                    <button
                                        onClick={handlePlaceOrder}
                                        disabled={isSubmitting}
                                        className="w-full bg-primary text-white py-4 rounded-xl font-bold text-lg shadow-lg shadow-primary/30 hover:shadow-primary/40 hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:translate-y-0"
                                    >
                                        {isSubmitting ? (
                                            <>
                                                <span className="material-symbols-outlined animate-spin text-xl">progress_activity</span>
                                                <span>{t('common:processing', 'Đang xử lý...')}</span>
                                            </>
                                        ) : (
                                            <>
                                                <span>{t('customer:checkout.placeOrder')}</span>
                                                <span className="material-symbols-outlined">arrow_forward</span>
                                            </>
                                        )}
                                    </button>
                                    <p className="text-[10px] text-center text-gray-400 mt-4 leading-relaxed">
                                        Bằng việc đặt hàng, bạn đồng ý với <a className="underline" href="#">Điều khoản dịch vụ</a> và <a className="underline" href="#">Chính sách quyền riêng tư</a> của FoodieDash
                                    </p>
                                </div>
                            </div>
                            {/* Trust Badges */}
                            <div className="mt-6 flex justify-center gap-4 grayscale opacity-50">
                                <img alt="Visa" className="h-4" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCs__c9M-2vVKGK39Py16iaIlYcqaZ_fFqPRjQ1JYdrHwDhoWoO8wgUKjop6DCVzNX2nG8cjStqfaSLG0xZi-kU1MTLT36uib2zzzXNLNECIqmr4CMLoP_GihLv8GA8gZdmjBhoDxgSh9R-Yoyc8npF0INS8mHfyhsn6cV5DcJd7CDr2Zrc_xiSvuRWaBWw6457-vDhy1O3pmSMiJr6XUIZeJXmyLKCwVODJ1j_ypvM2u9LPXTQmnnpxff-zNyZRI7vF2acFkInJiQ" />
                                <img alt="Mastercard" className="h-6" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDMxVr6eBwHtfIFCaw585rSGpM0YrdmPjmsspstqNGuZGT3i94uMka9pKHVmDNB_fDda9tGltqt-qW0RVN3XFLhm_3nZ0t8Gyh4CGs5DQTL-gZ8lbaMD0B5816ZdT7Xhh_-nVCT_KfnPPPVVduRzSU4olUpM8Nu2dSCBA3N2Gm2M3W03uIJBhFNMAsThxzBPxh5FsdKP5XyVyTr3FgLn51XFCeSlaDeTMBpFstLToFCAckR1GZxREjn_miKjAK0EtebgSJKHMcaqyA" />
                                <img alt="PayPal" className="h-4" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAW6INytbBPZFxa2faKtKQcFuNbpfqf2frbiT-SiNVIFn5SzewPNumopbof9_3rRe5PlelzQNpYwIYN1Yu6ZHqtmKyCfSPrHCLqiYQrZqs3Chhf12UQ9JX3K_fzFalIidvMiXc-Tza2-mGc9l9HgUnWJa8Y9QsA08OVt-VImyD5R_5YaHD2ssRgnPGlWHj-FX5bq6oDTK2hf3VjVHBvaXTtGavTH-7Z7isuFfROEIv4u9tGf2LJF1F0TgccmEGQeFr9ydFAdVSd5-0" />
                            </div>
                        </aside>
                    </div>
                </main>
            </div>
        </div>
    );
};

export default CheckoutPage;
