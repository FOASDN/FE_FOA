import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { CheckCircle, AlertTriangle, XCircle, Loader2 } from "lucide-react";
import orderService from "@/services/order.service";
import type { Order } from "@/services/order.service";
import { buildVariantChips } from "@/utils/cartVariants";

type OrderStatusFilter =
  | "all"
  | "pending"
  | "completed"
  | "cancelled"
  | "shipping";

interface Toast {
  id: number;
  type: "success" | "warning" | "error";
  message: string;
}

const OrderHistoryTabContent = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<OrderStatusFilter>("all");
  const [toasts, setToasts] = useState<Toast[]>([]);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        const res = await orderService.getMyOrders();
        setOrders(res.data);
      } catch (err) {
        console.error("Failed to fetch orders:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  const showToast = (type: Toast["type"], message: string) => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, type, message }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  };

  const filteredOrders = orders.filter((order) => {
    if (statusFilter === "all") return true;
    return order.status === statusFilter;
  });

  const handleCancelOrder = async (orderId: string) => {
    if (!window.confirm("Bạn có chắc muốn hủy đơn hàng này?")) return;
    try {
      await orderService.cancelOrder(orderId);
      showToast("success", "Đã hủy đơn hàng thành công");
      const res = await orderService.getMyOrders();
      setOrders(res.data);
    } catch (err) {
      showToast("error", "Không thể hủy đơn hàng này");
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "completed":
        return {
          label: "Hoàn thành",
          className: "bg-green-100 text-green-700",
        };
      case "shipping":
        return { label: "Đang giao", className: "bg-blue-100 text-blue-700" };
      case "confirmed":
        return { label: "Đã xác nhận", className: "bg-blue-50 text-blue-600" };
      case "cancelled":
        return { label: "Đã hủy", className: "bg-red-100 text-red-700" };
      case "pending":
      default:
        return { label: "Chờ xử lý", className: "bg-amber-100 text-amber-700" };
    }
  };

  const getImageUrl = (image: any) => {
    if (!image) return "";
    if (typeof image === "string") return image;
    return image.secure_url || image.url || "";
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-3">
        <Loader2 className="w-10 h-10 text-primary animate-spin" />
        <p className="text-gray-500 font-medium tracking-wide">
          Đang tải lịch sử đơn hàng...
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="fixed top-24 right-6 z-50 flex flex-col gap-3">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`flex items-center gap-3 px-5 py-3 rounded-xl shadow-lg border-l-4 bg-white animate-in slide-in-from-right-5 ${
              toast.type === "success"
                ? "border-green-500"
                : toast.type === "warning"
                  ? "border-orange-500"
                  : "border-red-500"
            }`}
          >
            {toast.type === "success" && (
              <CheckCircle className="w-5 h-5 text-green-500" />
            )}
            {toast.type === "warning" && (
              <AlertTriangle className="w-5 h-5 text-orange-500" />
            )}
            {toast.type === "error" && (
              <XCircle className="w-5 h-5 text-red-500" />
            )}
            <span className="text-sm font-semibold text-gray-800">
              {toast.message}
            </span>
          </div>
        ))}
      </div>

      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
        <div className="flex flex-col gap-1">
          <h1 className="text-4xl font-black leading-tight tracking-tight text-text-main dark:text-white">
            Lịch sử đơn hàng
          </h1>
          <p className="text-[#9a734c] text-base">
            Quản lý và theo dõi các đơn hàng ăn uống của bạn.
          </p>
        </div>
      </div>

      <div className="bg-white dark:bg-white/5 rounded-xl shadow-sm border border-gray-100 dark:border-white/10 p-2 mb-8 overflow-x-auto">
        <div className="flex gap-2 min-w-max">
          {(
            [
              "all",
              "pending",
              "shipping",
              "completed",
              "cancelled",
            ] as OrderStatusFilter[]
          ).map((tab) => (
            <button
              key={tab}
              onClick={() => setStatusFilter(tab)}
              className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${
                statusFilter === tab
                  ? "bg-primary text-white shadow-md shadow-primary/20"
                  : "bg-transparent text-[#9a734c] hover:bg-gray-50 dark:hover:bg-white/5"
              }`}
            >
              {tab === "all"
                ? "Tất cả"
                : tab === "pending"
                  ? "Chờ xử lý"
                  : tab === "shipping"
                    ? "Đang giao"
                    : tab === "completed"
                      ? "Hoàn thành"
                      : "Đã hủy"}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-6">
        {filteredOrders.length === 0 ? (
          <div className="text-center py-20 bg-white dark:bg-white/5 rounded-2xl border border-dashed border-gray-200 dark:border-white/10">
            <p className="text-gray-500 font-medium">
              Bạn chưa có đơn hàng nào trong mục này.
            </p>
            <button
              onClick={() => navigate("/menu")}
              className="mt-4 text-primary font-bold hover:underline"
            >
              Đặt món ngay
            </button>
          </div>
        ) : (
          filteredOrders.map((order) => {
            const statusBadge = getStatusBadge(order.status);
            const firstItem = order.items[0];
            const variantChips = buildVariantChips(
              (firstItem as any)?.variations,
            );

            return (
              <div
                key={order._id}
                className="flex flex-col md:flex-row items-stretch rounded-xl bg-white dark:bg-white/5 shadow-sm hover:shadow-md border border-gray-100 dark:border-white/10 transition-all overflow-hidden"
              >
                <div
                  className="w-full md:w-48 bg-center bg-no-repeat aspect-video md:aspect-square bg-cover shrink-0 bg-gray-100"
                  style={{
                    backgroundImage: `url("${getImageUrl((firstItem.product_id as any)?.image)}")`,
                  }}
                />

                <div className="flex flex-1 flex-col justify-between p-6">
                  <div className="flex justify-between items-start gap-4">
                    <div className="min-w-0">
                      <h3 className="text-xl font-bold text-text-main dark:text-white mb-1">
                        {(firstItem as any).product_id?.name || "Sản phẩm"}
                        {order.items.length > 1 &&
                          ` + ${order.items.length - 1} món khác`}
                      </h3>

                      <div className="flex items-center gap-4 text-[#9a734c] text-sm mb-3 flex-wrap">
                        <span className="font-mono font-bold bg-gray-100 dark:bg-white/10 px-2 py-0.5 rounded text-primary">
                          #{order.code}
                        </span>
                        <span>
                          {new Date(order.createdAt).toLocaleDateString(
                            "vi-VN",
                          )}
                        </span>
                      </div>

                      <div className="flex flex-wrap gap-2 mb-3">
                        <span className="text-xs font-bold text-gray-500 bg-gray-100 dark:bg-white/10 px-2 py-1 rounded-md">
                          Số lượng: {firstItem.quantity}
                        </span>
                      </div>

                      {variantChips.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                          {variantChips.map((c) => (
                            <span
                              key={c.key}
                              className="inline-flex items-center gap-1 rounded-full px-2 py-1 bg-gray-100 dark:bg-white/10 text-text-main dark:text-white text-xs font-semibold"
                              title={
                                c.extra > 0
                                  ? `+${c.extra.toLocaleString("vi-VN")}đ`
                                  : undefined
                              }
                            >
                              {c.text}
                              {c.extra > 0 && (
                                <span className="text-[#9a734c] font-bold">
                                  +{c.extra.toLocaleString("vi-VN")}đx
                                </span>
                              )}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>

                    <span
                      className={`shrink-0 px-3 py-1 rounded-full text-xs font-bold uppercase ${statusBadge.className}`}
                    >
                      {statusBadge.label}
                    </span>
                  </div>

                  <div className="mt-4 pt-4 border-t border-gray-100 dark:border-white/10 flex flex-wrap items-center justify-between gap-4">
                    <div>
                      <p className="text-sm text-gray-500 mb-1">
                        Món đầu tiên:{" "}
                        {firstItem.sub_total.toLocaleString("vi-VN")}đ
                      </p>
                      <p className="text-primary text-xl font-black">
                        {order.total_price.toLocaleString("vi-VN")}đ
                      </p>
                      <p className="text-xs text-[#9a734c]">
                        {order.items.length} sản phẩm •{" "}
                        {(order.shipping_fee ?? 0) > 0
                          ? `Phí ship: ${order.shipping_fee.toLocaleString("vi-VN")}đ`
                          : "Miễn phí ship"}{" "}
                        •{" "}
                        {order.payment?.method === "cash_on_delivery"
                          ? "Tiền mặt"
                          : "Online"}
                      </p>
                    </div>

                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => navigate(`/order-detail/${order._id}`)}
                        className="px-4 py-2 rounded-lg bg-gray-100 dark:bg-white/10 text-text-main dark:text-white text-sm font-bold hover:bg-gray-200 transition-colors"
                      >
                        Chi tiết
                      </button>
                      {order.status === "pending" && (
                        <button
                          onClick={() => handleCancelOrder(order._id)}
                          className="px-4 py-2 rounded-lg border border-red-200 text-red-600 text-sm font-bold hover:bg-red-50 transition-colors"
                        >
                          Hủy đơn
                        </button>
                      )}
                      {order.status === "completed" && (
                        <button
                          onClick={() => navigate(`/rating/${order._id}`)}
                          className="px-4 py-2 rounded-lg bg-primary text-white text-sm font-bold hover:bg-primary/90 transition-colors"
                        >
                          Đánh giá
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </>
  );
};

export default OrderHistoryTabContent;
