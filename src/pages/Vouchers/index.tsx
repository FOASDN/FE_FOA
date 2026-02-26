import { useState, useEffect } from "react";
import {
    Ticket,
    Gift,
    Truck,
    Percent,
    Copy,
    Check,
    Sparkles,
    ArrowLeft,
    Wallet,
    History,
    Search,
    Clock,
    Zap,
    Loader2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import voucherAPI from "@/services/voucher.service";
import type { Voucher, VoucherCategory } from "@/types/voucher";
import { useTranslation } from "react-i18next";

const VouchersPage = () => {
    const navigate = useNavigate();
    const { t } = useTranslation(['customer', 'common']);
    const [activeCategory, setActiveCategory] = useState<string>("all");
    const [copiedCode, setCopiedCode] = useState<string | null>(null);
    const [vouchers, setVouchers] = useState<Voucher[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const categories = [
        { id: "all", name: "Tất cả" },
        { id: "discount", name: "Giảm giá" },
        { id: "freeship", name: "Freeship" },
        { id: "newuser", name: "Người mới" },
        { id: "special", name: "Đặc biệt" },
    ];

    // Fetch vouchers from API
    useEffect(() => {
        fetchVouchers();
    }, [activeCategory]);

    const fetchVouchers = async () => {
        try {
            setLoading(true);
            setError(null);

            const params: any = {
                is_active: true,
                limit: 20,
            };

            if (activeCategory !== "all") {
                params.category = activeCategory as VoucherCategory;
            }

            const response = await voucherAPI.getVouchers(params);
            setVouchers(response.data);
        } catch (err: any) {
            setError(err.response?.data?.message || "Không thể tải vouchers");
            console.error("Error fetching vouchers:", err);
        } finally {
            setLoading(false);
        }
    };

    const handleCopy = (code: string) => {
        navigator.clipboard.writeText(code);
        setCopiedCode(code);
        setTimeout(() => setCopiedCode(null), 2000);
    };

    const getTheme = (category: string) => {
        const themes: Record<string, string> = {
            discount: "text-orange-600 bg-orange-50 border-orange-200",
            freeship: "text-blue-600 bg-blue-50 border-blue-200",
            newuser: "text-purple-600 bg-purple-50 border-purple-200",
            special: "text-rose-600 bg-rose-50 border-rose-200",
        };
        return themes[category] || themes.discount;
    };

    const formatDiscount = (voucher: Voucher) => {
        if (voucher.discount_type === "percentage") {
            return `${voucher.discount_value}%`;
        }
        return `${(voucher.discount_value / 1000).toFixed(0)}K`;
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return `${date.getDate()}/${date.getMonth() + 1}`;
    };

    return (
        <div className="min-h-screen bg-slate-50 font-sans text-slate-900">
            {/* --- HEADER --- */}
            <div className="bg-white sticky top-0 z-50 border-b border-slate-100 shadow-sm">
                <div className="max-w-5xl mx-auto px-4 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <button onClick={() => navigate(-1)} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
                                <ArrowLeft className="w-5 h-5 text-slate-600" />
                            </button>
                            <div>
                                <h1 className="text-xl font-bold text-slate-900">{t('customer:voucher.title')}</h1>
                                <p className="text-xs text-slate-500">
                                    {loading ? "Đang tải..." : `${vouchers.length} voucher có sẵn`}
                                </p>
                            </div>
                        </div>
                        <button className="flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-orange-600 bg-slate-50 hover:bg-orange-50 px-3 py-2 rounded-lg transition-colors">
                            <History className="w-4 h-4" />
                            <span className="hidden sm:inline">Lịch sử</span>
                        </button>
                    </div>
                </div>
            </div>

            <main className="max-w-5xl mx-auto px-4 py-6 space-y-8">
                {/* --- WALLET SUMMARY --- */}
                <section className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-slate-900 text-white p-6 rounded-2xl shadow-lg relative overflow-hidden">
                        <div className="relative z-10">
                            <div className="flex items-center gap-2 text-slate-300 text-sm mb-1">
                                <Wallet className="w-4 h-4" />
                                <span>Tiết kiệm tháng này</span>
                            </div>
                            <div className="text-3xl font-black tracking-tight">450.000đ</div>
                            <div className="mt-4 flex gap-2">
                                <span className="text-xs bg-white/20 px-2 py-1 rounded">2 mã đã dùng</span>
                                <span className="text-xs bg-white/20 px-2 py-1 rounded">3 mã sắp hết hạn</span>
                            </div>
                        </div>
                        <div className="absolute right-[-20px] top-[-20px] w-32 h-32 bg-orange-500 rounded-full blur-[60px] opacity-30"></div>
                    </div>

                    {/* Featured/Hero Voucher */}
                    <div className="relative bg-gradient-to-r from-orange-500 to-rose-500 p-6 rounded-2xl shadow-lg text-white flex justify-between items-center overflow-hidden">
                        <div className="relative z-10">
                            <div className="flex items-center gap-2 text-orange-100 text-xs font-bold uppercase tracking-wider mb-2">
                                <Zap className="w-4 h-4 fill-current" /> Flash Sale
                            </div>
                            <h3 className="text-2xl font-black mb-1">Giảm 50% Toàn menu</h3>
                            <p className="text-sm text-orange-50 mb-4 opacity-90">Hết hạn sau 2 giờ</p>
                            <button className="bg-white text-orange-600 px-4 py-2 rounded-lg text-xs font-bold hover:bg-orange-50 transition">Lưu ngay</button>
                        </div>
                        <div className="relative z-10 bg-white/20 backdrop-blur-md p-4 rounded-xl border border-white/30 text-center min-w-[80px]">
                            <span className="block text-2xl font-black">50%</span>
                            <span className="text-[10px] uppercase font-bold">Off</span>
                        </div>
                        <Sparkles className="absolute bottom-4 right-20 text-white/20 w-12 h-12" />
                    </div>
                </section>

                {/* --- FILTERS & SEARCH --- */}
                <section className="flex flex-col sm:flex-row gap-4 justify-between items-center sticky top-[73px] z-40 py-2 bg-slate-50/95 backdrop-blur">
                    <div className="flex gap-2 overflow-x-auto no-scrollbar w-full sm:w-auto pb-2 sm:pb-0">
                        {categories.map(cat => (
                            <button
                                key={cat.id}
                                onClick={() => setActiveCategory(cat.id)}
                                className={`whitespace-nowrap px-4 py-2 rounded-full text-sm font-medium transition-all ${activeCategory === cat.id
                                    ? "bg-slate-900 text-white shadow-md"
                                    : "bg-white text-slate-600 border border-slate-200 hover:border-slate-300"
                                    }`}
                            >
                                {cat.name}
                            </button>
                        ))}
                    </div>
                    <div className="relative w-full sm:w-64">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <input
                            type="text"
                            placeholder="Nhập mã voucher..."
                            className="w-full pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all"
                        />
                    </div>
                </section>

                {/* Loading State */}
                {loading && (
                    <div className="flex items-center justify-center py-20">
                        <Loader2 className="w-8 h-8 text-orange-600 animate-spin" />
                    </div>
                )}

                {/* Error State */}
                {error && !loading && (
                    <div className="text-center py-20">
                        <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Ticket className="w-10 h-10 text-red-600" />
                        </div>
                        <h3 className="text-xl font-bold text-slate-700 mb-2">Có lỗi xảy ra</h3>
                        <p className="text-slate-500 mb-4">{error}</p>
                        <Button onClick={fetchVouchers} className="bg-orange-600 hover:bg-orange-700">
                            Thử lại
                        </Button>
                    </div>
                )}

                {/* --- VOUCHER LIST --- */}
                {!loading && !error && (
                    <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-5">
                        {vouchers.map((voucher) => {
                            const theme = getTheme(voucher.category);
                            return (
                                <div
                                    key={voucher._id}
                                    onClick={() => navigate(`/vouchers/${voucher._id}`)}
                                    className="group bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 overflow-hidden flex flex-col cursor-pointer"
                                >
                                    {/* Upper Part */}
                                    <div className="p-5 flex gap-4 items-start relative">
                                        <div className={`absolute left-0 top-0 bottom-0 w-1.5 ${theme.split(' ')[1].replace('text', 'bg').replace('50', '500')}`}></div>

                                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${theme}`}>
                                            {voucher.category === 'freeship' ? <Truck className="w-6 h-6" /> :
                                                voucher.category === 'newuser' ? <Sparkles className="w-6 h-6" /> :
                                                    voucher.category === 'special' ? <Gift className="w-6 h-6" /> :
                                                        <Percent className="w-6 h-6" />}
                                        </div>

                                        <div className="flex-1 min-w-0">
                                            <div className="flex justify-between items-start">
                                                <h3 className="font-bold text-slate-900 text-lg truncate pr-2">{voucher.title}</h3>
                                            </div>
                                            <p className="text-sm text-slate-500 mb-2 line-clamp-1">{voucher.description}</p>

                                            <div className="flex items-center gap-3 text-xs font-medium text-slate-400">
                                                <span className="flex items-center gap-1 bg-slate-50 px-2 py-1 rounded">
                                                    <Clock className="w-3 h-3" /> HSD: {formatDate(voucher.end_date)}
                                                </span>
                                                <span className="font-bold text-orange-600">
                                                    {formatDiscount(voucher)}
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Divider Line */}
                                    <div className="relative h-px bg-slate-100 mx-5">
                                        <div className="absolute -left-7 -top-2 w-4 h-4 bg-slate-50 rounded-full"></div>
                                        <div className="absolute -right-7 -top-2 w-4 h-4 bg-slate-50 rounded-full"></div>
                                    </div>

                                    {/* Bottom Part */}
                                    <div className="p-4 bg-slate-50/50 flex items-center justify-between gap-3">
                                        <div
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleCopy(voucher.code);
                                            }}
                                            className="flex-1 bg-white border border-slate-200 border-dashed rounded-lg px-3 py-2 flex justify-between items-center cursor-pointer hover:border-slate-400 transition-colors group/code"
                                        >
                                            <span className="font-mono font-bold text-slate-700 tracking-wide text-sm">{voucher.code}</span>
                                            {copiedCode === voucher.code ? (
                                                <Check className="w-4 h-4 text-green-500" />
                                            ) : (
                                                <Copy className="w-4 h-4 text-slate-400 group-hover/code:text-slate-600" />
                                            )}
                                        </div>

                                        <Button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                navigate(`/vouchers/${voucher._id}`);
                                            }}
                                            className="h-10 px-5 rounded-lg text-xs font-bold shadow-sm transition-all bg-slate-900 text-white hover:bg-slate-800"
                                        >
                                            {t('common:actions.details', 'Chi tiết')}
                                        </Button>
                                    </div>
                                </div>
                            );
                        })}
                    </section>
                )}

                {/* Empty State */}
                {!loading && !error && vouchers.length === 0 && (
                    <div className="flex flex-col items-center justify-center py-20 text-center">
                        <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mb-4">
                            <Ticket className="w-8 h-8 text-slate-400" />
                        </div>
                        <h3 className="text-lg font-bold text-slate-700">Chưa có voucher nào</h3>
                        <p className="text-sm text-slate-500">Vui lòng quay lại sau nhé!</p>
                    </div>
                )}
            </main>
        </div>
    );
};

export default VouchersPage;