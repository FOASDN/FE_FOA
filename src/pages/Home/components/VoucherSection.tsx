import React from "react";
import { Ticket } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link, useNavigate } from "react-router-dom";
const VoucherSection = () => {
    const navigate = useNavigate();
    return (
        <section>
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                    <div className="bg-red-100 p-2 rounded-full">
                        <Ticket className="w-5 h-5 text-red-600" />
                    </div>
                    <h2 className="text-2xl font-black text-slate-900">Ưu đãi độc quyền</h2>
                </div>
                <Link to="/vouchers" className="text-sm font-bold text-slate-500 hover:text-orange-600 transition-colors">Xem kho voucher</Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {([
                    {
                        code: "GIAM20K",
                        title: "Giảm 20k",
                        desc: "Đơn tối thiểu 100k",
                        expiry: "Hết hạn: 2 ngày nữa",
                        theme: "orange"
                    },
                    {
                        code: "FREESHIP",
                        title: "Freeship",
                        desc: "Dưới 5km",
                        expiry: "Hết hạn: Hôm nay",
                        theme: "blue"
                    },
                    {
                        code: "BANMOI",
                        title: "Giảm 50%",
                        desc: "Tối đa 30k",
                        expiry: "Hết hạn: 30/05",
                        theme: "green"
                    },
                ] as const).map((vc, idx) => {
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
                        // @ts-ignore
                        <div
                            key={idx}
                            onClick={() => navigate(`/vouchers/${vc.code}`)}
                            className={`relative flex flex-col justify-between p-0 rounded-2xl border ${colors[vc.theme]} shadow-sm hover:shadow-md transition-all group overflow-hidden cursor-pointer`}
                        >

                            {/* Họa tiết trang trí nền (Pattern) */}
                            <div className="absolute right-0 top-0 p-4 opacity-5">
                                <Ticket className="w-24 h-24 rotate-12" />
                            </div>

                            {/* Phần Nội dung Trên */}
                            <div className="p-5 relative z-10">
                                <div className="flex justify-between items-start mb-2">
                                    {/* @ts-ignore */}
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
                                {/* @ts-ignore */}
                                <Button className={`w-full h-10 rounded-xl font-bold text-white shadow-lg shadow-gray-200/50 transition-all ${btnColors[vc.theme]}`}>
                                    Lưu Mã Ngay
                                </Button>
                            </div>
                        </div>
                    );
                })}
            </div>
        </section>
    );
};

export default VoucherSection;
