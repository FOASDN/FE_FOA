import { useState } from "react";
import { clsx } from "clsx";

// Customer interface
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
}

// Mock customer data
const CUSTOMERS_MOCK: Customer[] = [
    {
        id: "CUST-001",
        name: "Nguyễn Văn A",
        email: "nguyenvana@gmail.com",
        phone: "+84 912 345 678",
        joinDate: "2023-01-15",
        totalOrders: 48,
        totalSpent: 12450000,
        loyaltyPoints: 1250,
        status: "vip",
        lastOrderDate: "2024-01-29",
    },
    {
        id: "CUST-002",
        name: "Trần Thị B",
        email: "tranthib@gmail.com",
        phone: "+84 908 765 432",
        joinDate: "2023-03-22",
        totalOrders: 32,
        totalSpent: 8960000,
        loyaltyPoints: 890,
        status: "active",
        lastOrderDate: "2024-01-28",
    },
    {
        id: "CUST-003",
        name: "Lê Văn C",
        email: "levanc@gmail.com",
        phone: "+84 935 123 456",
        joinDate: "2023-06-10",
        totalOrders: 15,
        totalSpent: 3280000,
        loyaltyPoints: 320,
        status: "active",
        lastOrderDate: "2024-01-25",
    },
    {
        id: "CUST-004",
        name: "Phạm Thị D",
        email: "phamthid@gmail.com",
        phone: "+84 901 234 567",
        joinDate: "2022-12-05",
        totalOrders: 72,
        totalSpent: 18900000,
        loyaltyPoints: 1890,
        status: "vip",
        lastOrderDate: "2024-01-30",
    },
    {
        id: "CUST-005",
        name: "Hoàng Văn E",
        email: "hoangvane@gmail.com",
        phone: "+84 945 678 901",
        joinDate: "2023-08-18",
        totalOrders: 5,
        totalSpent: 980000,
        loyaltyPoints: 98,
        status: "inactive",
        lastOrderDate: "2023-12-10",
    },
];

const SEGMENT_CHIPS = [
    { id: "all", label: "Tất cả", count: 5 },
    { id: "vip", label: "VIP", count: 2 },
    { id: "active", label: "Hoạt động", count: 2 },
    { id: "inactive", label: "Không hoạt động", count: 1 },
];

