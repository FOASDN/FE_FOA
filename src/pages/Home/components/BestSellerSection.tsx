import { useNavigate, Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { TrendingUp, ArrowRight, Star, Store, Clock, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import productAPI from "@/services/product.service";
import type { Product } from "@/types/product";

// ── Helper ──────────────────────────────────────────────
const getImageUrl = (image: Product["image"]): string => {
  if (!image) return "";
  if (typeof image === "object" && image.secure_url) return image.secure_url;
  if (typeof image === "string") return image;
  return "";
};

// ── Skeleton ─────────────────────────────────────────────
const BestSellerSkeleton = () => (
  <div className="bg-white rounded-[2rem] border border-gray-100 p-3 animate-pulse">
    <div className="aspect-4/3 rounded-[1.5rem] bg-gray-200 mb-4" />
    <div className="px-2 pb-2 space-y-2">
      <div className="h-5 bg-gray-200 rounded w-3/4" />
      <div className="h-4 bg-gray-100 rounded w-1/2" />
      <div className="h-10 bg-gray-100 rounded-xl mt-3" />
    </div>
  </div>
);

// ── Main ─────────────────────────────────────────────────
const BestSellerSection = () => {
  const navigate = useNavigate();
  const { t } = useTranslation(["customer", "common"]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    const fetchBestSellers = async () => {
      try {
        const res = await productAPI.getProducts({
          sort: "rating",
          limit: 4,
          page: 1,
          isAvailable: true,
        });
        if (!cancelled) setProducts(res.data.slice(0, 4));
      } catch (err) {
        console.error("BestSellerSection fetch error:", err);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    fetchBestSellers();
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <section>
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <h2 className="text-3xl font-black text-slate-900">
            {t("customer:home.trending")}
          </h2>
          <span className="bg-red-100 text-red-600 text-xs font-bold px-2 py-1 rounded-md uppercase flex items-center gap-1">
            <TrendingUp className="w-3 h-3" /> Trending
          </span>
        </div>
        <Link
          to="/menu"
          className="text-orange-600 font-bold text-sm hover:underline flex items-center gap-1"
        >
          {t("common:actions.viewAll")} <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {loading
          ? Array.from({ length: 4 }).map((_, i) => (
              <BestSellerSkeleton key={i} />
            ))
          : products.map((dish) => {
              const imageUrl = getImageUrl(dish.image);
              return (
                <div
                  key={dish._id}
                  onClick={() => navigate(`/food/${dish._id}`)}
                  className="group bg-white rounded-[2rem] border border-gray-100 p-3 hover:border-orange-100 shadow-sm hover:shadow-2xl hover:shadow-orange-900/5 transition-all duration-300 cursor-pointer"
                >
                  {/* Image */}
                  <div className="relative aspect-4/3 rounded-[1.5rem] overflow-hidden mb-4 bg-orange-50">
                    {imageUrl ? (
                      <img
                        src={imageUrl}
                        alt={dish.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                      />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="material-symbols-outlined text-orange-200 text-5xl">
                          restaurant
                        </span>
                      </div>
                    )}

                    {/* Rating */}
                    <div className="absolute top-3 left-3 bg-white/90 backdrop-blur px-2 py-1 rounded-lg flex items-center gap-1 shadow-sm">
                      <Star className="w-3 h-3 text-orange-500 fill-orange-500" />
                      <span className="text-[10px] font-bold text-slate-800">
                        {dish.rating.toFixed(1)}
                      </span>
                    </div>

                    {/* Tags */}
                    {dish.tags && dish.tags.length > 0 && (
                      <div className="absolute top-3 right-3">
                        <span className="bg-orange-600 text-white text-[10px] font-bold px-2 py-1 rounded-lg shadow-sm">
                          {dish.tags[0]}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  <div className="px-2 pb-2">
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex-1">
                        <h3 className="font-bold text-lg text-slate-800 leading-tight group-hover:text-orange-600 transition-colors line-clamp-1">
                          {dish.name}
                        </h3>
                        <p className="text-xs font-medium text-gray-400 mt-1 flex items-center gap-1">
                          <Store className="w-3 h-3" />
                          {dish.restaurant}
                        </p>
                      </div>
                      <div className="flex flex-col items-end pl-2">
                        <span className="text-lg font-black text-slate-900">
                          {dish.price.toLocaleString("vi-VN")}đ
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 py-3 border-t border-dashed border-gray-100 my-2">
                      <div className="flex items-center gap-1.5 text-xs font-bold text-slate-500 bg-slate-50 px-2 py-1 rounded-md">
                        <Clock className="w-3.5 h-3.5 text-orange-500" />
                        {dish.time}
                      </div>
                    </div>

                    <Button className="w-full h-11 rounded-xl font-bold flex items-center justify-center gap-2 transition-all duration-300 bg-slate-100 text-slate-900 hover:bg-slate-900 hover:text-white">
                      <Plus className="w-4 h-4" />
                      {t("customer:menu.addToCart")}
                    </Button>
                  </div>
                </div>
              );
            })}
      </div>
    </section>
  );
};

export default BestSellerSection;
