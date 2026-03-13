import { useState, useEffect, useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Loader2,
  CheckCircle2,
  Package,
  MapPin,
  Phone,
  ShoppingBag,
  AlertTriangle,
  Printer,
  Receipt,
  Bell,
  ChevronRight,
  Info,
  MessageCircle,
} from "lucide-react";
import orderService from "@/services/order.service";
import type { Order } from "@/services/order.service";

type ChecklistItem = { label: string; done: boolean };

const STATUS_STEPS = ["pending", "confirmed", "shipping", "completed"];

const getStatusLabel = (status: string) => {
  switch (status) {
    case "completed": return "Hoàn thành";
    case "shipping": return "Đang giao";
    case "confirmed": return "Đã xác nhận";
    case "cancelled": return "Đã hủy";
    default: return "Chờ xử lý";
  }
};

const getStatusBadgeClass = (status: string) => {
  switch (status) {
    case "completed": return "bg-green-100 text-green-700";
    case "shipping": return "bg-indigo-100 text-indigo-700";
    case "confirmed": return "bg-primary/10 text-primary";
    case "cancelled": return "bg-red-100 text-red-600";
    default: return "bg-amber-100 text-amber-700";
  }
};

const buildChecklist = (items: Order["items"]): ChecklistItem[] =>
  items.flatMap((item) => {
    const base: ChecklistItem = {
      label: `Chuẩn bị ${item.product_id?.name || "món ăn"} (x${item.quantity})`,
      done: false,
    };
    const extras: ChecklistItem[] = (item.variations || []).map((v) => ({
      label: `${v.name}: ${v.choice} — ${item.product_id?.name || ""}`,
      done: false,
    }));
    return [base, ...extras];
  });

