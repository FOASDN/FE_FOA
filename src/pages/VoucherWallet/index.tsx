import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

// Reusable component for voucher wallet content
export const VoucherWalletContent = () => {
    const { t } = useTranslation(['customer', 'common']);
    return (
        <div className="space-y-12">
            {/* Points Balance & Tier Progress */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Points Balance Card */}
                <div className="lg:col-span-2 relative bg-white dark:bg-card rounded-[24px] border border-border p-8 shadow-sm overflow-hidden">
                    <div className="relative z-10">
                        <div className="flex justify-between items-start mb-10">
                            <div>
                                <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-1">Số dư điểm</p>
                                <h2 className="text-5xl font-black text-foreground">
                                    2,450 <span className="text-xl font-medium text-muted-foreground">pts</span>
                                </h2>
                            </div>
                            <div className="px-4 py-2 bg-green-50 dark:bg-green-900/20 border border-green-100 dark:border-green-800/30 rounded-full flex items-center gap-2">
                                <span className="material-symbols-outlined text-green-600 text-base font-bold">verified</span>
                                <span className="text-green-700 dark:text-green-400 font-bold text-xs">THÀNH VIÊN VÀNG</span>
                            </div>
                        </div>

                        {/* Progress to next tier */}
                        <div className="relative pt-4">
                            <div className="flex justify-between text-xs font-bold mb-3">
                                <span className="text-primary uppercase">Vàng</span>
                                <span className="text-muted-foreground uppercase">Bạch kim</span>
                            </div>
                            <div className="h-4 bg-muted rounded-full overflow-visible relative group cursor-help">
                                <div className="h-full bg-primary rounded-full relative" style={{ width: '85%' }}>
                                    <div className="absolute -right-2 -top-1 size-6 bg-card border-4 border-primary rounded-full shadow-lg"></div>
                                </div>
                            </div>
                            <p className="mt-4 text-sm font-medium text-muted-foreground">
                                Kiếm thêm 50 điểm để mở khóa <span className="text-foreground font-bold">Giảm giá 15% vĩnh viễn</span>
                            </p>
                            <Link
                                to="/membership"
                                className="mt-3 inline-flex items-center gap-1 text-sm font-bold text-primary hover:underline"
                            >
                                <span className="material-symbols-outlined text-base">info</span>
                                <span>Tìm hiểu quyền lợi thành viên</span>
                            </Link>
                        </div>
                    </div>
                    <div className="absolute -right-20 -top-20 w-80 h-80 bg-primary/5 rounded-full blur-3xl"></div>
                </div>

                {/* Referral Card */}
                <div className="bg-gradient-to-br from-orange-500 to-primary p-8 rounded-[24px] text-white flex flex-col justify-between relative overflow-hidden group shadow-xl shadow-primary/20">
                    <div className="relative z-10">
                        <span className="material-symbols-outlined text-4xl mb-4 opacity-80 group-hover:scale-110 transition-transform">celebration</span>
                        <h3 className="text-2xl font-bold leading-tight mb-2">Chia sẻ niềm vui</h3>
                        <p className="text-orange-100 text-sm leading-relaxed mb-6">
                            Giới thiệu bạn bè và cả hai đều nhận <span className="font-bold text-white underline decoration-2 underline-offset-4">voucher 200.000đ</span> cho đơn đầu tiên.
                        </p>
                    </div>
                    <button className="relative z-10 w-full py-3 bg-white text-primary font-bold rounded-xl hover:bg-orange-50 transition-colors shadow-lg">
                        Mời bạn bè
                    </button>
                    <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-2xl"></div>
                </div>
            </div>

            {/* Rewards Shop */}
            <section className="space-y-6">
                <div className="flex items-end justify-between">
                    <div>
                        <h3 className="text-2xl font-bold">Cửa hàng thưởng</h3>
                        <p className="text-muted-foreground text-sm">Đổi điểm lấy phần thưởng</p>
                    </div>
                    <div className="flex gap-2">
                        <button className="size-10 border border-border rounded-full flex items-center justify-center hover:bg-card transition-all">
                            <span className="material-symbols-outlined text-sm">arrow_back</span>
                        </button>
                        <button className="size-10 border border-border rounded-full flex items-center justify-center hover:bg-card transition-all">
                            <span className="material-symbols-outlined text-sm">arrow_forward</span>
                        </button>
                    </div>
                </div>

                <div className="flex gap-6 overflow-x-auto no-scrollbar pb-4 -mx-1 px-1">
                    {/* Reward Item 1 */}
                    <div className="min-w-[280px] bg-card p-4 rounded-[24px] border border-border hover:shadow-lg transition-all group shrink-0">
                        <div className="aspect-video bg-muted rounded-2xl mb-4 overflow-hidden relative">
                            <img
                                alt="Phở"
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                src="https://images.unsplash.com/photo-1591814468924-caf88d1232e1?w=400&h=300&fit=crop"
                            />
                            <div className="absolute top-2 right-2 px-3 py-1 bg-card/90 backdrop-blur rounded-full text-[10px] font-black uppercase text-primary">
                                Phổ biến
                            </div>
                        </div>
                        <h4 className="font-bold text-lg mb-1">Tô Phở miễn phí</h4>
                        <p className="text-xs text-muted-foreground mb-4">Đổi tại "Sài Gòn Delights"</p>
                        <button className="w-full py-2.5 bg-background border border-primary/20 text-primary font-bold rounded-xl hover:bg-primary hover:text-white transition-all text-sm flex items-center justify-center gap-2">
                            500 <span className="text-[10px] opacity-80">ĐIỂM</span>
                        </button>
                    </div>

                    {/* Reward Item 2 */}
                    <div className="min-w-[280px] bg-card p-4 rounded-[24px] border border-border hover:shadow-lg transition-all group shrink-0">
                        <div className="aspect-video bg-muted rounded-2xl mb-4 overflow-hidden relative">
                            <img
                                alt="AI Health Coach"
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                src="https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=400&h=300&fit=crop"
                            />
                            <div className="absolute top-2 right-2 px-3 py-1 bg-card/90 backdrop-blur rounded-full text-[10px] font-black uppercase text-blue-500">
                                Cao cấp
                            </div>
                        </div>
                        <h4 className="font-bold text-lg mb-1">AI Health Coach</h4>
                        <p className="text-xs text-muted-foreground mb-4">Gói 1 tháng đầy đủ</p>
                        <button className="w-full py-2.5 bg-background border border-primary/20 text-primary font-bold rounded-xl hover:bg-primary hover:text-white transition-all text-sm flex items-center justify-center gap-2">
                            1,000 <span className="text-[10px] opacity-80">ĐIỂM</span>
                        </button>
                    </div>

                    {/* Reward Item 3 */}
                    <div className="min-w-[280px] bg-card p-4 rounded-[24px] border border-border hover:shadow-lg transition-all group shrink-0">
                        <div className="aspect-video bg-muted rounded-2xl mb-4 overflow-hidden relative">
                            <img
                                alt="Pizza"
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                src="https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400&h=300&fit=crop"
                            />
                        </div>
                        <h4 className="font-bold text-lg mb-1">Pizza cỡ lớn</h4>
                        <p className="text-xs text-muted-foreground mb-4">Topping tùy chọn</p>
                        <button className="w-full py-2.5 bg-background border border-primary/20 text-primary font-bold rounded-xl hover:bg-primary hover:text-white transition-all text-sm flex items-center justify-center gap-2">
                            850 <span className="text-[10px] opacity-80">ĐIỂM</span>
                        </button>
                    </div>
                </div>
            </section>

            {/* Vouchers and Points History */}
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-12">
                {/* Your Vouchers */}
                <div className="xl:col-span-2 space-y-8">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-border pb-4">
                        <h3 className="text-2xl font-bold">Voucher của bạn</h3>
                        <div className="flex bg-muted p-1 rounded-xl">
                            <button className="px-4 py-1.5 bg-card text-primary font-bold text-xs rounded-lg shadow-sm">
                                Đang dùng
                            </button>
                            <button className="px-4 py-1.5 text-muted-foreground font-bold text-xs rounded-lg">
                                Đã dùng
                            </button>
                            <button className="px-4 py-1.5 text-muted-foreground font-bold text-xs rounded-lg">
                                Hết hạn
                            </button>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Voucher Card 1 */}
                        <div className="bg-card rounded-2xl border border-border overflow-hidden flex shadow-sm group hover:-translate-y-1 transition-all">
                            <div className="w-24 bg-primary/10 flex flex-col items-center justify-center p-2 border-r border-dashed border-primary/30 relative">
                                <div className="absolute -top-3 -right-3 size-6 bg-background rounded-full"></div>
                                <div className="absolute -bottom-3 -right-3 size-6 bg-background rounded-full"></div>
                                <span className="text-2xl font-black text-primary">20%</span>
                                <span className="text-[8px] font-bold text-primary tracking-widest uppercase">OFF</span>
                            </div>
                            <div className="flex-1 p-5 space-y-3">
                                <div className="flex flex-wrap gap-2">
                                    <span className="px-2 py-1 bg-muted text-[9px] font-bold rounded">Tối thiểu 500k</span>
                                    <span className="px-2 py-1 bg-orange-100 dark:bg-orange-950/40 text-orange-600 dark:text-orange-400 text-[9px] font-bold rounded">
                                        Tất cả nhà hàng
                                    </span>
                                </div>
                                <h5 className="text-sm font-bold">Flash Sale Cuối Tuần</h5>
                                <div className="flex items-center justify-between">
                                    <span className="text-[10px] text-muted-foreground font-medium italic">Hết hạn sau 12h</span>
                                    <button className="text-xs font-black text-primary hover:underline">ÁP DỤNG</button>
                                </div>
                            </div>
                        </div>

                        {/* Voucher Card 2 */}
                        <div className="bg-card rounded-2xl border border-border overflow-hidden flex shadow-sm group hover:-translate-y-1 transition-all">
                            <div className="w-24 bg-blue-500/10 flex flex-col items-center justify-center p-2 border-r border-dashed border-blue-500/30 relative">
                                <div className="absolute -top-3 -right-3 size-6 bg-background rounded-full"></div>
                                <div className="absolute -bottom-3 -right-3 size-6 bg-background rounded-full"></div>
                                <span className="text-2xl font-black text-blue-600">200k</span>
                                <span className="text-[8px] font-bold text-blue-600 tracking-widest uppercase">OFF</span>
                            </div>
                            <div className="flex-1 p-5 space-y-3">
                                <div className="flex flex-wrap gap-2">
                                    <span className="px-2 py-1 bg-muted text-[9px] font-bold rounded">Tối thiểu 800k</span>
                                    <span className="px-2 py-1 bg-blue-100 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 text-[9px] font-bold rounded">
                                        Chỉ bữa tối
                                    </span>
                                </div>
                                <h5 className="text-sm font-bold">Phần thưởng thành viên</h5>
                                <div className="flex items-center justify-between">
                                    <span className="text-[10px] text-muted-foreground font-medium italic">HSD: 24 Th10</span>
                                    <button className="text-xs font-black text-primary hover:underline uppercase">Sao chép</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Points History */}
                <div className="space-y-6">
                    <h3 className="text-2xl font-bold">Lịch sử điểm</h3>
                    <div className="bg-card rounded-[24px] border border-border overflow-hidden">
                        <div className="max-h-[400px] overflow-y-auto no-scrollbar p-6 space-y-6">
                            {/* History Item 1 */}
                            <div className="flex justify-between items-center group">
                                <div className="flex items-center gap-4">
                                    <div className="size-10 bg-green-50 dark:bg-green-950/20 rounded-xl flex items-center justify-center">
                                        <span className="material-symbols-outlined text-green-600 text-lg">add_circle</span>
                                    </div>
                                    <div>
                                        <p className="text-sm font-bold">Đơn hàng "Bowl of Happiness"</p>
                                        <p className="text-[10px] text-muted-foreground uppercase tracking-tighter">12 Th10, 2024</p>
                                    </div>
                                </div>
                                <span className="text-sm font-black text-green-600">+120</span>
                            </div>

                            {/* History Item 2 */}
                            <div className="flex justify-between items-center group">
                                <div className="flex items-center gap-4">
                                    <div className="size-10 bg-red-50 dark:bg-red-950/20 rounded-xl flex items-center justify-center">
                                        <span className="material-symbols-outlined text-red-600 text-lg">remove_circle</span>
                                    </div>
                                    <div>
                                        <p className="text-sm font-bold">Đổi đồ uống miễn phí</p>
                                        <p className="text-[10px] text-muted-foreground uppercase tracking-tighter">10 Th10, 2024</p>
                                    </div>
                                </div>
                                <span className="text-sm font-black text-red-600">-150</span>
                            </div>

                            {/* History Item 3 */}
                            <div className="flex justify-between items-center group">
                                <div className="flex items-center gap-4">
                                    <div className="size-10 bg-green-50 dark:bg-green-950/20 rounded-xl flex items-center justify-center">
                                        <span className="material-symbols-outlined text-green-600 text-lg">add_circle</span>
                                    </div>
                                    <div>
                                        <p className="text-sm font-bold">Thưởng lựa chọn lành mạnh</p>
                                        <p className="text-[10px] text-muted-foreground uppercase tracking-tighter">08 Th10, 2024</p>
                                    </div>
                                </div>
                                <span className="text-sm font-black text-green-600">+2x 80</span>
                            </div>

                            {/* History Item 4 */}
                            <div className="flex justify-between items-center group">
                                <div className="flex items-center gap-4">
                                    <div className="size-10 bg-green-50 dark:bg-green-950/20 rounded-xl flex items-center justify-center">
                                        <span className="material-symbols-outlined text-green-600 text-lg">add_circle</span>
                                    </div>
                                    <div>
                                        <p className="text-sm font-bold">Đơn hàng "Sushi Garden"</p>
                                        <p className="text-[10px] text-muted-foreground uppercase tracking-tighter">05 Th10, 2024</p>
                                    </div>
                                </div>
                                <span className="text-sm font-black text-green-600">+210</span>
                            </div>

                            {/* History Item 5 */}
                            <div className="flex justify-between items-center group">
                                <div className="flex items-center gap-4">
                                    <div className="size-10 bg-green-50 dark:bg-green-950/20 rounded-xl flex items-center justify-center">
                                        <span className="material-symbols-outlined text-green-600 text-lg">add_circle</span>
                                    </div>
                                    <div>
                                        <p className="text-sm font-bold">Thưởng chào mừng</p>
                                        <p className="text-[10px] text-muted-foreground uppercase tracking-tighter">01 Th10, 2024</p>
                                    </div>
                                </div>
                                <span className="text-sm font-black text-green-600">+500</span>
                            </div>
                        </div>
                        <div className="p-4 border-t border-border bg-muted/30 text-center">
                            <button className="text-[10px] font-bold text-muted-foreground hover:text-primary uppercase tracking-widest">
                                Tải bản tổng kết
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

// Main voucher wallet page component
const VoucherWalletPage = () => {
    const { t } = useTranslation(['customer', 'common']);
    return (
        <div className="bg-background-light dark:bg-background-dark font-display text-[#1b140d] dark:text-gray-100 transition-colors duration-200 min-h-screen">
            <div className="relative flex h-auto min-h-screen w-full flex-col group/design-root overflow-x-hidden">
                <div className="layout-container flex h-full grow flex-col">
                    <main className="flex flex-1 justify-center py-10 px-4">
                        <div className="layout-content-container flex flex-col max-w-[1400px] flex-1">
                            {/* Page Heading */}
                            <div className="flex flex-col gap-2 p-4 mb-6">
                                <h1 className="text-[#1b140d] dark:text-white text-4xl font-black leading-tight tracking-[-0.033em]">{t('customer:voucherWallet.title')}</h1>
                                <p className="text-[#9a734c] dark:text-gray-400 text-lg font-normal">{t('customer:voucherWallet.subtitle')}</p>
                            </div>

                            <VoucherWalletContent />
                        </div>
                    </main>
                </div>
            </div>
        </div>
    );
};

export default VoucherWalletPage;
