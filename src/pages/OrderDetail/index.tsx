import { useState, useEffect } from "react";
import { useNavigate, Link, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
  Loader2,
  ArrowLeft,
  CheckCircle2,
  Clock,
  Package,
  MapPin,
  User,
  Phone,
  ReceiptText,
} from "lucide-react";
import orderService from "@/services/order.service";
import type { Order } from "@/services/order.service";
import { buildVariantChips } from "@/utils/cartVariants";
import { useAuth } from "@/hooks/useAuth";

const OrderDetailPage = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { t } = useTranslation(["customer", "common"]);
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { isStaff, isAdmin } = useAuth();
  const isStaffView = isStaff || isAdmin;

  useEffect(() => {
    const fetchOrderDetail = async () => {
      if (!id) return;
      try {
        setLoading(true);
        const res = await orderService.getOrderById(id);
        setOrder(res.data);
      } catch (err: any) {
        console.error("Failed to fetch order detail:", err);
        setError(
          err.response?.data?.message || "Không thể tải chi tiết đơn hàng",
        );
      } finally {
        setLoading(false);
      }
    };

    fetchOrderDetail();
  }, [id]);

  const getImageUrl = (image: any) => {
    if (!image) return "";
    if (typeof image === "string") return image;
    return image.secure_url || image.url || "";
  };

  const getStatusInfo = (status: string) => {
    switch (status) {
      case "completed":
        return {
          label: "Hoàn thành",
          color: "text-green-600",
          bg: "bg-green-50 dark:bg-green-900/20",
          icon: <CheckCircle2 className="w-5 h-5" />,
        };
      case "shipping":
        return {
          label: "Đang giao",
          color: "text-blue-600",
          bg: "bg-blue-50 dark:bg-blue-900/20",
          icon: <Package className="w-5 h-5" />,
        };
      case "confirmed":
        return {
          label: "Đã xác nhận",
          color: "text-primary",
          bg: "bg-primary/5",
          icon: <ReceiptText className="w-5 h-5" />,
        };
      case "cancelled":
        return {
          label: "Đã hủy",
          color: "text-red-600",
          bg: "bg-red-50 dark:bg-red-900/20",
          icon: <CheckCircle2 className="w-5 h-5" />,
        };
      case "pending":
      default:
        return {
          label: "Chờ xử lý",
          color: "text-amber-600",
          bg: "bg-amber-50 dark:bg-amber-900/20",
          icon: <Clock className="w-5 h-5" />,
        };
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen gap-4">
        <Loader2 className="w-12 h-12 text-primary animate-spin" />
        <p className="text-gray-500 font-bold">Đang tải chi tiết đơn hàng...</p>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen gap-6 p-6 text-center">
        <div className="w-20 h-20 rounded-full bg-red-50 flex items-center justify-center text-red-500">
          <ArrowLeft className="w-10 h-10" />
        </div>
        <div>
          <h2 className="text-2xl font-black text-gray-900 dark:text-white mb-2">
            {error || "Không tìm thấy đơn hàng"}
          </h2>
          <p className="text-gray-500">
            Vui lòng kiểm tra lại mã đơn hàng hoặc quay về trang chủ.
          </p>
        </div>
        <Link
          to="/profile/history"
          className="px-8 py-3 bg-primary text-white font-bold rounded-xl shadow-lg shadow-primary/20"
        >
          Quay lại lịch sử đặt hàng
        </Link>
      </div>
    );
  }

  const statusInfo = getStatusInfo(order.status);

  return (
    <div className="bg-background-light dark:bg-background-dark text-[#1c130d] dark:text-white transition-colors duration-300 min-h-screen font-display pb-20">
      <main className="max-w-5xl mx-auto w-full px-6 py-10">
        {/* Header Section */}
        <div className="mb-8">
          <button
            onClick={() => {
              if (window.location.pathname.includes("/staff/")) {
                navigate("/staff/orders");
              } else if (window.location.pathname.includes("/admin/")) {
                navigate("/admin/orders");
              } else {
                navigate("/profile/history");
              }
            }}
            className="inline-flex items-center text-sm font-bold text-[#9a734c] hover:text-primary transition-colors mb-6 group"
          >
            <ArrowLeft className="w-4 h-4 mr-2 transition-transform group-hover:-translate-x-1" />
            Quay lại
          </button>

          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div className="flex flex-col gap-1">
              <h1 className="text-4xl font-black text-black dark:text-white leading-tight">
                Mã đơn #{order.code}
              </h1>
              <p className="text-gray-500 font-medium">
                Đặt lúc{" "}
                {new Date(order.createdAt).toLocaleTimeString("vi-VN", {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
                , {new Date(order.createdAt).toLocaleDateString("vi-VN")}
              </p>
            </div>
            <div
              className={`flex items-center gap-2 px-4 py-2 rounded-xl font-bold ${statusInfo.bg} ${statusInfo.color}`}
            >
              {statusInfo.icon}
              {statusInfo.label}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          <div className="lg:col-span-2 flex flex-col gap-6">
            {/* Order Items */}
            <div className="bg-white dark:bg-white/5 border border-gray-100 dark:border-white/10 rounded-2xl overflow-hidden shadow-sm">
              <div className="px-6 py-5 border-b border-gray-100 dark:border-white/10 flex items-center gap-2">
                <Package className="w-5 h-5 text-primary" />
                <h3 className="font-bold text-lg">Món ăn đã đặt</h3>
              </div>
              <div className="divide-y divide-gray-50 dark:divide-white/5">
                {order.items.map((item, idx) => (
                  <div
                    key={idx}
                    className="p-6 flex items-center justify-between group hover:bg-gray-50/50 dark:hover:bg-white/2 transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <div
                        className="w-20 h-20 rounded-2xl bg-gray-100 bg-cover bg-center shrink-0 border border-gray-100 dark:border-white/10"
                        style={{
                          backgroundImage: `url("${getImageUrl((item.product_id as any)?.image)}")`,
                        }}
                      />
                      <div>
                        <h4 className="font-bold text-gray-900 dark:text-white group-hover:text-primary transition-colors">
                          {(item.product_id as any)?.name ||
                            "Sản phẩm không còn tồn tại"}
                        </h4>
                        <div className="mt-1 flex flex-wrap gap-2">
                          <span className="text-xs font-bold text-gray-500 bg-gray-100 dark:bg-white/10 px-2 py-1 rounded-md">
                            Số lượng: {item.quantity}
                          </span>
                        </div>

                        {(() => {
                          const chips = buildVariantChips(
                            (item as any).variations,
                          );
                          if (!chips.length) return null;

                          return (
                            <div className="mt-2 flex flex-wrap gap-2">
                              {chips.map((c) => (
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
                                      +{c.extra.toLocaleString("vi-VN")}đ
                                    </span>
                                  )}
                                </span>
                              ))}
                            </div>
                          );
                        })()}
                      </div>
                    </div>
                    <p className="font-black text-lg text-gray-900 dark:text-white">
                      {item.sub_total.toLocaleString("vi-VN")}đ
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Delivery Details */}
            <div className="bg-white dark:bg-white/5 border border-gray-100 dark:border-white/10 rounded-2xl p-6 shadow-sm">
              <div className="flex items-center gap-2 mb-6">
                <MapPin className="w-5 h-5 text-primary" />
                <h3 className="font-bold text-lg">Thông tin giao hàng</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-4">
                  <div className="flex gap-3">
                    <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary shrink-0">
                      <MapPin className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-[11px] font-black text-gray-400 uppercase tracking-widest mb-1">
                        Địa chỉ giao hàng
                      </p>
                      <p className="text-gray-900 dark:text-white font-bold leading-tight">
                        {order.delivery_address.detail}
                      </p>
                      <p className="text-gray-500 text-sm mt-1">
                        {order.delivery_address.ward},{" "}
                        {order.delivery_address.district},{" "}
                        {order.delivery_address.city}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="flex gap-3">
                    <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary shrink-0">
                      <User className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-[11px] font-black text-gray-400 uppercase tracking-widest mb-1">
                        Người nhận
                      </p>
                      <p className="text-gray-900 dark:text-white font-bold">
                        {order.delivery_address.receiver_name}
                      </p>
                      <div className="flex items-center gap-1 text-gray-500 text-sm mt-1">
                        <Phone className="w-3 h-3" />
                        {order.delivery_address.phone}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            {(order.note || order.staff_note_items?.length) && (
              <div className="bg-white dark:bg-white/5 border border-gray-100 dark:border-white/10 rounded-2xl p-6 shadow-sm">
                <div className="flex items-center gap-2 mb-4">
                  <ReceiptText className="w-5 h-5 text-primary" />
                  <h3 className="font-bold text-lg">
                    {isStaffView ? "Lưu ý từ khách hàng" : "Ghi chú đơn hàng"}
                  </h3>
                </div>

                {isStaffView ? (
                  order.staff_note_items?.length ? (
                    <ul className="space-y-2">
                      {order.staff_note_items.map((note, index) => (
                        <li
                          key={index}
                          className="flex items-start gap-2 text-sm text-gray-700 dark:text-gray-200"
                        >
                          <span className="mt-1 text-primary font-bold">•</span>
                          <span>{note}</span>
                        </li>
                      ))}
                    </ul>
                  ) : order.note ? (
                    <p className="text-sm text-gray-700 dark:text-gray-200 whitespace-pre-line">
                      {order.note}
                    </p>
                  ) : null
                ) : (
                  <p className="text-sm text-gray-700 dark:text-gray-200 whitespace-pre-line">
                    {order.note}
                  </p>
                )}
              </div>
            )}
          </div>

          {/* Bill Sidebar */}
          <div className="flex flex-col gap-6">
            <div className="bg-white dark:bg-white/5 border border-gray-100 dark:border-white/10 rounded-2xl p-6 shadow-md">
              <div className="flex items-center gap-2 mb-6">
                <ReceiptText className="w-5 h-5 text-primary" />
                <h3 className="font-bold text-lg">Hóa đơn</h3>
              </div>
              <div className="flex flex-col gap-4">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500 font-medium">Tạm tính</span>
                  <span className="font-bold">
                    {order.sub_total.toLocaleString("vi-VN")}đ
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500 font-medium">
                    Phí giao hàng
                  </span>
                  <span className="font-bold">
                    {order.shipping_fee > 0
                      ? `${order.shipping_fee.toLocaleString("vi-VN")}đ`
                      : "Miễn phí"}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500 font-medium">Giảm giá</span>
                  <span className="font-bold text-green-500">
                    -
                    {(
                      order.sub_total +
                      order.shipping_fee -
                      order.total_price
                    ).toLocaleString("vi-VN")}
                    đ
                  </span>
                </div>
                <div className="h-px bg-gray-100 dark:bg-white/10 my-2"></div>
                <div className="flex justify-between items-center">
                  <span className="text-lg font-black">
                    {t("customer:cart.grandTotal")}
                  </span>
                  <div className="text-right">
                    <p className="text-3xl font-black text-primary">
                      {order.total_price.toLocaleString("vi-VN")}đ
                    </p>
                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-tighter mt-1">
                      Thanh toán:{" "}
                      {order.payment.method === "cash_on_delivery"
                        ? "Tiền mặt"
                        : "Chuyển khoản"}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Order Timeline (Simple version) */}
            <div className="bg-[#fcfaf8] dark:bg-white/3 border border-gray-100 dark:border-white/10 rounded-2xl p-6">
              <h4 className="text-sm font-black text-gray-400 uppercase tracking-widest mb-6">
                Trạng thái xử lý
              </h4>
              <div className="space-y-6">
                <div className="flex gap-4 items-start">
                  <div className="w-6 h-6 rounded-full bg-green-500 flex items-center justify-center text-white shrink-0 mt-0.5 shadow-lg shadow-green-500/20">
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-sm font-bold">Đặt hàng thành công</p>
                    <p className="text-xs text-gray-400">
                      {new Date(order.createdAt).toLocaleTimeString("vi-VN")}
                    </p>
                  </div>
                </div>

                {order.status !== "pending" && order.status !== "cancelled" && (
                  <div className="flex gap-4 items-start">
                    <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center text-white shrink-0 mt-0.5 shadow-lg shadow-primary/20">
                      <Package className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-sm font-bold">Cửa hàng đã xác nhận</p>
                      <p className="text-xs text-primary/70">
                        Đang chuẩn bị món ăn
                      </p>
                    </div>
                  </div>
                )}

                {order.status === "shipping" && (
                  <div className="flex gap-4 items-start">
                    <div className="w-6 h-6 rounded-full bg-blue-500 flex items-center justify-center text-white shrink-0 mt-0.5">
                      <Clock className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-sm font-bold">Đang giao hàng</p>
                      <p className="text-xs text-blue-500">
                        Tài xế đang trên đường
                      </p>
                    </div>
                  </div>
                )}

                {order.status === "completed" && (
                  <div className="flex gap-4 items-start">
                    <div className="w-6 h-6 rounded-full bg-green-600 flex items-center justify-center text-white shrink-0 mt-0.5">
                      <CheckCircle2 className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-sm font-bold">Đã giao hàng</p>
                      <p className="text-xs text-gray-400">Đơn hàng hoàn tất</p>
                    </div>
                  </div>
                )}

                {order.status === "cancelled" && (
                  <div className="flex gap-4 items-start">
                    <div className="w-6 h-6 rounded-full bg-red-500 flex items-center justify-center text-white shrink-0 mt-0.5">
                      <Clock className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-red-500">
                        Đơn hàng đã hủy
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default OrderDetailPage;
