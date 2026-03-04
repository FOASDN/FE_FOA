<<<<<<< HEAD
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
=======
import { useEffect, useState } from "react";
>>>>>>> 441f52d (FSS-82 edit product (admin))
import { useTranslation } from "react-i18next";
import { Sparkles, Star, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
<<<<<<< HEAD
import recommendationService from "@/services/recommendation.service";
import type { AIRecommendation } from "@/services/recommendation.service";
import { useAuthStore } from "@/store/authStore";
=======
import { Link, useNavigate } from "react-router-dom";
import productAPI from "@/services/product.service";
import type { Product } from "@/types/product";
>>>>>>> 441f52d (FSS-82 edit product (admin))

// ── Helper ──────────────────────────────────────────────
const getImageUrl = (image: Product["image"]): string => {
  if (!image) return "";
  if (typeof image === "object" && image.secure_url) return image.secure_url;
  if (typeof image === "string") return image;
  return "";
};

// Tag mapping: hiển thị nhãn gợi ý dựa vào index
const AI_TAGS = ["Healthy Choice", "Top Pick", "Best Match"];

// ── Skeleton ─────────────────────────────────────────────
const RecommendedSkeleton = () => (
  <div className="flex bg-white rounded-2xl p-4 gap-4 border border-orange-50 animate-pulse">
    <div className="w-28 h-28 rounded-xl bg-gray-200 shrink-0" />
    <div className="flex-1 space-y-2 py-1">
      <div className="h-3 bg-gray-200 rounded w-1/3" />
      <div className="h-5 bg-gray-200 rounded w-2/3" />
      <div className="h-3 bg-gray-100 rounded w-1/2" />
      <div className="h-6 bg-gray-100 rounded w-1/4 mt-4" />
    </div>
  </div>
);

// ── Main ─────────────────────────────────────────────────
const RecommendedSection = () => {
<<<<<<< HEAD
    const navigate = useNavigate();
    const { t } = useTranslation(['customer', 'common']);
    const { isAuthenticated } = useAuthStore();

    const [recommendations, setRecommendations] = useState<AIRecommendation[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (!isAuthenticated) return;
        const fetchRecommendations = async () => {
            try {
                setIsLoading(true);
                const res = await recommendationService.getAIRecommendations();
                console.log('[AI Debug] recommendations:', JSON.stringify(res.data.data?.slice(0, 1), null, 2));
                setRecommendations(res.data.data);
            } catch (err) {
                console.error("Failed to load AI recommendations", err);
            } finally {
                setIsLoading(false);
            }
        };
        fetchRecommendations();
    }, [isAuthenticated]);

    if (!isAuthenticated) return null; // Hide if not logged in

    return (
        <section className="bg-gradient-to-br from-orange-50 via-amber-50 to-white rounded-[2rem] p-6 md:p-8 border border-orange-100">
            <div className="flex items-center justify-between mb-8">
                <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-2">
                        <Sparkles className="w-6 h-6 text-orange-600 fill-orange-600 animate-pulse" />
                        <h2 className="text-2xl font-black text-slate-900">{t('customer:home.aiSuggestion')}</h2>
                    </div>
                    <p className="text-sm text-slate-500 font-medium ml-8">{t('customer:home.aiSuggestionSub', 'Dựa trên sở thích và lịch sử đặt hàng của bạn')}</p>
                </div>
                <div className="flex items-center gap-2">
                    <Link to="/ai-suggestions">
                        <Button variant="ghost" className="text-emerald-600 font-bold hover:bg-emerald-50 hover:text-emerald-700 text-sm">
                            Gợi ý món an toàn
                        </Button>
                    </Link>
                    <Link to="/menu">
                        <Button variant="ghost" className="text-orange-600 font-bold hover:bg-orange-100 hover:text-orange-700">
                            {t('common:actions.viewAll')}
                        </Button>
                    </Link>
                </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {isLoading ? (
                    <div className="col-span-1 sm:col-span-2 lg:col-span-3 text-center py-12">
                        <Sparkles className="w-8 h-8 text-orange-400 animate-spin mx-auto mb-4" />
                        <p className="text-orange-600 font-medium animate-pulse">AI đang phân tích thực đơn cho bạn...</p>
                    </div>
                ) : recommendations.length > 0 ? (
                    recommendations.map((item, idx) => {
                        const img = item.product.image as any;
                        const imageUrl = typeof img === 'string'
                            ? img
                            : img?.secure_url
                            ?? img?.url
                            ?? "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=500&h=500&fit=crop";

                        return (
                            <div key={idx} onClick={() => navigate(`/food/${item.product._id}`)} className="flex bg-white rounded-2xl p-4 gap-4 shadow-sm border border-orange-50 hover:shadow-xl hover:shadow-orange-500/10 transition-all cursor-pointer group h-full">
                                <div className="relative w-28 h-28 rounded-xl overflow-hidden shrink-0">
                                    <img src={imageUrl} alt={item.product.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                                    {idx === 0 && <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors" />}
                                </div>
                                <div className="flex flex-col flex-1 justify-between">
                                    <div>
                                        <div className="flex justify-between items-start mb-2">
                                            <div className="bg-orange-100 text-orange-700 text-[10px] font-bold px-2 py-0.5 rounded-full inline-block">
                                                <div className="flex items-center gap-1"><Sparkles className="w-3 h-3" /> Điểm: {item.healthScore}/10</div>
                                            </div>
                                            <div className="flex items-center gap-1 text-xs font-bold text-slate-700">
                                                <Star className="w-3 h-3 text-orange-500 fill-orange-500" /> {item.product.rating || 5.0}
                                            </div>
                                        </div>
                                        <h3 className="font-bold text-lg text-slate-800 leading-tight mb-1">{item.product.name}</h3>
                                        <p className="text-xs text-slate-500 line-clamp-2">{item.aiReason}</p>
                                    </div>
                                    <div className="flex items-end justify-between mt-2">
                                        <span className="font-black text-lg text-orange-600">{item.product.price.toLocaleString()}đ</span>
                                        <button className="w-8 h-8 rounded-full bg-orange-50 text-orange-600 flex items-center justify-center hover:bg-orange-600 hover:text-white transition-all shrink-0 ml-2">
                                            <Plus className="w-5 h-5" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        );
                    })
                ) : (
                    <div className="col-span-1 sm:col-span-2 lg:col-span-3 text-center py-12 bg-white rounded-2xl border border-dashed border-orange-200">
                        <p className="text-slate-500">Chưa có đủ dữ liệu để gợi ý. Hãy cập nhật hồ sơ sức khỏe nhé!</p>
                        <Button variant="outline" className="mt-4" onClick={() => navigate('/profile-settings')}>
                            Cập nhật hồ sơ
                        </Button>
                    </div>
                )}
            </div>
        </section>
    );
=======
  const navigate = useNavigate();
  const { t } = useTranslation(["customer", "common"]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    const fetchRecommended = async () => {
      try {
        // Fetch 3 sản phẩm đánh giá cao, đang bán
        const res = await productAPI.getProducts({
          sort: "rating",
          limit: 3,
          page: 1,
          isAvailable: true,
        });
        if (!cancelled) setProducts(res.data.slice(0, 3));
      } catch (err) {
        console.error("RecommendedSection fetch error:", err);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    fetchRecommended();
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <section className="bg-linear-to-br from-orange-50 via-amber-50 to-white rounded-[2rem] p-6 md:p-8 border border-orange-100">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <Sparkles className="w-6 h-6 text-orange-600 fill-orange-600 animate-pulse" />
            <h2 className="text-2xl font-black text-slate-900">
              {t("customer:home.aiSuggestion")}
            </h2>
          </div>
          <p className="text-sm text-slate-500 font-medium ml-8">
            {t(
              "customer:home.aiSuggestionSub",
              "Những món được đánh giá cao nhất hôm nay",
            )}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Link to="/ai-suggestions">
            <Button
              variant="ghost"
              className="text-emerald-600 font-bold hover:bg-emerald-50 hover:text-emerald-700 text-sm"
            >
              Gợi ý món an toàn
            </Button>
          </Link>
          <Link to="/menu">
            <Button
              variant="ghost"
              className="text-orange-600 font-bold hover:bg-orange-100 hover:text-orange-700 flex items-center gap-1"
            >
              {t("common:actions.viewAll")}
              <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading
          ? Array.from({ length: 3 }).map((_, i) => (
              <RecommendedSkeleton key={i} />
            ))
          : products.map((item, idx) => {
              const imageUrl = getImageUrl(item.image);
              const aiTag = AI_TAGS[idx] ?? "Great Choice";
              return (
                <div
                  key={item._id}
                  onClick={() => navigate(`/food/${item._id}`)}
                  className="flex bg-white rounded-2xl p-4 gap-4 shadow-sm border border-orange-50 hover:shadow-xl hover:shadow-orange-500/10 transition-all cursor-pointer group"
                >
                  {/* Image */}
                  <div className="relative w-28 h-28 rounded-xl overflow-hidden shrink-0 bg-orange-50">
                    {imageUrl ? (
                      <img
                        src={imageUrl}
                        alt={item.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="material-symbols-outlined text-orange-200 text-3xl">
                          restaurant
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  <div className="flex flex-col flex-1 justify-between min-w-0">
                    <div>
                      <div className="flex justify-between items-start">
                        <div className="bg-orange-100 text-orange-700 text-[10px] font-bold px-2 py-0.5 rounded-full mb-2 inline-flex items-center gap-1">
                          <Sparkles className="w-3 h-3" />
                          {aiTag}
                        </div>
                        <div className="flex items-center gap-1 text-xs font-bold text-slate-700 shrink-0">
                          <Star className="w-3 h-3 text-orange-500 fill-orange-500" />
                          {item.rating.toFixed(1)}
                        </div>
                      </div>
                      <h3 className="font-bold text-lg text-slate-800 leading-tight mb-1 line-clamp-1 group-hover:text-orange-600 transition-colors">
                        {item.name}
                      </h3>
                      <p className="text-xs text-slate-500 line-clamp-2">
                        {item.description}
                      </p>
                    </div>
                    <div className="flex items-end justify-between mt-2">
                      <span className="font-black text-lg text-orange-600">
                        {item.price.toLocaleString("vi-VN")}đ
                      </span>
                      <div className="text-[10px] text-slate-400 flex items-center gap-1">
                        <span className="material-symbols-outlined text-[12px]">
                          schedule
                        </span>
                        {item.time}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
      </div>
    </section>
  );
>>>>>>> 441f52d (FSS-82 edit product (admin))
};

export default RecommendedSection;
