import { useState, useEffect, useCallback } from "react";
import { Loader2, Phone, MapPin, CheckCircle, Navigation, Wallet, Clock, RotateCcw } from "lucide-react";
import orderService, { type Order } from "@/services/order.service";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/useToast";

const PAYMENT_LABEL: Record<string, string> = {
    cash_on_delivery: "Tiền mặt (COD)",
    vnpay: "Đã thanh toán (VNPay)",
    momo: "Đã thanh toán (Momo)",
    credit_card: "Đã thanh toán (Thẻ)",
    paypal: "Đã thanh toán (PayPal)",
};

export default function StaffDeliveryMode() {
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);
    const [actioningIds, setActioningIds] = useState<Set<string>>(new Set());
    const { user } = useAuth();
    const { toast } = useToast();

    const fetchDeliveries = useCallback(async (showLoader = false) => {
        if (!user?._id) return;
        if (showLoader) setLoading(true);
        try {
            const res = await orderService.getAllOrders({
                status: "shipping",
                driver_id: user._id,
            });
            setOrders(res.data);
        } catch (error) {
            console.error("Failed to fetch deliveries", error);
        } finally {
            if (showLoader) setLoading(false);
        }
    }, [user?._id]);

    useEffect(() => {
        fetchDeliveries(true);
    }, [fetchDeliveries]);

    const handleCompleteDelivery = async (orderId: string) => {
        if (actioningIds.has(orderId)) return;
        setActioningIds((prev) => new Set(prev).add(orderId));
        try {
            await orderService.completeDelivery(orderId);
            toast("Đã giao hàng thành công! 🎉", "success");
            await fetchDeliveries();
        } catch (err: unknown) {
            const msg =
                (err as { response?: { data?: { message?: string } } })?.response?.data
                    ?.message ?? "Không thể hoàn thành đơn hàng.";
            toast(msg, "error");
        } finally {
            setActioningIds((prev) => {
                const next = new Set(prev);
                next.delete(orderId);
                return next;
            });
        }
    };

    const openMap = (address: string) => {
        const query = encodeURIComponent(address);
        window.open(`https://www.google.com/maps/search/?api=1&query=${query}`, "_blank");
    };

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center py-32 gap-3 min-h-[60vh]">
                <Loader2 className="w-10 h-10 text-primary animate-spin" />
                <p className="text-gray-500 font-medium">Đang tải đơn hàng...</p>
            </div>
        );
    }

    return (
        <div className="max-w-[800px] mx-auto pb-10">
            {/* Header */}
            <div className="flex items-center justify-between mb-6 sticky top-0 bg-[#f8f7f6] pt-2 pb-4 z-10 border-b border-gray-200 dark:border-white/10">
                <div>
                    <h1 className="text-2xl font-black text-gray-900 dark:text-white flex items-center gap-2">
                        Đơn đang giao
                    </h1>
                    <p className="text-sm text-gray-500 mt-1">
                        Tổng: <strong className="text-primary">{orders.length}</strong> đơn hàng
                    </p>
                </div>
                <button
                    onClick={() => fetchDeliveries(true)}
                    className="p-2 rounded-xl bg-white shadow-sm border border-gray-100 hover:bg-gray-50 active:scale-95 transition-all"
                >
                    <RotateCcw className="w-5 h-5 text-gray-600" />
                </button>
            </div>

            {orders.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 px-4 text-center">
                    <div className="w-24 h-24 bg-gray-100 dark:bg-white/5 rounded-full flex items-center justify-center mb-4">
                        <CheckCircle className="w-10 h-10 text-gray-400" />
                    </div>
                    <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-2">
                        Bạn hiện không có đơn nào
                    </h2>
                    <p className="text-gray-500">
                        Hãy quay lại Bảng Kanban để nhận thêm đơn đi giao nhé!
                    </p>
                </div>
            ) : (
                <div className="flex flex-col gap-4">
                    {orders.map((order) => {
                        const isActioning = actioningIds.has(order._id);
                        const address = order.delivery_address;
                        const fullAddress = `${address?.detail || ""}, ${address?.ward || ""}, ${address?.district || ""}, ${address?.city || ""}`;
                        const isCOD = order.payment.method === "cash_on_delivery";

                        return (
                            <div
                                key={order._id}
                                className="bg-white dark:bg-gray-800 rounded-2xl p-5 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] border border-gray-100 dark:border-white/10"
                            >
                                {/* Order Top Info */}
                                <div className="flex justify-between items-start mb-4">
                                    <div>
                                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-orange-100 text-orange-700 text-xs font-bold mb-2">
                                            <Clock className="w-3.5 h-3.5" />
                                            {new Date(order.updatedAt).toLocaleTimeString("vi-VN", {
                                                hour: "2-digit",
                                                minute: "2-digit",
                                            })}
                                        </span>
                                        <h3 className="text-lg font-black text-gray-900 dark:text-white block">
                                            #{order.code}
                                        </h3>
                                    </div>
                                </div>

                                {/* Consumer Info Card */}
                                <div className="bg-gray-50 dark:bg-white/5 rounded-xl p-4 mb-4">
                                    <div className="flex items-center gap-3 mb-3 pb-3 border-b border-gray-200 dark:border-white/10">
                                        <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-lg shrink-0">
                                            {(address?.receiver_name || "K").charAt(0).toUpperCase()}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="font-bold text-gray-900 dark:text-white truncate">
                                                {address?.receiver_name || order.user_id?.username || "Khách hàng"}
                                            </div>
                                            <div className="text-sm font-medium text-gray-500">
                                                {address?.phone || order.user_id?.phone || "Không có SĐT"}
                                            </div>
                                        </div>
                                        {/* Call Button */}
                                        <a
                                            href={`tel:${address?.phone || order.user_id?.phone}`}
                                            className="w-10 h-10 rounded-full bg-green-100 text-green-600 flex items-center justify-center shrink-0 hover:bg-green-200 active:scale-95 transition-all"
                                        >
                                            <Phone className="w-5 h-5 fill-current" />
                                        </a>
                                    </div>

                                    {/* Delivery Location */}
                                    <div className="flex items-start gap-3">
                                        <div className="mt-0.5 shrink-0">
                                            <MapPin className="w-5 h-5 text-red-500" />
                                        </div>
                                        <div className="flex-1 pr-2">
                                            <p className="text-sm font-medium text-gray-800 dark:text-gray-200 leading-snug">
                                                {fullAddress}
                                            </p>
                                        </div>
                                        <button
                                            onClick={() => openMap(fullAddress)}
                                            className="shrink-0 p-2 rounded-lg bg-indigo-50 text-indigo-600 hover:bg-indigo-100 active:scale-95 transition-all tooltip"
                                            title="Mở bản đồ"
                                        >
                                            <Navigation className="w-5 h-5" />
                                        </button>
                                    </div>
                                </div>

                                {/* Items Summary (brief) */}
                                <div className="mb-4">
                                    <span className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 block">
                                        Chi tiết đơn
                                    </span>
                                    <div className="text-sm text-gray-600 dark:text-gray-300 line-clamp-2">
                                        {order.items.map(item => `x${item.quantity} ${item.product_id?.name}`).join(", ")}
                                    </div>
                                </div>

                                {/* Payment Section (Crucial) */}
                                <div className={`p-4 rounded-xl mb-5 flex items-center justify-between border ${isCOD ? 'bg-orange-50/50 border-orange-200 dark:bg-orange-900/10 dark:border-orange-800/30' : 'bg-emerald-50/50 border-emerald-200 dark:bg-emerald-900/10 dark:border-emerald-800/30'}`}>
                                    <div className="flex items-center gap-3">
                                        <Wallet className={`w-5 h-5 ${isCOD ? 'text-orange-500' : 'text-emerald-500'}`} />
                                        <div>
                                            <div className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-0.5">
                                                {PAYMENT_LABEL[order.payment.method] || order.payment.method}
                                            </div>
                                            <div className={`font-black text-xl tracking-tight ${isCOD ? 'text-orange-600' : 'text-emerald-600'}`}>
                                                {order.total_price.toLocaleString("vi-VN")}đ
                                            </div>
                                        </div>
                                    </div>
                                    {isCOD && (
                                        <span className="px-2.5 py-1 bg-orange-100 text-orange-700 font-bold text-[10px] rounded-lg">
                                            THU TIỀN
                                        </span>
                                    )}
                                </div>

                                {/* MAIN ACTION */}
                                <button
                                    onClick={() => handleCompleteDelivery(order._id)}
                                    disabled={isActioning}
                                    className="w-full py-4 rounded-xl bg-amber-500 text-white font-bold text-base shadow-sm hover:bg-[#ee8c2b] transition-all disabled:opacity-50 disabled:cursor-not-allowed active:scale-95 flex items-center justify-center gap-2"
                                >
                                    {isActioning ? (
                                        <>
                                            <Loader2 className="w-5 h-5 animate-spin" />
                                            ĐANG XỬ LÝ...
                                        </>
                                    ) : (
                                        <>
                                            <CheckCircle className="w-5 h-5" />
                                            {isCOD ? "GIAO XONG & ĐÃ THU TIỀN" : "XÁC NHẬN GIAO XONG"}
                                        </>
                                    )}
                                </button>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
