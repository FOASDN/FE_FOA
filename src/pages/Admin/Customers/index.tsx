import { useState, useEffect } from "react";
import { clsx } from "clsx";
import apiClient from "@/lib/api-client";

// ============================================================
// TYPES – map the shape returned by GET /api/admin/customers
// ============================================================
interface CustomerAPI {
    _id: string;
    fullName?: string;
    name?: string;
    email: string;
    phone?: string;
    phoneNumber?: string;
    avatar?: string;
    createdAt?: string;
    joinDate?: string;
    totalOrders?: number;
    totalSpent?: number;
    loyaltyPoints?: number;
    status?: string;
    isActive?: boolean;
    lastOrderDate?: string;
    role?: string;
}

interface Customer {
    id: string;
    name: string;
    email: string;
    phone: string;
    avatar?: string;
    joinDate: string;
    totalOrders: number;
    totalSpent: number;
    loyaltyPoints: number;
    status: "active" | "inactive" | "vip";
    lastOrderDate: string;
    role?: string;
}

interface ApiResponse {
    success?: boolean;
    data?: CustomerAPI[] | { customers?: CustomerAPI[]; users?: CustomerAPI[] };
    customers?: CustomerAPI[];
    users?: CustomerAPI[];
    total?: number;
    totalPages?: number;
    page?: number;
}

// ============================================================
// HELPERS
// ============================================================
const normalizeStatus = (raw?: string | boolean): Customer["status"] => {
    if (raw === "vip") return "vip";
    if (raw === false || raw === "inactive" || raw === "blocked") return "inactive";
    return "active";
};

const normalizeCustomer = (c: CustomerAPI): Customer => ({
    id: c._id,
    name: c.fullName ?? c.name ?? "—",
    email: c.email ?? "—",
    phone: c.phone ?? c.phoneNumber ?? "—",
    avatar: c.avatar,
    joinDate: c.createdAt ?? c.joinDate ?? new Date().toISOString(),
    totalOrders: c.totalOrders ?? 0,
    totalSpent: c.totalSpent ?? 0,
    loyaltyPoints: c.loyaltyPoints ?? 0,
    status: normalizeStatus(c.status ?? c.isActive),
    lastOrderDate: c.lastOrderDate ?? c.createdAt ?? new Date().toISOString(),
    role: c.role,
});

const getStatusBadge = (status: Customer["status"]) => {
    switch (status) {
        case "vip":
            return "bg-purple-100 text-purple-700 border-purple-200";
        case "active":
            return "bg-green-100 text-green-700 border-green-200";
        case "inactive":
            return "bg-gray-100 text-gray-500 border-gray-200";
    }
};

const getStatusLabel = (status: Customer["status"]) => {
    switch (status) {
        case "vip":
            return "VIP";
        case "active":
            return "Hoạt động";
        case "inactive":
            return "Không HĐ";
    }
};

const SEGMENT_CHIPS = [
    { id: "all", label: "Tất cả" },
    { id: "vip", label: "VIP" },
    { id: "active", label: "Hoạt động" },
    { id: "inactive", label: "Không HĐ" },
];

