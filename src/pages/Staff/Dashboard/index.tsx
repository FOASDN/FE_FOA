import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Clock,
  AlertTriangle,
  CheckCircle2,
  TrendingUp,
  Users as UsersIcon,
  Loader2,
} from "lucide-react";
import orderService from "@/services/order.service";

export default function StaffDashboard() {
  const navigate = useNavigate();
  const [stats, setStats] = useState([
    { label: "Chờ xử lý", value: 0, icon: Clock, color: "#ee8c2b" },
    { label: "Đang xử lý", value: 0, icon: TrendingUp, color: "#ee8c2b" },
    {
      label: "Hoàn thành hôm nay",
      value: 0,
      icon: CheckCircle2,
      color: "#10b981",
    },
    {
      label: "Nguy cơ cao",
      value: 0,
      icon: AlertTriangle,
      color: "#ef4444",
      bg: "bg-red-50",
    },
  ]);
  const [recentOrders, setRecentOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        const res = await orderService.getAllOrders();
        const allOrders = res.data;

        // Simple stats calculation
        const pending = allOrders.filter((o: any) => o.status === "pending");
        const processing = allOrders.filter(
          (o: any) => o.status === "confirmed" || o.status === "shipping",
        );
        const completed = allOrders.filter(
          (o: any) =>
            o.status === "completed" &&
            new Date(o.createdAt).toDateString() === new Date().toDateString(),
        );

        setStats([
          {
            label: "Chờ xử lý",
            value: pending.length,
            icon: Clock,
            color: "#ee8c2b",
          },
          {
            label: "Đang xử lý",
            value: processing.length,
            icon: TrendingUp,
            color: "#ee8c2b",
          },
          {
            label: "Hoàn thành hôm nay",
            value: completed.length,
            icon: CheckCircle2,
            color: "#10b981",
          },
          {
            label: "Nguy cơ cao",
            value: 0,
            icon: AlertTriangle,
            color: "#ef4444",
            bg: "bg-red-50",
          },
        ]);

        setRecentOrders(allOrders.slice(0, 5));
      } catch (err) {
        console.error("Failed to fetch dashboard data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-3">
        <Loader2 className="w-10 h-10 text-primary animate-spin" />
        <p className="text-gray-500 font-medium">
          Đang tải dữ liệu hệ thống...
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-[1400px] mx-auto">
      {/* Welcome */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8 p-6 bg-white rounded-2xl border-2 border-[#e7dbcf]">
        <div>
          <h1 className="text-[32px] font-extrabold text-[#1b140d] mb-2">
            Chào mừng đến Staff Portal! 👋
          </h1>
          <p className="text-base text-[#9a734c]">
            Quản lý đơn hàng với dữ liệu thời gian thực
          </p>
        </div>
        <button
          className="px-6 py-3 bg-[#ee8c2b] hover:bg-[#d97706] text-white rounded-xl font-bold text-[15px] transition-all duration-300 shrink-0"
          onClick={() => navigate("/staff/orders")}
        >
          Xem tất cả đơn hàng
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5 mb-8">
        {stats.map((stat, i) => (
          <div
            key={i}
            className={`flex items-center gap-5 p-6 rounded-2xl border border-[#e7dbcf] bg-white hover:border-[#ee8c2b] hover:shadow-[0_4px_16px_rgba(238,140,43,0.15)] transition-all duration-300 cursor-pointer ${stat.bg || ""}`}
            onClick={() => navigate("/staff/orders")}
          >
            <div
              className="w-14 h-14 flex items-center justify-center bg-white rounded-[14px] shadow-[0_4px_12px_rgba(0,0,0,0.1)]"
              style={{ color: stat.color }}
            >
              <stat.icon className="w-7 h-7" />
            </div>
            <div>
              <div className="text-4xl font-extrabold text-[#1b140d] leading-none mb-1.5">
                {stat.value}
              </div>
              <div className="text-sm font-semibold text-[#9a734c]">
                {stat.label}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Orders Table */}
      <div className="mb-8">
        <h2 className="flex items-center gap-3 text-[22px] font-bold text-[#1b140d] mb-5">
          <Clock className="w-6 h-6 text-[#ee8c2b]" />
          Đơn hàng gần đây
        </h2>
        <div className="bg-white rounded-2xl shadow-[0_4px_16px_rgba(0,0,0,0.08)] overflow-hidden">
          {/* Header */}
          <div className="hidden lg:grid grid-cols-[120px_1fr_100px_120px_150px] gap-4 px-5 py-4 bg-[#f3ede7] text-[13px] font-bold text-[#9a734c] uppercase tracking-wide">
            <div>Đơn hàng</div>
            <div>Khách hàng</div>
            <div>Món</div>
            <div>Trạng thái</div>
            <div>Thời gian</div>
          </div>
          {/* Rows */}
          {recentOrders.map((order) => (
            <div
              key={order._id}
              onClick={() => navigate(`/order-detail/${order._id}`)}
              className="grid grid-cols-2 lg:grid-cols-[120px_1fr_100px_120px_150px] gap-4 px-5 py-4 border-b border-[#e7dbcf] last:border-b-0 cursor-pointer hover:bg-[#f3ede7] transition-all items-center text-sm text-[#1b140d]"
            >
              <div className="font-bold">#{order.code}</div>
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                  {order.user_id?.username?.charAt(0) || "U"}
                </div>
                <span>{order.user_id?.username || "Khách vãng lai"}</span>
              </div>
              <div className="hidden lg:block">{order.items.length} món</div>
              <div>
                <span
                  className={`px-2.5 py-1 rounded-xl text-xs font-semibold ${
                    order.status === "pending"
                      ? "bg-amber-100 text-amber-700"
                      : order.status === "confirmed"
                        ? "bg-blue-100 text-blue-700"
                        : order.status === "shipping"
                          ? "bg-indigo-100 text-indigo-700"
                          : order.status === "completed"
                            ? "bg-green-100 text-green-700"
                            : "bg-red-100 text-red-700"
                  }`}
                >
                  {order.status === "pending"
                    ? "Chờ xử lý"
                    : order.status === "confirmed"
                      ? "Đã xác nhận"
                      : order.status === "shipping"
                        ? "Đang giao"
                        : order.status === "completed"
                          ? "Thành công"
                          : "Đã hủy"}
                </span>
              </div>
              <div className="hidden lg:block text-[#9a734c]">
                {new Date(order.createdAt).toLocaleTimeString("vi-VN", {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </div>
            </div>
          ))}
          {recentOrders.length === 0 && (
            <div className="p-10 text-center text-gray-400">
              Chưa có đơn hàng nào
            </div>
          )}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="mb-8">
        <h2 className="flex items-center gap-3 text-[22px] font-bold text-[#1b140d] mb-5">
          <UsersIcon className="w-6 h-6 text-[#ee8c2b]" />
          Truy cập nhanh
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <button
            className="flex flex-col items-center gap-3 p-6 bg-white border-2 border-[#e7dbcf] rounded-2xl hover:border-[#ee8c2b] hover:shadow-[0_4px_16px_rgba(238,140,43,0.15)] transition-all text-[15px] font-semibold text-[#1b140d]"
            onClick={() => navigate("/staff/orders")}
          >
            <Clock className="w-8 h-8 text-[#ee8c2b]" />
            <span>Xem danh sách đơn hàng</span>
          </button>
          <button
            className="flex flex-col items-center gap-3 p-6 bg-white border-2 border-[#e7dbcf] rounded-2xl hover:border-[#ee8c2b] hover:shadow-[0_4px_16px_rgba(238,140,43,0.15)] transition-all text-[15px] font-semibold text-[#1b140d]"
            onClick={() => navigate("/staff/customers")}
          >
            <UsersIcon className="w-8 h-8 text-[#ee8c2b]" />
            <span>Quản lý khách hàng</span>
          </button>
        </div>
      </div>
    </div>
  );
}
