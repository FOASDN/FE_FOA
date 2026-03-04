import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useCart } from '@/hooks/useCart';
import { useToast, ToastContainer } from '@/hooks/useToast';
import productAPI from '@/services/product.service';
import type { Product } from '@/types/product';

const FoodDetailPage = () => {
    const navigate = useNavigate();
    const { id } = useParams<{ id: string }>();
    const { t } = useTranslation(['customer', 'common']);
    const { addItem } = useCart();
    const { toasts, toast, dismiss } = useToast();

    // Product data from API
    const [product, setProduct] = useState<Product | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // UI state
    const [spiciness, setSpiciness] = useState("medium");
    const [extras, setExtras] = useState<string[]>([]);
    const [quantity, setQuantity] = useState(1);
    const [showWarningModal, setShowWarningModal] = useState(false);

    useEffect(() => {
        if (!id) return;
        const fetchProduct = async () => {
            try {
                setLoading(true);
                setError(null);
                const res = await productAPI.getProductById(id);
                setProduct(res.data);
            } catch (err) {
                setError('Không tìm thấy sản phẩm.');
            } finally {
                setLoading(false);
            }
        };
        fetchProduct();
    }, [id]);

    const handleDecrease = () => { if (quantity > 1) setQuantity(prev => prev - 1); };
    const handleIncrease = () => setQuantity(prev => prev + 1);
    const toggleExtra = (extraId: string) => {
        setExtras(prev => prev.includes(extraId) ? prev.filter(e => e !== extraId) : [...prev, extraId]);
    };

    const extrasOptions = [
        { id: 'egg', name: 'Trứng ốp la thêm', price: 15000 },
        { id: 'rice', name: 'Cơm thêm', price: 10000 },
        { id: 'cheese', name: 'Phô mai lát', price: 12000 },
    ];

    const extrasTotalPrice = extras.reduce((sum, eId) => {
        const found = extrasOptions.find(e => e.id === eId);
        return sum + (found?.price || 0);
    }, 0);

    const totalPrice = product ? (product.price + extrasTotalPrice) * quantity : 0;

    const handleAddToCart = () => {
        if (!product) return;
        addItem({
            productId: product._id,
            name: product.name,
            image: typeof product.image === 'string' ? product.image : (product.image?.secure_url || ''),
            price: product.price + extrasTotalPrice,
            quantity,
            size: spiciness,
            extras: extras.map(eId => {
                const found = extrasOptions.find(e => e.id === eId);
                return { id: eId, name: found?.name || eId, price: found?.price || 0 };
            }),
        });
        toast(t('customer:foodCard.addToCart', 'Đã thêm vào giỏ hàng!'), 'success');
    };

    const imageUrl = product
        ? (typeof product.image === 'string' ? product.image : product.image?.secure_url)
        : null;

    // ─── Loading state ────────────────────────────────────────
    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="flex flex-col items-center gap-4">
                    <span className="material-symbols-outlined text-orange-500 text-5xl animate-spin">progress_activity</span>
                    <p className="text-slate-500 font-medium">Đang tải thông tin món ăn...</p>
                </div>
            </div>
        );
    }

    // ─── Error state ──────────────────────────────────────────
    if (error || !product) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="text-center max-w-sm">
                    <div className="w-20 h-20 rounded-full bg-red-50 flex items-center justify-center mx-auto mb-4">
                        <span className="material-symbols-outlined text-red-400 text-4xl">sentiment_dissatisfied</span>
                    </div>
                    <h2 className="text-xl font-bold text-slate-800 mb-2">Không tìm thấy món ăn</h2>
                    <p className="text-slate-500 mb-6">{error || 'Món ăn này không tồn tại hoặc đã bị xóa.'}</p>
                    <button
                        onClick={() => navigate('/menu')}
                        className="px-6 py-3 bg-orange-500 text-white font-bold rounded-xl hover:bg-orange-600 transition-colors"
                    >
                        ← Quay lại Thực đơn
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-white text-slate-800 font-sans min-h-screen flex flex-col antialiased relative">

            {/* Warning Modal */}
            {showWarningModal && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 backdrop-blur-md bg-black/60">
                    <div className="w-full max-w-[480px] bg-white rounded-2xl p-8 flex flex-col items-center shadow-2xl">
                        <div className="mb-6 relative">
                            <div className="absolute inset-0 bg-red-500/20 rounded-full scale-150 blur-xl"></div>
                            <div className="relative size-20 rounded-full bg-red-50 flex items-center justify-center text-red-600 shadow-lg shadow-red-500/20">
                                <span className="material-symbols-outlined text-[40px]">warning</span>
                            </div>
                        </div>
                        <h2 className="text-2xl font-extrabold text-center mb-6">Xác nhận thêm vào giỏ</h2>
                        <div className="flex flex-col gap-3 w-full">
                            <button
                                onClick={() => { setShowWarningModal(false); handleAddToCart(); }}
                                className="w-full py-4 rounded-xl bg-orange-500 text-white font-bold hover:bg-orange-600 transition-colors"
                            >
                                Xác nhận
                            </button>
                            <button
                                onClick={() => setShowWarningModal(false)}
                                className="w-full py-4 rounded-xl border border-gray-200 text-slate-600 font-bold hover:bg-gray-50 transition-colors"
                            >
                                Hủy
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Main Content */}
            <main className="flex-grow w-full max-w-[1440px] mx-auto px-4 md:px-10 lg:px-20 py-6 md:py-10">

                {/* Breadcrumb */}
                <nav className="flex items-center gap-2 mb-6 text-sm text-slate-500">
                    <button onClick={() => navigate('/menu')} className="hover:text-orange-600 font-medium transition-colors">
                        Thực đơn
                    </button>
                    <span>/</span>
                    <span className="text-slate-800 font-semibold truncate max-w-[200px]">{product.name}</span>
                </nav>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-start mb-16">

                    {/* LEFT: Sticky Image */}
                    <div className="relative lg:sticky lg:top-24">
                        <div className="relative w-full aspect-[4/3] rounded-3xl overflow-hidden shadow-xl bg-gray-100 group">
                            {imageUrl ? (
                                <img
                                    src={imageUrl}
                                    alt={product.name}
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                                />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center text-gray-300">
                                    <span className="material-symbols-outlined text-6xl">restaurant</span>
                                </div>
                            )}
                            {/* Badges */}
                            <div className="absolute top-4 left-4 flex flex-col gap-2">
                                {product.tags?.map((tag, idx) => (
                                    <span key={idx} className="inline-flex items-center bg-orange-600 text-white text-xs font-bold uppercase px-3 py-1.5 rounded-full shadow-md">
                                        {tag}
                                    </span>
                                ))}
                            </div>
                            {/* Rating badge */}
                            <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur px-3 py-2 rounded-xl flex items-center gap-1.5 shadow-sm">
                                <span className="material-symbols-outlined text-orange-500 text-[16px]">star</span>
                                <span className="text-sm font-bold text-slate-800">{product.rating}</span>
                                <span className="text-xs text-slate-400">({product.review_count} đánh giá)</span>
                            </div>
                        </div>

                        {/* Meta info row */}
                        <div className="flex items-center gap-3 mt-4 flex-wrap">
                            <div className="flex items-center gap-1.5 bg-gray-50 border border-gray-200 px-3 py-2 rounded-xl text-sm text-slate-600">
                                <span className="material-symbols-outlined text-[16px]">restaurant</span>
                                <span className="font-medium">{product.restaurant}</span>
                            </div>
                            <div className="flex items-center gap-1.5 bg-gray-50 border border-gray-200 px-3 py-2 rounded-xl text-sm text-slate-600">
                                <span className="material-symbols-outlined text-[16px]">schedule</span>
                                <span className="font-medium">{product.time}</span>
                            </div>
                            <div className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-bold ${product.isAvailable ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-red-50 text-red-700 border border-red-200'}`}>
                                <span className="material-symbols-outlined text-[16px]">{product.isAvailable ? 'check_circle' : 'cancel'}</span>
                                {product.isAvailable ? 'Còn hàng' : 'Hết hàng'}
                            </div>
                        </div>
                    </div>

                    {/* RIGHT: Details & Actions */}
                    <div className="flex flex-col pt-2">

                        {/* Header */}
                        <div className="mb-6">
                            <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight mb-3">
                                {product.name}
                            </h1>
                            <div className="flex items-center gap-4 flex-wrap">
                                <span className="text-3xl font-black text-orange-600">
                                    {product.price.toLocaleString('vi-VN')}đ
                                </span>
                            </div>
                        </div>

                        {/* Description */}
                        <div className="mb-8">
                            <h3 className="text-lg font-bold text-slate-900 mb-3">{t('customer:foodDetail.description', 'Mô tả')}</h3>
                            <p className="text-base text-gray-600 leading-relaxed">
                                {product.description}
                            </p>
                        </div>

                        {/* Customization Options */}
                        <div className="mb-8 space-y-6 border-t border-gray-100 pt-6">

                            {/* Spiciness */}
                            <div>
                                <h3 className="text-base font-bold text-slate-900 mb-3">Độ cay</h3>
                                <div className="flex flex-wrap gap-3">
                                    {['none', 'mild', 'medium', 'hot', 'extra'].map((level) => {
                                        const labels: Record<string, string> = {
                                            none: 'Không cay', mild: 'Ít cay', medium: 'Vừa', hot: 'Cay', extra: 'Siêu cay'
                                        };
                                        return (
                                            <button
                                                key={level}
                                                onClick={() => setSpiciness(level)}
                                                className={`px-4 py-2 rounded-xl text-sm font-semibold border transition-all ${spiciness === level
                                                    ? 'bg-orange-600 text-white border-orange-600 shadow-md shadow-orange-200'
                                                    : 'bg-white border-gray-200 text-gray-600 hover:border-orange-300 hover:text-orange-600'
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
                                <h3 className="text-base font-bold text-slate-900 mb-3">{t('customer:foodDetail.chooseTopping', 'Chọn topping thêm')}</h3>
                                <div className="space-y-3">
                                    {extrasOptions.map((item) => (
                                        <div
                                            key={item.id}
                                            onClick={() => toggleExtra(item.id)}
                                            className={`flex items-center justify-between p-3.5 rounded-xl border cursor-pointer transition-all ${extras.includes(item.id)
                                                ? 'bg-orange-50 border-orange-300'
                                                : 'bg-white border-gray-200 hover:border-gray-300'
                                                }`}
                                        >
                                            <div className="flex items-center gap-3">
                                                <div className={`w-5 h-5 rounded flex items-center justify-center border-2 transition-colors ${extras.includes(item.id) ? 'bg-orange-600 border-orange-600' : 'border-gray-300'}`}>
                                                    {extras.includes(item.id) && <span className="material-symbols-outlined text-white text-[14px]">check</span>}
                                                </div>
                                                <span className="text-sm font-medium text-slate-800">{item.name}</span>
                                            </div>
                                            <span className="text-sm font-bold text-orange-600">+{item.price.toLocaleString('vi-VN')}đ</span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Ingredients / Recipe */}
                            {product.recipe && product.recipe.length > 0 && (
                                <div>
                                    <h3 className="text-base font-bold text-slate-900 mb-3">{t('customer:foodDetail.ingredients', 'Nguyên liệu')}</h3>
                                    <div className="grid grid-cols-2 gap-y-2 gap-x-4">
                                        {product.recipe.map((ing, idx) => (
                                            <div key={idx} className="flex items-center gap-2 text-sm text-gray-600">
                                                <span className="w-1.5 h-1.5 rounded-full bg-orange-400 shrink-0"></span>
                                                <span>{ing.name}</span>
                                                {ing.quantity && <span className="text-gray-400 text-xs">({ing.quantity})</span>}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Action Bar */}
                        <div className="mt-auto pt-4 border-t border-gray-100 sticky bottom-0 bg-white/90 backdrop-blur-lg pb-4 z-20 shadow-[0_-8px_30px_rgba(0,0,0,0.06)] -mx-4 px-4 md:mx-0 md:rounded-2xl md:shadow-none">
                            <div className="flex flex-col sm:flex-row gap-4 items-stretch sm:items-center">
                                {/* Quantity */}
                                <div className="flex items-center justify-between bg-gray-50 border border-gray-200 rounded-xl px-2 h-14 min-w-[140px]">
                                    <button onClick={handleDecrease} className="w-10 h-10 flex items-center justify-center text-gray-500 hover:text-orange-600 hover:bg-white rounded-lg transition-all">
                                        <span className="material-symbols-outlined text-[20px]">remove</span>
                                    </button>
                                    <span className="font-bold text-lg text-slate-900">{quantity}</span>
                                    <button onClick={handleIncrease} className="w-10 h-10 flex items-center justify-center text-gray-500 hover:text-orange-600 hover:bg-white rounded-lg transition-all">
                                        <span className="material-symbols-outlined text-[20px]">add</span>
                                    </button>
                                </div>

                                {/* Add to cart CTA */}
                                <button
                                    onClick={handleAddToCart}
                                    disabled={!product.isAvailable}
                                    className="flex-1 h-14 font-bold text-lg rounded-xl shadow-lg flex items-center justify-center gap-3 transition-all hover:-translate-y-0.5 active:translate-y-0 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed bg-orange-600 hover:bg-orange-700 text-white shadow-orange-200"
                                >
                                    <span className="material-symbols-outlined">shopping_bag</span>
                                    <span>{t('customer:foodDetail.addToCart', 'Thêm vào giỏ')}</span>
                                    <span className="w-px h-6 bg-white/30 mx-1"></span>
                                    <span>{totalPrice.toLocaleString('vi-VN')}đ</span>
                                </button>
                            </div>
                            <p className="text-center sm:text-left mt-3 text-xs text-gray-400">Miễn phí giao hàng cho đơn trên 300.000đ</p>
                        </div>
                    </div>
                </div>

                {/* Reviews section (static) */}
                <section className="mb-16 max-w-5xl">
                    <h2 className="text-2xl font-bold text-slate-900 mb-8">{t('customer:foodDetail.reviews', 'Đánh giá')}</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {/* Rating Summary */}
                        <div className="bg-gray-50 rounded-2xl p-6 border border-gray-100 h-fit">
                            <div className="flex flex-col items-center justify-center text-center">
                                <span className="text-5xl font-extrabold text-slate-900 mb-2">{product.rating}</span>
                                <div className="flex gap-1 text-yellow-400 mb-2">
                                    {[...Array(5)].map((_, i) => (
                                        <span key={i} className={`material-symbols-outlined ${i < Math.round(product.rating) ? 'text-yellow-400' : 'text-gray-300'}`}>star</span>
                                    ))}
                                </div>
                                <p className="text-sm text-gray-500">Dựa trên {product.review_count} đánh giá</p>
                            </div>
                        </div>

                        {/* Placeholder reviews */}
                        <div className="md:col-span-2 space-y-4">
                            {[
                                { name: "Minh Anh", date: "2 ngày trước", rating: 5, text: "Món rất ngon! Đúng vị và giao hàng nhanh." },
                                { name: "Hoàng Tùng", date: "1 tuần trước", rating: 4, text: "Chất lượng tốt, sẽ đặt lại lần sau." },
                            ].map((review, idx) => (
                                <div key={idx} className="bg-white p-5 rounded-xl border border-gray-100">
                                    <div className="flex justify-between items-start mb-3">
                                        <div className="flex items-center gap-3">
                                            <div className="size-10 rounded-full bg-orange-100 flex items-center justify-center font-bold text-orange-600">
                                                {review.name.charAt(0)}
                                            </div>
                                            <div>
                                                <h4 className="font-bold text-sm text-slate-900">{review.name}</h4>
                                                <div className="flex text-yellow-400 text-[14px]">
                                                    {[...Array(5)].map((_, i) => (
                                                        <span key={i} className={`material-symbols-outlined text-[14px] ${i < review.rating ? 'text-yellow-400' : 'text-gray-300'}`}>star</span>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                        <span className="text-xs text-gray-400">{review.date}</span>
                                    </div>
                                    <p className="text-sm text-gray-600">{review.text}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>
            </main>

            <ToastContainer toasts={toasts} dismiss={dismiss} />
        </div>
    );
};

export default FoodDetailPage;
