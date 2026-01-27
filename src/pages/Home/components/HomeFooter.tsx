import React from "react";
import { Utensils } from "lucide-react";

const HomeFooter = () => {
    return (
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
    );
};

export default HomeFooter;
