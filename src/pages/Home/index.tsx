import React from "react";
import {
    MapPin,
    Search,
    ChevronRight,
    ArrowRight,
    History,
    Store,
    ChevronLeft,
    Star,
    Clock,
    Bike,
    Heart,
    ShoppingCart,
    Plus,
    Zap,
    Utensils,
    Flame,
    Sparkles,
    TrendingUp,
    Ticket,
    Gift,
    BookOpen,
    Quote,
    CheckCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";

const HomePage = () => {
    const [isUserMenuOpen, setIsUserMenuOpen] = React.useState(false);
    const dropdownRef = React.useRef<HTMLDivElement>(null);

    // Close dropdown when clicking outside
    React.useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsUserMenuOpen(false);
            }
        };

        if (isUserMenuOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isUserMenuOpen]);

    return (
        <div className="min-h-screen bg-gray-50/50 text-slate-800 font-sans selection:bg-orange-100 selection:text-orange-600">
            {/* --- HEADER --- */}
            <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-gray-100 px-4 md:px-8 py-4 transition-all duration-300">
                <div className="max-w-7xl mx-auto flex items-center justify-between gap-6">
                    {/* Logo */}
                    <div className="flex items-center gap-6 md:gap-10">
                        <div className="flex items-center gap-2.5 text-orange-600 cursor-pointer group">
                            <div className="bg-orange-600 text-white p-2 rounded-xl group-hover:rotate-12 transition-transform duration-300">
                                <Utensils className="w-5 h-5" />
                            </div>
                            <h2 className="text-2xl font-black tracking-tighter">FoodieDash</h2>
                        </div>

                        <div className="hidden lg:flex items-center gap-3 bg-gray-100/80 px-4 py-2 rounded-full cursor-pointer hover:bg-orange-50 hover:text-orange-600 transition-all duration-300">
                            <div className="bg-white p-1 rounded-full shadow-sm"><MapPin className="w-3.5 h-3.5 text-orange-600" /></div>
                            <span className="text-sm font-semibold truncate max-w-[150px]">Đà Nẵng, Việt Nam</span>
                            <ChevronRight className="w-4 h-4 text-gray-400" />
                        </div>
                    </div>

                    {/* Search */}
                    <div className="flex-1 max-w-xl hidden md:block">
                        <div className="relative group">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-orange-500 transition-colors" />
                            <input type="text" placeholder="Bạn thèm món gì hôm nay?" className="w-full bg-gray-100/50 border border-transparent group-hover:bg-white group-hover:border-gray-200 focus:bg-white focus:border-orange-500/50 focus:ring-4 focus:ring-orange-500/10 rounded-full py-3 pl-12 pr-6 text-sm font-medium outline-none transition-all duration-300" />
                        </div>
                    </div>

                    {/* Menu & Actions */}
                    <div className="flex items-center gap-1 md:gap-4">
                        <nav className="hidden lg:flex items-center gap-6 mr-4 font-bold text-sm text-slate-600">
                            <a href="#" className="hover:text-orange-600 transition-colors">Thực đơn</a>
                            <a href="#" className="hover:text-orange-600 transition-colors">Đặt bàn</a>
                            <a href="#" className="hover:text-orange-600 transition-colors">Về chúng tôi</a>
                            <a href="#" className="flex items-center gap-1 hover:text-orange-600 transition-colors">
                                Theo dõi đơn <span className="bg-red-100 text-red-600 text-[10px] px-1.5 py-0.5 rounded-full">1</span>
                            </a>
                        </nav>

                        <div className="h-6 w-px bg-gray-200 hidden lg:block mx-2"></div>

                        {/* Cart Button */}
                        <button className="relative p-2.5 rounded-full bg-white border border-gray-200 text-gray-700 hover:border-orange-200 hover:text-orange-600 hover:shadow-lg hover:shadow-orange-500/20 transition-all duration-300 group">
                            <ShoppingCart className="w-5 h-5 group-hover:scale-110 transition-transform" />
                            <span className="absolute -top-0.5 -right-0.5 bg-orange-600 text-white text-[10px] font-bold h-5 w-5 flex items-center justify-center rounded-full border-2 border-white">2</span>
                        </button>

                        {/* User Avatar with Dropdown */}
                        <div className="relative" ref={dropdownRef}>
                            <button
                                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                                className="w-10 h-10 rounded-full p-0.5 bg-gradient-to-tr from-orange-500 to-yellow-400 cursor-pointer hover:scale-105 transition-transform"
                            >
                                <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix" alt="User" className="w-full h-full object-cover rounded-full border-2 border-white" />
                            </button>

                            {/* Dropdown Menu */}
                            {isUserMenuOpen && (
                                <div className="absolute right-0 top-full mt-2 w-64 bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                                    {/* User Info */}
                                    <div className="p-4 bg-gradient-to-br from-orange-50 to-yellow-50 border-b border-gray-100">
                                        <div className="flex items-center gap-3">
                                            <div className="w-12 h-12 rounded-full p-0.5 bg-gradient-to-tr from-orange-500 to-yellow-400">
                                                <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix" alt="User" className="w-full h-full object-cover rounded-full border-2 border-white" />
                                            </div>
                                            <div className="flex-1">
                                                <h4 className="font-bold text-slate-900">Nguyễn Văn A</h4>
                                                <p className="text-xs text-slate-500">nguyenvana@email.com</p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Menu Items */}
                                    <div className="p-2">
                                        <a href="#" className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-orange-50 transition-colors group">
                                            <div className="w-9 h-9 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center group-hover:bg-orange-600 group-hover:text-white transition-colors">
                                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                                </svg>
                                            </div>
                                            <div className="flex-1">
                                                <p className="font-semibold text-sm text-slate-800">Tài khoản</p>
                                                <p className="text-xs text-slate-500">Quản lý thông tin cá nhân</p>
                                            </div>
                                        </a>

                                        <a href="#" className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-orange-50 transition-colors group">
                                            <div className="w-9 h-9 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-colors">
                                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                                                </svg>
                                            </div>
                                            <div className="flex-1">
                                                <p className="font-semibold text-sm text-slate-800">Đơn hàng</p>
                                                <p className="text-xs text-slate-500">Xem lịch sử đặt hàng</p>
                                            </div>
                                        </a>

                                        <a href="#" className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-orange-50 transition-colors group">
                                            <div className="w-9 h-9 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center group-hover:bg-purple-600 group-hover:text-white transition-colors">
                                                <Heart className="w-5 h-5" />
                                            </div>
                                            <div className="flex-1">
                                                <p className="font-semibold text-sm text-slate-800">Yêu thích</p>
                                                <p className="text-xs text-slate-500">Món ăn đã lưu</p>
                                            </div>
                                        </a>

                                        <a href="#" className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-orange-50 transition-colors group">
                                            <div className="w-9 h-9 rounded-full bg-green-100 text-green-600 flex items-center justify-center group-hover:bg-green-600 group-hover:text-white transition-colors">
                                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                </svg>
                                            </div>
                                            <div className="flex-1">
                                                <p className="font-semibold text-sm text-slate-800">Cài đặt</p>
                                                <p className="text-xs text-slate-500">Tùy chỉnh ứng dụng</p>
                                            </div>
                                        </a>
                                    </div>

                                    {/* Logout */}
                                    <div className="p-2 border-t border-gray-100">
                                        <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-red-50 transition-colors group">
                                            <div className="w-9 h-9 rounded-full bg-red-100 text-red-600 flex items-center justify-center group-hover:bg-red-600 group-hover:text-white transition-colors">
                                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                                                </svg>
                                            </div>
                                            <p className="font-semibold text-sm text-slate-800">Đăng xuất</p>
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </header>

            {/* --- MAIN CONTENT --- */}
            <main className="flex-1 flex flex-col items-center pb-20">
                <div className="w-full max-w-7xl px-4 md:px-8 py-8 flex flex-col gap-12">

                    {/* 1. HERO BANNER */}
                    <section className="relative group">
                        <div className="relative overflow-hidden rounded-[2.5rem] aspect-[4/3] md:aspect-[21/8] flex items-center shadow-2xl shadow-orange-900/10">
                            <img
                                src="https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=1600&h=800&fit=crop"
                                alt="Hero Food"
                                className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
                            />
                            <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/40 to-transparent" />

                            <div className="relative z-10 w-full max-w-2xl px-8 md:px-16 py-12 flex flex-col gap-6 items-start">
                                <div className="inline-flex items-center gap-2 bg-orange-500/20 backdrop-blur-md border border-orange-500/30 text-orange-100 text-xs font-bold uppercase tracking-widest px-4 py-1.5 rounded-full">
                                    <Flame className="w-3 h-3 text-orange-400 fill-orange-400" />
                                    Weekend Special
                                </div>

                                <h1 className="text-white text-4xl md:text-6xl font-black leading-[1.1] tracking-tight drop-shadow-sm">
                                    Đại tiệc <br />
                                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-yellow-400">
                                        Giảm giá 50%
                                    </span>
                                </h1>

                                <p className="text-gray-200 text-lg font-medium max-w-md leading-relaxed">
                                    Trải nghiệm ẩm thực tuyệt vời ngay tại nhà. Giao hàng miễn phí cho đơn từ 100k.
                                </p>

                                <div className="flex gap-4 mt-2">
                                    <Button className="bg-orange-600 hover:bg-orange-700 text-white font-bold h-12 px-8 rounded-2xl shadow-lg shadow-orange-600/30 hover:shadow-orange-600/50 transition-all hover:-translate-y-1">
                                        Đặt Ngay <ArrowRight className="ml-2 w-5 h-5" />
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* 2. CATEGORIES (FSS-59) */}
                    <section>
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-2xl font-black text-slate-800">Danh mục món ăn</h2>
                            <div className="flex gap-2">
                                <button className="w-9 h-9 rounded-full bg-white border flex items-center justify-center hover:border-orange-500 hover:text-orange-600 transition-colors shadow-sm"><ChevronLeft className="w-5 h-5" /></button>
                                <button className="w-9 h-9 rounded-full bg-white border flex items-center justify-center hover:border-orange-500 hover:text-orange-600 transition-colors shadow-sm"><ChevronRight className="w-5 h-5" /></button>
                            </div>
                        </div>

                        <div className="flex gap-4 overflow-x-auto pb-4 -mx-4 px-4 scrollbar-hide snap-x">
                            {[
                                { name: "Cơm", icon: "🍚", color: "bg-orange-100 text-orange-600" },
                                { name: "Phở", icon: "🍜", color: "bg-red-100 text-red-600" },
                                { name: "Đồ uống", icon: "🥤", color: "bg-blue-100 text-blue-600" },
                                { name: "Ăn vặt", icon: "🍟", color: "bg-yellow-100 text-yellow-600" },
                                { name: "Healthy", icon: "🥗", color: "bg-green-100 text-green-600" },
                                { name: "Bánh", icon: "🍰", color: "bg-pink-100 text-pink-600" },
                            ].map((cat, idx) => (
                                <div key={idx} className="snap-start shrink-0 group cursor-pointer">
                                    <div className="w-32 h-36 bg-white rounded-[1.5rem] border border-gray-100 shadow-sm hover:shadow-lg hover:shadow-orange-500/10 flex flex-col items-center justify-center gap-3 transition-all duration-300 hover:-translate-y-1">
                                        <div className={`w-14 h-14 rounded-full flex items-center justify-center text-2xl shadow-inner ${cat.color} group-hover:scale-110 transition-transform duration-300`}>
                                            {cat.icon}
                                        </div>
                                        <span className="font-bold text-sm text-slate-700 group-hover:text-orange-600 transition-colors">{cat.name}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>

                    {/* 3. RECOMMENDED FOR YOU - AI PICKS (FSS-61 - NEW SECTION) */}
                    <section className="bg-gradient-to-br from-indigo-50 via-purple-50 to-white rounded-[2rem] p-6 md:p-8 border border-indigo-100">
                        <div className="flex items-center justify-between mb-8">
                            <div className="flex flex-col gap-1">
                                <div className="flex items-center gap-2">
                                    <Sparkles className="w-6 h-6 text-indigo-600 fill-indigo-600 animate-pulse" />
                                    <h2 className="text-2xl font-black text-slate-900">Gợi ý riêng cho bạn</h2>
                                </div>
                                <p className="text-sm text-slate-500 font-medium ml-8">Dựa trên sở thích và lịch sử đặt hàng của bạn</p>
                            </div>
                            <Button variant="ghost" className="text-indigo-600 font-bold hover:bg-indigo-100 hover:text-indigo-700">
                                Xem tất cả
                            </Button>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            {[
                                {
                                    name: "Salad Cá Hồi",
                                    desc: "Ít calo • Phù hợp ăn kiêng",
                                    price: 125000,
                                    rating: 4.9,
                                    time: "15-20 min",
                                    image: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=500&h=500&fit=crop",
                                    tag: "Healthy Choice"
                                },
                                {
                                    name: "Bò Beefsteak",
                                    desc: "Món bạn hay đặt vào T6",
                                    price: 250000,
                                    rating: 5.0,
                                    time: "30-40 min",
                                    image: "https://images.unsplash.com/photo-1600891964092-4316c288032e?w=500&h=500&fit=crop",
                                    tag: "Top Pick"
                                },
                                {
                                    name: "Trà Đào Cam Sả",
                                    desc: "Gợi ý đi kèm bữa trưa",
                                    price: 45000,
                                    rating: 4.7,
                                    time: "10-15 min",
                                    image: "https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=500&h=500&fit=crop",
                                    tag: "Best Match"
                                }
                            ].map((item, idx) => (
                                <div key={idx} className="flex bg-white rounded-2xl p-4 gap-4 shadow-sm border border-indigo-50 hover:shadow-xl hover:shadow-indigo-500/10 transition-all cursor-pointer group">
                                    <div className="relative w-28 h-28 rounded-xl overflow-hidden shrink-0">
                                        <img src={item.image} alt={item.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                                        {idx === 0 && <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors" />}
                                    </div>
                                    <div className="flex flex-col flex-1 justify-between">
                                        <div>
                                            <div className="flex justify-between items-start">
                                                <div className="bg-indigo-100 text-indigo-700 text-[10px] font-bold px-2 py-0.5 rounded-full mb-2 inline-block">
                                                    <div className="flex items-center gap-1"><Sparkles className="w-3 h-3" /> {item.tag}</div>
                                                </div>
                                                <div className="flex items-center gap-1 text-xs font-bold text-slate-700">
                                                    <Star className="w-3 h-3 text-orange-500 fill-orange-500" /> {item.rating}
                                                </div>
                                            </div>
                                            <h3 className="font-bold text-lg text-slate-800 leading-tight mb-1">{item.name}</h3>
                                            <p className="text-xs text-slate-500">{item.desc}</p>
                                        </div>
                                        <div className="flex items-end justify-between mt-2">
                                            <span className="font-black text-lg text-indigo-600">{item.price.toLocaleString()}đ</span>
                                            <button className="w-8 h-8 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center hover:bg-indigo-600 hover:text-white transition-all">
                                                <Plus className="w-5 h-5" />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>

                    {/* 4. BEST SELLERS / POPULAR (FSS-60) */}
                    <section>
                        <div className="flex items-center justify-between mb-8">
                            <div className="flex items-center gap-3">
                                <h2 className="text-3xl font-black text-slate-900">Món đang Hot</h2>
                                <span className="bg-red-100 text-red-600 text-xs font-bold px-2 py-1 rounded-md uppercase flex items-center gap-1">
                                    <TrendingUp className="w-3 h-3" /> Trending
                                </span>
                            </div>
                            <a href="#" className="text-orange-600 font-bold text-sm hover:underline flex items-center gap-1">
                                Xem tất cả <ArrowRight className="w-4 h-4" />
                            </a>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                            {[
                                {
                                    name: "Burger Phô Mai 2 Tầng",
                                    restaurant: "Burger King",
                                    time: "15-25 min",
                                    price: 89000,
                                    originalPrice: 129000,
                                    image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=500&h=500&fit=crop",
                                    flashSale: true,
                                    timer: "02:45:12",
                                    rating: 4.8
                                },
                                {
                                    name: "Cơm Gà Xối Mỡ",
                                    restaurant: "Cơm Tấm Cali",
                                    time: "20-35 min",
                                    price: 55000,
                                    rating: 4.9,
                                    image: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=500&h=500&fit=crop",
                                    favorite: true
                                },
                                {
                                    name: "Pizza Hải Sản",
                                    restaurant: "Pizza Hut",
                                    time: "10-20 min",
                                    price: 159000,
                                    originalPrice: 199000,
                                    image: "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=500&h=500&fit=crop",
                                    flashSale: true,
                                    timer: "00:15:44",
                                    rating: 4.5
                                },
                                {
                                    name: "Bún Bò Huế",
                                    restaurant: "Bún Bò Gốc Huế",
                                    time: "25-40 min",
                                    price: 45000,
                                    rating: 4.6,
                                    image: "https://images.unsplash.com/photo-1582878826629-29b7ad1cdc43?w=500&h=500&fit=crop"
                                },
                            ].map((dish, idx) => (
                                <div key={idx} className="group bg-white rounded-[2rem] border border-gray-100 p-3 hover:border-orange-100 shadow-sm hover:shadow-2xl hover:shadow-orange-900/5 transition-all duration-300">
                                    {/* Image Container */}
                                    <div className="relative aspect-[4/3] rounded-[1.5rem] overflow-hidden mb-4">
                                        <img
                                            src={dish.image}
                                            alt={dish.name}
                                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                                        />

                                        {/* Overlays */}
                                        <div className="absolute top-3 left-3 flex gap-2">
                                            {dish.flashSale && (
                                                <div className="bg-red-600 text-white px-2 py-1 rounded-lg text-[10px] font-black uppercase flex items-center gap-1 shadow-sm">
                                                    <Zap className="w-3 h-3 fill-current" /> Promo
                                                </div>
                                            )}
                                            <div className="bg-white/90 backdrop-blur px-2 py-1 rounded-lg flex items-center gap-1 shadow-sm">
                                                <Star className="w-3 h-3 text-orange-500 fill-orange-500" />
                                                <span className="text-[10px] font-bold text-slate-800">{dish.rating}</span>
                                            </div>
                                        </div>

                                        <button className="absolute top-3 right-3 w-8 h-8 bg-white/50 backdrop-blur hover:bg-white rounded-full flex items-center justify-center text-slate-600 hover:text-red-500 transition-all shadow-sm">
                                            <Heart className={`w-4 h-4 ${dish.favorite ? 'fill-red-500 text-red-500' : ''}`} />
                                        </button>

                                        {/* Timer Overlay for Flash Sales */}
                                        {dish.flashSale && (
                                            <div className="absolute bottom-3 left-3 right-3 bg-slate-900/80 backdrop-blur-md p-2 rounded-xl flex items-center justify-between border border-white/10">
                                                <span className="text-white/70 text-[10px] font-bold uppercase">Kết thúc</span>
                                                <div className="text-white font-mono font-bold text-xs">{dish.timer}</div>
                                            </div>
                                        )}
                                    </div>

                                    {/* Content */}
                                    <div className="px-2 pb-2">
                                        <div className="flex justify-between items-start mb-2">
                                            <div className="flex-1">
                                                <h3 className="font-bold text-lg text-slate-800 leading-tight group-hover:text-orange-600 transition-colors line-clamp-1">{dish.name}</h3>
                                                <p className="text-xs font-medium text-gray-400 mt-1 flex items-center gap-1">
                                                    <Store className="w-3 h-3" /> {dish.restaurant}
                                                </p>
                                            </div>
                                            <div className="flex flex-col items-end pl-2">
                                                <span className="text-lg font-black text-slate-900">{dish.price.toLocaleString()}đ</span>
                                                {dish.originalPrice && (
                                                    <span className="text-xs text-gray-400 line-through font-medium">{dish.originalPrice.toLocaleString()}đ</span>
                                                )}
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-3 py-3 border-t border-dashed border-gray-100 my-2">
                                            <div className="flex items-center gap-1.5 text-xs font-bold text-slate-500 bg-slate-50 px-2 py-1 rounded-md">
                                                <Clock className="w-3.5 h-3.5 text-orange-500" /> {dish.time}
                                            </div>
                                        </div>

                                        <Button className={`w-full h-11 rounded-xl font-bold flex items-center justify-center gap-2 transition-all duration-300 ${dish.flashSale
                                            ? 'bg-gradient-to-r from-orange-600 to-orange-500 text-white shadow-lg shadow-orange-500/30 hover:shadow-orange-500/50 hover:scale-[1.02]'
                                            : 'bg-slate-100 text-slate-900 hover:bg-slate-900 hover:text-white'
                                            }`}>
                                            {dish.flashSale ? <Zap className="w-4 h-4 fill-white" /> : <Plus className="w-4 h-4" />}
                                            Thêm vào giỏ
                                        </Button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>

                    {/* 4. VOUCHER WALLET PREVIEW (REDESIGNED) */}
                    <section>
                        <div className="flex items-center justify-between mb-6">
                            <div className="flex items-center gap-2">
                                <div className="bg-red-100 p-2 rounded-full">
                                    <Ticket className="w-5 h-5 text-red-600" />
                                </div>
                                <h2 className="text-2xl font-black text-slate-900">Ưu đãi độc quyền</h2>
                            </div>
                            <a href="#" className="text-sm font-bold text-slate-500 hover:text-orange-600 transition-colors">Xem kho voucher</a>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {[
                                {
                                    code: "GIAM20K",
                                    title: "Giảm 20k",
                                    desc: "Đơn tối thiểu 100k",
                                    expiry: "Hết hạn: 2 ngày nữa",
                                    theme: "orange" // Theme màu cam/đỏ
                                },
                                {
                                    code: "FREESHIP",
                                    title: "Freeship",
                                    desc: "Dưới 5km",
                                    expiry: "Hết hạn: Hôm nay",
                                    theme: "blue" // Theme màu xanh dương
                                },
                                {
                                    code: "BANMOI",
                                    title: "Giảm 50%",
                                    desc: "Tối đa 30k",
                                    expiry: "Hết hạn: 30/05",
                                    theme: "green" // Theme màu xanh lá
                                },
                            ].map((vc, idx) => {
                                // Cấu hình màu sắc dựa trên theme
                                const colors = {
                                    orange: "bg-gradient-to-br from-orange-50 to-red-50 border-orange-100 text-orange-700",
                                    blue: "bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-100 text-blue-700",
                                    green: "bg-gradient-to-br from-emerald-50 to-teal-50 border-emerald-100 text-emerald-700",
                                };

                                const btnColors = {
                                    orange: "bg-orange-600 hover:bg-orange-700",
                                    blue: "bg-blue-600 hover:bg-blue-700",
                                    green: "bg-emerald-600 hover:bg-emerald-700",
                                };

                                return (
                                    <div key={idx} className={`relative flex flex-col justify-between p-0 rounded-2xl border ${colors[vc.theme]} shadow-sm hover:shadow-md transition-all group overflow-hidden`}>

                                        {/* Họa tiết trang trí nền (Pattern) */}
                                        <div className="absolute right-0 top-0 p-4 opacity-5">
                                            <Ticket className="w-24 h-24 rotate-12" />
                                        </div>

                                        {/* Phần Nội dung Trên */}
                                        <div className="p-5 relative z-10">
                                            <div className="flex justify-between items-start mb-2">
                                                <span className={`text-[10px] font-bold px-2 py-1 rounded border bg-white/50 backdrop-blur uppercase tracking-wider ${colors[vc.theme].split(' ')[3]}`}>
                                                    {vc.code}
                                                </span>
                                                <span className="text-[10px] font-medium text-slate-400">{vc.expiry}</span>
                                            </div>
                                            <h3 className="text-2xl font-black mb-1 text-slate-800">{vc.title}</h3>
                                            <p className="text-sm text-slate-500 font-medium">{vc.desc}</p>
                                        </div>

                                        {/* Đường kẻ đứt nét + Hình tròn cắt (Cutouts) */}
                                        <div className="relative flex items-center">
                                            {/* Hình tròn bên trái */}
                                            <div className="absolute -left-2 w-4 h-4 rounded-full bg-gray-50 border border-gray-200 z-20"></div>
                                            {/* Đường kẻ */}
                                            <div className="w-full border-t-2 border-dashed border-gray-300/50 mx-4"></div>
                                            {/* Hình tròn bên phải */}
                                            <div className="absolute -right-2 w-4 h-4 rounded-full bg-gray-50 border border-gray-200 z-20"></div>
                                        </div>

                                        {/* Phần Nút bấm Dưới */}
                                        <div className="p-4 bg-white/30 backdrop-blur-sm">
                                            <Button className={`w-full h-10 rounded-xl font-bold text-white shadow-lg shadow-gray-200/50 transition-all ${btnColors[vc.theme]}`}>
                                                Lưu Mã Ngay
                                            </Button>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </section>

                    {/* 5. LOYALTY PROGRAM BANNER (NEW) */}
                    <section className="relative overflow-hidden rounded-[2rem] bg-gradient-to-r from-slate-900 to-slate-800 text-white p-8 md:p-12 shadow-2xl">
                        <div className="absolute top-0 right-0 p-12 opacity-10 rotate-12">
                            <Gift className="w-64 h-64" />
                        </div>
                        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
                            <div className="flex-1">
                                <div className="flex items-center gap-2 text-yellow-400 mb-2 font-bold uppercase tracking-widest text-xs">
                                    <Gift className="w-4 h-4" /> Thành viên thân thiết
                                </div>
                                <h2 className="text-3xl md:text-4xl font-black mb-4">Ăn ngon tích điểm - Đổi quà thả ga</h2>
                                <p className="text-slate-300 mb-6 max-w-md">Bạn còn thiếu <strong>20 điểm</strong> nữa để đổi được một ly Trà Sữa Full Topping miễn phí.</p>

                                {/* Progress Bar */}
                                <div className="w-full max-w-sm h-3 bg-slate-700 rounded-full overflow-hidden mb-2">
                                    <div className="h-full bg-gradient-to-r from-yellow-400 to-orange-500 w-[70%]"></div>
                                </div>
                                <div className="text-xs text-slate-400">Đã tích lũy: 80/100 điểm</div>
                            </div>
                            <Button className="bg-white text-slate-900 hover:bg-yellow-400 hover:text-black font-bold h-12 px-8 rounded-xl transition-colors">
                                Xem Kho Quà
                            </Button>
                        </div>
                    </section>

                    {/* 7. REVIEWS (REDESIGNED) */}
                    <section className="bg-gradient-to-b from-white via-orange-50 to-white py-24">
                        <div className="max-w-7xl mx-auto px-4 md:px-8">
                            {/* Header Section */}
                            <div className="flex flex-col items-center text-center mb-16">
                                <span className="text-orange-600 font-bold uppercase tracking-widest text-xs mb-2">Wall of Love</span>
                                <h2 className="text-4xl font-black text-slate-900 mb-4">Khách hàng nói gì về chúng tôi?</h2>
                                <div className="w-20 h-1.5 bg-orange-500 rounded-full mb-6"></div>
                                <p className="text-slate-500 max-w-xl text-lg">
                                    Hương vị được kiểm chứng bởi hơn 10,000 thực khách. Sự hài lòng của bạn là niềm vui của bếp.
                                </p>
                            </div>

                            {/* Reviews Grid */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                                {[
                                    {
                                        user: "Nguyễn Văn A",
                                        role: "Thực khách",
                                        dish: "Burger Phô Mai 2 Tầng",
                                        comment: "Đồ ăn giao đến vẫn còn nóng hổi. Món Burger 2 tầng thực sự rất đẫm sốt, thịt bò mềm ngọt. Chắc chắn sẽ đặt lại!",
                                        rating: 5,
                                        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Annie"
                                    },
                                    {
                                        user: "Trần Thị B",
                                        role: "Văn phòng",
                                        dish: "Cơm Tấm Sườn Bì",
                                        comment: "Mình hay đặt cơm trưa ở đây. Thích nhất là quán dùng hộp giấy thân thiện môi trường. Nước mắm pha rất vừa miệng.",
                                        rating: 5,
                                        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Bob"
                                    },
                                    {
                                        user: "Lê C",
                                        role: "Khách quen",
                                        dish: "Trà Đào Cam Sả",
                                        comment: "Giao hàng siêu nhanh, shipper của quán rất lễ phép. Trà uống thanh mát, không bị ngọt gắt như mấy chỗ khác.",
                                        rating: 4,
                                        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Caty"
                                    }
                                ].map((review, idx) => (
                                    <div key={idx} className="group bg-white p-8 rounded-[2rem] shadow-[0_2px_20px_rgba(0,0,0,0.04)] hover:shadow-[0_20px_40px_rgba(0,0,0,0.08)] hover:-translate-y-2 transition-all duration-300 border border-gray-100 flex flex-col relative overflow-hidden">

                                        {/* Dấu ngoặc kép trang trí */}
                                        <Quote className="absolute top-6 right-8 text-orange-100 w-12 h-12 fill-current transform group-hover:scale-110 group-hover:rotate-12 transition-transform duration-500" />

                                        {/* Rating Stars */}
                                        <div className="flex items-center gap-1 text-yellow-400 mb-6">
                                            {[...Array(5)].map((_, i) => (
                                                <Star key={i} className={`w-5 h-5 ${i < review.rating ? 'fill-current' : 'text-gray-200'}`} />
                                            ))}
                                        </div>

                                        {/* Comment Content */}
                                        <p className="text-slate-700 text-lg leading-relaxed mb-8 flex-1 relative z-10">
                                            "{review.comment}"
                                        </p>

                                        {/* User Info & Order Detail */}
                                        <div className="flex items-center gap-4 pt-6 border-t border-gray-50">
                                            <img src={review.avatar} alt={review.user} className="w-12 h-12 rounded-full bg-gray-100 border-2 border-white shadow-sm" />
                                            <div className="flex-1">
                                                <div className="flex items-center gap-2">
                                                    <h4 className="font-bold text-slate-900">{review.user}</h4>
                                                    <CheckCircle className="w-4 h-4 text-green-500 fill-green-100" />
                                                </div>
                                                <p className="text-xs text-slate-400 mt-0.5">Đã dùng: <span className="text-orange-600 font-semibold">{review.dish}</span></p>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </section>

                    {/* 8. CULINARY STORIES (NEW) */}
                    <section>
                        <div className="flex items-center gap-2 mb-6">
                            <BookOpen className="w-6 h-6 text-slate-700" />
                            <h2 className="text-2xl font-black text-slate-900">Góc Bếp & Chuyện Nghề</h2>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="group cursor-pointer">
                                <div className="rounded-[2rem] overflow-hidden aspect-[16/9] mb-4 relative">
                                    <img src="https://images.unsplash.com/photo-1556910103-1c02745a30bf?w=800&fit=crop" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-6">
                                        <h3 className="text-white text-2xl font-bold leading-tight">Hành trình tìm kiếm hạt gạo ST25 ngon nhất cho món Cơm Tấm</h3>
                                    </div>
                                </div>
                                <p className="text-slate-500 line-clamp-2">Để có được đĩa cơm tấm dẻo thơm, chúng tôi đã phải đi khắp các vựa lúa miền Tây...</p>
                            </div>
                            <div className="group cursor-pointer">
                                <div className="rounded-[2rem] overflow-hidden aspect-[16/9] mb-4 relative">
                                    <img src="https://images.unsplash.com/photo-1547592180-85f173990554?w=800&fit=crop" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-6">
                                        <h3 className="text-white text-2xl font-bold leading-tight">5 Lợi ích bất ngờ của chế độ ăn Eat Clean</h3>
                                    </div>
                                </div>
                                <p className="text-slate-500 line-clamp-2">Không chỉ giúp giảm cân, Eat Clean còn mang lại làn da sáng khỏe và tinh thần minh mẫn...</p>
                            </div>
                        </div>
                    </section>

                    {/* 5. HISTORY SECTION (ORDER IT AGAIN) */}
                    <section>
                        <div className="flex items-center gap-3 mb-6 opacity-80">
                            <History className="w-5 h-5 text-orange-600" />
                            <h3 className="font-bold text-slate-600 text-sm uppercase tracking-wider">Đặt lại đơn cũ</h3>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {[
                                { name: "Burger King", date: "Hôm qua", items: "2 món", price: 89000, image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=200&h=200&fit=crop" },
                                { name: "Cơm Tấm Cali", date: "2 ngày trước", items: "1 món", price: 55000, image: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=200&h=200&fit=crop" },
                                { name: "Pizza Palace", date: "Tuần trước", items: "1 món", price: 159000, image: "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=200&h=200&fit=crop" },
                            ].map((order, idx) => (
                                <div key={idx} className="flex items-center gap-4 bg-white border border-gray-100 p-4 rounded-2xl hover:border-orange-200 hover:shadow-lg transition-all cursor-pointer group">
                                    <img src={order.image} alt={order.name} className="w-16 h-16 rounded-xl object-cover grayscale group-hover:grayscale-0 transition-all" />
                                    <div className="flex-1">
                                        <h4 className="font-bold text-slate-800">{order.name}</h4>
                                        <p className="text-xs text-gray-400">{order.date} • {order.items}</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="font-bold text-orange-600">{order.price.toLocaleString()}đ</p>
                                        <div className="mt-1 w-8 h-8 rounded-full bg-orange-50 flex items-center justify-center text-orange-600 group-hover:bg-orange-600 group-hover:text-white transition-colors">
                                            <Plus className="w-4 h-4" />
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>

                </div>
            </main>

            {/* --- FOOTER --- */}
            <footer className="bg-slate-900 text-white pt-20 pb-10 rounded-t-[3rem] mt-auto">
                <div className="max-w-7xl mx-auto px-8">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
                        <div className="col-span-1 md:col-span-1">
                            <div className="flex items-center gap-2 text-white mb-6">
                                <div className="bg-orange-600 p-1.5 rounded-lg"><Utensils className="w-6 h-6" /></div>
                                <h2 className="text-2xl font-black">FoodieDash</h2>
                            </div>
                            <p className="text-slate-400 text-sm leading-relaxed mb-6">
                                Trải nghiệm dịch vụ giao đồ ăn nhanh nhất với các nhà hàng địa phương tốt nhất.
                            </p>
                        </div>

                        <div>
                            <h4 className="font-bold text-lg mb-6 text-orange-500">Công ty</h4>
                            <ul className="flex flex-col gap-3 text-slate-400 text-sm">
                                <li><a href="#" className="hover:text-white transition-colors">Về chúng tôi</a></li>
                                <li><a href="#" className="hover:text-white transition-colors">Tuyển dụng</a></li>
                                <li><a href="#" className="hover:text-white transition-colors">Blog</a></li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="font-bold text-lg mb-6 text-orange-500">Hỗ trợ</h4>
                            <ul className="flex flex-col gap-3 text-slate-400 text-sm">
                                <li><a href="#" className="hover:text-white transition-colors">Trung tâm trợ giúp</a></li>
                                <li><a href="#" className="hover:text-white transition-colors">Điều khoản dịch vụ</a></li>
                                <li><a href="#" className="hover:text-white transition-colors">Chính sách bảo mật</a></li>
                            </ul>
                        </div>

                        <div>
                            <h4 className="font-bold text-lg mb-6 text-orange-500">Tải App</h4>
                            <div className="flex flex-col gap-3">
                                <button className="bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl p-3 flex items-center gap-3 transition-all">
                                    <div className="w-8 h-8 rounded bg-white text-black flex items-center justify-center font-bold text-xl">A</div>
                                    <div className="text-left leading-tight">
                                        <div className="text-[10px] text-slate-400 uppercase font-bold">Download on</div>
                                        <div className="font-bold">App Store</div>
                                    </div>
                                </button>
                                <button className="bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl p-3 flex items-center gap-3 transition-all">
                                    <div className="w-8 h-8 rounded bg-white text-black flex items-center justify-center font-bold text-xl">G</div>
                                    <div className="text-left leading-tight">
                                        <div className="text-[10px] text-slate-400 uppercase font-bold">Get it on</div>
                                        <div className="font-bold">Google Play</div>
                                    </div>
                                </button>
                            </div>
                        </div>
                    </div>

                    <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-slate-500 text-xs font-medium">
                        <p>© 2026 FoodieDash Inc. All rights reserved.</p>
                        <div className="flex gap-6">
                            <a href="#" className="hover:text-white">Privacy</a>
                            <a href="#" className="hover:text-white">Terms</a>
                            <a href="#" className="hover:text-white">Sitemap</a>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default HomePage;