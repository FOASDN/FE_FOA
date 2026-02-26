import { useState } from "react";
import { clsx } from "clsx";

// Staff interface
interface StaffMember {
    id: string;
    name: string;
    email: string;
    phone: string;
    role: "admin" | "manager" | "chef" | "delivery" | "cashier";
    status: "active" | "inactive" | "on-leave";
    joinDate: string;
    lastActive: string;
    ordersHandled?: number;
    performance?: number; // 0-100
}

// Mock staff data
const STAFF_MOCK: StaffMember[] = [
    {
        id: "STAFF-001",
        name: "Nguyễn Văn Quản",
        email: "admin@foodorder.com",
        phone: "+84 901 234 567",
        role: "admin",
        status: "active",
        joinDate: "2023-01-15",
        lastActive: "2024-01-30T13:45:00",
        ordersHandled: 1250,
        performance: 98,
    },
    {
        id: "STAFF-002",
        name: "Trần Thị Hoa",
        email: "manager.hoa@foodorder.com",
        phone: "+84 912 345 678",
        role: "manager",
        status: "active",
        joinDate: "2023-03-20",
        lastActive: "2024-01-30T14:15:00",
        ordersHandled: 890,
        performance: 95,
    },
    {
        id: "STAFF-003",
        name: "Lê Văn Bếp",
        email: "chef.bep@foodorder.com",
        phone: "+84 923 456 789",
        role: "chef",
        status: "active",
        joinDate: "2023-02-10",
        lastActive: "2024-01-30T12:30:00",
        ordersHandled: 2340,
        performance: 92,
    },
    {
        id: "STAFF-004",
        name: "Phạm Thị Giao",
        email: "delivery.giao@foodorder.com",
        phone: "+84 934 567 890",
        role: "delivery",
        status: "active",
        joinDate: "2023-05-12",
        lastActive: "2024-01-30T11:20:00",
        ordersHandled: 1580,
        performance: 88,
    },
    {
        id: "STAFF-005",
        name: "Hoàng Văn Thu",
        email: "cashier.thu@foodorder.com",
        phone: "+84 945 678 901",
        role: "cashier",
        status: "on-leave",
        joinDate: "2023-07-01",
        lastActive: "2024-01-25T18:00:00",
        ordersHandled: 620,
        performance: 85,
    },
    {
        id: "STAFF-006",
        name: "Vũ Thị Bếp 2",
        email: "chef2@foodorder.com",
        phone: "+84 956 789 012",
        role: "chef",
        status: "inactive",
        joinDate: "2023-09-15",
        lastActive: "2024-01-15T10:00:00",
        ordersHandled: 450,
        performance: 75,
    },
];

const ROLE_FILTERS = [
    { id: "all", label: "Tất cả" },
    { id: "admin", label: "Quản trị viên" },
    { id: "manager", label: "Quản lý" },
    { id: "chef", label: "Đầu bếp" },
    { id: "delivery", label: "Giao hàng" },
    { id: "cashier", label: "Thu ngân" },
];

