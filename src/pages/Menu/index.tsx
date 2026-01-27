import { useState, useEffect } from "react";
import {
    Search,
    ShoppingCart,
    Star,
    Heart,
    Plus,
    Utensils,
    MapPin,
    Clock,
    SlidersHorizontal,
    Check,
    Loader2
} from "lucide-react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import HomeHeader from "@/pages/Home/components/HomeHeader";
import productAPI from "@/services/product.service";
import type { Product } from "@/types/product";


const MenuPage = () => {
    const navigate = useNavigate();
    const [searchParams, setSearchParams] = useSearchParams();

    // params state
    const categoryParam = searchParams.get("category") || "all";
    const searchParam = searchParams.get("search") || "";

    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [activeCategory, setActiveCategory] = useState(categoryParam);
    const [searchQuery, setSearchQuery] = useState(searchParam);
    const [priceRange, setPriceRange] = useState([0, 100]);
    const [selectedRating, setSelectedRating] = useState<number | null>(null);
    const [sortBy, setSortBy] = useState("popular");
    const [totalItems, setTotalItems] = useState(0);

    const categories = [
        { id: "all", name: "Tất cả", icon: "🍽️" },
        { id: "burger", name: "Burgers", icon: "🍔" },
        { id: "pizza", name: "Pizza", icon: "🍕" },
        { id: "sushi", name: "Sushi", icon: "🍱" },
        { id: "healthy", name: "Healthy", icon: "🥗" },
        { id: "dessert", name: "Tráng miệng", icon: "🍰" },
        { id: "drink", name: "Đồ uống", icon: "🥤" },
    ];

    useEffect(() => {
        // Update URL when category or search changes
        const params: any = {};
        if (activeCategory !== "all") params.category = activeCategory;
        if (searchQuery) params.search = searchQuery;
        setSearchParams(params);

        fetchProducts();
    }, [activeCategory, searchQuery, priceRange, selectedRating, sortBy]);

    const fetchProducts = async () => {
        try {
            setLoading(true);
            const filters: any = {
                page: 1,
                limit: 100, // Load many for now, implement load more later
                sort: sortBy,
            };

            if (activeCategory !== "all") filters.category = activeCategory;
            if (searchQuery) filters.search = searchQuery;
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
            {/* --- HEADER --- */}
            <HomeHeader
                searchQuery={searchQuery}
                onSearchChange={setSearchQuery}
                cartCount={3}
            />
            {/* --- MAIN LAYOUT --- */}
            <div className="max-w-[1400px] mx-auto px-4 md:px-8 py-8">
                <div className="flex flex-col lg:flex-row gap-8">

                    {/* --- SIDEBAR (FILTERS) --- */}
                    <aside className="w-full lg:w-72 shrink-0 space-y-8">

                        {/* Categories */}
                        <div className="bg-white rounded-[2rem] p-6 shadow-sm border border-gray-100">
                            <div className="flex items-center gap-2 mb-6">
                                <SlidersHorizontal className="w-5 h-5 text-orange-600" />
                                <h3 className="font-black text-lg text-slate-900">Danh mục</h3>
                            </div>
                            <div className="space-y-1">
                                {categories.map((cat) => (
                                    <button
                                        key={cat.id}
                                        onClick={() => handleCategoryChange(cat.id)}
                                        className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 group ${activeCategory === cat.id
                                            ? 'bg-orange-50 text-orange-700 shadow-sm'
                                            : 'text-slate-600 hover:bg-gray-50'
                                            }`}
                                    >
                                        <div className="flex items-center gap-3">
                                            <span className="text-xl group-hover:scale-110 transition-transform">{cat.icon}</span>
                                            <span>{cat.name}</span>
                                        </div>
                                        {activeCategory === cat.id && <Check className="w-4 h-4 text-orange-600" />}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Price Filter */}
                        <div className="bg-white rounded-[2rem] p-6 shadow-sm border border-gray-100">
                            <h3 className="font-black text-lg text-slate-900 mb-6">Khoảng giá</h3>
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
                            <h3 className="font-black text-lg text-slate-900 mb-4">Đánh giá</h3>
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
                                                <Star key={i} className={`w-4 h-4 ${i < rating ? 'fill-current' : 'text-gray-300'}`} />
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
                                    {categories.find(c => c.id === activeCategory)?.name}
                                </h1>
                                <p className="text-slate-500 text-sm mt-1">Tìm thấy <span className="font-bold text-orange-600">{totalItems}</span> món ăn</p>
                            </div>

                            <div className="flex items-center gap-3">
                                <span className="text-sm font-medium text-slate-500">Sắp xếp:</span>
                                <select
                                    value={sortBy}
                                    onChange={(e) => setSortBy(e.target.value)}
                                    className="bg-gray-50 border-none text-sm font-bold text-slate-700 py-2.5 pl-4 pr-10 rounded-xl focus:ring-2 focus:ring-orange-500/20 outline-none cursor-pointer hover:bg-gray-100 transition-colors"
                                >
                                    <option value="popular">Phổ biến nhất</option>
                                    <option value="rating">Đánh giá cao</option>
                                    <option value="price_low">Giá thấp đến cao</option>
                                </select>
                            </div>
                        </div>

                        {/* Loading State */}
                        {loading && (
                            <div className="flex justify-center py-20">
                                <Loader2 className="w-10 h-10 text-orange-600 animate-spin" />
                            </div>
                        )}

                        {/* Food Grid */}
                        {!loading && (
                            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                                {products.map((item) => (
                                    <div
                                        key={item._id}
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
                                                <Heart className={`w-5 h-5 ${item.isFavorite ? 'fill-red-500 text-red-500' : ''}`} />
                                            </button>

                                            {/* Rating Badge */}
                                            <div className="absolute bottom-3 left-3 bg-white/90 backdrop-blur px-2.5 py-1 rounded-xl flex items-center gap-1 shadow-sm">
                                                <Star className="w-3.5 h-3.5 text-orange-500 fill-orange-500" />
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
                                                        <Utensils className="w-3 h-3" /> {item.restaurant}
                                                    </div>
                                                    <div className="flex items-center gap-1 bg-gray-50 px-2 py-1 rounded-md">
                                                        <Clock className="w-3 h-3" /> {item.time}
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="flex items-center justify-between pt-4 border-t border-dashed border-gray-100 mt-2">
                                                <div className="flex flex-col">
                                                    <span className="text-[10px] text-slate-400 uppercase font-bold">Giá</span>
                                                    <span className="text-xl font-black text-slate-900">${item.price}</span>
                                                </div>
                                                <Button className="h-10 px-5 rounded-xl bg-slate-900 text-white hover:bg-orange-600 font-bold transition-colors shadow-lg shadow-slate-200 hover:shadow-orange-200">
                                                    Thêm <Plus className="w-4 h-4 ml-1" />
                                                </Button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* Empty State */}
                        {!loading && products.length === 0 && (
                            <div className="text-center py-20">
                                <div className="bg-gray-50 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <Search className="w-10 h-10 text-gray-300" />
                                </div>
                                <h3 className="text-xl font-bold text-slate-900">Không tìm thấy món nào</h3>
                                <p className="text-slate-500 mt-2">Thử thay đổi bộ lọc hoặc tìm từ khóa khác xem sao.</p>
                                <button
                                    onClick={() => { setActiveCategory("all"); setSearchQuery(""); setPriceRange([0, 100]); setSelectedRating(null); }}
                                    className="mt-6 text-orange-600 font-bold hover:underline"
                                >
                                    Xóa bộ lọc
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