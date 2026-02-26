import { useState } from "react";
import { clsx } from "clsx";

const SHIPPERS_MOCK = [
    { id: "1", name: "Nguyễn Văn A", phone: "0901234567", status: "active", currentOrders: 2, totalDeliveries: 156, rating: 4.8, avgTime: "28 phút", zone: "Quận 1" },
    { id: "2", name: "Trần Văn B", phone: "0912345678", status: "active", currentOrders: 1, totalDeliveries: 203, rating: 4.9, avgTime: "25 phút", zone: "Quận 3" },
    { id: "3", name: "Lê Thị C", phone: "0923456789", status: "offline", currentOrders: 0, totalDeliveries: 98, rating: 4.7, avgTime: "30 phút", zone: "Quận 2" },
    { id: "4", name: "Phạm Văn D", phone: "0934567890", status: "busy", currentOrders: 3, totalDeliveries: 187, rating: 4.6, avgTime: "32 phút", zone: "Quận 1" },
    { id: "5", name: "Hoàng Văn E", phone: "0945678901", status: "active", currentOrders: 1, totalDeliveries: 142, rating: 4.8, avgTime: "27 phút", zone: "Quận 5" },
];

const ACTIVE_DELIVERIES = [
    { id: "ORD-7721", shipper: "Nguyễn Văn A", customer: "Trần Thị B", address: "123 Nguyễn Huệ, Q1", status: "picking_up", estimatedTime: "15 phút", progress: 30 },
    { id: "ORD-7722", shipper: "Trần Văn B", customer: "Lê Văn C", address: "456 Lê Lợi, Q3", status: "delivering", estimatedTime: "8 phút", progress: 75 },
    { id: "ORD-7723", shipper: "Nguyễn Văn A", customer: "Phạm Thị D", address: "789 Hai Bà Trưng, Q1", status: "pending", estimatedTime: "25 phút", progress: 10 },
    { id: "ORD-7724", shipper: "Phạm Văn D", customer: "Hoàng Văn E", address: "321 Pasteur, Q1", status: "delivering", estimatedTime: "5 phút", progress: 90 },
    { id: "ORD-7725", shipper: "Phạm Văn D", customer: "Đặng Thị F", address: "654 Võ Văn Tần, Q3", status: "pending", estimatedTime: "30 phút", progress: 5 },
];

const STATUS_TABS = [
    { id: "all", label: "Tất cả", count: 5 },
    { id: "pending", label: "Chờ lấy hàng", count: 2 },
    { id: "picking_up", label: "Đang lấy", count: 1 },
    { id: "delivering", label: "Đang giao", count: 2 },
];

