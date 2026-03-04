import { useState, useEffect } from "react";
import { Search, Loader2 } from "lucide-react";
import orderService from "@/services/order.service";
import type { Order } from "@/services/order.service";

type StatusFilter = "all" | "pending" | "shipping" | "completed" | "cancelled";

export default function StaffOrders() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const params = statusFilter === "all" ? {} : { status: statusFilter };
      const res = await orderService.getAllOrders(params);
      setOrders(res.data);
    } catch (err) {
      console.error("Failed to fetch orders:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [statusFilter]);

  const handleUpdateStatus = async (
    orderId: string,
    status: Order["status"],
  ) => {
    try {
      await orderService.updateOrderStatus(orderId, status);
      fetchOrders();
    } catch (err) {
      alert("Không thể cập nhật trạng thái");
    }
  };

  const filteredOrders = orders.filter((order: Order) => {
    const matchesSearch =
      searchQuery === "" ||
      order.code?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.user_id?.username
        ?.toLowerCase()
        .includes(searchQuery.toLowerCase());
    return matchesSearch;
  });

  const statusBadge = (status: string) => {
    let cls = "bg-gray-100 text-gray-700";
    let label = status;

    if (status === "pending") {
      cls = "bg-amber-100 text-amber-700";
      label = "Chờ xử lý";
    } else if (status === "confirmed") {
      cls = "bg-blue-100 text-blue-700";
      label = "Đã xác nhận";
    } else if (status === "shipping") {
      cls = "bg-indigo-100 text-indigo-700";
      label = "Đang giao";
    } else if (status === "completed") {
      cls = "bg-green-100 text-green-700";
      label = "Hoàn thành";
    } else if (status === "cancelled") {
      cls = "bg-red-100 text-red-700";
      label = "Đã hủy";
    }

    return (
      <span className={`px-3 py-1 rounded-full text-xs font-bold ${cls}`}>
        {label}
      </span>
    );
  };

  return (
    <div className="max-w-[1400px] mx-auto p-4">
      <div className="mb-8">
        <h1 className="text-3xl font-black text-text-main dark:text-white mb-2">
          Quản lý đơn hàng (Nhân viên)
        </h1>
        <p className="text-[#9a734c]">Hệ thống xử lý đơn hàng thời gian thực</p>
      </div>

      {/* Search & Filters */}
      <div className="flex flex-col md:flex-row gap-4 mb-8">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#9a734c]" />
          <input
            type="text"
            placeholder="Tìm theo mã đơn hoặc tên khách..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full py-3 pl-12 pr-4 border border-gray-200 dark:border-white/10 rounded-xl focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
          />
        </div>
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-hide">
          {(
            [
              "all",
              "pending",
              "shipping",
              "completed",
              "cancelled",
            ] as StatusFilter[]
          ).map((f) => (
            <button
              key={f}
              onClick={() => setStatusFilter(f)}
              className={`px-4 py-2 rounded-xl text-sm font-bold whitespace-nowrap transition-all ${statusFilter === f ? "bg-primary text-white shadow-lg shadow-primary/20" : "bg-white dark:bg-white/5 border border-gray-100 dark:border-white/10 text-[#9a734c] hover:bg-gray-50"}`}
            >
              {f === "all"
                ? "Tất cả"
                : f === "pending"
                  ? "Chờ xử lý"
                  : f === "shipping"
                    ? "Đang giao"
                    : f === "completed"
                      ? "Thành công"
                      : "Đã hủy"}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 gap-3">
          <Loader2 className="w-10 h-10 text-primary animate-spin" />
          <p className="text-gray-500 font-medium">
            Đang cập nhật luồng đơn hàng...
          </p>
        </div>
      ) : filteredOrders.length === 0 ? (
        <div className="text-center py-20 bg-white dark:bg-white/5 rounded-2xl border border-dashed border-gray-200">
          <p className="text-gray-400">Không có đơn hàng nào.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredOrders.map((order) => (
            <div
              key={order._id}
              className="bg-white dark:bg-white/5 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-white/10 hover:shadow-md transition-all group"
            >
              <div className="flex justify-between items-start mb-4">
                <div>
                  <div className="text-lg font-black text-primary mb-1">
                    #{order.code}
                  </div>
                  <div className="text-xs text-[#9a734c]">
                    {new Date(order.createdAt).toLocaleString("vi-VN")}
                  </div>
                </div>
                {statusBadge(order.status)}
              </div>

              <div className="flex items-center gap-3 mb-4 p-3 bg-gray-50 dark:bg-white/5 rounded-xl">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                  {order.user_id?.username?.charAt(0) || "U"}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-bold text-text-main dark:text-white truncate">
                    {order.user_id?.username}
                  </div>
                  <div className="text-[11px] text-[#9a734c]">
                    {order.user_id?.phone || "Không có SĐT"}
                  </div>
                </div>
              </div>

              <div className="space-y-2 mb-4 max-h-32 overflow-y-auto pr-2 scrollbar-hide">
                {order.items.map((item: any, i: number) => (
                  <div
                    key={i}
                    className="flex justify-between text-xs text-[#6b5744] dark:text-gray-400"
                  >
                    <span className="truncate flex-1">
                      {item.product_id?.name || "Món ăn"}
                    </span>
                    <span className="font-bold ml-2">x{item.quantity}</span>
                  </div>
                ))}
              </div>

              <div className="space-y-1 mb-6 pt-4 border-t border-gray-100 dark:border-white/10">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-500">Phí giao hàng:</span>
                  <span className="font-semibold text-text-main dark:text-gray-300">
                    {(order.shipping_fee ?? 0) === 0
                      ? "Miễn phí"
                      : `${order.shipping_fee.toLocaleString("vi-VN")}đ`}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-bold text-[#9a734c]">
                    Tổng thanh toán:
                  </span>
                  <span className="text-lg font-black text-text-main dark:text-white">
                    {order.total_price.toLocaleString("vi-VN")}đ
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                {order.status === "pending" && (
                  <button
                    onClick={() => handleUpdateStatus(order._id, "confirmed")}
                    className="col-span-2 py-3 bg-primary text-white rounded-xl text-sm font-bold shadow-lg shadow-primary/20 hover:bg-primary/90 transition-all active:scale-95"
                  >
                    Xác nhận đơn
                  </button>
                )}
                {order.status === "confirmed" && (
                  <button
                    onClick={() => handleUpdateStatus(order._id, "shipping")}
                    className="col-span-2 py-3 bg-indigo-600 text-white rounded-xl text-sm font-bold shadow-lg shadow-indigo-200 hover:bg-indigo-700 transition-all active:scale-95"
                  >
                    Giao hàng
                  </button>
                )}
                {order.status === "shipping" && (
                  <button
                    onClick={() => handleUpdateStatus(order._id, "completed")}
                    className="col-span-2 py-3 bg-green-600 text-white rounded-xl text-sm font-bold shadow-lg shadow-green-200 hover:bg-green-700 transition-all active:scale-95"
                  >
                    Hoàn tất
                  </button>
                )}
                {order.status !== "completed" &&
                  order.status !== "cancelled" && (
                    <button
                      onClick={() => handleUpdateStatus(order._id, "cancelled")}
                      className="col-span-2 py-2 text-red-500 text-xs font-bold hover:bg-red-50 rounded-lg transition-colors"
                    >
                      Hủy đơn này
                    </button>
                  )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