export default function StaffOrderDetail() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [updating, setUpdating] = useState(false);
  const [checklist, setChecklist] = useState<ChecklistItem[]>([]);
  const [internalNote, setInternalNote] = useState("");

  const fetchOrder = useCallback(async () => {
    if (!id) return;
    try {
      setLoading(true);
      const res = await orderService.getOrderById(id);
      setOrder(res.data);
      setChecklist(buildChecklist(res.data.items));
    } catch (err: unknown) {
      const message = (err as { response?: { data?: { message?: string } } })?.response?.data?.message;
      setError(message || "Không thể tải chi tiết đơn hàng");
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchOrder();
  }, [fetchOrder]);

  const handleUpdateStatus = async (status: Order["status"]) => {
    if (!order) return;
    try {
      setUpdating(true);
      await orderService.updateOrderStatus(order._id, status);
      await fetchOrder();
    } catch {
      alert("Không thể cập nhật trạng thái đơn hàng");
    } finally {
      setUpdating(false);
    }
  };

  const toggleChecklist = (idx: number) => {
    setChecklist((prev) =>
      prev.map((item, i) => (i === idx ? { ...item, done: !item.done } : item))
    );
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-32 gap-4">
        <Loader2 className="w-12 h-12 text-primary animate-spin" />
        <p className="text-gray-500 font-bold">Đang tải chi tiết đơn hàng...</p>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="flex flex-col items-center justify-center py-32 gap-6 text-center">
        <div className="w-20 h-20 rounded-full bg-red-50 flex items-center justify-center text-red-400">
          <ShoppingBag className="w-10 h-10" />
        </div>
        <div>
          <h2 className="text-2xl font-black text-gray-900 dark:text-white mb-2">
            {error || "Không tìm thấy đơn hàng"}
          </h2>
          <p className="text-gray-500">Vui lòng kiểm tra lại hoặc quay về danh sách.</p>
        </div>
        <button
          onClick={() => navigate("/staff/orders")}
          className="px-8 py-3 bg-primary text-white font-bold rounded-xl shadow-lg shadow-primary/20"
        >
          Quay lại danh sách
        </button>
      </div>
    );
  }

  const statusIdx = order.status === "cancelled" ? -1 : STATUS_STEPS.indexOf(order.status);

  const timelineSteps = [
    { label: "Đặt hàng", sub: "Đơn hàng đã được tạo" },
    { label: "Xác nhận", sub: "Cửa hàng xác nhận đơn" },
    { label: "Đang giao", sub: "Tài xế đang trên đường" },
    { label: "Hoàn tất", sub: "Giao hàng thành công" },
  ];

  return (
    <div className="flex flex-col min-h-full bg-gray-50 dark:bg-background-dark">
      {/* ── Header ── */}
      <div className="h-16 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between px-6 shrink-0">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate("/staff/orders")}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 font-semibold text-sm transition-colors"
          >
            Đơn hàng
          </button>
          <ChevronRight className="w-4 h-4 text-gray-300" />
          <span className="text-gray-800 dark:text-white font-bold text-sm">#{order.code}</span>
          <span className={`ml-1 px-3 py-1 rounded-full text-xs font-bold ${getStatusBadgeClass(order.status)}`}>
            {getStatusLabel(order.status)}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => navigate(`/staff/support?orderId=${order._id}`)}
            className="flex items-center gap-2 px-4 py-2 bg-orange-50 dark:bg-orange-900/20 hover:bg-orange-100 dark:hover:bg-orange-900/40 text-orange-600 dark:text-orange-400 text-sm font-semibold rounded-lg border border-orange-200 dark:border-orange-800 transition-colors"
          >
            <MessageCircle className="w-4 h-4" />
            Chat với khách
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200 text-sm font-semibold rounded-lg transition-colors">
            <Printer className="w-4 h-4" />
            In phiếu bếp
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200 text-sm font-semibold rounded-lg transition-colors">
            <Receipt className="w-4 h-4" />
            In hóa đơn
          </button>
          <button className="w-10 h-10 flex items-center justify-center rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-500 dark:text-gray-400 transition-colors">
            <Bell className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* ── Scrollable content ── */}
      <div className="flex-1 overflow-y-auto p-6">
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-6">

          {/* ── Left 70% ── */}
          <div className="lg:w-[70%] space-y-6">

            {/* Order Items */}
            <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-100 dark:border-gray-700 flex items-center gap-2">
                <ShoppingBag className="w-5 h-5 text-primary" />
                <h2 className="font-bold text-gray-900 dark:text-white">
                  Món ăn · {order.items.length} sản phẩm
                </h2>
              </div>
              <div className="divide-y divide-gray-100 dark:divide-gray-700">
                {order.items.map((item, idx) => (
                  <div key={idx} className="flex items-start gap-4 px-6 py-5">
                    <div className="w-12 h-12 bg-slate-100 dark:bg-gray-800 rounded-lg flex items-center justify-center shrink-0">
                      <span className="text-xl font-bold text-primary">{item.quantity}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-gray-900 dark:text-white text-base">
                        {item.product_id?.name || "Sản phẩm không còn tồn tại"}
                      </p>
                      {item.variations?.length > 0 && (
                        <div className="mt-2 space-y-1">
                          {item.variations.map((v, vIdx) => (
                            <div key={vIdx} className="flex items-start gap-2 bg-red-50 dark:bg-red-900/20 px-3 py-1.5 rounded-lg">
                              <Info className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                              <span className="text-red-600 dark:text-red-400 text-sm font-medium">
                                {v.name}: {v.choice}
                              </span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                    <p className="font-bold text-gray-900 dark:text-white shrink-0 text-sm">
                      {item.sub_total.toLocaleString("vi-VN")}đ
                    </p>
                  </div>
                ))}
              </div>
              {/* Bill footer */}
              <div className="px-6 py-4 border-t border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 space-y-2">
                <div className="flex justify-between text-sm text-gray-500 dark:text-gray-400">
                  <span>Tạm tính</span>
                  <span className="font-semibold">{order.sub_total.toLocaleString("vi-VN")}đ</span>
                </div>
                <div className="flex justify-between text-sm text-gray-500 dark:text-gray-400">
                  <span>Phí giao hàng</span>
                  <span className="font-semibold">
                    {order.shipping_fee > 0 ? `${order.shipping_fee.toLocaleString("vi-VN")}đ` : "Miễn phí"}
                  </span>
                </div>
                <div className="flex justify-between font-bold text-gray-900 dark:text-white text-base pt-2 border-t border-gray-200 dark:border-gray-600">
                  <span>Tổng cộng</span>
                  <span className="text-primary">{order.total_price.toLocaleString("vi-VN")}đ</span>
                </div>
              </div>
            </div>

            {/* Kitchen Checklist */}
            <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-100 dark:border-gray-700 flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-primary" />
                <h2 className="font-bold text-gray-900 dark:text-white">Checklist bếp</h2>
              </div>
              <div className="px-6 py-4 space-y-3">
                {checklist.length === 0 ? (
                  <p className="text-gray-400 text-sm py-6 text-center">Không có checklist</p>
                ) : (
                  checklist.map((item, idx) => (
                    <label key={idx} className="flex items-center gap-3 cursor-pointer group">
                      <input
                        type="checkbox"
                        checked={item.done}
                        onChange={() => toggleChecklist(idx)}
                        className="w-4 h-4 rounded accent-primary cursor-pointer"
                      />
                      <span
                        className={`text-sm font-medium transition-colors ${item.done
                          ? "line-through text-gray-400 dark:text-gray-500"
                          : "text-gray-700 dark:text-gray-200 group-hover:text-gray-900 dark:group-hover:text-white"
                          }`}
                      >
                        {item.label}
                      </span>
                    </label>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* ── Right 30% ── */}
          <div className="lg:w-[30%] space-y-6">

            {/* Customer Details */}
            <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden">
              <div className="px-5 py-4 border-b border-gray-100 dark:border-gray-700">
                <h3 className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest">
                  Khách hàng
                </h3>
              </div>
              <div className="px-5 py-4 space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-sm shrink-0">
                    {order.user_id?.username?.charAt(0)?.toUpperCase() || "K"}
                  </div>
                  <div className="min-w-0">
                    <p className="font-bold text-gray-900 dark:text-white text-sm leading-tight">
                      {order.user_id?.username || "Khách hàng"}
                    </p>
                    {order.user_id?.email && (
                      <p className="text-xs text-gray-400 truncate">{order.user_id.email}</p>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
                  <Phone className="w-4 h-4 text-gray-400 shrink-0" />
                  <span>{order.delivery_address.phone || order.user_id?.phone || "—"}</span>
                </div>
                <div className="flex items-start gap-2 text-sm text-gray-600 dark:text-gray-300">
                  <MapPin className="w-4 h-4 text-gray-400 shrink-0 mt-0.5" />
                  <span className="leading-snug">
                    {order.delivery_address.detail}, {order.delivery_address.ward},{" "}
                    {order.delivery_address.district}, {order.delivery_address.city}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300 pt-1 border-t border-gray-100 dark:border-gray-700">
                  <Package className="w-4 h-4 text-gray-400 shrink-0" />
                  <span>
                    {order.payment.method === "cash_on_delivery"
                      ? "Tiền mặt khi nhận hàng"
                      : order.payment.method === "credit_card"
                        ? "Thẻ tín dụng"
                        : "PayPal"}
                  </span>
                </div>
              </div>
            </div>

            {/* Timeline */}
            <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden">
              <div className="px-5 py-4 border-b border-gray-100 dark:border-gray-700">
                <h3 className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest">
                  Lịch sử trạng thái
                </h3>
              </div>
              <div className="px-5 py-5">
                {order.status === "cancelled" ? (
                  <div className="flex items-center gap-3 text-red-500">
                    <AlertTriangle className="w-5 h-5 shrink-0" />
                    <div>
                      <p className="font-bold text-sm">Đơn hàng bị hủy</p>
                      <p className="text-xs text-gray-400 mt-0.5">Đơn đã bị hủy bởi cửa hàng</p>
                    </div>
                  </div>
                ) : (
                  <div className="relative">
                    <div className="absolute left-[11px] top-3 bottom-3 w-0.5 bg-gray-100 dark:bg-gray-700" />
                    <div className="space-y-5">
                      {timelineSteps.map((step, idx) => {
                        const isDone = idx < statusIdx;
                        const isCurrent = idx === statusIdx;
                        return (
                          <div key={idx} className="flex items-start gap-4 relative">
                            <div
                              className={`w-[22px] h-[22px] rounded-full flex items-center justify-center shrink-0 ring-4 ring-white dark:ring-gray-900 z-10 ${isDone
                                ? "bg-green-500"
                                : isCurrent
                                  ? "bg-primary"
                                  : "bg-gray-200 dark:bg-gray-700"
                                }`}
                            >
                              {isDone ? (
                                <CheckCircle2 className="w-3.5 h-3.5 text-white" />
                              ) : (
                                <div className={`w-2 h-2 rounded-full ${isCurrent ? "bg-white" : "bg-gray-400"}`} />
                              )}
                            </div>
                            <div className="pb-1">
                              <p
                                className={`text-sm font-semibold ${isDone || isCurrent
                                  ? "text-gray-900 dark:text-white"
                                  : "text-gray-400 dark:text-gray-500"
                                  }`}
                              >
                                {step.label}
                              </p>
                              <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">{step.sub}</p>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Staff Actions */}
            {order.status !== "completed" && order.status !== "cancelled" && (
              <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden">
                <div className="px-5 py-4 border-b border-gray-100 dark:border-gray-700">
                  <h3 className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest">
                    Thao tác
                  </h3>
                </div>
                <div className="px-5 py-4 space-y-3">
                  {order.status === "pending" && (
                    <button
                      onClick={() => handleUpdateStatus("confirmed")}
                      disabled={updating}
                      className="w-full py-3 bg-primary text-white font-bold rounded-lg hover:bg-primary/90 transition-colors flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
                    >
                      {updating && <Loader2 className="w-4 h-4 animate-spin" />}
                      Xác nhận đơn
                    </button>
                  )}
                  {order.status === "confirmed" && (
                    <button
                      onClick={() => handleUpdateStatus("shipping")}
                      disabled={updating}
                      className="w-full py-3 bg-primary text-white font-bold rounded-lg hover:bg-primary/90 transition-colors flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
                    >
                      {updating && <Loader2 className="w-4 h-4 animate-spin" />}
                      Bàn giao shipper
                    </button>
                  )}
                  {order.status === "shipping" && (
                    <button
                      onClick={() => handleUpdateStatus("completed")}
                      disabled={updating}
                      className="w-full py-3 bg-green-600 text-white font-bold rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
                    >
                      {updating && <Loader2 className="w-4 h-4 animate-spin" />}
                      Hoàn tất giao hàng
                    </button>
                  )}
                  <button
                    onClick={() => handleUpdateStatus("cancelled")}
                    disabled={updating}
                    className="w-full py-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-200 font-bold rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-600 hover:border-red-200 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    Hủy đơn
                  </button>
                </div>
              </div>
            )}

            {/* Internal Notes */}
            <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden">
              <div className="px-5 py-4 border-b border-gray-100 dark:border-gray-700">
                <h3 className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest">
                  Ghi chú nội bộ
                </h3>
              </div>
              <div className="px-5 py-4 space-y-3">
                <textarea
                  value={internalNote}
                  onChange={(e) => setInternalNote(e.target.value)}
                  placeholder="Ghi chú dành cho bếp hoặc shipper..."
                  rows={4}
                  className="w-full px-3 py-2.5 rounded-lg border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-800 text-sm text-gray-700 dark:text-gray-200 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary resize-none"
                />
                <button className="w-full py-2.5 border border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-200 text-sm font-bold rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                  Lưu ghi chú
                </button>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

