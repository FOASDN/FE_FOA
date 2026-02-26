import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useCart } from '@/hooks/useCart';
import { useToast, ToastContainer } from '@/hooks/useToast';

const FoodDetailPage = () => {
    const navigate = useNavigate();
    const { t } = useTranslation(['customer', 'common']);
    const { addItem } = useCart();
    const { toasts, toast, dismiss } = useToast();
    const [spiciness, setSpiciness] = useState("medium");
    const [extras, setExtras] = useState<string[]>([]);
    const [quantity, setQuantity] = useState(1);
    const [isAllergic, setIsAllergic] = useState(false); // Toggle state for demo
    const [showWarningModal, setShowWarningModal] = useState(false);

    const handleDecrease = () => {
        if (quantity > 1) {
            setQuantity(prev => prev - 1);
        }
    };

    const handleIncrease = () => {
        setQuantity(prev => prev + 1);
    };

    const toggleExtra = (id: string) => {
        setExtras(prev => prev.includes(id) ? prev.filter(e => e !== id) : [...prev, id]);
    };

    const handleAddToCart = () => {
        if (isAllergic) {
            setShowWarningModal(true);
        } else {
            addItem({
                productId: 'pho-bo-special',
                name: 'Phở Bò Đặc Biệt',
                image: '',
                price: 75000,
                quantity,
                size: spiciness,
                extras: extras.map(e => ({ id: e, name: e, price: 5000 })),
            });
            toast(t('customer:foodCard.addToCart', 'Đã thêm vào giỏ hàng!'), 'success');
        }
    };

    return (
        <div className="bg-background-light dark:bg-background-dark text-text-main dark:text-background-light font-display min-h-screen flex flex-col antialiased selection:bg-primary/20 relative">
            {/* Dev Toggle for Demo */}
            <div className="fixed top-24 right-4 z-50 bg-white dark:bg-black border border-gray-200 dark:border-white/20 p-2 rounded-lg shadow-xl opacity-90 hover:opacity-100 transition-opacity">
                <label className="flex items-center gap-2 cursor-pointer text-xs font-bold">
                    <input
                        type="checkbox"
                        checked={isAllergic}
                        onChange={(e) => setIsAllergic(e.target.checked)}
                        className="rounded text-red-500 focus:ring-red-500"
                    />
                    Mô phỏng Cảnh báo Dị ứng
                </label>
            </div>

            {/* Warning Modal */}
            {showWarningModal && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 backdrop-blur-md bg-black/60">
                    <div className="w-full max-w-[480px] bg-white dark:bg-[#181a1b] rounded-2xl p-8 flex flex-col items-center shadow-2xl animate-in fade-in zoom-in duration-300">
                        <div className="mb-6 relative">
                            <div className="absolute inset-0 bg-red-500/20 rounded-full scale-150 blur-xl"></div>
                            <div className="relative size-20 rounded-full bg-red-50 bg-opacity-100 flex items-center justify-center text-red-600 shadow-lg shadow-red-500/20">
                                <span className="material-symbols-outlined text-[40px] font-bold">warning</span>
                            </div>
                        </div>

                        <h2 className="text-2xl font-extrabold text-center text-[#1b140d] dark:text-white mb-2">
                            Cảnh báo Sức khỏe
                        </h2>

                        <p className="text-center text-gray-600 dark:text-gray-300 mb-6 px-4 leading-relaxed">
                            Bạn đang thêm <span className="font-bold text-red-600">Phở Bò Tái</span> vào giỏ hàng.
                        </p>

                        <div className="w-full bg-red-50 dark:bg-red-900/10 border border-red-100 dark:border-red-900/30 rounded-xl p-4 mb-6 flex gap-3">
                            <span className="material-symbols-outlined text-red-600 shrink-0">no_meals</span>
                            <div>
                                <p className="text-sm font-bold text-red-700 dark:text-red-400 mb-1">Cảnh báo Dị ứng</p>
                                <p className="text-xs text-red-600/80 dark:text-red-400/80 leading-relaxed">
                                    AI của chúng tôi phát hiện món này chứa <span className="font-bold">Mì trứng</span>, xung đột với hồ sơ dị ứng của bạn.
                                </p>
                            </div>
                        </div>

                        <p className="text-xs text-center text-gray-400 mb-6 max-w-xs mx-auto">
                            Vui lòng xác nhận bạn hiểu rủi ro trước khi tiếp tục. Chúng tôi khuyên bạn nên xem các món thay thế khác.
                        </p>

                        <div className="flex flex-col gap-3 w-full">
                            <button
                                onClick={() => { setShowWarningModal(false); navigate("/ai-suggestions"); }}
                                className="w-full py-4 rounded-xl bg-emerald-600 text-white font-bold text-sm tracking-wide hover:bg-emerald-700 transition-colors flex items-center justify-center gap-2"
                            >
                                <span className="material-symbols-outlined text-[18px]">shield</span>
                                Xem món thay thế an toàn
                            </button>
                            <button
                                onClick={() => setShowWarningModal(false)}
                                className="w-full py-4 rounded-xl bg-[#1b140d] dark:bg-white text-white dark:text-black font-bold text-sm tracking-wide hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
                            >
                                <span className="material-symbols-outlined text-[18px]">arrow_back</span>
                                Quay lại & Xem món khác
                            </button>
                            <button
                                onClick={() => { setShowWarningModal(false); alert("Đã thêm bất chấp cảnh báo!"); }}
                                className="w-full py-4 rounded-xl border border-red-200 dark:border-red-900/30 text-red-600 dark:text-red-400 font-bold text-sm hover:bg-red-50 dark:hover:bg-red-900/10 transition-colors"
                            >
                                Tôi hiểu rủi ro, vẫn thêm
                            </button>
                        </div>

                        <div className="mt-6 flex items-center gap-2 text-[10px] text-gray-300 uppercase tracking-widest font-bold">
                            <span className="material-symbols-outlined text-[12px]">security</span>
                            Giao thức an toàn AI FoodieDash
                        </div>
                    </div>
                </div>
            )}

            {/* Main Content */}
            <main className="flex-grow w-full max-w-[1440px] mx-auto px-4 md:px-10 lg:px-20 py-6 md:py-10">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-start mb-16">
                    {/* LEFT COLUMN: Sticky Hero Image */}
                    <div className="relative lg:sticky lg:top-24 h-auto lg:h-[calc(100vh-8rem)] flex flex-col">
                        <div className="relative w-full h-full min-h-[400px] lg:min-h-0 rounded-2xl overflow-hidden shadow-lg group">
                            <div
                                className="absolute inset-0 bg-center bg-cover bg-no-repeat transition-transform duration-700 group-hover:scale-105"
                                style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1582878826629-29b7ad1cdc43?w=800&h=800&fit=crop")' }}
                            >
                            </div>
                            {/* Overlay Badge */}
                            <div className="absolute top-4 left-4">
                                <span className="inline-flex items-center gap-1 bg-white/90 dark:bg-black/80 backdrop-blur-md px-3 py-1.5 rounded-full text-xs font-bold text-text-main dark:text-white shadow-sm">
                                    <span className="material-symbols-outlined text-orange-500 text-[16px] fill">local_fire_department</span>
                                    Phổ biến
                                </span>
                            </div>
                        </div>
                        {/* Thumbnails (Optional Visual Flair) */}
                        <div className="flex gap-4 mt-4 overflow-x-auto pb-2 scrollbar-hide">
                            <button className="w-20 h-20 rounded-lg overflow-hidden border-2 border-primary shrink-0">
                                <div className="w-full h-full bg-cover bg-center" style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1582878826629-29b7ad1cdc43?w=300&h=300&fit=crop")' }}></div>
                            </button>
                            <button className="w-20 h-20 rounded-lg overflow-hidden border border-transparent opacity-60 hover:opacity-100 hover:border-gray-300 dark:hover:border-gray-600 transition-all shrink-0">
                                <div className="w-full h-full bg-cover bg-center" style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1591814468924-caf88d1232e1?w=300&h=300&fit=crop")' }}></div>
                            </button>
                            <button className="w-20 h-20 rounded-lg overflow-hidden border border-transparent opacity-60 hover:opacity-100 hover:border-gray-300 dark:hover:border-gray-600 transition-all shrink-0">
                                <div className="w-full h-full bg-cover bg-center" style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=300&h=300&fit=crop")' }}></div>
                            </button>
                        </div>
                    </div>
                    {/* RIGHT COLUMN: Details & Actions */}
                    <div className="flex flex-col h-full pt-2">
                        {/* Breadcrumbs */}
                        <nav className="flex flex-wrap items-center gap-2 mb-4 text-sm">
                            <a className="text-[#9e6b47] hover:text-primary font-medium transition-colors" href="#">{t('customer:menu.title')}</a>
                            <span className="text-[#9e6b47]/60">/</span>
                            <a className="text-[#9e6b47] hover:text-primary font-medium transition-colors" href="#">Món Việt</a>
                            <span className="text-[#9e6b47]/60">/</span>
                            <span className="text-text-main dark:text-white font-semibold">Phở Bò Tái</span>
                        </nav>
                        {/* Header */}
                        <div className="mb-6">
                            <h1 className="text-4xl md:text-5xl font-extrabold text-text-main dark:text-white tracking-tight leading-[1.1] mb-3">
                                Phở Bò Tái
                            </h1>
                            <div className="flex items-center gap-4">
                                <span className="text-2xl md:text-3xl font-bold text-primary">75.000đ</span>
                                <div className="flex items-center gap-1">
                                    <span className="material-symbols-outlined text-yellow-400 text-[20px] fill-1">star</span>
                                    <span className="text-sm font-bold text-text-main dark:text-white">4.8</span>
                                    <span className="text-sm text-gray-500 dark:text-gray-400">(240+ đánh giá)</span>
                                </div>
                            </div>
                        </div>
                        {/* AI Health Verification Box */}
                        {/* AI Health Verification Box */}
                        {!isAllergic ? (
                            <div className="bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-900/10 dark:to-teal-900/10 border border-emerald-200 dark:border-emerald-800 rounded-2xl p-6 mb-8 transition-all duration-300 relative overflow-hidden group">
                                <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                                    <span className="material-symbols-outlined text-[100px] text-emerald-600 rotate-12">health_and_safety</span>
                                </div>
                                <div className="flex items-start gap-5 relative z-10">
                                    <div className="p-3 bg-gradient-to-br from-emerald-500 to-teal-600 text-white rounded-2xl flex items-center justify-center shadow-lg shadow-emerald-500/30">
                                        <span className="material-symbols-outlined text-[28px]">verified_user</span>
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="text-xl font-extrabold text-[#064e3b] dark:text-emerald-400 mb-2 flex items-center gap-2">
                                            Lựa chọn lành mạnh đã được AI xác minh
                                            <span className="material-symbols-outlined text-emerald-600 dark:text-emerald-400 text-[20px] fill-1">check_circle</span>
                                        </h3>
                                        <p className="text-sm font-medium text-[#065f46] dark:text-emerald-300/80 mb-5 leading-relaxed max-w-md">
                                            Công nghệ <span className="font-bold">NutriAI™</span> đã phân tích kỹ lưỡng món ăn này để đảm bảo đủ chất dinh dưỡng và an toàn cho sức khỏe của bạn.
                                        </p>
                                        <div className="flex flex-wrap gap-3">
                                            {[
                                                { icon: 'local_fire_department', text: 'Nóng hổi thơm ngon', color: 'text-orange-700 dark:text-orange-300', bg: 'bg-orange-100 dark:bg-orange-900/30' },
                                                { icon: 'fitness_center', text: 'Giàu Protein (28g)', color: 'text-blue-700 dark:text-blue-300', bg: 'bg-blue-100 dark:bg-blue-900/30' },
                                                { icon: 'bolt', text: '520 kcal', color: 'text-amber-700 dark:text-amber-300', bg: 'bg-amber-100 dark:bg-amber-900/30' }
                                            ].map((tag, idx) => (
                                                <span key={idx} className={`inline-flex items-center gap-1.5 px-3 py-1.5 ${tag.bg} rounded-lg text-xs font-bold ${tag.color} shadow-sm border border-transparent hover:border-current transition-all`}>
                                                    <span className="material-symbols-outlined text-[16px]">{tag.icon}</span>
                                                    {tag.text}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="bg-red-50 dark:bg-red-900/10 border border-red-200 dark:border-red-900/30 rounded-xl p-5 mb-8 transition-all duration-300 animate-in fade-in slide-in-from-top-2">
                                <div className="flex items-start gap-4">
                                    <div className="p-2 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-full flex items-center justify-center shadow-sm animate-pulse">
                                        <span className="material-symbols-outlined">warning</span>
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="text-lg font-bold text-[#1b140d] dark:text-white mb-1 flex items-center gap-2">
                                            Cảnh báo Sức khỏe AI: Có chứa Mì trứng
                                        </h3>
                                        <p className="text-sm text-[#1b140d]/70 dark:text-white/70 mb-4 leading-relaxed">
                                            Trợ lý AI nhận thấy món này có chứa thành phần bạn bị dị ứng. Vui lòng cân nhắc cẩn thận trước khi đặt hàng.
                                        </p>
                                        <button onClick={() => navigate('/ai-suggestions')} className="inline-flex items-center gap-1 text-xs font-bold text-red-600 dark:text-red-400 hover:underline">
                                            <span>XEM CÁC MÓN THAY THẾ</span>
                                            <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}
                        {/* Description */}
                        <div className="mb-8">
                            <h3 className="text-lg font-bold text-text-main dark:text-white mb-3">{t('customer:foodDetail.description')}</h3>
                            <p className="text-base text-gray-600 dark:text-gray-300 leading-relaxed">
                                Tô phở bò tái truyền thống Hà Nội với nước dùng thanh ngọt được ninh từ xương trong 12 tiếng. Thịt bò tươi thái mỏng, tái chín vừa phải khi chan nước dùng nóng. Ăn kèm bánh phở tươi, rau thơm, ngò gai và chanh tươi. Hương vị đậm đà, chân thực của ẩm thực phố cổ.
                            </p>
                        </div>

                        {/* Customization Options */}
                        <div className="mb-8 space-y-6 border-t border-gray-100 dark:border-white/10 pt-6">
                            {/* Spiciness Level */}
                            <div>
                                <h3 className="text-base font-bold text-text-main dark:text-white mb-3">Độ cay</h3>
                                <div className="flex flex-wrap gap-3">
                                    {['none', 'mild', 'medium', 'hot', 'extra'].map((level) => {
                                        const labels: Record<string, string> = {
                                            none: 'Không cay', mild: 'Ít cay', medium: 'Vừa', hot: 'Cay', extra: 'Siêu cay'
                                        };
                                        return (
                                            <button
                                                key={level}
                                                onClick={() => setSpiciness(level)}
                                                className={`px-4 py-2 rounded-lg text-sm font-medium border transition-all ${spiciness === level
                                                    ? 'bg-primary text-white border-primary shadow-md shadow-primary/20'
                                                    : 'bg-white dark:bg-white/5 border-gray-200 dark:border-white/10 text-gray-600 dark:text-gray-300 hover:border-primary/50'
                                                    }`}
                                            >
                                                {labels[level]}
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>

                            {/* Extra Toppings */}
                            <div>
                                <h3 className="text-base font-bold text-text-main dark:text-white mb-3">{t('customer:foodDetail.chooseTopping')}</h3>
                                <div className="space-y-3">
                                    {[
                                        { id: 'egg', name: 'Trứng ốp la thêm', price: 15000 },
                                        { id: 'rice', name: 'Cơm thêm', price: 10000 },
                                        { id: 'cheese', name: 'Phô mai lát', price: 12000 }
                                    ].map((item) => (
                                        <div
                                            key={item.id}
                                            className={`flex items-center justify-between p-3 rounded-xl border cursor-pointer transition-all ${extras.includes(item.id)
                                                ? 'bg-primary/5 border-primary dark:bg-primary/10'
                                                : 'bg-white dark:bg-white/5 border-gray-200 dark:border-white/10 hover:border-gray-300'
                                                }`}
                                            onClick={() => toggleExtra(item.id)}
                                        >
                                            <div className="flex items-center gap-3">
                                                <div className={`size-5 rounded flex items-center justify-center border ${extras.includes(item.id) ? 'bg-primary border-primary' : 'border-gray-300 dark:border-gray-500'
                                                    }`}>
                                                    {extras.includes(item.id) && <span className="material-symbols-outlined text-white text-[16px]">check</span>}
                                                </div>
                                                <span className="text-sm font-medium text-text-main dark:text-white">{item.name}</span>
                                            </div>
                                            <span className="text-sm font-semibold text-primary">+{item.price.toLocaleString('vi-VN')}đ</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Ingredients */}
                        <div className="mb-10">
                            <h3 className="text-lg font-bold text-text-main dark:text-white mb-3">{t('customer:foodDetail.ingredients')}</h3>
                            <ul className="grid grid-cols-2 gap-y-2 gap-x-4">
                                <li className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
                                    <span className="w-1.5 h-1.5 rounded-full bg-primary/40"></span>
                                    Thịt bò tươi
                                </li>
                                <li className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
                                    <span className="w-1.5 h-1.5 rounded-full bg-primary/40"></span>
                                    Nước dùng xương
                                </li>
                                <li className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
                                    <span className="w-1.5 h-1.5 rounded-full bg-primary/40"></span>
                                    Bánh phở tươi
                                </li>
                                <li className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
                                    <span className="w-1.5 h-1.5 rounded-full bg-primary/40"></span>
                                    Hành lá, rau thơm
                                </li>
                                <li className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
                                    <span className="w-1.5 h-1.5 rounded-full bg-primary/40"></span>
                                    Ngò gai, húng quế
                                </li>
                                <li className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
                                    <span className="w-1.5 h-1.5 rounded-full bg-primary/40"></span>
                                    Chanh, ớt tươi
                                </li>
                                {isAllergic && (
                                    <li className="flex items-center justify-between gap-2 text-sm font-bold text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 px-2 py-1 rounded">
                                        <div className="flex items-center gap-2">
                                            <span className="w-1.5 h-1.5 rounded-full bg-red-500"></span>
                                            Mì trứng
                                        </div>
                                        <span className="text-[10px] uppercase font-extrabold bg-red-100 dark:bg-red-900/40 px-1.5 py-0.5 rounded tracking-wide border border-red-200 dark:border-red-800">Dị ứng</span>
                                    </li>
                                )}
                            </ul>
                        </div>
                        {/* Action Bar */}
                        <div className="mt-auto pt-4 border-t border-gray-100 dark:border-white/10 sticky bottom-0 bg-white/90 dark:bg-black/90 backdrop-blur-lg pb-4 z-20 shadow-[0_-8px_30px_rgba(0,0,0,0.12)] -mx-4 px-4 md:mx-0 md:rounded-2xl md:mb-6 md:border-x md:border-b-0">
                            <div className="flex flex-col sm:flex-row gap-4 items-stretch sm:items-center">
                                {/* Quantity Stepper */}
                                <div className="flex items-center justify-between bg-background-light dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl px-2 h-14 min-w-[140px]">
                                    <button
                                        onClick={handleDecrease}
                                        aria-label="Decrease quantity"
                                        className="w-10 h-10 flex items-center justify-center text-gray-500 hover:text-primary hover:bg-white dark:hover:bg-white/10 rounded-lg transition-all"
                                    >
                                        <span className="material-symbols-outlined text-[20px]">remove</span>
                                    </button>
                                    <span className="font-bold text-lg text-text-main dark:text-white">{quantity}</span>
                                    <button
                                        onClick={handleIncrease}
                                        aria-label="Increase quantity"
                                        className="w-10 h-10 flex items-center justify-center text-gray-500 hover:text-primary hover:bg-white dark:hover:bg-white/10 rounded-lg transition-all"
                                    >
                                        <span className="material-symbols-outlined text-[20px]">add</span>
                                    </button>
                                </div>
                                {/* Main CTA */}
                                <div className="flex-1 flex flex-col gap-2">
                                    <button
                                        onClick={handleAddToCart}
                                        className={`w-full h-14 font-bold text-lg rounded-xl shadow-lg flex items-center justify-center gap-3 transition-all hover:-translate-y-0.5 active:translate-y-0 cursor-pointer ${isAllergic
                                            ? 'bg-red-800 hover:bg-red-900 text-white shadow-red-900/20'
                                            : 'bg-primary hover:bg-primary/90 text-white shadow-primary/30'
                                            }`}
                                    >
                                        {!isAllergic ? (
                                            <>
                                                <span className="material-symbols-outlined">shopping_bag</span>
                                                <span>{t('customer:foodDetail.addToCart')}</span>
                                                <span className="w-px h-6 bg-white/20 mx-1"></span>
                                                <span>{(75000 * quantity).toLocaleString('vi-VN')}đ</span>
                                            </>
                                        ) : (
                                            <>
                                                <span className="material-symbols-outlined">warning</span>
                                                <span>Tôi hiểu, vẫn thêm {(75000 * quantity).toLocaleString('vi-VN')}đ</span>
                                            </>
                                        )}
                                    </button>
                                    {isAllergic && (
                                        <p className="text-center text-[10px] font-bold text-red-600 dark:text-red-400 flex items-center justify-center gap-1">
                                            <span className="material-symbols-outlined text-[12px] fill">info</span>
                                            Vui lòng xác nhận bạn hiểu rủi ro dị ứng trước khi đặt hàng.
                                        </p>
                                    )}
                                </div>
                            </div>
                            <p className="text-center sm:text-left mt-3 text-xs text-gray-400">
                                Miễn phí giao hàng cho đơn trên 300.000đ
                            </p>
                        </div>
                    </div>
                </div>

                {/* REVIEWS SECTION */}
                <section className="mb-16 max-w-5xl">
                    <h2 className="text-2xl font-bold text-text-main dark:text-white mb-8">{t('customer:foodDetail.reviews')}</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {/* Rating Summary */}
                        <div className="bg-white dark:bg-white/5 rounded-2xl p-6 border border-gray-100 dark:border-white/10 h-fit">
                            <div className="flex flex-col items-center justify-center text-center">
                                <span className="text-5xl font-extrabold text-text-main dark:text-white mb-2">4.8</span>
                                <div className="flex gap-1 text-yellow-400 mb-2">
                                    <span className="material-symbols-outlined fill-1">star</span>
                                    <span className="material-symbols-outlined fill-1">star</span>
                                    <span className="material-symbols-outlined fill-1">star</span>
                                    <span className="material-symbols-outlined fill-1">star</span>
                                    <span className="material-symbols-outlined fill-1">star_half</span>
                                </div>
                                <p className="text-sm text-gray-500 dark:text-gray-400">Dựa trên 248 đánh giá</p>
                            </div>
                            <div className="mt-6 space-y-2">
                                {[5, 4, 3, 2, 1].map((star) => (
                                    <div key={star} className="flex items-center gap-3 text-xs">
                                        <span className="font-bold w-3">{star}</span>
                                        <div className="flex-1 h-2 bg-gray-100 dark:bg-white/10 rounded-full overflow-hidden">
                                            <div
                                                className="h-full bg-yellow-400 rounded-full"
                                                style={{ width: star === 5 ? '70%' : star === 4 ? '20%' : '5%' }}
                                            ></div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                        {/* Review List */}
                        <div className="md:col-span-2 space-y-4">
                            {[
                                { name: "Minh Anh", date: "2 ngày trước", rating: 5, text: "Nước dùng thanh ngọt, thịt bò tái mềm, tan trong miệng. Phở ngon nhất tôi từng ăn ở HCM!" },
                                { name: "Hoàng Tùng", date: "1 tuần trước", rating: 4, text: "Phở đúng vị Hà Nội, bánh phở tươi mềm. Giao hàng đúng giờ, giữ nhiệt tốt." },
                                { name: "Thu Hà", date: "2 tuần trước", rating: 5, text: "Tuyệt vời! Nước dùng ngọt tự nhiên từ xương, không bột ngọt. Sẽ ủng hộ lâu dài!" }
                            ].map((review, idx) => (
                                <div key={idx} className="bg-white dark:bg-white/5 p-5 rounded-xl border border-gray-100 dark:border-white/10">
                                    <div className="flex justify-between items-start mb-3">
                                        <div className="flex items-center gap-3">
                                            <div className="size-10 rounded-full bg-gray-200 flex items-center justify-center font-bold text-gray-500">
                                                {review.name.charAt(0)}
                                            </div>
                                            <div>
                                                <h4 className="font-bold text-sm text-text-main dark:text-white">{review.name}</h4>
                                                <div className="flex text-yellow-400 text-[14px]">
                                                    {[...Array(5)].map((_, i) => (
                                                        <span key={i} className={`material-symbols-outlined ${i < review.rating ? 'fill-1' : ''}`}>star</span>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                        <span className="text-xs text-gray-400">{review.date}</span>
                                    </div>
                                    <p className="text-sm text-gray-600 dark:text-gray-300">{review.text}</p>
                                </div>
                            ))}
                            <button className="w-full py-3 text-sm font-bold text-primary border border-primary/20 rounded-xl hover:bg-primary/5 transition-colors">
                                {t('common:actions.viewAll')}
                            </button>
                        </div>
                    </div>
                </section>

                {/* RELATED PRODUCTS */}
                <section className="mb-10">
                    <h2 className="text-2xl font-bold text-text-main dark:text-white mb-6">{t('customer:foodDetail.relatedItems')}</h2>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                        {[
                            { name: "Pad Thai Tôm", price: 135000, img: "https://lh3.googleusercontent.com/aida-public/AB6AXuDJIFsv1Yt0Ay3jH1Bp4-v6NQ5GYFLjB2UbwYytkKTvXwBlmD-Bnf5HcbAMIFVwHfWGYTpYJbyyJI-v6sDH62z-2Y2p4fso65vqDCI9Zbxido1-wLWijVFBdIkl9pSi9iBbTamOkQ62plUL7Ho1jlokjlGSn9iCLYkf8ElFSYqgER_rGOWLzfAIVDlprdc03uj0ajQzFLrer-H_tMrMNidtWzUbDgsxhknhLUsUK7hnnJeZtUFJ4cxkf2CX6kBOajYpP0F7yQeGzvY" },
                            { name: "Súp Tom Yum", price: 120000, img: "https://lh3.googleusercontent.com/aida-public/AB6AXuA_eXW4G0uubYHfUzl7N_MXC2PcgpJzscs76Bhq2KQiyQ8Xa_S6W7Ir9Hdfy04CCCxZOEUGqrElnyFw92IS_0ZMP7ZFnB2uip-NJ5LnIX0aZcrOBfUTRpR1i5hUgiuR6UnVfFO9M1v2CatkljKRAMk6o410j-8ilIrJflbk--gF1H6tzoW4pYrxZXD2lAcczkEgR5Sruzl2dxYZLOdmbjYknSAJa68cyBTpLXsNQUQ_U-vKQ6hA9CNDu0Nr4MlDsn432mTW-gdNn9E" },
                            { name: "Cà Ri Xanh", price: 140000, img: "https://lh3.googleusercontent.com/aida-public/AB6AXuBS2l5DGZFEHaiFZFN1egqQ9q2Knebt4Y8fw7gi3ak_C9Uu2sqbxs10pnKyiD4WkN5iBGZdVEhnEXUSw3jv6Kv2bCRd2eESmn89kUpPx1KEiZPKEuvXJX5OJ3NkhNyQQ2eLsrhJvXRX4KofC0Lj9zBEf-U5JiUA7B0Vb1uHXmi_owP8ZqRVU3aCU-ZV2X2bpwbxaTDY-VAyZuFLhQniDzfKr9VkCzRqgmsIYy6egwPrYM3ckJakmfQb51ptLPS3NriTY0fDfywXIKw" },
                            { name: "Gỏi Xoài Cá Trê", price: 110000, img: "https://lh3.googleusercontent.com/aida-public/AB6AXuBta7V079jGQX19B6VM3WIELX_zDUYnmh7eY_dzks62za15ASJLEs1iwQeU-M0O7fO4KiwybYLHcO_6e11hQLTP8iOynGtc5s8TZ0mlfUaFWhi3Y0MFJl_JOG9yjngk3__VS2jl7WKtK6YsMmlHha2EY-pAmdcnNAfuaqeSZSVJt1ygpjyCx-5cNEpJ5djR4fSmAFmX7MPXJMQ5sNVVp7uuAEqAYnYmIJwGPs4oVlY_uCxXUA-tPdLTaxUE3gIzwe3kCvY_pMXiWnE" }
                        ].map((item, idx) => (
                            <div key={idx} className="group cursor-pointer">
                                <div className="rounded-xl overflow-hidden mb-3 aspect-square relative">
                                    <div
                                        className="w-full h-full bg-cover bg-center transition-transform duration-500 group-hover:scale-110"
                                        style={{ backgroundImage: `url("${item.img}")` }}
                                    ></div>
                                    <button className="absolute bottom-2 right-2 size-8 bg-white rounded-full shadow-md flex items-center justify-center text-primary opacity-0 group-hover:opacity-100 transition-opacity">
                                        <span className="material-symbols-outlined text-[18px]">add</span>
                                    </button>
                                </div>
                                <h4 className="font-bold text-text-main dark:text-white mb-1 truncate">{item.name}</h4>
                                <p className="text-primary font-bold text-sm">{item.price.toLocaleString('vi-VN')}đ</p>
                            </div>
                        ))}
                    </div>
                </section>
            </main>
            <ToastContainer toasts={toasts} dismiss={dismiss} />
        </div>
    );
};

export default FoodDetailPage;
