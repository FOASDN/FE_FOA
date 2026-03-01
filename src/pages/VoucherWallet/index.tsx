import { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import voucherService from "@/services/voucher.service";
import type { Voucher } from "@/types/voucher";
import { DiscountType } from "@/types/voucher";

// ─── helpers ────────────────────────────────────────────────────────────────

function formatDiscount(voucher: Voucher): string {
    if (voucher.discount_type === DiscountType.PERCENTAGE) {
        return `${voucher.discount_value}%`;
    }
    if (voucher.discount_type === DiscountType.FIXED_AMOUNT) {
        return `${(voucher.discount_value / 1000).toFixed(0)}k`;
    }
    return `${voucher.discount_value}`;
}

function formatDate(dateStr: string): string {
    const d = new Date(dateStr);
    return `${d.getDate()} Th${d.getMonth() + 1}, ${d.getFullYear()}`;
}

function getExpiryLabel(endDate: string): string {
    const now = new Date();
    const end = new Date(endDate);
    const diffMs = end.getTime() - now.getTime();
    if (diffMs <= 0) return "Đã hết hạn";
    const diffH = Math.floor(diffMs / (1000 * 60 * 60));
    if (diffH < 24) return `Hết hạn sau ${diffH}h`;
    const diffD = Math.floor(diffH / 24);
    if (diffD < 7) return `Hết hạn sau ${diffD} ngày`;
    return `HSD: ${formatDate(endDate)}`;
}

function isExpired(v: Voucher): boolean {
    return new Date(v.end_date) < new Date();
}

// A voucher is "exhausted" only when the global pool is fully used up
function isExhausted(v: Voucher): boolean {
    return (
        v.total_usage_limit !== null &&
        v.total_usage_limit !== undefined &&
        v.current_usage_count >= v.total_usage_limit
    );
}

type FilterTab = "active" | "used" | "expired";

// ─── Color map by category ───────────────────────────────────────────────────

const COLORS: Record<string, { bg: string; text: string; border: string; badge: string }> = {
    discount: { bg: "bg-primary/10", text: "text-primary", border: "border-primary/30", badge: "bg-orange-100 dark:bg-orange-950/40 text-orange-600 dark:text-orange-400" },
    freeship: { bg: "bg-green-500/10", text: "text-green-600", border: "border-green-500/30", badge: "bg-green-100 dark:bg-green-950/40 text-green-600 dark:text-green-400" },
    newuser: { bg: "bg-blue-500/10", text: "text-blue-600", border: "border-blue-500/30", badge: "bg-blue-100 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400" },
    special: { bg: "bg-purple-500/10", text: "text-purple-600", border: "border-purple-500/30", badge: "bg-purple-100 dark:bg-purple-950/40 text-purple-600 dark:text-purple-400" },
};
const getColor = (cat: string) => COLORS[cat] ?? COLORS.discount;

// ─── Sub-components ──────────────────────────────────────────────────────────

const VoucherCard = ({
    voucher,
    onCopy,
    copied,
}: {
    voucher: Voucher;
    onCopy: (code: string) => void;
    copied: string | null;
}) => {
    const color = getColor(voucher.category);
    const expired = isExpired(voucher);
    const isCopied = copied === voucher.code;

    return (
        <div className={`bg-card rounded-2xl border border-border overflow-hidden flex shadow-sm group hover:-translate-y-1 transition-all ${expired ? "opacity-60" : ""}`}>
            <div className={`w-24 ${color.bg} flex flex-col items-center justify-center p-2 border-r border-dashed ${color.border} relative`}>
                <div className="absolute -top-3 -right-3 size-6 bg-background rounded-full" />
                <div className="absolute -bottom-3 -right-3 size-6 bg-background rounded-full" />
                <span className={`text-2xl font-black ${color.text}`}>{formatDiscount(voucher)}</span>
                <span className={`text-[8px] font-bold ${color.text} tracking-widest uppercase`}>OFF</span>
            </div>
            <div className="flex-1 p-5 space-y-3">
                <div className="flex flex-wrap gap-2">
                    {voucher.min_order_amount > 0 && (
                        <span className="px-2 py-1 bg-muted text-[9px] font-bold rounded">
                            Tối thiểu {(voucher.min_order_amount / 1000).toFixed(0)}k
                        </span>
                    )}
                    {voucher.conditions?.slice(0, 1).map((c, i) => (
                        <span key={i} className={`px-2 py-1 ${color.badge} text-[9px] font-bold rounded`}>{c}</span>
                    ))}
                </div>
                <h5 className="text-sm font-bold line-clamp-1">{voucher.title}</h5>
                <div className="flex items-center justify-between">
                    <span className="text-[10px] text-muted-foreground font-medium italic">
                        {getExpiryLabel(voucher.end_date)}
                    </span>
                    <button
                        onClick={() => onCopy(voucher.code)}
                        className="text-xs font-black text-primary hover:underline uppercase flex items-center gap-1"
                    >
                        {isCopied ? (
                            <>
                                <span className="material-symbols-outlined text-xs">check_circle</span>
                                Đã sao chép
                            </>
                        ) : "Sao chép"}
                    </button>
                </div>
            </div>
        </div>
    );
};

const VoucherSkeleton = () => (
    <div className="bg-card rounded-2xl border border-border overflow-hidden flex shadow-sm animate-pulse">
        <div className="w-24 bg-muted border-r border-dashed border-border" />
        <div className="flex-1 p-5 space-y-3">
            <div className="h-4 bg-muted rounded w-3/4" />
            <div className="h-3 bg-muted rounded w-1/2" />
            <div className="h-3 bg-muted rounded w-2/3" />
        </div>
    </div>
);

// ─── Main content (exported for reuse) ───────────────────────────────────────

export const VoucherWalletContent = () => {
    const [vouchers, setVouchers] = useState<Voucher[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [activeTab, setActiveTab] = useState<FilterTab>("active");
    const [copied, setCopied] = useState<string | null>(null);

    const fetchVouchers = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);
            const res = await voucherService.getVouchers({ limit: 100 });
            setVouchers(res.data ?? []);
        } catch (err) {
            console.error("Failed to fetch vouchers:", err);
            setError("Không thể tải danh sách voucher. Vui lòng thử lại.");
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => { fetchVouchers(); }, [fetchVouchers]);

    const handleCopy = (code: string) => {
        navigator.clipboard.writeText(code).then(() => {
            setCopied(code);
            setTimeout(() => setCopied(null), 2000);
        });
    };

    const filtered = vouchers.filter((v) => {
        if (activeTab === "expired") return isExpired(v) || isExhausted(v);
        if (activeTab === "used") return isExhausted(v) && !isExpired(v);
        return !isExpired(v) && !isExhausted(v);
    });

    const tabs: { key: FilterTab; label: string }[] = [
        { key: "active", label: "Đang dùng" },
        { key: "used", label: "Đã hết" },
        { key: "expired", label: "Hết hạn" },
    ];

    const emptyIcon: Record<FilterTab, string> = {
        active: "confirmation_number",
        used: "receipt_long",
        expired: "event_busy",
    };

    return (
        <div className="space-y-12">
            {/* Points Balance & Tier Progress */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
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
                        <div className="relative pt-4">
                            <div className="flex justify-between text-xs font-bold mb-3">
                                <span className="text-primary uppercase">Vàng</span>
                                <span className="text-muted-foreground uppercase">Bạch kim</span>
                            </div>
                            <div className="h-4 bg-muted rounded-full overflow-visible relative">
                                <div className="h-full bg-primary rounded-full relative" style={{ width: "85%" }}>
                                    <div className="absolute -right-2 -top-1 size-6 bg-card border-4 border-primary rounded-full shadow-lg" />
                                </div>
                            </div>
                            <p className="mt-4 text-sm font-medium text-muted-foreground">
                                Kiếm thêm 50 điểm để mở khóa{" "}
                                <span className="text-foreground font-bold">Giảm giá 15% vĩnh viễn</span>
                            </p>
                            <Link to="/membership" className="mt-3 inline-flex items-center gap-1 text-sm font-bold text-primary hover:underline">
                                <span className="material-symbols-outlined text-base">info</span>
                                <span>Tìm hiểu quyền lợi thành viên</span>
                            </Link>
                        </div>
                    </div>
                    <div className="absolute -right-20 -top-20 w-80 h-80 bg-primary/5 rounded-full blur-3xl" />
                </div>

                <div className="bg-gradient-to-br from-orange-500 to-primary p-8 rounded-[24px] text-white flex flex-col justify-between relative overflow-hidden group shadow-xl shadow-primary/20">
                    <div className="relative z-10">
                        <span className="material-symbols-outlined text-4xl mb-4 opacity-80 group-hover:scale-110 transition-transform">celebration</span>
                        <h3 className="text-2xl font-bold leading-tight mb-2">Chia sẻ niềm vui</h3>
                        <p className="text-orange-100 text-sm leading-relaxed mb-6">
                            Giới thiệu bạn bè và cả hai đều nhận{" "}
                            <span className="font-bold text-white underline decoration-2 underline-offset-4">voucher 200.000đ</span>{" "}
                            cho đơn đầu tiên.
                        </p>
                    </div>
                    <button className="relative z-10 w-full py-3 bg-white text-primary font-bold rounded-xl hover:bg-orange-50 transition-colors shadow-lg">
                        Mời bạn bè
                    </button>
                    <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-2xl" />
                </div>
            </div>

            {/* Voucher Wallet — real data */}
            <div className="space-y-8">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-border pb-4">
                    <h3 className="text-2xl font-bold">Voucher của bạn</h3>
                    <div className="flex bg-muted p-1 rounded-xl">
                        {tabs.map((tab) => (
                            <button
                                key={tab.key}
                                onClick={() => setActiveTab(tab.key)}
                                className={`px-4 py-1.5 font-bold text-xs rounded-lg transition-all ${activeTab === tab.key
                                        ? "bg-card text-primary shadow-sm"
                                        : "text-muted-foreground"
                                    }`}
                            >
                                {tab.label}
                                {tab.key === "active" && !loading && vouchers.length > 0 && (
                                    <span className="ml-1.5 px-1.5 py-0.5 bg-primary/10 text-primary rounded-full text-[9px]">
                                        {vouchers.filter(v => !isExpired(v) && !isExhausted(v)).length}
                                    </span>
                                )}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Error */}
                {error && (
                    <div className="flex flex-col items-center justify-center py-12 text-center space-y-4">
                        <span className="material-symbols-outlined text-5xl text-destructive opacity-80">error</span>
                        <p className="text-sm font-medium text-muted-foreground">{error}</p>
                        <button
                            onClick={fetchVouchers}
                            className="px-4 py-2 text-xs font-bold text-primary border border-primary/20 rounded-xl hover:bg-primary/5 transition-colors"
                        >
                            Thử lại
                        </button>
                    </div>
                )}

                {/* Loading */}
                {loading && !error && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {Array.from({ length: 6 }).map((_, i) => <VoucherSkeleton key={i} />)}
                    </div>
                )}

                {/* Voucher grid */}
                {!loading && !error && filtered.length > 0 && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filtered.map((v) => (
                            <VoucherCard key={v._id} voucher={v} onCopy={handleCopy} copied={copied} />
                        ))}
                    </div>
                )}

                {/* Empty state */}
                {!loading && !error && filtered.length === 0 && (
                    <div className="flex flex-col items-center justify-center py-16 text-center space-y-3">
                        <span className="material-symbols-outlined text-6xl text-muted-foreground/40">
                            {emptyIcon[activeTab]}
                        </span>
                        <p className="text-lg font-bold text-muted-foreground">
                            {activeTab === "expired"
                                ? "Không có voucher đã hết hạn"
                                : activeTab === "used"
                                    ? "Không có voucher đã hết lượt"
                                    : "Không có voucher nào khả dụng"}
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
};

// ─── Page wrapper ─────────────────────────────────────────────────────────────

const VoucherWalletPage = () => {
    const { t } = useTranslation(["customer", "common"]);
    return (
        <div className="bg-background-light dark:bg-background-dark font-display text-[#1b140d] dark:text-gray-100 transition-colors duration-200 min-h-screen">
            <div className="relative flex h-auto min-h-screen w-full flex-col overflow-x-hidden">
                <div className="layout-container flex h-full grow flex-col">
                    <main className="flex flex-1 justify-center py-10 px-4">
                        <div className="layout-content-container flex flex-col max-w-[1400px] flex-1">
                            <div className="flex flex-col gap-2 p-4 mb-6">
                                <h1 className="text-[#1b140d] dark:text-white text-4xl font-black leading-tight tracking-[-0.033em]">
                                    {t("customer:voucherWallet.title")}
                                </h1>
                                <p className="text-[#9a734c] dark:text-gray-400 text-lg font-normal">
                                    {t("customer:voucherWallet.subtitle")}
                                </p>
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
