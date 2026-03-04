import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useTranslation } from "react-i18next";
import productAPI from "@/services/product.service";
import useDebounce from "@/hooks/useDebounce";
import type { Product } from "@/types/product";

const MenuPage = () => {
    const navigate = useNavigate();
    const { t } = useTranslation(['customer', 'common']);
    const [searchParams, setSearchParams] = useSearchParams();

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
};

export default MenuPage;