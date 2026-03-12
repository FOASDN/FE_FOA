import { useState, useEffect, useRef, useCallback } from "react";
import { Loader2, RefreshCw } from "lucide-react";
import orderService from "@/services/order.service";
import type { Order } from "@/services/order.service";
import OrderKanbanCard from "@/components/Staff/OrderKanbanCard";
import RejectModal from "@/components/Staff/RejectModal";
import { useNotificationSound } from "@/hooks/useNotificationSound";
import { useToast } from "@/hooks/useToast";

const POLL_INTERVAL = 10_000; // 10 seconds

export default function StaffOrders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [actioningIds, setActioningIds] = useState<Set<string>>(new Set());
  const [rejectTarget, setRejectTarget] = useState<Order | null>(null);
  const prevPendingCount = useRef(0);
  const { playNotification } = useNotificationSound();
  const { toast } = useToast();

  // ── Fetch ──────────────────────────────────────────────────────────────
  const fetchOrders = useCallback(async (showLoader = false) => {
    if (showLoader) setLoading(true);
    try {
      const res = await orderService.getAllOrders({
        status: "pending,confirmed,processing,ready_for_delivery",
      });
      setOrders(res.data);
    } catch {
      // silent – next poll will retry
    } finally {
      if (showLoader) setLoading(false);
    }
  }, []);

  // Initial load
  useEffect(() => {
    fetchOrders(true);
  }, [fetchOrders]);

  // Polling every 10s
  useEffect(() => {
    const id = setInterval(() => fetchOrders(), POLL_INTERVAL);
    return () => clearInterval(id);
  }, [fetchOrders]);

  // Derived columns
  const pendingOrders = orders.filter((o) => o.status === "pending");
  const preparingOrders = orders.filter(
    (o) => o.status === "confirmed" || o.status === "processing",
  );
  const readyOrders = orders.filter((o) => o.status === "ready_for_delivery");

  // Sound alert when new PENDING orders arrive
  useEffect(() => {
    if (pendingOrders.length > prevPendingCount.current) {
      playNotification();
    }
    prevPendingCount.current = pendingOrders.length;
  }, [pendingOrders.length, playNotification]);

  // ── Helpers ────────────────────────────────────────────────────────────
  const startActioning = (id: string) =>
    setActioningIds((prev) => new Set(prev).add(id));

  const stopActioning = (id: string) =>
    setActioningIds((prev) => {
      const next = new Set(prev);
      next.delete(id);
      return next;
    });

  // ── Actions ────────────────────────────────────────────────────────────
  const handleConfirm = async (orderId: string) => {
    if (actioningIds.has(orderId)) return;
    startActioning(orderId);
    try {
      await orderService.confirmOrder(orderId);
      toast("Đã nhận đơn, bắt đầu chế biến!", "success");
      await fetchOrders();
    } catch (err: unknown) {
      const msg =
        (err as { response?: { data?: { message?: string } } })?.response?.data
          ?.message ?? "Có lỗi xảy ra. Đơn hàng có thể đã bị hủy.";
      toast(msg, "error");
      await fetchOrders();
    } finally {
      stopActioning(orderId);
    }
  };

  const handleRejectOpen = (orderId: string) => {
    const order = orders.find((o) => o._id === orderId);
    if (order) setRejectTarget(order);
  };

  const handleRejectConfirm = async (reason: string) => {
    if (!rejectTarget) return;
    const orderId = rejectTarget._id;
    startActioning(orderId);
    try {
      await orderService.rejectOrder(orderId, reason);
      toast("Đã từ chối đơn hàng.", "info");
      setRejectTarget(null);
      await fetchOrders();
    } catch (err: unknown) {
      const msg =
        (err as { response?: { data?: { message?: string } } })?.response?.data
          ?.message ?? "Không thể từ chối đơn hàng.";
      toast(msg, "error");
    } finally {
      stopActioning(orderId);
    }
  };

  const handleMarkReady = async (orderId: string) => {
    if (actioningIds.has(orderId)) return;
    startActioning(orderId);
    try {
      await orderService.markOrderReady(orderId);
      toast("Đơn hàng đã sẵn sàng để giao!", "success");
      await fetchOrders();
    } catch (err: unknown) {
      const msg =
        (err as { response?: { data?: { message?: string } } })?.response?.data
          ?.message ?? "Không thể cập nhật trạng thái.";
      toast(msg, "error");
    } finally {
      stopActioning(orderId);
    }
  };

  const handleAssignDelivery = async (orderId: string) => {
    if (actioningIds.has(orderId)) return;
    startActioning(orderId);
    try {
      await orderService.assignDelivery(orderId);
      toast("Bạn đã nhận giao đơn này!", "success");
      await fetchOrders();
    } catch (err: unknown) {
      const msg =
        (err as { response?: { data?: { message?: string } } })?.response?.data
          ?.message ?? "Không thể nhận giao đơn hàng.";
      toast(msg, "error");
    } finally {
      stopActioning(orderId);
    }
  };

  // ── Kanban Column ──────────────────────────────────────────────────────
  const KanbanColumn = ({
    title,
    count,
    colorClass,
    children,
  }: {
    title: string;
    count: number;
    colorClass: string;
    children: React.ReactNode;
  }) => (
    <div className="flex flex-col gap-3">
      <div
        className={`flex items-center justify-between px-4 py-3 rounded-xl border border-gray-100 dark:border-white/5 bg-white dark:bg-gray-800 shadow-sm`}
      >
        <div className="flex items-center gap-2">
          <div className={`w-2 h-2 rounded-full ${colorClass.split(' ')[0]}`} />
          <span className="font-bold text-gray-700 dark:text-gray-300 text-xs tracking-tight uppercase">{title}</span>
        </div>
        <span className="text-[10px] font-black bg-gray-100 dark:bg-white/10 text-gray-500 dark:text-gray-400 px-2 py-0.5 rounded-full">
          {count}
        </span>
      </div>
      <div className="flex flex-col gap-3 min-h-[200px]">
        {children}
        {count === 0 && (
          <div className="flex-1 flex items-center justify-center py-10 border-2 border-dashed border-gray-200 dark:border-white/10 rounded-xl">
            <p className="text-sm text-gray-400">Không có đơn</p>
          </div>
        )}
      </div>
    </div>
  );

  // ── Render ─────────────────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-32 gap-3">
        <Loader2 className="w-10 h-10 text-primary animate-spin" />
        <p className="text-gray-500 font-medium">Đang tải đơn hàng...</p>
      </div>
    );
  }

  return (
    <div className="p-4 max-w-[1400px] mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-black text-gray-900 dark:text-white">
            Quản lý Đơn hàng
          </h1>
          <p className="text-sm text-gray-500 mt-0.5">
            Cập nhật tự động mỗi 10 giây
          </p>
        </div>
        <button
          onClick={() => fetchOrders(true)}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gray-100 dark:bg-white/10 text-gray-600 dark:text-gray-300 font-bold text-sm hover:bg-gray-200 dark:hover:bg-white/20 transition-all active:scale-95"
        >
          <RefreshCw className="w-4 h-4" />
          Làm mới
        </button>
      </div>

      {/* Kanban board */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Column 1: PENDING */}
        <KanbanColumn
          title="MỚI NHẬN"
          count={pendingOrders.length}
          colorClass="bg-red-500"
        >
          {pendingOrders.map((order) => (
            <OrderKanbanCard
              key={order._id}
              order={order}
              onConfirm={handleConfirm}
              onReject={handleRejectOpen}
              onMarkReady={handleMarkReady}
              isActioning={actioningIds.has(order._id)}
            />
          ))}
        </KanbanColumn>

        {/* Column 2: CONFIRMED / PROCESSING */}
        <KanbanColumn
          title="ĐANG CHẾ BIẾN"
          count={preparingOrders.length}
          colorClass="bg-amber-500"
        >
          {preparingOrders.map((order) => (
            <OrderKanbanCard
              key={order._id}
              order={order}
              onConfirm={handleConfirm}
              onReject={handleRejectOpen}
              onMarkReady={handleMarkReady}
              isActioning={actioningIds.has(order._id)}
            />
          ))}
        </KanbanColumn>

        {/* Column 3: READY_FOR_DELIVERY */}
        <KanbanColumn
          title="CHỜ ĐI GIAO"
          count={readyOrders.length}
          colorClass="bg-emerald-500"
        >
          {readyOrders.map((order) => (
            <OrderKanbanCard
              key={order._id}
              order={order}
              onConfirm={handleConfirm}
              onReject={handleRejectOpen}
              onMarkReady={handleMarkReady}
              onAssignDelivery={handleAssignDelivery}
              isActioning={actioningIds.has(order._id)}
            />
          ))}
        </KanbanColumn>
      </div>

      {/* Reject Modal */}
      <RejectModal
        isOpen={!!rejectTarget}
        orderCode={rejectTarget?.code ?? ""}
        onConfirm={handleRejectConfirm}
        onClose={() => setRejectTarget(null)}
        isLoading={rejectTarget ? actioningIds.has(rejectTarget._id) : false}
      />
    </div>
  );
}
