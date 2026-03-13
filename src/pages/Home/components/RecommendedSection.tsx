import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Sparkles, Star, ArrowRight, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link, useNavigate } from "react-router-dom";
import recommendationService from "@/services/recommendation.service";
import type { AIRecommendation } from "@/services/recommendation.service";
import productAPI from "@/services/product.service";
import type { Product } from "@/types/product";
import { useAuthStore } from "@/store/authStore";
import { useCart } from "@/hooks/useCart";
import toast from "react-hot-toast";

// ── Helpers ───────────────────────────────────────────────

const getImageUrl = (image: Product["image"]): string => {
  if (!image) return "";
  if (typeof image === "object" && image.secure_url) return image.secure_url;
  if (typeof image === "string") return image;
  return "";
};

// Nhãn gợi ý mặc định khi dùng fallback (không có AI)
const FALLBACK_TAGS = ["Healthy Choice", "Top Pick", "Best Match"];

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

// ── Types (union để render chung) ─────────────────────────

type DisplayItem =
  | { type: "ai"; data: AIRecommendation }
  | { type: "fallback"; data: Product; tag: string };

// ── Main Component ────────────────────────────────────────

const RecommendedSection = () => {
  const navigate = useNavigate();
  const { t } = useTranslation(["customer", "common"]);
  const { isAuthenticated } = useAuthStore();

  const [items, setItems] = useState<DisplayItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAIMode, setIsAIMode] = useState(false);
  const { addItem } = useCart();

  useEffect(() => {
    let cancelled = false;

    const fetchData = async () => {
      setLoading(true);
      try {
        if (isAuthenticated) {
          // ── Thử lấy AI recommendations ──
          try {
            const res = await recommendationService.getAIRecommendations();
            const aiData = res.data.data;
            if (!cancelled && aiData && aiData.length > 0) {
              setItems(aiData.map((d: any) => ({ type: "ai", data: d })));
              setIsAIMode(true);
              return;
            }
          } catch (_aiErr) {
            // AI endpoint failed → fallback silently
          }
        }

        // ── Fallback: top rated products từ DB ──
        const res = await productAPI.getProducts({
          sort: "rating",
          limit: 3,
          page: 1,
          isAvailable: true,
        });
        if (!cancelled) {
          setItems(
            res.data.slice(0, 3).map((p, idx) => ({
              type: "fallback",
              data: p,
              tag: FALLBACK_TAGS[idx] ?? "Great Choice",
            })),
          );
          setIsAIMode(false);
        }
      } catch (err) {
        console.error("RecommendedSection fetch error:", err);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    fetchData();
    return () => {
      cancelled = true;
    };
  }, [isAuthenticated]);

  // ── Render ────────────────────────────────────────────

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
            {isAIMode && (
              <span className="text-[10px] font-bold bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full border border-emerald-200">
                AI
              </span>
            )}
          </div>
          <p className="text-sm text-slate-500 font-medium ml-8">
            {isAIMode
              ? t(
                  "customer:home.aiSuggestionSub",
                  "Dựa trên sở thích và lịch sử đặt hàng của bạn",
                )
              : "Những món được đánh giá cao nhất hôm nay"}
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
        {/* Loading */}
        {loading && (
          <>
            {isAuthenticated ? (
              // AI loading state
              <div className="col-span-1 sm:col-span-2 lg:col-span-3 text-center py-12">
                <Sparkles className="w-8 h-8 text-orange-400 animate-spin mx-auto mb-4" />
                <p className="text-orange-600 font-medium animate-pulse">
                  AI đang phân tích thực đơn cho bạn...
                </p>
              </div>
            ) : (
              // Skeleton cards (fallback)
              Array.from({ length: 3 }).map((_, i) => (
                <RecommendedSkeleton key={i} />
              ))
            )}
          </>
        )}

        {/* Items */}
        {!loading &&
          items.map((item, idx) => {
            const isAI = item.type === "ai";
            const product = isAI ? item.data.product : item.data;
            const imageUrl = getImageUrl(product.image);
            const tagLabel = isAI
              ? `Điểm: ${item.data.healthScore}/10`
              : item.tag;
            const subText = isAI ? item.data.aiReason : product.description;

            return (
              <div
                key={isAI ? product._id + idx : product._id}
                onClick={() => navigate(`/food/${product._id}`)}
                className="flex bg-white rounded-2xl p-4 gap-4 shadow-sm border border-orange-50 hover:shadow-xl hover:shadow-orange-500/10 transition-all cursor-pointer group"
              >
                {/* Image */}
                <div className="relative w-28 h-28 rounded-xl overflow-hidden shrink-0 bg-orange-50">
                  {imageUrl ? (
                    <img
                      src={imageUrl}
                      alt={product.name}
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
                    <div className="flex justify-between items-start mb-2">
                      <div className="bg-orange-100 text-orange-700 text-[10px] font-bold px-2 py-0.5 rounded-full inline-flex items-center gap-1">
                        <Sparkles className="w-3 h-3" />
                        {tagLabel}
                      </div>
                      <div className="flex items-center gap-1 text-xs font-bold text-slate-700 shrink-0">
                        <Star className="w-3 h-3 text-orange-500 fill-orange-500" />
                        {product.rating.toFixed(1)}
                      </div>
                    </div>
                    <h3 className="font-bold text-lg text-slate-800 leading-tight mb-1 line-clamp-1 group-hover:text-orange-600 transition-colors">
                      {product.name}
                    </h3>
                    <p className="text-xs text-slate-500 line-clamp-2">
                      {subText}
                    </p>
                  </div>
                  <div className="flex items-end justify-between mt-2">
                    <span className="font-black text-lg text-orange-600">
                      {product.price.toLocaleString("vi-VN")}đ
                    </span>
                    <div className="flex items-center gap-2">
                      <div className="text-[10px] text-slate-400 flex items-center gap-0.5">
                        <span className="material-symbols-outlined text-[12px]">
                          schedule
                        </span>
                        {product.time}
                      </div>
                      <Button
                        onClick={(e) => {
                          e.stopPropagation();

                          addItem({
                            productId: product._id,
                            name: product.name,
                            image: imageUrl,
                            price: product.price,
                            quantity: 1,
                          });
                          toast.success("Đã thêm vào giỏ hàng!");
                        }}
                        className="w-8 h-8 rounded-full bg-orange-50 text-orange-600 flex items-center justify-center hover:bg-orange-600 hover:text-white transition-all shrink-0"
                      >
                        <Plus className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}

        {/* Empty state (AI mode, not loading, no items) */}
        {!loading && items.length === 0 && (
          <div className="col-span-1 sm:col-span-2 lg:col-span-3 text-center py-12 bg-white rounded-2xl border border-dashed border-orange-200">
            <Sparkles className="w-10 h-10 text-orange-300 mx-auto mb-3" />
            <p className="text-slate-500">
              Chưa có đủ dữ liệu để gợi ý. Hãy cập nhật hồ sơ sức khỏe nhé!
            </p>
            <Button
              variant="outline"
              className="mt-4"
              onClick={() => navigate("/profile-settings")}
            >
              Cập nhật hồ sơ
            </Button>
          </div>
        )}
      </div>
    </section>
  );
};

export default RecommendedSection;