const AdminDelivery = () => {
    const [activeTab, setActiveTab] = useState("all");
    const [selectedShipper, setSelectedShipper] = useState<string | null>(null);

    const getStatusColor = (status: string) => {
        switch (status) {
            case "active":
                return "bg-green-100 text-green-700 border-green-200";
            case "busy":
                return "bg-amber-100 text-amber-700 border-amber-200";
            case "offline":
                return "bg-gray-100 text-gray-600 border-gray-200";
            default:
                return "bg-gray-100 text-gray-600";
        }
    };

    const getStatusLabel = (status: string) => {
        switch (status) {
            case "active":
                return "Sẵn sàng";
            case "busy":
                return "Đang bận";
            case "offline":
                return "Offline";
            default:
                return status;
        }
    };

    const getDeliveryStatusColor = (status: string) => {
        switch (status) {
            case "pending":
                return "bg-gray-100 text-gray-700";
            case "picking_up":
                return "bg-blue-100 text-blue-700";
            case "delivering":
                return "bg-[#ee8c2b]/20 text-[#ee8c2b]";
            case "delivered":
                return "bg-green-100 text-green-700";
            default:
                return "bg-gray-100 text-gray-600";
        }
    };

    const getDeliveryStatusLabel = (status: string) => {
        switch (status) {
            case "pending":
                return "Chờ lấy";
            case "picking_up":
                return "Đang lấy";
            case "delivering":
                return "Đang giao";
            case "delivered":
                return "Đã giao";
            default:
                return status;
        }
    };

    return (
        <div className="max-w-7xl mx-auto w-full">
            {/* Header */}
            <div className="flex flex-wrap items-end justify-between gap-4 mb-6">
                <div>
                    <h2 className="text-3xl font-black tracking-tight text-[#1b140d]">
                        Quản lý giao hàng
                    </h2>
                    <p className="text-[#9a734c] mt-1">
                        Theo dõi shipper và trạng thái giao hàng real-time.
                    </p>
                </div>
                <div className="flex gap-3">
                    <button
                        type="button"
                        className="flex items-center gap-2 px-4 py-2 bg-white border border-[#e7dbcf] rounded-lg text-sm font-semibold text-[#1b140d] hover:bg-[#f3ede7]"
                    >
                        <span className="material-symbols-outlined text-base">map</span>
                        Xem bản đồ
                    </button>
                    <button
                        type="button"
                        className="flex items-center gap-2 px-4 py-2 bg-[#ee8c2b] text-white rounded-lg text-sm font-bold shadow-sm hover:bg-[#d87c24]"
                    >
                        <span className="material-symbols-outlined text-base">person_add</span>
                        Thêm shipper
                    </button>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
                <div className="bg-white border border-[#e7dbcf] rounded-xl p-6">
                    <div className="flex items-center justify-between mb-3">
                        <div className="p-2 bg-green-100 rounded-lg">
                            <span className="material-symbols-outlined text-green-600">delivery_truck_speed</span>
                        </div>
                        <span className="text-2xl font-black text-green-600">3</span>
                    </div>
                    <p className="text-xs font-medium text-[#9a734c]">Đang giao hàng</p>
                    <p className="text-sm text-[#9a734c] mt-1">5 đơn đang xử lý</p>
                </div>

                <div className="bg-white border border-[#e7dbcf] rounded-xl p-6">
                    <div className="flex items-center justify-between mb-3">
                        <div className="p-2 bg-blue-100 rounded-lg">
                            <span className="material-symbols-outlined text-blue-600">group</span>
                        </div>
                        <span className="text-2xl font-black text-blue-600">3/5</span>
                    </div>
                    <p className="text-xs font-medium text-[#9a734c]">Shipper online</p>
                    <p className="text-sm text-[#9a734c] mt-1">60% khả dụng</p>
                </div>

                <div className="bg-white border border-[#e7dbcf] rounded-xl p-6">
                    <div className="flex items-center justify-between mb-3">
                        <div className="p-2 bg-[#ee8c2b]/10 rounded-lg">
                            <span className="material-symbols-outlined text-[#ee8c2b]">schedule</span>
                        </div>
                        <span className="text-2xl font-black text-[#1b140d]">28</span>
                    </div>
                    <p className="text-xs font-medium text-[#9a734c]">Thời gian TB</p>
                    <p className="text-sm text-[#9a734c] mt-1">phút/đơn hàng</p>
                </div>

                <div className="bg-white border border-[#e7dbcf] rounded-xl p-6">
                    <div className="flex items-center justify-between mb-3">
                        <div className="p-2 bg-amber-100 rounded-lg">
                            <span className="material-symbols-outlined text-amber-600">star</span>
                        </div>
                        <span className="text-2xl font-black text-amber-600">4.8</span>
                    </div>
                    <p className="text-xs font-medium text-[#9a734c]">Đánh giá TB</p>
                    <p className="text-sm text-[#9a734c] mt-1">Từ khách hàng</p>
                </div>
            </div>

            {/* Active Deliveries Section */}
            <div className="bg-white border border-[#e7dbcf] rounded-xl p-6 mb-6">
                <div className="flex items-center justify-between mb-6">
                    <h3 className="text-lg font-bold text-[#1b140d]">Đơn hàng đang giao</h3>
                    <div className="border-b border-[#e7dbcf]">
                        <div className="flex gap-6">
                            {STATUS_TABS.map((tab) => (
                                <button
                                    key={tab.id}
                                    type="button"
                                    onClick={() => setActiveTab(tab.id)}
                                    className={clsx(
                                        "pb-3 border-b-2 text-sm font-semibold whitespace-nowrap transition-colors",
                                        activeTab === tab.id
                                            ? "border-[#ee8c2b] text-[#ee8c2b]"
                                            : "border-transparent text-[#9a734c] hover:text-[#1b140d]"
                                    )}
                                >
                                    {tab.label} ({tab.count})
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="space-y-4">
                    {ACTIVE_DELIVERIES.map((delivery) => (
                        <div
                            key={delivery.id}
                            className="border border-[#e7dbcf] rounded-lg p-4 hover:shadow-md transition-shadow"
                        >
                            <div className="flex items-start justify-between gap-4 mb-3">
                                <div className="flex-1">
                                    <div className="flex items-center gap-2 mb-2">
                                        <span className="text-sm font-bold text-[#1b140d]">#{delivery.id}</span>
                                        <span className={clsx("px-2 py-0.5 rounded-full text-xs font-bold", getDeliveryStatusColor(delivery.status))}>
                                            {getDeliveryStatusLabel(delivery.status)}
                                        </span>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                                        <div>
                                            <p className="text-xs text-[#9a734c] mb-1">Shipper</p>
                                            <p className="font-semibold text-[#1b140d]">{delivery.shipper}</p>
                                        </div>
                                        <div>
                                            <p className="text-xs text-[#9a734c] mb-1">Khách hàng</p>
                                            <p className="font-semibold text-[#1b140d]">{delivery.customer}</p>
                                        </div>
                                        <div>
                                            <p className="text-xs text-[#9a734c] mb-1">Địa chỉ</p>
                                            <p className="font-semibold text-[#1b140d] truncate">{delivery.address}</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="text-xs text-[#9a734c] mb-1">Dự kiến</p>
                                    <p className="text-sm font-bold text-[#ee8c2b]">{delivery.estimatedTime}</p>
                                </div>
                            </div>

                            {/* Progress bar */}
                            <div className="space-y-1">
                                <div className="flex justify-between text-xs">
                                    <span className="text-[#9a734c]">Tiến độ</span>
                                    <span className="font-bold text-[#1b140d]">{delivery.progress}%</span>
                                </div>
                                <div className="w-full bg-[#f3ede7] h-2 rounded-full overflow-hidden">
                                    <div
                                        className="bg-[#ee8c2b] h-full rounded-full transition-all"
                                        style={{ width: `${delivery.progress}%` }}
                                    />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Shipper List */}
            <div className="bg-white border border-[#e7dbcf] rounded-xl overflow-hidden">
                <div className="p-6 border-b border-[#e7dbcf]">
                    <h3 className="text-lg font-bold text-[#1b140d]">Danh sách shipper</h3>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-[#fcfaf8] border-b border-[#e7dbcf]">
                                <th className="py-4 px-6 text-xs font-bold text-[#9a734c] uppercase tracking-wider">Tên</th>
                                <th className="py-4 px-6 text-xs font-bold text-[#9a734c] uppercase tracking-wider">Điện thoại</th>
                                <th className="py-4 px-6 text-xs font-bold text-[#9a734c] uppercase tracking-wider">Khu vực</th>
                                <th className="py-4 px-6 text-xs font-bold text-[#9a734c] uppercase tracking-wider text-center">Trạng thái</th>
                                <th className="py-4 px-6 text-xs font-bold text-[#9a734c] uppercase tracking-wider text-center">Đơn hiện tại</th>
                                <th className="py-4 px-6 text-xs font-bold text-[#9a734c] uppercase tracking-wider text-center">Tổng giao</th>
                                <th className="py-4 px-6 text-xs font-bold text-[#9a734c] uppercase tracking-wider text-center">Đánh giá</th>
                                <th className="py-4 px-6 text-xs font-bold text-[#9a734c] uppercase tracking-wider text-center">TG TB</th>
                                <th className="py-4 px-6 text-xs font-bold text-[#9a734c] uppercase tracking-wider text-right">Thao tác</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-[#e7dbcf]">
                            {SHIPPERS_MOCK.map((shipper) => (
                                <tr key={shipper.id} className="hover:bg-[#fcfaf8] transition-colors">
                                    <td className="py-4 px-6">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-full bg-[#ee8c2b]/20 flex items-center justify-center">
                                                <span className="text-[#ee8c2b] font-bold text-sm">
                                                    {shipper.name.charAt(0)}
                                                </span>
                                            </div>
                                            <span className="text-sm font-semibold text-[#1b140d]">{shipper.name}</span>
                                        </div>
                                    </td>
                                    <td className="py-4 px-6">
                                        <span className="text-sm text-[#9a734c]">{shipper.phone}</span>
                                    </td>
                                    <td className="py-4 px-6">
                                        <span className="text-sm text-[#1b140d] font-medium">{shipper.zone}</span>
                                    </td>
                                    <td className="py-4 px-6 text-center">
                                        <span className={clsx("inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold border", getStatusColor(shipper.status))}>
                                            {getStatusLabel(shipper.status)}
                                        </span>
                                    </td>
                                    <td className="py-4 px-6 text-center">
                                        <span className="text-sm font-bold text-[#1b140d]">{shipper.currentOrders}</span>
                                    </td>
                                    <td className="py-4 px-6 text-center">
                                        <span className="text-sm font-bold text-[#1b140d]">{shipper.totalDeliveries}</span>
                                    </td>
                                    <td className="py-4 px-6 text-center">
                                        <div className="flex items-center justify-center gap-1">
                                            <span className="material-symbols-outlined text-[#ee8c2b] text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                                            <span className="text-sm font-bold text-[#1b140d]">{shipper.rating}</span>
                                        </div>
                                    </td>
                                    <td className="py-4 px-6 text-center">
                                        <span className="text-sm text-[#9a734c]">{shipper.avgTime}</span>
                                    </td>
                                    <td className="py-4 px-6 text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            <button
                                                type="button"
                                                onClick={() => setSelectedShipper(shipper.id)}
                                                className="p-2 text-[#9a734c] hover:text-[#ee8c2b] hover:bg-[#ee8c2b]/10 rounded-lg transition-colors"
                                                title="Xem chi tiết"
                                            >
                                                <span className="material-symbols-outlined text-xl">visibility</span>
                                            </button>
                                            <button
                                                type="button"
                                                className="p-2 text-[#9a734c] hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                                title="Gọi điện"
                                            >
                                                <span className="material-symbols-outlined text-xl">call</span>
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Shipper Detail Modal Placeholder */}
            {selectedShipper && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-xl max-w-4xl w-full p-6 max-h-[90vh] overflow-y-auto">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-xl font-bold text-[#1b140d]">
                                Chi tiết shipper #{selectedShipper}
                            </h3>
                            <button
                                type="button"
                                onClick={() => setSelectedShipper(null)}
                                className="p-2 hover:bg-[#f3ede7] rounded-lg transition-colors"
                            >
                                <span className="material-symbols-outlined">close</span>
                            </button>
                        </div>
                        <div className="text-center py-12 text-[#9a734c]">
                            Chi tiết shipper, lịch sử giao hàng, performance metrics...
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminDelivery;
