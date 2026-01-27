import React from "react";
import { BookOpen } from "lucide-react";

const CulinaryStorySection = () => {
    return (
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
    );
};

export default CulinaryStorySection;