const AdminCustomers = () => {
    const [activeSegment, setActiveSegment] = useState("all");
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(
        null
    );

    // Calculate stats
    const totalCustomers = CUSTOMERS_MOCK.length;
    const vipCustomers = CUSTOMERS_MOCK.filter((c) => c.status === "vip").length;
    const totalRevenue = CUSTOMERS_MOCK.reduce((sum, c) => sum + c.totalSpent, 0);
    const avgOrderValue = totalRevenue / CUSTOMERS_MOCK.reduce((sum, c) => sum + c.totalOrders, 0);

    // Filter customers
    const filteredCustomers = CUSTOMERS_MOCK.filter((customer) => {
        const matchesSegment =
            activeSegment === "all" || customer.status === activeSegment;
        const matchesSearch =
            searchQuery === "" ||
            customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            customer.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
            customer.phone.includes(searchQuery);
        return matchesSegment && matchesSearch;
    });

    const getStatusBadge = (status: Customer["status"]) => {
        switch (status) {
            case "vip":
                return "bg-purple-100 text-purple-700 border-purple-200";
            case "active":
                return "bg-green-100 text-green-700 border-green-200";
            case "inactive":
                return "bg-gray-100 text-gray-600 border-gray-200";
        }
    };

    const getStatusLabel = (status: Customer["status"]) => {
        switch (status) {
            case "vip":
                return "VIP";
            case "active":
                return "Hoạt động";
            case "inactive":
                return "Không hoạt động";
        }
    };

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
                            <span className="material-symbols-outlined text-blue-600">
                                group
                            </span>
                        </div>
                        <span className="text-xs font-bold text-green-600">+12.5%</span>
                    </div>
                    <p className="text-sm font-medium text-[#9a734c] mb-1">
                        Tổng khách hàng
                    </p>
                    <h3 className="text-3xl font-bold text-[#1b140d]">{totalCustomers}</h3>
                </div>

                <div className="bg-white border border-[#e7dbcf] rounded-xl p-6">
                    <div className="flex items-center justify-between mb-3">
                        <div className="p-2 bg-purple-100 rounded-lg">
                            <span className="material-symbols-outlined text-purple-600">
                                workspace_premium
                            </span>
                        </div>
                    </div>
                    <p className="text-sm font-medium text-[#9a734c] mb-1">
                        Khách hàng VIP
                    </p>
                    <h3 className="text-3xl font-bold text-[#1b140d]">{vipCustomers}</h3>
                </div>

                <div className="bg-white border border-[#e7dbcf] rounded-xl p-6">
                    <div className="flex items-center justify-between mb-3">
                        <div className="p-2 bg-[#ee8c2b]/10 rounded-lg">
                            <span className="material-symbols-outlined text-[#ee8c2b]">
                                payments
                            </span>
                        </div>
                        <span className="text-xs font-bold text-green-600">+8.2%</span>
                    </div>
                    <p className="text-sm font-medium text-[#9a734c] mb-1">
                        Tổng doanh thu
                    </p>
                    <h3 className="text-2xl font-bold text-[#1b140d]">
                        {totalRevenue.toLocaleString("vi-VN")}₫
                    </h3>
                </div>

                <div className="bg-white border border-[#e7dbcf] rounded-xl p-6">
                    <div className="flex items-center justify-between mb-3">
                        <div className="p-2 bg-green-100 rounded-lg">
                            <span className="material-symbols-outlined text-green-600">
                                shopping_cart
                            </span>
                        </div>
                    </div>
                    <p className="text-sm font-medium text-[#9a734c] mb-1">
                        Giá trị TB/đơn
                    </p>
                    <h3 className="text-2xl font-bold text-[#1b140d]">
                        {avgOrderValue.toLocaleString("vi-VN", { maximumFractionDigits: 0 })}₫
                    </h3>
                </div>
            </div>

            {/* Search & Filters */}
            <div className="bg-white border border-[#e7dbcf] rounded-xl p-4 mb-6">
                <div className="flex flex-col md:flex-row gap-4">
                    {/* Search */}
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

                    {/* Segment chips */}
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
                                {chip.label} ({chip.count})
                            </button>
                        ))}
                    </div>

                    {/* Export button */}
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
                            {filteredCustomers.map((customer) => (
                                <tr
                                    key={customer.id}
                                    className="hover:bg-[#fcfaf8] transition-colors group cursor-pointer"
                                    onClick={() => setSelectedCustomer(customer)}
                                >
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-full bg-[#ee8c2b]/20 flex items-center justify-center text-[#ee8c2b] font-bold text-sm">
                                                {customer.name.charAt(0)}
                                            </div>
                                            <div>
                                                <p className="text-sm font-bold text-[#1b140d]">
                                                    {customer.name}
                                                </p>
                                                <p className="text-xs text-[#9a734c]">{customer.id}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <p className="text-sm text-[#1b140d]">{customer.email}</p>
                                        <p className="text-xs text-[#9a734c]">{customer.phone}</p>
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
                                            <span className="material-symbols-outlined text-base">
                                                stars
                                            </span>
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
                                                <span className="material-symbols-outlined text-xl">
                                                    visibility
                                                </span>
                                            </button>
                                            <button
                                                type="button"
                                                className="p-1.5 text-[#9a734c] hover:text-blue-600 hover:bg-blue-50 rounded transition-colors"
                                                title="Gửi thông báo"
                                                onClick={(e) => e.stopPropagation()}
                                            >
                                                <span className="material-symbols-outlined text-xl">
                                                    mail
                                                </span>
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Empty state */}
                {filteredCustomers.length === 0 && (
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
                                <div className="w-16 h-16 rounded-full bg-[#ee8c2b]/20 flex items-center justify-center text-[#ee8c2b] font-bold text-2xl">
                                    {selectedCustomer.name.charAt(0)}
                                </div>
                                <div>
                                    <h3 className="text-2xl font-bold text-[#1b140d]">
                                        {selectedCustomer.name}
                                    </h3>
                                    <p className="text-sm text-[#9a734c]">{selectedCustomer.id}</p>
                                </div>
                            </div>
                            <button
                                type="button"
                                onClick={() => setSelectedCustomer(null)}
                                className="p-2 hover:bg-[#f3ede7] rounded-lg transition-colors"
                            >
                                <span className="material-symbols-outlined text-[#1b140d]">
                                    close
                                </span>
                            </button>
                        </div>

                        {/* Modal Content */}
                        <div className="p-8 space-y-6">
                            {/* Contact Info */}
                            <div>
                                <h4 className="text-lg font-bold text-[#1b140d] mb-4">
                                    Thông tin liên hệ
                                </h4>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <p className="text-xs font-medium text-[#9a734c] mb-1">
                                            Email
                                        </p>
                                        <p className="text-sm text-[#1b140d]">
                                            {selectedCustomer.email}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-xs font-medium text-[#9a734c] mb-1">
                                            Số điện thoại
                                        </p>
                                        <p className="text-sm text-[#1b140d]">
                                            {selectedCustomer.phone}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-xs font-medium text-[#9a734c] mb-1">
                                            Ngày tham gia
                                        </p>
                                        <p className="text-sm text-[#1b140d]">
                                            {new Date(selectedCustomer.joinDate).toLocaleDateString(
                                                "vi-VN"
                                            )}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-xs font-medium text-[#9a734c] mb-1">
                                            Đơn hàng gần nhất
                                        </p>
                                        <p className="text-sm text-[#1b140d]">
                                            {new Date(
                                                selectedCustomer.lastOrderDate
                                            ).toLocaleDateString("vi-VN")}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Stats */}
                            <div>
                                <h4 className="text-lg font-bold text-[#1b140d] mb-4">
                                    Thống kê
                                </h4>
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
