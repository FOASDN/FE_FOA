import { useState, useEffect, useMemo } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useSafeCart } from "@/hooks/useSafeCart";
import { useAuth } from "@/hooks/useAuth";
import { useSupportChatStore } from "@/store/supportChatStore";
import toast from "react-hot-toast";
import productAPI from "@/services/product.service";
import reviewService from "@/services/review.service";
import recommendationService from "@/services/recommendation.service";
import type { Product, VariantGroup, VariantOption } from "@/types/product";
import { FoodCard } from "@/components/shared/FoodCard";
import VariantModal from "@/components/model/VariantModel";
import {
  User, ThumbsUp, MessageSquare, Star, Loader2, Plus, Minus,
  Check, ChevronLeft, ShieldCheck, Flame, ShoppingCart, Zap, SearchX
} from "lucide-react";
import { useAllergyCheck } from "@/hooks/useAllergyCheck";
import { useCart } from "@/hooks/useCart";

const getImageUrl = (image: any): string => {
  if (!image) return "";
  if (typeof image === "object" && image.secure_url) return image.secure_url;
  if (typeof image === "string") return image;
  return "";
};

const FoodDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { t } = useTranslation(["customer", "common"]);
  const { safeAddItem } = useSafeCart();
  const { addItem } = useCart();
  const { isAuthenticated } = useAuth();
  const { openChat } = useSupportChatStore();

  // --- States ---
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [suggestedFoods, setSuggestedFoods] = useState<Product[]>([]);
  const [loadingSuggested, setLoadingSuggested] = useState(false);
  const [openVariantModal, setOpenVariantModal] = useState(false);
  const [allergyBannerDismissed, setAllergyBannerDismissed] = useState(false);

  // FSS-40: Check allergy status for this product
  const allergyResult = useAllergyCheck(product);
  const [reviews, setReviews] = useState<any[]>([]);
  const [loadingReviews, setLoadingReviews] = useState(false);
  const [isBuyNowMode, setIsBuyNowMode] = useState(false);
  const [selectedVariants, setSelectedVariants] = useState<Record<string, string[]>>({});

  // --- Logic ---
  const extraPrice = useMemo(() => {
    if (!product || !product.variants) return 0;
    let extra = 0;
    product.variants.forEach((group) => {
      const selected = selectedVariants[group.name] || [];
      selected.forEach((choice) => {
        const option = group.options.find((opt) => opt.choice === choice);
        if (option) extra += option.extra_price;
      });
    });
    return extra;
  }, [product, selectedVariants]);

  const currentPrice = (product?.price || 0) + extraPrice;

  // Cuộn lên đầu trang khi đổi món
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [id]);

  useEffect(() => {
    const fetchProductAndSuggestions = async () => {
      if (!id) return;
      try {
        setLoading(true);
        const res = await productAPI.getProductById(id);
        setProduct(res.data);

        // Fetch reviews
        setLoadingReviews(true);
        const reviewRes = await reviewService.getProductReviews(id);
        setReviews(reviewRes.data || []);
        setLoadingReviews(false);

        setLoadingSuggested(true);
        if (isAuthenticated) {
          const safeRes = await recommendationService.getSafeFoods();
          const filtered = safeRes.data.data.filter((p: Product) => p._id !== id).slice(0, 4);
          setSuggestedFoods(filtered);
        } else {
          const allRes = await productAPI.getProducts({ limit: 4 });
          const filtered = allRes.data.filter((p: Product) => p._id !== id).slice(0, 4);
          setSuggestedFoods(filtered);
        }
      } catch (err) {
        console.error("Failed to fetch product or suggestions:", err);
        toast.error("Không tìm thấy sản phẩm");
      } finally {
        setLoading(false);
        setLoadingSuggested(false);
      }
    };
    fetchProductAndSuggestions();
  }, [id, isAuthenticated]);

  useEffect(() => {
    if (product?.variants) {
      const init: Record<string, string[]> = {};
      product.variants.forEach((g) => {
        if (g.required && !g.multiple && g.options?.length) {
          init[g.name] = [g.options[0].choice];
        } else {
          init[g.name] = [];
        }
      });
      setSelectedVariants(init);
    }
  }, [product]);

  const toggleVariant = (group: VariantGroup, choice: string) => {
    setSelectedVariants((prev) => {
      const current = prev[group.name] ?? [];
      if (!group.multiple) return { ...prev, [group.name]: [choice] };

      const exists = current.includes(choice);
      let next = exists ? current.filter((c) => c !== choice) : [...current, choice];
      if (group.max_choices && next.length > group.max_choices) return prev;
      return { ...prev, [group.name]: next };
    });
  };

  const handleIncrease = () => {
    setQuantity((prev) => prev + 1);
  };

  const handleDecrease = () => {
    setQuantity((prev) => (prev > 1 ? prev - 1 : 1));
  };

  const handleAddToCart = () => {
    if (!product) return;
    if (product.variants) {
      for (const g of product.variants) {
        if (g.required && (!selectedVariants[g.name] || selectedVariants[g.name].length === 0)) {
          toast.error(`Vui lòng chọn ${g.name}`);
          return;
        }
      }
    }
    const variations = product.variants ? product.variants.flatMap((g) => {
      const picked = selectedVariants[g.name] ?? [];
      return picked.map((choice) => ({ name: g.name, choice }));
    }) : [];

    addItem({
      productId: product._id,
      name: product.name,
      image: getImageUrl(product.image),
      price: currentPrice,
      quantity,
      variations,
    });
    toast.success(t("customer:foodCard.addToCart", "Đã thêm vào giỏ hàng!"));
  };

  const handleBuyNow = () => {
    if (!product) return;
    // Tương tự validate như Add To Cart...
    const variations = product.variants ? product.variants.flatMap((g) => {
      const picked = selectedVariants[g.name] ?? [];
      return picked.map((choice) => ({ name: g.name, choice }));
    }) : [];

    const buyNowItem = {
      productId: product._id,
      name: product.name,
      image: getImageUrl(product.image),
      price: currentPrice,
      quantity,
      variations,
    };
    navigate('/checkout', { state: { buyNowItem } });
  };

  return (
    <div className="bg-slate-50 font-sans min-h-screen pb-24 relative">
      <main className="max-w-6xl mx-auto px-4 md:px-8 py-6">

        {loading ? (
          <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
            <Loader2 className="w-10 h-10 text-orange-500 animate-spin" />
            <p className="font-medium text-slate-500 animate-pulse">Đang chuẩn bị món ăn...</p>
          </div>
        ) : !product ? (
          <div className="text-center py-20 bg-white rounded-3xl mt-10 shadow-sm border border-slate-200">
            <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <SearchX className="w-10 h-10 text-slate-400" />
            </div>
            <h2 className="text-2xl font-bold text-slate-800">Không tìm thấy món ăn</h2>
            <button onClick={() => navigate("/menu")} className="mt-4 text-orange-600 font-bold hover:underline">
              Quay lại thực đơn
            </button>
          </div>
        ) : (
          <div>
            {/* --- BREADCRUMB --- */}
            <nav className="flex items-center gap-2 mb-6 text-sm">
              <button onClick={() => navigate(-1)} className="text-slate-500 hover:text-orange-600 transition-colors p-1 -ml-1 rounded-full hover:bg-orange-50">
                <ChevronLeft className="w-5 h-5" />
              </button>
              <Link className="text-slate-500 hover:text-orange-600 font-medium" to="/menu">
                Thực đơn
              </Link>
              <span className="text-slate-300">/</span>
              <span className="text-slate-900 font-bold truncate max-w-[200px]">{product.name}</span>
            </nav>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">

              {/* --- LEFT COLUMN: IMAGE --- */}
              <div className="lg:col-span-5 relative lg:sticky lg:top-24">
                <div className="relative w-full aspect-square md:aspect-[4/3] lg:aspect-square rounded-[2.5rem] overflow-hidden shadow-xl shadow-slate-200 bg-white">
                  <img
                    src={getImageUrl(product.image)}
                    alt={product.name}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute top-4 left-4">
                    <span className="inline-flex items-center gap-1.5 bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-full text-xs font-black uppercase tracking-wider text-orange-600 shadow-md">
                      <Flame className="w-3.5 h-3.5 fill-current" />
                      Món bán chạy
                    </span>
                  </div>
                </div>
              </div>

              {/* RIGHT COLUMN: Details & Actions */}
              <div className="flex flex-col h-full pt-2">
                {/* FSS-40: Allergy Warning Banner */}
                {allergyResult.level !== "safe" && !allergyBannerDismissed && (
                  <div
                    className={`mb-4 rounded-2xl p-4 flex gap-3 items-start border ${allergyResult.level === "danger"
                      ? "bg-red-50 border-red-200"
                      : "bg-amber-50 border-amber-200"
                      }`}
                  >
                    <span
                      className={`material-symbols-outlined text-2xl shrink-0 mt-0.5 ${allergyResult.level === "danger"
                        ? "text-red-500"
                        : "text-amber-500"
                        }`}
                    >
                      warning
                    </span>
                    <div className="flex-1">
                      <p
                        className={`font-bold text-sm ${allergyResult.level === "danger"
                          ? "text-red-800"
                          : "text-amber-800"
                          }`}
                      >
                        {allergyResult.level === "danger"
                          ? "⚠️ Cảnh báo dị ứng!"
                          : "⚡ Lưu ý sức khỏe"}
                      </p>
                      <p
                        className={`text-xs mt-1 ${allergyResult.level === "danger"
                          ? "text-red-700"
                          : "text-amber-700"
                          }`}
                      >
                        {allergyResult.warningMessage}
                      </p>
                      {allergyResult.conflictIngredients.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-2">
                          {allergyResult.conflictIngredients.map(
                            (ing: string, i: number) => (
                              <span
                                key={i}
                                className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${allergyResult.level === "danger"
                                  ? "bg-red-100 text-red-700"
                                  : "bg-amber-100 text-amber-700"
                                  }`}
                              >
                                {ing}
                              </span>
                            ),
                          )}
                        </div>
                      )}
                    </div>
                    <button
                      onClick={() => setAllergyBannerDismissed(true)}
                      className="text-gray-400 hover:text-gray-600 shrink-0"
                    >
                      <span className="material-symbols-outlined text-[18px]">
                        close
                      </span>
                    </button>
                  </div>
                )}

                <nav className="flex flex-wrap items-center gap-2 mb-4 text-sm">
                  <Link
                    className="text-[#9e6b47] hover:text-primary font-medium transition-colors"
                    to="/menu"
                  >
                    {t("customer:menu.title")}
                  </Link>
                  <span className="text-[#9e6b47]/60">/</span>
                  <span className="text-text-main dark:text-white font-semibold">
                    {product.name}
                  </span>
                </nav>

                <div className="mb-6">
                  <h1 className="text-3xl md:text-4xl lg:text-5xl font-black text-slate-900 tracking-tight leading-[1.1] mb-4">
                    {product.name}
                  </h1>

                  <div className="flex flex-wrap items-center gap-4 sm:gap-6">
                    <span className="text-3xl font-black text-orange-600">
                      {currentPrice.toLocaleString("vi-VN")}đ
                    </span>
                    <div className="h-6 w-px bg-slate-200 hidden sm:block"></div>
                    <div className="flex items-center gap-1.5 bg-yellow-50 px-3 py-1.5 rounded-full border border-yellow-100">
                      <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                      <span className="font-bold text-slate-800">
                        {Number(product?.rating ?? 0).toFixed(1)}
                      </span>
                      <span className="text-xs text-slate-500 font-medium ml-1">
                        ({product?.review_count || 0}+ đánh giá)
                      </span>
                    </div>
                  </div>
                </div>

                {/* AI Healthy Badge */}
                {product.health_tags && product.health_tags.length > 0 && (
                  <div className="bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-100 rounded-3xl p-5 mb-8 flex items-start gap-4">
                    <div className="w-12 h-12 bg-emerald-500 text-white rounded-2xl flex items-center justify-center shrink-0 shadow-sm shadow-emerald-500/20">
                      <ShieldCheck className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-emerald-900 mb-1">
                        NutriAI™ Khuyên dùng
                      </h3>
                      <p className="text-sm text-emerald-700/80 mb-3 font-medium leading-relaxed">
                        Món ăn được trí tuệ nhân tạo phân tích thành phần, đảm bảo an toàn cho hồ sơ sức khỏe của bạn.
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {product.health_tags.map((tag) => (
                          <span key={tag} className="px-2.5 py-1 bg-white border border-emerald-200 text-emerald-700 rounded-lg text-[11px] font-bold uppercase tracking-wider shadow-sm">
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                <div className="mb-8">
                  <h3 className="text-lg font-bold text-text-main dark:text-white mb-3 flex items-center gap-2">
                    <span className="material-symbols-outlined text-primary">
                      description
                    </span>
                    {t("customer:foodDetail.description")}
                  </h3>
                  <div className="bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/10 rounded-2xl p-6 relative">
                    <span className="material-symbols-outlined absolute top-4 left-4 text-4xl text-gray-200 dark:text-gray-700/50 -z-0 select-none">
                      format_quote
                    </span>
                    <p className="text-base text-gray-700 dark:text-gray-300 leading-relaxed tracking-wide relative z-10 pl-6 border-l-2 border-primary/20">
                      {product.description ||
                        "Đang cập nhật giới thiệu cho món ăn tuyệt vời này..."}
                    </p>
                  </div>
                </div>

                {/* VARIANTS SECTION */}
                {product.variants && product.variants.length > 0 && (
                  <div className="space-y-6 mb-8">
                    {product.variants.map((group) => (
                      <div key={group.name} className="bg-white border border-slate-200 rounded-3xl p-5 shadow-sm">
                        <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-slate-900 text-lg">{group.name}</span>
                            {group.required && (
                              <span className="text-[10px] font-black uppercase tracking-wider px-2 py-1 rounded-md bg-rose-100 text-rose-600">
                                Bắt buộc
                              </span>
                            )}
                            {group.multiple && (
                              <span className="text-[10px] font-bold px-2 py-1 rounded-md bg-slate-100 text-slate-600">
                                Chọn nhiều {group.max_choices ? `(Max: ${group.max_choices})` : ""}
                              </span>
                            )}
                          </div>
                          <span className="text-xs font-medium text-slate-500 bg-slate-50 px-2 py-1 rounded-lg">
                            Đã chọn: {selectedVariants[group.name]?.length || 0}
                          </span>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          {group.options.map((option) => {
                            const isSelected = selectedVariants[group.name]?.includes(option.choice);
                            return (
                              <button
                                key={option.choice}
                                onClick={() => toggleVariant(group, option.choice)}
                                className={`flex items-center justify-between p-3.5 rounded-2xl border-2 transition-all text-left ${isSelected
                                  ? "border-orange-500 bg-orange-50 shadow-sm"
                                  : "border-slate-100 bg-white hover:border-orange-300"
                                  }`}
                              >
                                <div className="flex items-center gap-3">
                                  {/* Radio/Checkbox Indicator */}
                                  <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors shrink-0 ${isSelected ? "border-orange-500 bg-orange-500" : "border-slate-300"
                                    }`}>
                                    {isSelected && <div className="w-2 h-2 bg-white rounded-full" />}
                                  </div>
                                  <span className={`text-sm font-bold ${isSelected ? "text-orange-900" : "text-slate-700"}`}>
                                    {option.choice}
                                  </span>
                                </div>
                                {option.extra_price > 0 && (
                                  <span className={`text-[13px] font-black ${isSelected ? "text-orange-600" : "text-slate-500"}`}>
                                    +{option.extra_price.toLocaleString("vi-VN")}đ
                                  </span>
                                )}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* --- STICKY ACTION BAR (Thanh mua hàng trượt) --- */}
                {/* Trên Mobile: Dính chặt đáy màn hình. Trên Desktop: Nằm gọn dưới nội dung */}
                <div className="fixed bottom-0 inset-x-0 z-50 bg-white/90 backdrop-blur-xl border-t border-slate-200 p-4 shadow-[0_-10px_20px_rgba(0,0,0,0.05)]">
                  <div className="flex items-center gap-3 max-w-6xl mx-auto">

                    {/* Quantity Selector */}
                    <div className="flex items-center justify-between bg-slate-100 border border-slate-200 rounded-2xl px-1.5 h-14 min-w-[120px] shrink-0">
                      <button onClick={handleDecrease} className="w-10 h-10 flex items-center justify-center bg-white rounded-xl shadow-sm text-slate-600 hover:text-orange-600 active:scale-95 transition-all">
                        <Minus className="w-4 h-4" />
                      </button>
                      <span className="font-black text-lg text-slate-900 w-8 text-center">
                        {quantity}
                      </span>
                      <button onClick={handleIncrease} className="w-10 h-10 flex items-center justify-center bg-white rounded-xl shadow-sm text-slate-600 hover:text-orange-600 active:scale-95 transition-all">
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>

                    {/* Buttons */}
                    <button
                      onClick={handleAddToCart}
                      className="flex-1 h-14 bg-orange-100 text-orange-700 font-black text-sm sm:text-base rounded-2xl flex items-center justify-center gap-2 hover:bg-orange-200 active:scale-95 transition-all"
                    >
                      <ShoppingCart className="w-5 h-5 hidden sm:block" />
                      Thêm vào giỏ
                    </button>

                    <button
                      onClick={handleBuyNow}
                      className="flex-1 h-14 bg-orange-600 text-white font-black text-sm sm:text-base rounded-2xl shadow-lg shadow-orange-500/30 flex items-center justify-center gap-2 hover:bg-orange-700 active:scale-95 transition-all"
                    >
                      <Zap className="w-5 h-5 fill-current hidden sm:block" />
                      Mua ngay
                    </button>

                  </div>
                  <div className="mt-4 max-w-sm ml-auto">
                    <button
                      onClick={() => openChat()}
                      className="flex items-center gap-2 px-6 py-4 rounded-2xl bg-slate-100 text-slate-700 font-bold hover:bg-slate-200 transition-colors w-full justify-center"
                    >
                      <MessageSquare className="size-5" />
                      Nhắn tin
                    </button>
                  </div>
                </div>

              </div>
            </div>

            {/* --- REVIEWS SECTION --- */}
            <section className="mt-20 border-t border-slate-200 pt-16">
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900 mb-8 flex items-center gap-3">
                <MessageSquare className="w-8 h-8 text-orange-500" />
                Đánh giá từ khách hàng
              </h2>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Summary Card */}
                <div className="lg:col-span-4">
                  <div className="bg-white rounded-3xl p-8 border border-slate-200 text-center shadow-sm sticky top-24">
                    <div className="text-6xl font-black text-slate-900 mb-2 tracking-tighter">
                      {Number(product?.rating ?? 0).toFixed(1)}
                    </div>
                    <div className="flex justify-center gap-1 mb-4">
                      {[1, 2, 3, 4, 5].map((s) => (
                        <Star key={s} className={`w-6 h-6 ${Number(product?.rating ?? 0) >= s ? "fill-yellow-400 text-yellow-400" : "fill-slate-100 text-slate-200"}`} />
                      ))}
                    </div>
                    <p className="text-sm font-bold text-slate-500">
                      Dựa trên {Number(product?.review_count ?? 0)} lượt đánh giá
                    </p>
                  </div>
                </div>

                {/* Review List */}
                <div className="lg:col-span-8 space-y-5">
                  {loadingReviews ? (
                    <div className="flex flex-col items-center py-10 gap-3">
                      <Loader2 className="w-8 h-8 text-orange-500 animate-spin" />
                      <p className="text-slate-500 font-medium">Đang tải nhận xét...</p>
                    </div>
                  ) : reviews.length === 0 ? (
                    <div className="bg-slate-100/50 rounded-3xl p-12 text-center border border-dashed border-slate-300">
                      <MessageSquare className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                      <p className="text-slate-500 font-bold">Món này chưa có nhận xét chi tiết.</p>
                      <p className="text-slate-400 text-sm mt-1">Hãy là người đầu tiên đánh giá!</p>
                    </div>
                  ) : (
                    reviews.map((rev) => (
                      <div key={rev._id} className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm">
                        <div className="flex justify-between items-start mb-4">
                          <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center overflow-hidden shrink-0">
                              {rev.user_id?.avatar ? (
                                <img
                                  src={rev.user_id.avatar}
                                  alt="Avatar"
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                <User className="w-6 h-6 text-slate-400" />
                              )}
                            </div>
                            <div>
                              <p className="font-bold text-slate-900">
                                {rev.isAnonymous ? "Người dùng ẩn danh" : rev.user_id?.username || "Khách hàng"}
                              </p>
                              <div className="flex items-center gap-2 mt-1">
                                <div className="flex gap-0.5">
                                  {[1, 2, 3, 4, 5].map((s) => (
                                    <Star key={s} className={`w-3.5 h-3.5 ${rev.rating >= s ? "text-yellow-400 fill-yellow-400" : "text-slate-200 fill-slate-200"}`} />
                                  ))}
                                </div>
                                <span className="w-1 h-1 bg-slate-300 rounded-full"></span>
                                <span className="text-[11px] text-slate-500 font-medium">
                                  {new Date(rev.createdAt).toLocaleDateString("vi-VN")}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>

                        <p className="text-slate-700 leading-relaxed mb-4">
                          {rev.comment}
                        </p>

                        {rev.images && rev.images.length > 0 && (
                          <div className="flex flex-wrap gap-2 mb-4">
                            {rev.images.map((img: any, i: number) => (
                              <div key={i} className="w-24 h-24 rounded-2xl overflow-hidden border border-slate-200 cursor-zoom-in">
                                <img
                                  src={typeof img === 'string' ? `${import.meta.env.VITE_API_URL}/files/${img}` : img.url || img.secure_url}
                                  alt="Review"
                                  className="w-full h-full object-cover hover:scale-110 transition-transform duration-500"
                                />
                              </div>
                            ))}
                          </div>
                        )}

                        <div className="pt-3 border-t border-gray-50 dark:border-white/5 flex items-center gap-4">
                          <button className="flex items-center gap-1.5 text-[10px] font-black uppercase text-gray-400 hover:text-primary transition-colors">
                            <ThumbsUp className="w-3.5 h-3.5" />
                            Hữu ích
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </section>

            {/* --- SUGGESTED FOODS --- */}
            {suggestedFoods.length > 0 && (
              <section className="mt-16 pt-16 border-t border-slate-200">
                <div className="flex items-center gap-3 mb-8">
                  <div className="p-3 bg-orange-100 rounded-2xl">
                    <Flame className="w-6 h-6 text-orange-600 fill-orange-600/20" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-black text-slate-900">
                      {isAuthenticated ? "Gợi ý an toàn cho bạn" : "Có thể bạn sẽ thích"}
                    </h2>
                    <p className="text-sm text-slate-500 mt-1 font-medium">
                      {isAuthenticated
                        ? "Được AI chọn lọc dựa trên hồ sơ sức khỏe cá nhân."
                        : "Khám phá thêm các hương vị hấp dẫn khác."}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
                  {suggestedFoods.map((suggestedItem) => (
                    <FoodCard
                      key={suggestedItem._id}
                      id={suggestedItem._id}
                      name={suggestedItem.name}
                      image={getImageUrl(suggestedItem.image)}
                      price={suggestedItem.price}
                      rating={suggestedItem.rating}
                      restaurant={suggestedItem.restaurant}
                      time={suggestedItem.time}
                    />
                  ))}
                </div>
              </section>
            )}
          </div>
        )}
      </main>

      {/* Component Modal Variant cũ của em */}
      <VariantModal
        open={openVariantModal}
        onClose={() => setOpenVariantModal(false)}
        productName={product?.name ?? ""}
        basePrice={Number(product?.price ?? 0)}
        variants={(product as any)?.variants ?? []}
        quantity={quantity}
        toastError={(msg) => toast.error(msg)}
        onConfirm={({ variations, unitPrice }) => {
          if (!product) return;

          safeAddItem(
            product,
            {
              productId: product._id,
              name: product.name,
              image:
                typeof product.image === "object"
                  ? product.image.secure_url
                  : product.image,
              price: unitPrice,
              quantity,
              variations,
            },
            () => {
              toast.success(
                t("customer:foodCard.addToCart", "Đã thêm vào giỏ hàng!"),
              );
            },
          );
        }}
      />
    </div>
  );
};

export default FoodDetailPage;