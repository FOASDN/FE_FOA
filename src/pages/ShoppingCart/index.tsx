import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { MOCK_CART_ITEMS, MOCK_UPSELL_ITEMS } from '../../constants/mockOrders';
import type { OrderItem } from '../../constants/mockOrders';

const ShoppingCartPage = () => {
    const navigate = useNavigate();
    const { t } = useTranslation(['customer', 'common']);
    // Mock data for cart items
    const [cartItems, setCartItems] = useState<OrderItem[]>(MOCK_CART_ITEMS);

    // Mock upsell items
    const upsellItems = MOCK_UPSELL_ITEMS;

    const updateQuantity = (id: number, change: number) => {
        setCartItems(prev => prev.map(item => {
            if (item.id === id) {
                const newQuantity = Math.max(0, item.quantity + change);
                return { ...item, quantity: newQuantity };
            }
            return item;
        }).filter(item => item.quantity > 0));
    };

    const addToCart = (item: any) => {
        // Logic to add item to cart (mock)
        const existingItem = cartItems.find(i => i.id === item.id);
        if (existingItem) {
            updateQuantity(item.id, 1);
        } else {
            setCartItems([...cartItems, { ...item, quantity: 1, options: "Standard" }]);
        }
    };

    const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const deliveryFee = subtotal > 300000 ? 0 : 50000;
    const discount = 0; // Mock discount
    const total = subtotal + deliveryFee - discount;

    return (
        <div className="bg-background-light dark:bg-background-dark text-text-main dark:text-background-light font-display min-h-screen">
            <main className="max-w-[1440px] mx-auto px-4 md:px-10 lg:px-20 py-8">
                {/* Breadcrumbs */}
                <div className="flex flex-wrap gap-2 mb-6">
                    <Link to="/" className="text-[#9a734c] text-sm font-medium leading-normal hover:text-primary transition-colors">{t('common:nav.home')}</Link>
                    <span className="text-[#9a734c] text-sm font-medium leading-normal">/</span>
                    <span className="text-text-main dark:text-white text-sm font-medium leading-normal">{t('customer:cart.title')}</span>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                    {/* Left Column: Cart Items */}
                    <div className="lg:col-span-2 flex flex-col gap-6">
                        {/* Page Heading */}
                        <div className="flex flex-col gap-1 mb-2">
                            <h1 className="text-3xl md:text-4xl font-extrabold text-text-main dark:text-white leading-tight">{t('customer:cart.title')}</h1>
                            <p className="text-[#9a734c] text-base font-normal">Bạn có {cartItems.reduce((acc, item) => acc + item.quantity, 0)} món trong giỏ hàng</p>
                        </div>

                        {/* List Items */}
                        <div className="flex flex-col gap-2 bg-white dark:bg-white/5 rounded-xl overflow-hidden shadow-sm border border-gray-100 dark:border-white/10">
                            {cartItems.length === 0 ? (
                                <div className="text-center py-20 px-4">
                                    <span className="material-symbols-outlined text-6xl text-gray-300 mb-4">shopping_cart_off</span>
                                    <p className="text-xl font-bold text-gray-500 mb-4">{t('customer:cart.empty')}</p>
                                    <Link to="/" className="inline-block px-6 py-3 bg-primary text-white font-bold rounded-lg hover:bg-primary/90 transition-colors">
                                        {t('customer:cart.browsMenu')}
                                    </Link>
                                </div>
                            ) : (
                                cartItems.map(item => (
                                    <div key={item.id} className="flex flex-col sm:flex-row gap-4 px-6 py-6 border-b border-gray-100 dark:border-white/10 last:border-b-0">
                                        <div
                                            className="bg-center bg-no-repeat aspect-video bg-cover rounded-lg h-[100px] w-full sm:w-[160px] shrink-0"
                                            style={{ backgroundImage: `url("${item.image}")` }}
                                        ></div>
                                        <div className="flex flex-1 flex-col justify-between">
                                            <div className="flex justify-between items-start">
                                                <div>
                                                    <h3 className="text-lg font-bold text-text-main dark:text-white line-clamp-1">{item.name}</h3>
                                                    <p className="text-[#9a734c] text-sm mt-1">{item.options}</p>
                                                </div>
                                                <p className="text-lg font-bold text-text-main dark:text-white">{(item.price * item.quantity).toLocaleString('vi-VN')}đ</p>
                                            </div>
                                            <div className="flex items-center justify-between mt-4 sm:mt-0">
                                                <button onClick={() => updateQuantity(item.id, -item.quantity)} className="text-red-500 text-sm font-medium flex items-center gap-1 hover:underline">
                                                    <span className="material-symbols-outlined text-lg">delete</span> {t('common:actions.delete')}
                                                </button>
                                                <div className="flex items-center gap-3">
                                                    <button onClick={() => updateQuantity(item.id, -1)} className="text-base font-bold flex h-8 w-8 items-center justify-center rounded-lg bg-gray-100 dark:bg-white/10 hover:bg-primary/20 transition-colors">-</button>
                                                    <input className="text-base font-bold w-8 p-0 text-center bg-transparent focus:outline-none border-none" type="number" readOnly value={item.quantity} />
                                                    <button onClick={() => updateQuantity(item.id, 1)} className="text-base font-bold flex h-8 w-8 items-center justify-center rounded-lg bg-gray-100 dark:bg-white/10 hover:bg-primary/20 transition-colors">+</button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>

                        {/* Special Instructions & Add More */}
                        {cartItems.length > 0 && (
                            <div className="flex flex-col gap-6">
                                <Link to="/menu" className="inline-flex items-center gap-2 text-primary font-bold hover:gap-3 transition-all">
                                    <span className="material-symbols-outlined">add_circle</span> {t('customer:cart.continueShopping', 'Thêm món khác')}
                                </Link>
                                <div className="flex flex-col gap-2">
                                    <label className="text-sm font-bold text-text-main dark:text-white">{t('customer:checkout.orderNote')}</label>
                                    <textarea
                                        className="w-full bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-lg p-3 text-sm focus:ring-primary focus:border-primary transition-all dark:text-white"
                                        placeholder={t('customer:checkout.orderNotePlaceholder')}
                                        rows={3}
                                    ></textarea>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Right Column: Order Summary */}
                    {cartItems.length > 0 && (
                        <div className="flex flex-col gap-6">
                            <div className="sticky top-24 flex flex-col gap-6">
                                {/* Voucher Code */}
                                <div className="bg-white dark:bg-white/5 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-white/10">
                                    <p className="text-text-main dark:text-white text-lg font-bold mb-4">{t('customer:cart.voucherCode')}</p>
                                    <div className="flex gap-2">
                                        <input className="flex-1 bg-gray-50 dark:bg-white/10 border-none rounded-lg px-4 text-sm focus:ring-primary dark:text-white" placeholder={t('customer:cart.voucherCode')} type="text" />
                                        <button className="bg-primary text-white px-4 py-2 rounded-lg font-bold text-sm hover:bg-primary/90 transition-colors">{t('customer:cart.applyVoucher')}</button>
                                    </div>
                                </div>

                                {/* Price Breakdown */}
                                <div className="bg-white dark:bg-white/5 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-white/10">
                                    <p className="text-text-main dark:text-white text-lg font-bold mb-6">{t('customer:cart.grandTotal', 'Tóm tắt đơn hàng')}</p>
                                    <div className="flex flex-col gap-4">
                                        <div className="flex justify-between items-center text-[#9a734c]">
                                            <span className="text-sm">{t('customer:cart.subtotal')}</span>
                                            <span className="text-sm font-medium">{subtotal.toLocaleString('vi-VN')}đ</span>
                                        </div>
                                        <div className="flex justify-between items-center text-[#9a734c]">
                                            <span className="text-sm">{t('customer:cart.deliveryFee')}</span>
                                            <span className="text-sm font-medium text-green-600">{deliveryFee === 0 ? t('common:status.free', 'Miễn phí') : `${deliveryFee.toLocaleString('vi-VN')}đ`}</span>
                                        </div>
                                        {/* <div className="flex justify-between items-center text-[#9a734c]">
                                            <span className="text-sm">Thuế (8%)</span>
                                            <span className="text-sm font-medium">Included</span>
                                        </div> */}
                                        <div className="flex justify-between items-center text-primary">
                                            <span className="text-sm">{t('customer:cart.discount')}</span>
                                            <span className="text-sm font-medium">-{discount.toLocaleString('vi-VN')}đ</span>
                                        </div>
                                        <hr className="border-gray-100 dark:border-white/10 my-2" />
                                        <div className="flex justify-between items-center text-text-main dark:text-white">
                                            <span className="text-lg font-bold">{t('customer:cart.grandTotal')}</span>
                                            <span className="text-2xl font-black text-primary">{total.toLocaleString('vi-VN')}đ</span>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => navigate("/checkout")}
                                        className="w-full bg-primary text-white py-4 rounded-xl font-bold text-lg mt-8 hover:bg-primary/90 shadow-lg shadow-primary/20 transition-all flex items-center justify-center gap-2"
                                    >
                                        {t('customer:cart.checkout', 'Tiến hành thanh toán')}
                                        <span className="material-symbols-outlined">arrow_forward</span>
                                    </button>

                                    {/* Trust Badges */}
                                    <div className="flex justify-center items-center gap-4 mt-6 opacity-40 grayscale hover:grayscale-0 transition-all">
                                        <span className="material-symbols-outlined text-2xl">credit_card</span>
                                        <span className="material-symbols-outlined text-2xl">contactless</span>
                                        <span className="material-symbols-outlined text-2xl">shield_locked</span>
                                    </div>
                                    <p className="text-center text-[10px] text-[#9a734c] mt-4 uppercase tracking-widest font-bold">Thanh toán bảo mật SSL</p>
                                </div>

                                {/* Free Delivery Banner */}
                                {deliveryFee === 0 && (
                                    <div className="bg-primary/10 border border-primary/20 p-4 rounded-xl">
                                        <div className="flex items-center gap-3">
                                            <div className="p-2 bg-primary rounded-lg text-white">
                                                <span className="material-symbols-outlined text-lg">local_shipping</span>
                                            </div>
                                            <div>
                                                <p className="text-xs font-bold text-primary">Tuyệt vời!</p>
                                                <p className="text-[11px] text-[#9a734c]">Bạn được miễn phí giao hàng cho đơn này.</p>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </div>

                {/* Upsell / People also ordered */}
                <div className="mt-16">
                    <h3 className="text-text-main dark:text-white text-xl font-bold mb-6">{t('customer:cart.youMayLike', 'Có thể bạn sẽ thích')}</h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {upsellItems.map(item => (
                            <div key={item.id} className="bg-white dark:bg-white/5 p-4 rounded-xl border border-gray-100 dark:border-white/10 group hover:border-primary transition-all">
                                <div
                                    className="bg-center bg-no-repeat aspect-video bg-cover rounded-lg mb-3"
                                    style={{ backgroundImage: `url("${item.image}")` }}
                                ></div>
                                <p className="font-bold text-sm truncate text-text-main dark:text-white">{item.name}</p>
                                <div className="flex justify-between items-center mt-2">
                                    <span className="text-primary font-bold text-sm">{item.price.toLocaleString('vi-VN')}đ</span>
                                    <button
                                        onClick={() => addToCart(item)}
                                        className="bg-gray-100 dark:bg-white/10 p-1 rounded-md text-primary hover:bg-primary hover:text-white transition-colors"
                                    >
                                        <span className="material-symbols-outlined text-sm">add</span>
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </main>
        </div>
    );
};

export default ShoppingCartPage;
