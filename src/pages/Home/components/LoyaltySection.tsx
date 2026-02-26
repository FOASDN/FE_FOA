import { Gift } from "lucide-react";
import { Button } from "@/components/ui/button";

const LoyaltySection = () => {
    return (
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
    );
};

export default LoyaltySection;