// ============================================================
// COMPONENT
// ============================================================
const AdminCustomers = () => {
    const [customers, setCustomers] = useState<Customer[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [activeSegment, setActiveSegment] = useState("all");
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [total, setTotal] = useState(0);
    const LIMIT = 10;

    // ----------------------------------------------------------
    // Fetch từ API
    // ----------------------------------------------------------
    useEffect(() => {
        const fetchCustomers = async () => {
            setLoading(true);
            setError(null);
            try {
                const res = await apiClient.get<ApiResponse>("/admin/customers", {
                    params: { page, limit: LIMIT },
                });
                const payload = res.data;

                // Xử lý nhiều dạng response khác nhau
                let raw: CustomerAPI[] = [];
                if (Array.isArray(payload.data)) {
                    raw = payload.data;
                } else if (payload.data && "customers" in payload.data && Array.isArray(payload.data.customers)) {
                    raw = payload.data.customers;
                } else if (payload.data && "users" in payload.data && Array.isArray(payload.data.users)) {
                    raw = payload.data.users;
                } else if (Array.isArray(payload.customers)) {
                    raw = payload.customers;
                } else if (Array.isArray(payload.users)) {
                    raw = payload.users;
                }

                setCustomers(raw.map(normalizeCustomer));
                setTotal(payload.total ?? raw.length);
                setTotalPages((payload.totalPages ?? Math.ceil((payload.total ?? raw.length) / LIMIT)) || 1);
            } catch (err: unknown) {
                console.error("Lỗi tải danh sách khách hàng:", err);
                setError("Không thể tải danh sách khách hàng. Vui lòng thử lại.");
            } finally {
                setLoading(false);
            }
        };

        fetchCustomers();
    }, [page]);

    // ----------------------------------------------------------
    // Derived stats
    // ----------------------------------------------------------
    const vipCustomers = customers.filter((c) => c.status === "vip").length;
    const totalRevenue = customers.reduce((s, c) => s + c.totalSpent, 0);
    const totalOrders = customers.reduce((s, c) => s + c.totalOrders, 0);
    const avgOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;

    // ----------------------------------------------------------
    // Filter (client-side trên trang hiện tại)
    // ----------------------------------------------------------
    const filtered = customers.filter((c) => {
        const matchSeg = activeSegment === "all" || c.status === activeSegment;
        const q = searchQuery.toLowerCase();
        const matchQ =
            !q ||
            c.name.toLowerCase().includes(q) ||
            c.email.toLowerCase().includes(q) ||
            c.phone.includes(q);
        return matchSeg && matchQ;
    });

    const segCounts: Record<string, number> = {
        all: customers.length,
        vip: customers.filter((c) => c.status === "vip").length,
        active: customers.filter((c) => c.status === "active").length,
        inactive: customers.filter((c) => c.status === "inactive").length,
    };

    // ----------------------------------------------------------
    // Render
    // ----------------------------------------------------------
    return (
        <div className="max-w-7xl mx-auto w-full">
            {/* Header */}
            <div className="flex flex-wrap items-end justify-between gap-4 mb-6">
                <div>
                    <h2 className="text-3xl font-black tracking-tight text-[#1b140d]">
                        Quản lý khách hàng
                    </h2>
                    <p className="text-[#9a734c] mt-1">
                        Theo dõi thông tin, lịch sử mua hàng và điểm thưởng.
                    </p>
                </div>
                <button
                    type="button"
                    className="flex items-center gap-2 px-6 py-3 bg-[#ee8c2b] text-white rounded-lg text-sm font-bold shadow-sm hover:bg-[#d87c24] transition-all"
                >
                    <span className="material-symbols-outlined text-xl">add</span>
                    Thêm khách hàng
                </button>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                <div className="bg-white border border-[#e7dbcf] rounded-xl p-6">
                    <div className="flex items-center justify-between mb-3">
                        <div className="p-2 bg-blue-100 rounded-lg">
                            <span className="material-symbols-outlined text-blue-600">group</span>
                        </div>
                    </div>
                    <p className="text-sm font-medium text-[#9a734c] mb-1">Tổng khách hàng</p>
                    <h3 className="text-3xl font-bold text-[#1b140d]">{loading ? "—" : total}</h3>
                </div>

                <div className="bg-white border border-[#e7dbcf] rounded-xl p-6">
                    <div className="flex items-center justify-between mb-3">
                        <div className="p-2 bg-purple-100 rounded-lg">
                            <span className="material-symbols-outlined text-purple-600">workspace_premium</span>
                        </div>
                    </div>
                    <p className="text-sm font-medium text-[#9a734c] mb-1">Khách hàng VIP</p>
                    <h3 className="text-3xl font-bold text-[#1b140d]">{loading ? "—" : vipCustomers}</h3>
                </div>

                <div className="bg-white border border-[#e7dbcf] rounded-xl p-6">
                    <div className="flex items-center justify-between mb-3">
                        <div className="p-2 bg-[#ee8c2b]/10 rounded-lg">
                            <span className="material-symbols-outlined text-[#ee8c2b]">payments</span>
                        </div>
                    </div>
                    <p className="text-sm font-medium text-[#9a734c] mb-1">Tổng chi tiêu (trang này)</p>
                    <h3 className="text-2xl font-bold text-[#1b140d]">
                        {loading ? "—" : totalRevenue.toLocaleString("vi-VN") + "₫"}
                    </h3>
                </div>

                <div className="bg-white border border-[#e7dbcf] rounded-xl p-6">
                    <div className="flex items-center justify-between mb-3">
                        <div className="p-2 bg-green-100 rounded-lg">
                            <span className="material-symbols-outlined text-green-600">shopping_cart</span>
                        </div>
                    </div>
                    <p className="text-sm font-medium text-[#9a734c] mb-1">Giá trị TB/đơn</p>
                    <h3 className="text-2xl font-bold text-[#1b140d]">
                        {loading ? "—" : avgOrderValue.toLocaleString("vi-VN", { maximumFractionDigits: 0 }) + "₫"}
                    </h3>
                </div>
            </div>

            {/* Search & Filters */}
            <div className="bg-white border border-[#e7dbcf] rounded-xl p-4 mb-6">
                <div className="flex flex-col md:flex-row gap-4">
                    <div className="relative flex-1">
                        <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[#9a734c]">
                            search
                        </span>
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Tìm theo tên, email hoặc số điện thoại..."
                            className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-[#f3ede7] border-none focus:ring-2 focus:ring-[#ee8c2b]/50 text-sm text-[#1b140d] placeholder:text-[#9a734c]"
                        />
                    </div>

                    <div className="flex items-center gap-2 overflow-x-auto">
                        {SEGMENT_CHIPS.map((chip) => (
                            <button
                                key={chip.id}
                                type="button"
                                onClick={() => setActiveSegment(chip.id)}
                                className={clsx(
                                    "shrink-0 px-4 py-2 rounded-lg font-medium text-sm transition-colors",
                                    activeSegment === chip.id
                                        ? "bg-[#ee8c2b] text-white"
                                        : "bg-[#f3ede7] text-[#1b140d] hover:bg-[#e7dbcf]"
                                )}
                            >
                                {chip.label}
                                {!loading && (
                                    <span className="ml-1.5 text-xs opacity-75">({segCounts[chip.id]})</span>
                                )}
                            </button>
                        ))}
                    </div>

                    <button
                        type="button"
                        className="shrink-0 flex items-center gap-2 px-4 py-2 border border-[#e7dbcf] rounded-lg text-sm font-medium text-[#1b140d] hover:bg-[#f3ede7] transition-colors"
                    >
                        <span className="material-symbols-outlined text-base">download</span>
                        Xuất dữ liệu
                    </button>
                </div>
            </div>

            {/* Customer Table */}
            <div className="bg-white border border-[#e7dbcf] rounded-xl overflow-hidden shadow-sm">

                {/* Loading skeleton */}
                {loading && (
                    <div className="p-8 flex flex-col gap-4 animate-pulse">
                        {[...Array(5)].map((_, i) => (
                            <div key={i} className="flex items-center gap-4">
                                <div className="w-10 h-10 rounded-full bg-[#f3ede7]" />
                                <div className="flex-1 space-y-2">
                                    <div className="h-3 bg-[#f3ede7] rounded w-1/4" />
                                    <div className="h-3 bg-[#f3ede7] rounded w-1/3" />
                                </div>
                                <div className="h-3 bg-[#f3ede7] rounded w-20" />
                                <div className="h-3 bg-[#f3ede7] rounded w-16" />
                            </div>
                        ))}
                    </div>
                )}

                {/* Error state */}
                {!loading && error && (
                    <div className="flex flex-col items-center justify-center py-16 text-center">
                        <div className="w-20 h-20 rounded-full bg-red-50 flex items-center justify-center mb-4">
                            <span className="material-symbols-outlined text-4xl text-red-400">error</span>
                        </div>
                        <h3 className="text-lg font-bold text-[#1b140d] mb-2">Lỗi tải dữ liệu</h3>
                        <p className="text-sm text-[#9a734c] mb-4">{error}</p>
                        <button
                            type="button"
                            onClick={() => setPage((p) => p)}
                            className="px-4 py-2 bg-[#ee8c2b] text-white text-sm font-bold rounded-lg hover:bg-[#d87c24] transition-colors"
                        >
                            Thử lại
                        </button>
                    </div>
                )}

                {/* Table */}
                {!loading && !error && (
                    <>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="bg-[#fcfaf8] border-b border-[#e7dbcf]">
                                        <th className="px-6 py-4 text-xs font-bold uppercase text-[#9a734c] tracking-wider">
                                            Khách hàng
                                        </th>
                                        <th className="px-6 py-4 text-xs font-bold uppercase text-[#9a734c] tracking-wider">
                                            Liên hệ
                                        </th>
                                        <th className="px-6 py-4 text-xs font-bold uppercase text-[#9a734c] tracking-wider">
                                            Ngày tham gia
                                        </th>
                                        <th className="px-6 py-4 text-xs font-bold uppercase text-[#9a734c] tracking-wider">
                                            Trạng thái
                                        </th>
                                        <th className="px-6 py-4 text-xs font-bold uppercase text-[#9a734c] tracking-wider text-right">
                                            Tổng đơn
                                        </th>
                                        <th className="px-6 py-4 text-xs font-bold uppercase text-[#9a734c] tracking-wider text-right">
                                            Tổng chi tiêu
                                        </th>
                                        <th className="px-6 py-4 text-xs font-bold uppercase text-[#9a734c] tracking-wider text-right">
                                            Điểm
                                        </th>
                                        <th className="px-6 py-4 text-xs font-bold uppercase text-[#9a734c] tracking-wider text-right">
                                            Thao tác
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-[#e7dbcf]">
                                    {filtered.map((customer) => (
                                        <tr
                                            key={customer.id}
                                            className="hover:bg-[#fcfaf8] transition-colors group cursor-pointer"
                                            onClick={() => setSelectedCustomer(customer)}
                                        >
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    {customer.avatar ? (
                                                        <img
                                                            src={customer.avatar}
                                                            alt={customer.name}
                                                            className="w-10 h-10 rounded-full object-cover"
                                                        />
                                                    ) : (
                                                        <div className="w-10 h-10 rounded-full bg-[#ee8c2b]/20 flex items-center justify-center text-[#ee8c2b] font-bold text-sm">
                                                            {customer.name.charAt(0).toUpperCase()}
                                                        </div>
                                                    )}
                                                    <div>
                                                        <p className="text-sm font-bold text-[#1b140d]">
                                                            {customer.name}
                                                        </p>
                                                        <p className="text-xs text-[#9a734c] font-mono">
                                                            {customer.id.slice(-8).toUpperCase()}
                                                        </p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <p className="text-sm text-[#1b140d]">{customer.email}</p>
                                                <p className="text-xs text-[#9a734c]">{customer.phone}</p>
                                            </td>
                                            <td className="px-6 py-4">
                                                <p className="text-sm text-[#1b140d]">
                                                    {new Date(customer.joinDate).toLocaleDateString("vi-VN")}
                                                </p>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span
                                                    className={clsx(
                                                        "inline-flex items-center px-2.5 py-1 rounded-md text-xs font-bold border",
                                                        getStatusBadge(customer.status)
                                                    )}
                                                >
                                                    {getStatusLabel(customer.status)}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <span className="text-sm font-bold text-[#1b140d]">
                                                    {customer.totalOrders}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <span className="text-sm font-bold text-[#1b140d]">
                                                    {customer.totalSpent.toLocaleString("vi-VN")}₫
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <span className="inline-flex items-center gap-1 text-sm font-bold text-[#ee8c2b]">
                                                    <span className="material-symbols-outlined text-base">stars</span>
                                                    {customer.loyaltyPoints}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                    <button
                                                        type="button"
                                                        className="p-1.5 text-[#9a734c] hover:text-[#ee8c2b] hover:bg-[#ee8c2b]/10 rounded transition-colors"
                                                        title="Xem chi tiết"
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            setSelectedCustomer(customer);
                                                        }}
                                                    >
                                                        <span className="material-symbols-outlined text-xl">visibility</span>
                                                    </button>
                                                    <button
                                                        type="button"
                                                        className="p-1.5 text-[#9a734c] hover:text-blue-600 hover:bg-blue-50 rounded transition-colors"
                                                        title="Gửi thông báo"
                                                        onClick={(e) => e.stopPropagation()}
                                                    >
                                                        <span className="material-symbols-outlined text-xl">mail</span>
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {/* Empty state */}
                        {filtered.length === 0 && (
                            <div className="flex flex-col items-center justify-center py-16 text-center">
                                <div className="w-24 h-24 rounded-full bg-[#f3ede7] flex items-center justify-center mb-4">
                                    <span className="material-symbols-outlined text-5xl text-[#9a734c]">
                                        search_off
                                    </span>
                                </div>
                                <h3 className="text-lg font-bold text-[#1b140d] mb-2">
                                    Không tìm thấy khách hàng
                                </h3>
                                <p className="text-sm text-[#9a734c]">
                                    Thử thay đổi bộ lọc hoặc từ khóa tìm kiếm
                                </p>
                            </div>
                        )}

                        {/* Pagination */}
                        <div className="p-4 flex items-center justify-between border-t border-[#e7dbcf] bg-[#fcfaf8]">
                            <p className="text-sm text-[#9a734c]">
                                Trang {page} / {totalPages} · {total} khách hàng
                            </p>
                            <div className="flex gap-2">
                                <button
                                    type="button"
                                    disabled={page <= 1}
                                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                                    className="px-3 py-1 rounded-lg border border-[#e7dbcf] text-sm font-medium text-[#1b140d] hover:bg-white transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                                >
                                    Trước
                                </button>
                                {[...Array(Math.min(totalPages, 5))].map((_, i) => {
                                    const p = i + 1;
                                    return (
                                        <button
                                            key={p}
                                            type="button"
                                            onClick={() => setPage(p)}
                                            className={clsx(
                                                "px-3 py-1 rounded-lg text-sm font-medium transition-colors",
                                                p === page
                                                    ? "bg-[#ee8c2b] text-white font-bold shadow-sm"
                                                    : "border border-[#e7dbcf] text-[#1b140d] hover:bg-white"
                                            )}
                                        >
                                            {p}
                                        </button>
                                    );
                                })}
                                <button
                                    type="button"
                                    disabled={page >= totalPages}
                                    onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                                    className="px-3 py-1 rounded-lg border border-[#e7dbcf] text-sm font-medium text-[#1b140d] hover:bg-white transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                                >
                                    Sau
                                </button>
                            </div>
                        </div>
                    </>
                )}
            </div>

            {/* Customer Detail Modal */}
            {selectedCustomer && (
                <div
                    className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
                    onClick={() => setSelectedCustomer(null)}
                >
                    <div
                        className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Modal Header */}
                        <div className="sticky top-0 bg-white border-b border-[#e7dbcf] px-8 py-6 flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                {selectedCustomer.avatar ? (
                                    <img
                                        src={selectedCustomer.avatar}
                                        alt={selectedCustomer.name}
                                        className="w-16 h-16 rounded-full object-cover"
                                    />
                                ) : (
                                    <div className="w-16 h-16 rounded-full bg-[#ee8c2b]/20 flex items-center justify-center text-[#ee8c2b] font-bold text-2xl">
                                        {selectedCustomer.name.charAt(0).toUpperCase()}
                                    </div>
                                )}
                                <div>
                                    <h3 className="text-2xl font-bold text-[#1b140d]">
                                        {selectedCustomer.name}
                                    </h3>
                                    <div className="flex items-center gap-2 mt-1">
                                        <p className="text-sm text-[#9a734c] font-mono">
                                            #{selectedCustomer.id.slice(-8).toUpperCase()}
                                        </p>
                                        <span
                                            className={clsx(
                                                "inline-flex items-center px-2 py-0.5 rounded text-xs font-bold border",
                                                getStatusBadge(selectedCustomer.status)
                                            )}
                                        >
                                            {getStatusLabel(selectedCustomer.status)}
                                        </span>
                                    </div>
                                </div>
                            </div>
                            <button
                                type="button"
                                onClick={() => setSelectedCustomer(null)}
                                className="p-2 hover:bg-[#f3ede7] rounded-lg transition-colors"
                            >
                                <span className="material-symbols-outlined text-[#1b140d]">close</span>
                            </button>
                        </div>

                        {/* Modal Content */}
                        <div className="p-8 space-y-6">
                            {/* Contact Info */}
                            <div>
                                <h4 className="text-lg font-bold text-[#1b140d] mb-4">Thông tin liên hệ</h4>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <p className="text-xs font-medium text-[#9a734c] mb-1">Email</p>
                                        <p className="text-sm text-[#1b140d]">{selectedCustomer.email}</p>
                                    </div>
                                    <div>
                                        <p className="text-xs font-medium text-[#9a734c] mb-1">Số điện thoại</p>
                                        <p className="text-sm text-[#1b140d]">{selectedCustomer.phone}</p>
                                    </div>
                                    <div>
                                        <p className="text-xs font-medium text-[#9a734c] mb-1">Ngày tham gia</p>
                                        <p className="text-sm text-[#1b140d]">
                                            {new Date(selectedCustomer.joinDate).toLocaleDateString("vi-VN")}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-xs font-medium text-[#9a734c] mb-1">Đơn hàng gần nhất</p>
                                        <p className="text-sm text-[#1b140d]">
                                            {new Date(selectedCustomer.lastOrderDate).toLocaleDateString("vi-VN")}
                                        </p>
                                    </div>
                                    {selectedCustomer.role && (
                                        <div>
                                            <p className="text-xs font-medium text-[#9a734c] mb-1">Vai trò</p>
                                            <p className="text-sm text-[#1b140d] capitalize">{selectedCustomer.role}</p>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Stats */}
                            <div>
                                <h4 className="text-lg font-bold text-[#1b140d] mb-4">Thống kê</h4>
                                <div className="grid grid-cols-3 gap-4">
                                    <div className="bg-[#f3ede7] rounded-lg p-4 text-center">
                                        <p className="text-2xl font-bold text-[#1b140d]">
                                            {selectedCustomer.totalOrders}
                                        </p>
                                        <p className="text-xs text-[#9a734c] mt-1">Tổng đơn hàng</p>
                                    </div>
                                    <div className="bg-[#f3ede7] rounded-lg p-4 text-center">
                                        <p className="text-xl font-bold text-[#1b140d]">
                                            {selectedCustomer.totalSpent.toLocaleString("vi-VN")}₫
                                        </p>
                                        <p className="text-xs text-[#9a734c] mt-1">Tổng chi tiêu</p>
                                    </div>
                                    <div className="bg-[#ee8c2b]/10 rounded-lg p-4 text-center border border-[#ee8c2b]/20">
                                        <p className="text-2xl font-bold text-[#ee8c2b]">
                                            {selectedCustomer.loyaltyPoints}
                                        </p>
                                        <p className="text-xs text-[#9a734c] mt-1">Điểm thưởng</p>
                                    </div>
                                </div>
                            </div>

                            {/* Full Customer ID */}
                            <div className="bg-[#f3ede7] rounded-lg p-3">
                                <p className="text-xs font-medium text-[#9a734c] mb-1">Customer ID</p>
                                <p className="text-xs text-[#1b140d] font-mono break-all">{selectedCustomer.id}</p>
                            </div>

                            {/* Actions */}
                            <div className="flex gap-3 pt-4 border-t border-[#e7dbcf]">
                                <button
                                    type="button"
                                    className="flex-1 px-4 py-3 bg-[#ee8c2b] text-white rounded-lg font-bold hover:bg-[#d87c24] transition-colors"
                                >
                                    Xem lịch sử đơn hàng
                                </button>
                                <button
                                    type="button"
                                    className="px-4 py-3 border border-[#e7dbcf] rounded-lg font-bold text-[#1b140d] hover:bg-[#f3ede7] transition-colors"
                                >
                                    Gửi thông báo
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminCustomers;
