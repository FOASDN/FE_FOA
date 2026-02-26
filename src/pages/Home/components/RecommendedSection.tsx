
import { useTranslation } from "react-i18next";
import { Sparkles, Star, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

import { Link, useNavigate } from "react-router-dom";

const RecommendedSection = () => {
    const navigate = useNavigate();
    const { t } = useTranslation(['customer', 'common']);
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
                    <div key={idx} onClick={() => navigate("/food/1")} className="flex bg-white rounded-2xl p-4 gap-4 shadow-sm border border-orange-50 hover:shadow-xl hover:shadow-orange-500/10 transition-all cursor-pointer group">
                        <div className="relative w-28 h-28 rounded-xl overflow-hidden shrink-0">
                            <img src={item.image} alt={item.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                            {idx === 0 && <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors" />}
                        </div>
                        <div className="flex flex-col flex-1 justify-between">
                            <div>
                                <div className="flex justify-between items-start">
                                    <div className="bg-orange-100 text-orange-700 text-[10px] font-bold px-2 py-0.5 rounded-full mb-2 inline-block">
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
                                <span className="font-black text-lg text-orange-600">{item.price.toLocaleString()}đ</span>
                                <button className="w-8 h-8 rounded-full bg-orange-50 text-orange-600 flex items-center justify-center hover:bg-orange-600 hover:text-white transition-all">
                                    <Plus className="w-5 h-5" />
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
};

export default RecommendedSection;