const AdminStaff = () => {
    const [searchQuery, setSearchQuery] = useState("");
    const [activeRoleFilter, setActiveRoleFilter] = useState("all");
    const [selectedStaff, setSelectedStaff] = useState<StaffMember | null>(null);

    // Calculate stats
    const totalStaff = STAFF_MOCK.length;
    const activeStaff = STAFF_MOCK.filter((s) => s.status === "active").length;
    const onLeaveStaff = STAFF_MOCK.filter((s) => s.status === "on-leave").length;
    const avgPerformance =
        STAFF_MOCK.reduce((sum, s) => sum + (s.performance || 0), 0) / totalStaff;

    // Filter staff
    const filteredStaff = STAFF_MOCK.filter((staff) => {
        const matchesSearch =
            searchQuery === "" ||
            staff.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            staff.email.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesRole =
            activeRoleFilter === "all" || staff.role === activeRoleFilter;
        return matchesSearch && matchesRole;
    });

    const getRoleBadge = (role: StaffMember["role"]) => {
        switch (role) {
            case "admin":
                return "bg-purple-100 text-purple-700 border-purple-200";
            case "manager":
                return "bg-blue-100 text-blue-700 border-blue-200";
            case "chef":
                return "bg-orange-100 text-orange-700 border-orange-200";
            case "delivery":
                return "bg-green-100 text-green-700 border-green-200";
            case "cashier":
                return "bg-pink-100 text-pink-700 border-pink-200";
        }
    };

    const getRoleLabel = (role: StaffMember["role"]) => {
        switch (role) {
            case "admin":
                return "Quản trị viên";
            case "manager":
                return "Quản lý";
            case "chef":
                return "Đầu bếp";
            case "delivery":
                return "Giao hàng";
            case "cashier":
                return "Thu ngân";
        }
    };

    const getRoleIcon = (role: StaffMember["role"]) => {
        switch (role) {
            case "admin":
                return "admin_panel_settings";
            case "manager":
                return "manage_accounts";
            case "chef":
                return "restaurant";
            case "delivery":
                return "delivery_dining";
            case "cashier":
                return "point_of_sale";
        }
    };

    const getStatusBadge = (status: StaffMember["status"]) => {
        switch (status) {
            case "active":
                return "bg-green-100 text-green-700";
            case "inactive":
                return "bg-gray-100 text-gray-600";
            case "on-leave":
                return "bg-amber-100 text-amber-700";
        }
    };

    const getStatusLabel = (status: StaffMember["status"]) => {
        switch (status) {
            case "active":
                return "Đang làm";
            case "inactive":
                return "Nghỉ việc";
            case "on-leave":
                return "Nghỉ phép";
        }
    };

    const getTimeAgo = (dateString: string) => {
        const date = new Date(dateString);
        const now = new Date();
        const diff = now.getTime() - date.getTime();
        const minutes = Math.floor(diff / 60000);
        const hours = Math.floor(minutes / 60);
        const days = Math.floor(hours / 24);

        if (minutes < 60) return `${minutes} phút trước`;
        if (hours < 24) return `${hours} giờ trước`;
        return `${days} ngày trước`;
    };

    return (
        <div className="max-w-7xl mx-auto w-full">
            {/* Header */}
            <div className="flex flex-wrap items-end justify-between gap-4 mb-6">
                <div>
                    <h2 className="text-3xl font-black tracking-tight text-[#1b140d]">
                        Quản lý nhân viên
                    </h2>
                    <p className="text-[#9a734c] mt-1">
                        Phân quyền, theo dõi hiệu suất và quản lý nhân sự.
                    </p>
                </div>
                <button
                    type="button"
                    className="flex items-center gap-2 px-6 py-3 bg-[#ee8c2b] text-white rounded-lg text-sm font-bold shadow-sm hover:bg-[#d87c24]"
                >
                    <span className="material-symbols-outlined text-xl">person_add</span>
                    Thêm nhân viên
                </button>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                <div className="bg-white border border-[#e7dbcf] rounded-xl p-6">
                    <div className="flex items-center justify-between mb-3">
                        <div className="p-2 bg-blue-100 rounded-lg">
                            <span className="material-symbols-outlined text-blue-600">
                                groups
                            </span>
                        </div>
                    </div>
                    <p className="text-sm font-medium text-[#9a734c] mb-1">
                        Tổng nhân viên
                    </p>
                    <h3 className="text-3xl font-bold text-[#1b140d]">{totalStaff}</h3>
                </div>

                <div className="bg-white border border-[#e7dbcf] rounded-xl p-6">
                    <div className="flex items-center justify-between mb-3">
                        <div className="p-2 bg-green-100 rounded-lg">
                            <span className="material-symbols-outlined text-green-600">
                                check_circle
                            </span>
                        </div>
                    </div>
                    <p className="text-sm font-medium text-[#9a734c] mb-1">
                        Đang làm việc
                    </p>
                    <h3 className="text-3xl font-bold text-green-600">{activeStaff}</h3>
                </div>

                <div className="bg-white border border-[#e7dbcf] rounded-xl p-6">
                    <div className="flex items-center justify-between mb-3">
                        <div className="p-2 bg-amber-100 rounded-lg">
                            <span className="material-symbols-outlined text-amber-600">
                                event_busy
                            </span>
                        </div>
                    </div>
                    <p className="text-sm font-medium text-[#9a734c] mb-1">Nghỉ phép</p>
                    <h3 className="text-3xl font-bold text-amber-600">{onLeaveStaff}</h3>
                </div>

                <div className="bg-white border border-[#e7dbcf] rounded-xl p-6">
                    <div className="flex items-center justify-between mb-3">
                        <div className="p-2 bg-[#ee8c2b]/10 rounded-lg">
                            <span className="material-symbols-outlined text-[#ee8c2b]">
                                trending_up
                            </span>
                        </div>
                    </div>
                    <p className="text-sm font-medium text-[#9a734c] mb-1">Hiệu suất TB</p>
                    <h3 className="text-3xl font-bold text-[#1b140d]">
                        {avgPerformance.toFixed(0)}%
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
                            placeholder="Tìm theo tên hoặc email..."
                            className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-[#f3ede7] border-none focus:ring-2 focus:ring-[#ee8c2b]/50 text-sm"
                        />
                    </div>

                    {/* Role filters */}
                    <div className="flex items-center gap-2 overflow-x-auto no-scrollbar">
                        {ROLE_FILTERS.map((filter) => (
                            <button
                                key={filter.id}
                                type="button"
                                onClick={() => setActiveRoleFilter(filter.id)}
                                className={clsx(
                                    "shrink-0 px-4 py-2 rounded-lg font-medium text-sm transition-colors",
                                    activeRoleFilter === filter.id
                                        ? "bg-[#ee8c2b] text-white"
                                        : "bg-[#f3ede7] text-[#1b140d] hover:bg-[#e7dbcf]"
                                )}
                            >
                                {filter.label}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Staff Table */}
            <div className="bg-white border border-[#e7dbcf] rounded-xl overflow-hidden shadow-sm">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-[#fcfaf8] border-b border-[#e7dbcf]">
                                <th className="px-6 py-4 text-xs font-bold uppercase text-[#9a734c] tracking-wider">
                                    Nhân viên
                                </th>
                                <th className="px-6 py-4 text-xs font-bold uppercase text-[#9a734c] tracking-wider">
                                    Liên hệ
                                </th>
                                <th className="px-6 py-4 text-xs font-bold uppercase text-[#9a734c] tracking-wider">
                                    Vai trò
                                </th>
                                <th className="px-6 py-4 text-xs font-bold uppercase text-[#9a734c] tracking-wider">
                                    Trạng thái
                                </th>
                                <th className="px-6 py-4 text-xs font-bold uppercase text-[#9a734c] tracking-wider text-right">
                                    Hiệu suất
                                </th>
                                <th className="px-6 py-4 text-xs font-bold uppercase text-[#9a734c] tracking-wider text-right">
                                    Đơn xử lý
                                </th>
                                <th className="px-6 py-4 text-xs font-bold uppercase text-[#9a734c] tracking-wider text-right">
                                    Thao tác
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-[#e7dbcf]">
                            {filteredStaff.map((staff) => (
                                <tr
                                    key={staff.id}
                                    className="hover:bg-[#fcfaf8] transition-colors group cursor-pointer"
                                    onClick={() => setSelectedStaff(staff)}
                                >
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-full bg-[#ee8c2b]/20 flex items-center justify-center">
                                                <span className="material-symbols-outlined text-[#ee8c2b]">
                                                    {getRoleIcon(staff.role)}
                                                </span>
                                            </div>
                                            <div>
                                                <p className="text-sm font-bold text-[#1b140d]">
                                                    {staff.name}
                                                </p>
                                                <p className="text-xs text-[#9a734c]">
                                                    {getTimeAgo(staff.lastActive)}
                                                </p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <p className="text-sm text-[#1b140d]">{staff.email}</p>
                                        <p className="text-xs text-[#9a734c]">{staff.phone}</p>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span
                                            className={clsx(
                                                "inline-flex items-center px-2.5 py-1 rounded-md text-xs font-bold border",
                                                getRoleBadge(staff.role)
                                            )}
                                        >
                                            {getRoleLabel(staff.role)}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span
                                            className={clsx(
                                                "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold",
                                                getStatusBadge(staff.status)
                                            )}
                                        >
                                            <span
                                                className={clsx(
                                                    "w-2 h-2 rounded-full",
                                                    staff.status === "active"
                                                        ? "bg-green-600"
                                                        : staff.status === "on-leave"
                                                            ? "bg-amber-600"
                                                            : "bg-gray-600"
                                                )}
                                            />
                                            {getStatusLabel(staff.status)}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            <div className="w-24 h-2 bg-[#f3ede7] rounded-full overflow-hidden">
                                                <div
                                                    className="h-full bg-[#ee8c2b] rounded-full"
                                                    style={{ width: `${staff.performance || 0}%` }}
                                                />
                                            </div>
                                            <span className="text-sm font-bold text-[#1b140d] w-10">
                                                {staff.performance || 0}%
                                            </span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <span className="text-sm font-bold text-[#1b140d]">
                                            {staff.ordersHandled || 0}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button
                                                type="button"
                                                className="p-1.5 text-[#9a734c] hover:text-blue-600 hover:bg-blue-50 rounded transition-colors"
                                                title="Chỉnh sửa"
                                                onClick={(e) => e.stopPropagation()}
                                            >
                                                <span className="material-symbols-outlined text-xl">
                                                    edit
                                                </span>
                                            </button>
                                            <button
                                                type="button"
                                                className="p-1.5 text-[#9a734c] hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                                                title="Xóa"
                                                onClick={(e) => e.stopPropagation()}
                                            >
                                                <span className="material-symbols-outlined text-xl">
                                                    delete
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
                {filteredStaff.length === 0 && (
                    <div className="flex flex-col items-center justify-center py-16">
                        <div className="w-24 h-24 rounded-full bg-[#f3ede7] flex items-center justify-center mb-4">
                            <span className="material-symbols-outlined text-5xl text-[#9a734c]">
                                person_off
                            </span>
                        </div>
                        <h3 className="text-lg font-bold text-[#1b140d] mb-2">
                            Không tìm thấy nhân viên
                        </h3>
                        <p className="text-sm text-[#9a734c]">
                            Thử thay đổi bộ lọc hoặc từ khóa tìm kiếm
                        </p>
                    </div>
                )}
            </div>

            {/* Staff Detail Modal */}
            {selectedStaff && (
                <div
                    className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
                    onClick={() => setSelectedStaff(null)}
                >
                    <div
                        className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Modal Header */}
                        <div className="sticky top-0 bg-white border-b border-[#e7dbcf] px-8 py-6 flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <div className="w-16 h-16 rounded-full bg-[#ee8c2b]/20 flex items-center justify-center">
                                    <span className="material-symbols-outlined text-[#ee8c2b] text-3xl">
                                        {getRoleIcon(selectedStaff.role)}
                                    </span>
                                </div>
                                <div>
                                    <h3 className="text-2xl font-bold text-[#1b140d]">
                                        {selectedStaff.name}
                                    </h3>
                                    <p className="text-sm text-[#9a734c]">{selectedStaff.id}</p>
                                </div>
                            </div>
                            <button
                                type="button"
                                onClick={() => setSelectedStaff(null)}
                                className="p-2 hover:bg-[#f3ede7] rounded-lg transition-colors"
                            >
                                <span className="material-symbols-outlined">close</span>
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
                                            {selectedStaff.email}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-xs font-medium text-[#9a734c] mb-1">
                                            Điện thoại
                                        </p>
                                        <p className="text-sm text-[#1b140d]">
                                            {selectedStaff.phone}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-xs font-medium text-[#9a734c] mb-1">
                                            Vai trò
                                        </p>
                                        <span
                                            className={clsx(
                                                "inline-flex items-center px-2.5 py-1 rounded-md text-xs font-bold border",
                                                getRoleBadge(selectedStaff.role)
                                            )}
                                        >
                                            {getRoleLabel(selectedStaff.role)}
                                        </span>
                                    </div>
                                    <div>
                                        <p className="text-xs font-medium text-[#9a734c] mb-1">
                                            Ngày tham gia
                                        </p>
                                        <p className="text-sm text-[#1b140d]">
                                            {new Date(selectedStaff.joinDate).toLocaleDateString(
                                                "vi-VN"
                                            )}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Stats */}
                            <div>
                                <h4 className="text-lg font-bold text-[#1b140d] mb-4">
                                    Hiệu suất
                                </h4>
                                <div className="grid grid-cols-3 gap-4">
                                    <div className="bg-[#f3ede7] rounded-lg p-4 text-center">
                                        <p className="text-2xl font-bold text-[#1b140d]">
                                            {selectedStaff.ordersHandled || 0}
                                        </p>
                                        <p className="text-xs text-[#9a734c] mt-1">
                                            Đơn đã xử lý
                                        </p>
                                    </div>
                                    <div className="bg-[#ee8c2b]/10 rounded-lg p-4 text-center border border-[#ee8c2b]/20">
                                        <p className="text-2xl font-bold text-[#ee8c2b]">
                                            {selectedStaff.performance || 0}%
                                        </p>
                                        <p className="text-xs text-[#9a734c] mt-1">Hiệu suất</p>
                                    </div>
                                    <div className="bg-[#f3ede7] rounded-lg p-4 text-center">
                                        <p className="text-2xl font-bold text-[#1b140d]">
                                            {Math.floor(
                                                (new Date().getTime() -
                                                    new Date(selectedStaff.joinDate).getTime()) /
                                                (1000 * 60 * 60 * 24 * 30)
                                            )}
                                        </p>
                                        <p className="text-xs text-[#9a734c] mt-1">Tháng làm việc</p>
                                    </div>
                                </div>
                            </div>

                            {/* Actions */}
                            <div className="flex gap-3 pt-4 border-t border-[#e7dbcf]">
                                <button
                                    type="button"
                                    className="flex-1 px-4 py-3 bg-[#ee8c2b] text-white rounded-lg font-bold hover:bg-[#d87c24]"
                                >
                                    Chỉnh sửa thông tin
                                </button>
                                <button
                                    type="button"
                                    className="px-4 py-3 border border-[#e7dbcf] rounded-lg font-bold text-[#1b140d] hover:bg-[#f3ede7]"
                                >
                                    Đổi vai trò
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminStaff;
