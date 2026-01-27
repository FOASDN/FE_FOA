import React from "react";
import { TrendingUp, ArrowRight, Zap, Star, Heart, Store, Clock, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

const BestSellerSection = () => {
    return (
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
    );
};

export default BestSellerSection;
