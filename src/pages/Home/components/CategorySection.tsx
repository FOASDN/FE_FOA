import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";

const CategorySection = () => {
    return (
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
                ].map((cat, idx) => {
                    const categoryMap: Record<string, string> = {
                        "Cơm": "com",
                        "Phở": "pho",
                        "Đồ uống": "drink",
                        "Ăn vặt": "snack",
                        "Healthy": "healthy",
                        "Bánh": "dessert",
                    };
                    return (
                        <Link key={idx} to={`/menu?category=${categoryMap[cat.name]}`} className="snap-start shrink-0 group cursor-pointer">
                            <div className="w-32 h-36 bg-white rounded-[1.5rem] border border-gray-100 shadow-sm hover:shadow-lg hover:shadow-orange-500/10 flex flex-col items-center justify-center gap-3 transition-all duration-300 hover:-translate-y-1">
                                <div className={`w-14 h-14 rounded-full flex items-center justify-center text-2xl shadow-inner ${cat.color} group-hover:scale-110 transition-transform duration-300`}>
                                    {cat.icon}
                                </div>
                                <span className="font-bold text-sm text-slate-700 group-hover:text-orange-600 transition-colors">{cat.name}</span>
                            </div>
                        </Link>
                    );
                })}
            </div>
        </section>
    );
};

export default CategorySection;
