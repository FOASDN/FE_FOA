import React, { useState, useEffect, useCallback } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import productAPI from "@/services/product.service";
import useDebounce from "@/hooks/useDebounce";
import type { Product } from "@/types/product";
import { CUSTOMER_CATEGORY_FILTERS } from "@/constants/product.constants";
import useDebounce from "@/hooks/useDebounce";

// ─── Helpers ───

<<<<<<< HEAD
    // params state
    const categoryParam = searchParams.get("category") || "all";
    const searchParam = searchParams.get("search") || "";

    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [activeCategory, setActiveCategory] = useState(categoryParam);
    const [searchQuery, setSearchQuery] = useState(searchParam);
    const debouncedSearch = useDebounce(searchQuery, 400);
    const [priceRange, setPriceRange] = useState([0, 100]);
    const [selectedRating, setSelectedRating] = useState<number | null>(null);
    const [sortBy, setSortBy] = useState("popular");
    const [totalItems, setTotalItems] = useState(0);
    const [visibleCount, setVisibleCount] = useState(6);

    const categories = [
        { id: "all", name: t('customer:menu.allCategories') },
        { id: "pho", name: "Phở" },
        { id: "bun", name: "Bún" },
        { id: "mi", name: "Mì" },
        { id: "snack", name: "Ăn vặt" },
        { id: "com", name: "Cơm" },
        { id: "drink", name: "Đồ uống" },
    ];

    useEffect(() => {
        // Update URL when category or search changes
        const params: any = {};
        if (activeCategory !== "all") params.category = activeCategory;
        if (debouncedSearch) params.search = debouncedSearch;
        setSearchParams(params);

        // Reset visible count when filters change
        setVisibleCount(6);

        fetchProducts();
    }, [activeCategory, debouncedSearch, priceRange, selectedRating, sortBy]);

    const fetchProducts = async () => {
        try {
            setLoading(true);
            const filters: any = {
                page: 1,
                limit: 100,
                sort: sortBy,
            };

            if (activeCategory !== "all") filters.category = activeCategory;
            if (debouncedSearch) filters.search = debouncedSearch;
            if (priceRange[1] < 100) filters.maxPrice = priceRange[1];
            if (selectedRating) filters.minRating = selectedRating;

            const response = await productAPI.getProducts(filters);
            setProducts(response.data);
            setTotalItems(response.pagination.total);
        } catch (error) {
            console.error("Error fetching products:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleCategoryChange = (id: string) => {
        setActiveCategory(id);
        // Reset search when changing category potentially? Or keep it?
        // keeping it simple for now
    };

    return (
        <div className="min-h-screen bg-gray-50/50 font-sans text-slate-800">

            {/* --- MAIN LAYOUT --- */}
            <div className="max-w-[1400px] mx-auto px-4 md:px-8 py-8">
                <div className="flex flex-col lg:flex-row gap-8">

                    {/* --- SIDEBAR (FILTERS) --- */}
                    <aside className="w-full lg:w-72 shrink-0 space-y-8">

                        {/* Search Input */}
                        <div className="bg-white rounded-[2rem] p-5 shadow-sm border border-gray-100">
                            <h3 className="font-black text-lg text-slate-900 mb-4 tracking-tight">Tìm kiếm</h3>
                            <div className="relative">
                                <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-orange-400 text-[20px]">
                                    search
                                </span>
                                <input
                                    type="text"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    placeholder="Tìm món ăn..."
                                    className="w-full h-12 pl-11 pr-10 bg-orange-50/60 rounded-xl border-2 border-orange-100 text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-orange-400 focus:bg-white transition-all text-sm font-medium"
                                />
                                {searchQuery && (
                                    <button
                                        onClick={() => setSearchQuery("")}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 transition-colors"
                                    >
                                        <span className="material-symbols-outlined text-[20px]">close</span>
                                    </button>
                                )}
                            </div>
                        </div>

                        {/* Categories — typography-only, no icons */}
                        <div className="bg-white rounded-[2rem] p-6 shadow-sm border border-gray-100 overflow-hidden">
                            <div className="mb-6">
                                <h3 className="font-black text-lg text-slate-900 tracking-tight">{t('customer:menu.allCategories')}</h3>
                                <div className="mt-2 h-1 w-12 rounded-full bg-gradient-to-r from-orange-500 to-amber-400" aria-hidden />
                            </div>
                            <div className="space-y-1">
                                {categories.map((cat) => (
                                    <button
                                        key={cat.id}
                                        onClick={() => handleCategoryChange(cat.id)}
                                        className={`relative w-full text-left px-4 py-3.5 rounded-xl text-sm font-semibold transition-all duration-300 group overflow-hidden
                                            ${activeCategory === cat.id
                                                ? "bg-gradient-to-r from-orange-50 to-amber-50/50 text-orange-700 shadow-[inset_0_0_0_2px_rgba(234,88,12,0.12)]"
                                                : "text-slate-600 hover:bg-slate-50 hover:text-slate-800"
                                            }`}
                                    >
                                        {activeCategory === cat.id && (
                                            <span className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 rounded-r-full bg-gradient-to-b from-orange-500 to-amber-500" aria-hidden />
                                        )}
                                        <span className={`relative block pl-3 tracking-wide ${activeCategory === cat.id ? "text-orange-700" : ""}`}>
                                            {cat.name}
                                        </span>
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Price Filter */}
                        <div className="bg-white rounded-[2rem] p-6 shadow-sm border border-gray-100">
                            <h3 className="font-black text-lg text-slate-900 mb-6">{t('customer:menu.priceRange')}</h3>
                            <div className="px-2">
                                <input
                                    type="range"
                                    min="0"
                                    max="100"
                                    value={priceRange[1]}
                                    onChange={(e) => setPriceRange([0, parseInt(e.target.value)])}
                                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-orange-600"
                                />
                                <div className="flex justify-between mt-4">
                                    <div className="px-4 py-2 bg-gray-50 rounded-xl border border-gray-200 text-sm font-bold text-slate-700">
                                        ${priceRange[0]}
                                    </div>
                                    <div className="px-4 py-2 bg-gray-50 rounded-xl border border-gray-200 text-sm font-bold text-slate-700">
                                        ${priceRange[1]}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Rating Filter */}
                        <div className="bg-white rounded-[2rem] p-6 shadow-sm border border-gray-100">
                            <h3 className="font-black text-lg text-slate-900 mb-4">{t('customer:menu.rating')}</h3>
                            <div className="space-y-2">
                                {[5, 4, 3].map((rating) => (
                                    <button
                                        key={rating}
                                        onClick={() => setSelectedRating(selectedRating === rating ? null : rating)}
                                        className={`w-full flex items-center gap-3 px-4 py-2 rounded-xl text-sm transition-colors ${selectedRating === rating ? 'bg-orange-50 ring-1 ring-orange-200' : 'hover:bg-gray-50'
                                            }`}
                                    >
                                        <div className="flex gap-1 text-orange-400">
                                            {[...Array(5)].map((_, i) => (
                                                <span key={i} className={`material-symbols-outlined text-[16px] ${i < rating ? 'text-orange-400' : 'text-gray-300'}`}>star</span>
                                            ))}
                                        </div>
                                        <span className="text-slate-600 font-medium">& Up</span>
                                    </button>
                                ))}
                            </div>
                        </div>
                    </aside>

                    {/* --- MAIN CONTENT (GRID) --- */}
                    <main className="flex-1">

                        {/* Toolbar */}
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 bg-white p-4 rounded-[1.5rem] shadow-sm border border-gray-100">
                            <div>
                                <h1 className="text-2xl font-black text-slate-900">
                                    {debouncedSearch
                                        ? <span>Kết quả cho: <span className="text-orange-600">"{debouncedSearch}"</span></span>
                                        : categories.find(c => c.id === activeCategory)?.name
                                    }
                                </h1>
                                <p className="text-slate-500 text-sm mt-1">{t('customer:menu.foundItems', { count: totalItems, defaultValue: 'Tìm thấy {{count}} món ăn' })}</p>
                            </div>

                            <div className="flex items-center gap-3">
                                <span className="text-sm font-medium text-slate-500">{t('customer:menu.sortBy')}:</span>
                                <select
                                    value={sortBy}
                                    onChange={(e) => setSortBy(e.target.value)}
                                    className="bg-gray-50 border-none text-sm font-bold text-slate-700 py-2.5 pl-4 pr-10 rounded-xl focus:ring-2 focus:ring-orange-500/20 outline-none cursor-pointer hover:bg-gray-100 transition-colors"
                                >
                                    <option value="popular">{t('customer:menu.sortPopular')}</option>
                                    <option value="rating">{t('customer:menu.sortPriceDesc', 'Đánh giá cao')}</option>
                                    <option value="price_low">{t('customer:menu.sortPriceAsc')}</option>
                                </select>
                            </div>
                        </div>

                        {/* Loading State */}
                        {loading && (
                            <div className="flex justify-center py-20">
                                <span className="material-symbols-outlined w-10 h-10 text-orange-600 animate-spin text-4xl">progress_activity</span>
                            </div>
                        )}

                        {/* Food Grid */}
                        {!loading && (
                            <>
                                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                                    {products.slice(0, visibleCount).map((item) => (
                                        <div
                                            key={item._id}
                                            onClick={() => navigate(`/food/${item._id}`)}
                                            className="group bg-white rounded-[2rem] border border-gray-100 p-3 hover:border-orange-100 hover:shadow-[0_8px_30px_rgb(0,0,0,0.06)] transition-all duration-300 cursor-pointer flex flex-col"
                                        >
                                            {/* Image Area */}
                                            <div className="relative aspect-[4/3] rounded-[1.5rem] overflow-hidden mb-4">
                                                <img
                                                    src={typeof item.image === 'string' ? item.image : item.image?.secure_url}
                                                    alt={item.name}
                                                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                                                />

                                                {/* Badges */}
                                                <div className="absolute top-3 left-3 flex flex-col gap-2 items-start">
                                                    {item.tags?.map((tag, idx) => (
                                                        <span key={idx} className="bg-orange-600 text-white text-[10px] font-bold uppercase px-2 py-1 rounded-lg shadow-md">
                                                            {tag}
                                                        </span>
                                                    ))}
                                                </div>

                                                {/* Favorite Button */}
                                                <button className="absolute top-3 right-3 w-9 h-9 bg-white/60 backdrop-blur-sm hover:bg-white rounded-full flex items-center justify-center text-slate-600 hover:text-red-500 transition-all shadow-sm">
                                                    <span className={`material-symbols-outlined text-[20px] ${item.isFavorite ? 'text-red-500 fill-current' : ''}`}>favorite</span>
                                                </button>

                                                {/* Rating Badge */}
                                                <div className="absolute bottom-3 left-3 bg-white/90 backdrop-blur px-2.5 py-1 rounded-xl flex items-center gap-1 shadow-sm">
                                                    <span className="material-symbols-outlined w-3.5 h-3.5 text-orange-500 text-[14px]">star</span>
                                                    <span className="text-xs font-bold text-slate-800">{item.rating}</span>
                                                    <span className="text-[10px] text-slate-400">({item.review_count})</span>
                                                </div>
                                            </div>

                                            {/* Content Area */}
                                            <div className="px-2 pb-2 flex flex-col flex-1">
                                                <div className="flex-1">
                                                    <h3 className="font-bold text-lg text-slate-900 leading-tight mb-2 group-hover:text-orange-600 transition-colors line-clamp-1">
                                                        {item.name}
                                                    </h3>
                                                    <div className="flex items-center gap-2 text-xs text-slate-500 mb-4">
                                                        <div className="flex items-center gap-1 bg-gray-50 px-2 py-1 rounded-md">
                                                            <span className="material-symbols-outlined w-3 h-3 text-[12px]">restaurant</span> {item.restaurant}
                                                        </div>
                                                        <div className="flex items-center gap-1 bg-gray-50 px-2 py-1 rounded-md">
                                                            <span className="material-symbols-outlined w-3 h-3 text-[12px]">schedule</span> {item.time}
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="flex items-center justify-between pt-4 border-t border-dashed border-gray-100 mt-2">
                                                    <div className="flex flex-col">
                                                        <span className="text-[10px] text-slate-400 uppercase font-bold">{t('customer:cart.price', 'Giá')}</span>
                                                        <span className="text-xl font-black text-slate-900">${item.price}</span>
                                                    </div>
                                                    <Button className="h-10 px-5 rounded-xl bg-slate-900 text-white hover:bg-orange-600 font-bold transition-colors shadow-lg shadow-slate-200 hover:shadow-orange-200">
                                                        {t('customer:menu.addToCart')} <span className="material-symbols-outlined w-4 h-4 ml-1 text-[16px]">add</span>
                                                    </Button>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                {visibleCount < products.length && (
                                    <div className="flex justify-center mt-12">
                                        <Button
                                            onClick={() => setVisibleCount((prev) => prev + 6)}
                                            className="h-12 px-8 rounded-2xl bg-white border border-gray-200 text-slate-700 hover:bg-orange-50 hover:text-orange-600 hover:border-orange-200 font-bold transition-all shadow-sm"
                                        >
                                            {t('common:actions.loadMore', { count: products.length - visibleCount, defaultValue: 'Xem thêm {{count}} món nữa' })}
                                        </Button>
                                    </div>
                                )}
                            </>
                        )}

                        {/* Empty State */}
                        {!loading && products.length === 0 && (
                            <div className="text-center py-20">
                                <div className="bg-gray-50 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <span className="material-symbols-outlined w-10 h-10 text-gray-300 text-4xl">search</span>
                                </div>
                                <h3 className="text-xl font-bold text-slate-900">{t('customer:menu.noResults')}</h3>
                                <p className="text-slate-500 mt-2">{t('customer:menu.noResultsHint', 'Thử thay đổi bộ lọc hoặc tìm từ khóa khác xem sao.')}</p>
                                <button
                                    onClick={() => { setActiveCategory("all"); setSearchQuery(""); setPriceRange([0, 100]); setSelectedRating(null); setVisibleCount(6); }}
                                    className="mt-6 text-orange-600 font-bold hover:underline"
                                >
                                    {t('customer:menu.clearFilters', 'Xóa bộ lọc')}
                                </button>
                            </div>
                        )}
                    </main>
                </div>
            </div>
        </div>
    );
=======
/** Lấy URL ảnh an toàn — tránh render <img src={undefined}> */
const getImageUrl = (image: Product["image"]): string | null => {
  if (!image) return null;
  if (typeof image === "object" && image.secure_url) return image.secure_url;
  if (typeof image === "string" && image.length > 0) return image;
  return null;
>>>>>>> 441f52d (FSS-82 edit product (admin))
};

// ─── Sub-components ───

const FoodCardSkeleton = () => (
  <div className="bg-white rounded-[2rem] border border-gray-100 p-3 animate-pulse">
    <div className="aspect-4/3 rounded-[1.5rem] bg-gray-200 mb-4" />
    <div className="px-2 pb-2 space-y-3">
      <div className="h-5 bg-gray-200 rounded w-3/4" />
      <div className="h-4 bg-gray-100 rounded w-1/2" />
      <div className="h-10 bg-gray-100 rounded-xl mt-4" />
    </div>
  </div>
);

interface FoodCardProps {
  item: Product;
  onNavigate: (id: string) => void;
}

const FoodCard: React.FC<FoodCardProps> = ({ item, onNavigate }) => {
  const imageUrl = getImageUrl(item.image);
  return (
    <div
      onClick={() => onNavigate(item._id)}
      className="group bg-white rounded-[2rem] border border-gray-100 p-3 hover:border-orange-100 hover:shadow-[0_8px_30px_rgb(0,0,0,0.06)] transition-all duration-300 cursor-pointer flex flex-col"
    >
      {/* Image Area */}
      <div className="relative aspect-4/3 rounded-[1.5rem] overflow-hidden mb-4 bg-orange-50">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={item.name}
            loading="lazy"
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="material-symbols-outlined text-orange-300 text-5xl">
              restaurant
            </span>
          </div>
        )}

        {/* Tags badges */}
        {item.tags && item.tags.length > 0 && (
          <div className="absolute top-3 left-3 flex flex-col gap-1.5 items-start">
            {item.tags.slice(0, 2).map((tag, idx) => (
              <span
                key={idx}
                className="bg-orange-600 text-white text-[10px] font-bold uppercase px-2 py-1 rounded-lg shadow-md"
              >
                {tag}
              </span>
            ))}
          </div>
        )}

        {/* Rating Badge */}
        <div className="absolute bottom-3 left-3 bg-white/90 backdrop-blur px-2.5 py-1 rounded-xl flex items-center gap-1 shadow-sm">
          <span className="material-symbols-outlined text-orange-500 text-[14px]">
            star
          </span>
          <span className="text-xs font-bold text-slate-800">
            {item.rating.toFixed(1)}
          </span>
          <span className="text-[10px] text-slate-400">
            ({item.review_count})
          </span>
        </div>

        {/* Health tags overlay */}
        {item.health_tags && item.health_tags.length > 0 && (
          <div className="absolute top-3 right-3">
            <div
              className="w-7 h-7 bg-green-100 rounded-full flex items-center justify-center"
              title={item.health_tags.join(", ")}
            >
              <span className="material-symbols-outlined text-green-600 text-[14px]">
                health_and_safety
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Content Area */}
      <div className="px-2 pb-2 flex flex-col flex-1">
        <div className="flex-1">
          <h3 className="font-bold text-lg text-slate-900 leading-tight mb-1 group-hover:text-orange-600 transition-colors line-clamp-1">
            {item.name}
          </h3>
          <p className="text-sm text-slate-400 line-clamp-2 mb-3">
            {item.description}
          </p>
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <div className="flex items-center gap-1 bg-gray-50 px-2 py-1 rounded-md">
              <span className="material-symbols-outlined text-[12px]">
                restaurant
              </span>
              {item.restaurant}
            </div>
            <div className="flex items-center gap-1 bg-gray-50 px-2 py-1 rounded-md">
              <span className="material-symbols-outlined text-[12px]">
                schedule
              </span>
              {item.time}
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between pt-4 border-t border-dashed border-gray-100 mt-3">
          <div className="flex flex-col">
            <span className="text-[10px] text-slate-400 uppercase font-bold">
              Giá
            </span>
            <span className="text-xl font-black text-slate-900">
              {item.price.toLocaleString("vi-VN")}đ
            </span>
          </div>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onNavigate(item._id);
            }}
            className="h-10 px-5 rounded-xl bg-slate-900 text-white hover:bg-orange-600 font-bold transition-colors shadow-lg shadow-slate-200 hover:shadow-orange-200 flex items-center gap-1.5 text-sm"
          >
            Chi tiết
            <span className="material-symbols-outlined text-[16px]">
              arrow_forward
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};

// ─── Main Component ───

const MenuPage = () => {
  const navigate = useNavigate();
  const { t } = useTranslation(["customer", "common"]);
  const [searchParams, setSearchParams] = useSearchParams();

  // ── State ──
  const categoryParam = searchParams.get("category") || "all";
  const searchParam = searchParams.get("search") || "";

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState(categoryParam);
  const [searchQuery, setSearchQuery] = useState(searchParam);
  const [sortBy, setSortBy] = useState("popular");
  const [totalItems, setTotalItems] = useState(0);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);

  const LIMIT = 9;

  // Debounce search để tránh gọi API mỗi keystroke
  const debouncedSearch = useDebounce(searchQuery, 400);

  // ── Fetch ──

  const fetchProducts = useCallback(
    async (currentPage: number, append: boolean = false) => {
      try {
        if (append) {
          setLoadingMore(true);
        } else {
          setLoading(true);
        }

        const filters: Record<string, any> = {
          page: currentPage,
          limit: LIMIT,
          sort: sortBy,
          isAvailable: true, // Customer chỉ thấy món đang bán
        };

        if (activeCategory !== "all") filters.category = activeCategory;
        if (debouncedSearch.trim()) filters.search = debouncedSearch.trim();

        const response = await productAPI.getProducts(filters);

        setProducts((prev) =>
          append ? [...prev, ...response.data] : response.data,
        );
        setTotalItems(response.pagination.total);
        setHasMore(currentPage < response.pagination.totalPages);
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setLoading(false);
        setLoadingMore(false);
      }
    },
    [activeCategory, debouncedSearch, sortBy],
  );

  // Reset về trang 1 khi filter/search/sort thay đổi
  useEffect(() => {
    setPage(1);
    fetchProducts(1, false);

    // Sync URL params
    const params: Record<string, string> = {};
    if (activeCategory !== "all") params.category = activeCategory;
    if (searchQuery) params.search = searchQuery;
    setSearchParams(params, { replace: true });
  }, [activeCategory, debouncedSearch, sortBy]);

  const handleLoadMore = () => {
    const nextPage = page + 1;
    setPage(nextPage);
    fetchProducts(nextPage, true);
  };

  const handleCategoryChange = (id: string) => {
    setActiveCategory(id);
  };

  const clearFilters = () => {
    setActiveCategory("all");
    setSearchQuery("");
    setSortBy("popular");
  };

  // ── Render ──

  return (
    <div className="min-h-screen bg-gray-50/50 font-sans text-slate-800">
      <div className="max-w-[1400px] mx-auto px-4 md:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* ── SIDEBAR (Filters) ── */}
          <aside className="w-full lg:w-72 shrink-0 space-y-6">
            {/* Search (mobile — show in sidebar on mobile) */}
            <div className="lg:hidden relative">
              <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-[20px]">
                search
              </span>
              <input
                type="text"
                placeholder="Tìm món ăn..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full h-12 pl-11 pr-4 rounded-2xl border border-gray-200 bg-white focus:outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-400/20 text-sm"
              />
            </div>

            {/* Categories */}
            <div className="bg-white rounded-[2rem] p-6 shadow-sm border border-gray-100 overflow-hidden">
              <div className="mb-5">
                <h3 className="font-black text-lg text-slate-900 tracking-tight">
                  {t("customer:menu.allCategories")}
                </h3>
                <div className="mt-2 h-1 w-12 rounded-full bg-linear-to-r from-orange-500 to-amber-400" />
              </div>
              <div className="space-y-1">
                {CUSTOMER_CATEGORY_FILTERS.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => handleCategoryChange(cat.id)}
                    className={`relative w-full text-left px-4 py-3.5 rounded-xl text-sm font-semibold transition-all duration-200 overflow-hidden
                      ${
                        activeCategory === cat.id
                          ? "bg-linear-to-r from-orange-50 to-amber-50/50 text-orange-700 shadow-[inset_0_0_0_2px_rgba(234,88,12,0.12)]"
                          : "text-slate-600 hover:bg-slate-50 hover:text-slate-800"
                      }`}
                  >
                    {activeCategory === cat.id && (
                      <span className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 rounded-r-full bg-linear-to-b from-orange-500 to-amber-500" />
                    )}
                    <span
                      className={`relative block pl-3 ${activeCategory === cat.id ? "text-orange-700" : ""}`}
                    >
                      {cat.label}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Rating Filter */}
            <div className="bg-white rounded-[2rem] p-6 shadow-sm border border-gray-100">
              <h3 className="font-black text-lg text-slate-900 mb-4">
                {t("customer:menu.rating")}
              </h3>
              <div className="space-y-2">
                {[5, 4, 3].map((rating) => (
                  <button
                    key={rating}
                    onClick={() =>
                      setSortBy(
                        sortBy === `rating_${rating}`
                          ? "popular"
                          : `rating_${rating}`,
                      )
                    }
                    className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm transition-colors font-medium
                      ${sortBy === `rating_${rating}` ? "bg-orange-50 ring-1 ring-orange-200 text-orange-700" : "hover:bg-gray-50 text-slate-600"}`}
                  >
                    <div className="flex gap-0.5">
                      {[...Array(5)].map((_, i) => (
                        <span
                          key={i}
                          className={`material-symbols-outlined text-[15px] ${i < rating ? "text-orange-400" : "text-gray-200"}`}
                        >
                          star
                        </span>
                      ))}
                    </div>
                    <span>& Up</span>
                  </button>
                ))}
              </div>
            </div>
          </aside>

          {/* ── MAIN CONTENT ── */}
          <main className="flex-1 min-w-0">
            {/* Toolbar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 bg-white p-4 rounded-[1.5rem] shadow-sm border border-gray-100">
              <div className="flex items-center gap-4 flex-1">
                {/* Search (desktop) */}
                <div className="hidden lg:block relative flex-1 max-w-sm">
                  <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-[20px]">
                    search
                  </span>
                  <input
                    type="text"
                    placeholder="Tìm món ăn..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full h-11 pl-11 pr-4 rounded-xl border border-gray-200 bg-gray-50 focus:outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-400/20 text-sm"
                  />
                </div>
                <div>
                  <h1 className="text-xl font-black text-slate-900">
                    {
                      CUSTOMER_CATEGORY_FILTERS.find(
                        (c) => c.id === activeCategory,
                      )?.label
                    }
                  </h1>
                  {!loading && (
                    <p className="text-slate-500 text-sm mt-0.5">
                      {totalItems > 0
                        ? `${totalItems} món ăn`
                        : "Không tìm thấy món nào"}
                    </p>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-3 shrink-0">
                <span className="text-sm font-medium text-slate-500 hidden sm:block">
                  Sắp xếp:
                </span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="bg-gray-50 border border-gray-200 text-sm font-bold text-slate-700 py-2.5 pl-4 pr-10 rounded-xl focus:ring-2 focus:ring-orange-500/20 outline-none cursor-pointer hover:bg-gray-100 transition-colors"
                >
                  <option value="popular">Phổ biến nhất</option>
                  <option value="rating">Đánh giá cao</option>
                  <option value="price_low">Giá tăng dần</option>
                  <option value="price_high">Giá giảm dần</option>
                </select>
              </div>
            </div>

            {/* Active filters chips */}
            {(activeCategory !== "all" ||
              searchQuery ||
              sortBy !== "popular") && (
              <div className="flex flex-wrap items-center gap-2 mb-4">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                  Đang lọc:
                </span>
                {activeCategory !== "all" && (
                  <span className="inline-flex items-center gap-1 bg-orange-100 text-orange-700 text-xs font-bold px-3 py-1.5 rounded-full">
                    {
                      CUSTOMER_CATEGORY_FILTERS.find(
                        (c) => c.id === activeCategory,
                      )?.label
                    }
                    <button
                      onClick={() => setActiveCategory("all")}
                      className="ml-1 hover:text-orange-900"
                    >
                      <span className="material-symbols-outlined text-[14px]">
                        close
                      </span>
                    </button>
                  </span>
                )}
                {searchQuery && (
                  <span className="inline-flex items-center gap-1 bg-blue-100 text-blue-700 text-xs font-bold px-3 py-1.5 rounded-full">
                    "{searchQuery}"
                    <button
                      onClick={() => setSearchQuery("")}
                      className="ml-1 hover:text-blue-900"
                    >
                      <span className="material-symbols-outlined text-[14px]">
                        close
                      </span>
                    </button>
                  </span>
                )}
                <button
                  onClick={clearFilters}
                  className="text-xs font-bold text-slate-400 hover:text-slate-600 underline"
                >
                  Xóa tất cả
                </button>
              </div>
            )}

            {/* Loading Skeleton */}
            {loading && (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {Array.from({ length: 6 }).map((_, i) => (
                  <FoodCardSkeleton key={i} />
                ))}
              </div>
            )}

            {/* Food Grid */}
            {!loading && products.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {products.map((item) => (
                  <FoodCard
                    key={item._id}
                    item={item}
                    onNavigate={(id) => navigate(`/food/${id}`)}
                  />
                ))}
              </div>
            )}

            {/* Load More */}
            {!loading && hasMore && (
              <div className="flex justify-center mt-10">
                <button
                  onClick={handleLoadMore}
                  disabled={loadingMore}
                  className="h-12 px-8 rounded-2xl bg-white border border-gray-200 text-slate-700 hover:bg-orange-50 hover:text-orange-600 hover:border-orange-200 font-bold transition-all shadow-sm disabled:opacity-50 flex items-center gap-2"
                >
                  {loadingMore ? (
                    <>
                      <span className="material-symbols-outlined animate-spin text-[18px]">
                        progress_activity
                      </span>
                      Đang tải...
                    </>
                  ) : (
                    <>
                      Xem thêm món
                      <span className="material-symbols-outlined text-[18px]">
                        expand_more
                      </span>
                    </>
                  )}
                </button>
              </div>
            )}

            {/* Empty State */}
            {!loading && products.length === 0 && (
              <div className="text-center py-20">
                <div className="bg-gray-50 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="material-symbols-outlined text-gray-300 text-4xl">
                    search_off
                  </span>
                </div>
                <h3 className="text-xl font-bold text-slate-900">
                  {t("customer:menu.noResults")}
                </h3>
                <p className="text-slate-500 mt-2 max-w-xs mx-auto">
                  Thử thay đổi danh mục hoặc từ khóa tìm kiếm khác nhé.
                </p>
                <button
                  onClick={clearFilters}
                  className="mt-6 text-orange-600 font-bold hover:underline"
                >
                  {t("customer:menu.clearFilters", "Xóa bộ lọc")}
                </button>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
};

export default MenuPage;
