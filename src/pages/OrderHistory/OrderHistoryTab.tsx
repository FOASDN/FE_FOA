/**
 * Order History Tab - Displays customer order history with actions
 */
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { MOCK_CUSTOMER_ORDERS, type CustomerOrder } from "../../constants/mockOrders";
import { CheckCircle, AlertTriangle, XCircle, Edit3 } from "lucide-react";

type OrderStatusFilter = 'all' | 'needs_review' | 'delivered' | 'delivering' | 'cancelled';

interface Toast {
  id: number;
  type: 'success' | 'warning' | 'error';
  message: string;
}

interface ConfirmationModal {
  type: 'confirm' | 'edit' | 'cancel';
  order: CustomerOrder;
  message: string;
}

const OrderHistoryTabContent = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState(MOCK_CUSTOMER_ORDERS);
  const [statusFilter, setStatusFilter] = useState<OrderStatusFilter>('all');
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [confirmationModal, setConfirmationModal] = useState<ConfirmationModal | null>(null);

  // Toast notification
  const showToast = (type: Toast['type'], message: string) => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, type, message }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 4000);
  };

  // Filter orders
  const filteredOrders = orders.filter(order => {
    if (statusFilter === 'all') return true;
    return order.status === statusFilter;
  });

  // Action handlers
  const handleConfirmOrder = (order: CustomerOrder) => {
    setConfirmationModal({
      type: 'confirm',
      order,
      message: `Xác nhận lại đơn hàng ${order.orderId} với thông tin hiện tại?`
    });
  };

  const handleEditOrder = (order: CustomerOrder) => {
    showToast('warning', '⚠️ Tính năng chỉnh sửa đơn hàng đang được phát triển');
    // TODO: Navigate to edit order page
  };

  const handleCancelOrder = (order: CustomerOrder) => {
    setConfirmationModal({
      type: 'cancel',
      order,
      message: `Bạn có chắc chắn muốn hủy đơn hàng ${order.orderId}?`
    });
  };

  // Execute action
  const executeAction = () => {
    if (!confirmationModal) return;

    const { type, order } = confirmationModal;
    const orderIndex = orders.findIndex(o => o.id === order.id);

    if (orderIndex === -1) return;

    const updatedOrders = [...orders];

    if (type === 'confirm') {
      updatedOrders[orderIndex] = { ...order, status: 'confirmed', needsCustomerAction: false };
      showToast('success', `✓ Đã xác nhận lại đơn ${order.orderId}`);
    } else if (type === 'cancel') {
      updatedOrders[orderIndex] = { ...order, status: 'cancelled', needsCustomerAction: false };
      showToast('error', `✗ Đã hủy đơn ${order.orderId}`);
    }

    setOrders(updatedOrders);
    setConfirmationModal(null);
  };

  // Get status badge
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'needs_review':
        return {
          label: 'Cần xem lại',
          className: 'bg-orange-100 text-orange-700'
        };
      case 'delivered':
        return {
          label: 'Hoàn thành',
          className: 'bg-green-100 text-green-700'
        };
      case 'delivering':
        return {
          label: 'Đang giao',
          className: 'bg-blue-100 text-blue-700'
        };
      case 'confirmed':
        return {
          label: 'Đã xác nhận',
          className: 'bg-green-100 text-green-700'
        };
      case 'cancelled':
        return {
          label: 'Đã hủy',
          className: 'bg-red-100 text-red-700'
        };
      default:
        return {
          label: 'Chờ xử lý',
          className: 'bg-gray-100 text-gray-700'
        };
    }
  };

  const ordersNeedingReview = orders.filter(o => o.status === 'needs_review').length;

  return (
    <>
      {/* Toast Notifications */}
      <div className="fixed top-24 right-6 z-50 flex flex-col gap-3">
        {toasts.map(toast => (
          <div key={toast.id} className={`flex items-center gap-3 px-5 py-3 rounded-xl shadow-lg border-l-4 bg-white animate-in slide-in-from-right-5 ${toast.type === 'success' ? 'border-green-500' :
            toast.type === 'warning' ? 'border-orange-500' :
              'border-red-500'
            }`}>
            {toast.type === 'success' && <CheckCircle className="w-5 h-5 text-green-500" />}
            {toast.type === 'warning' && <AlertTriangle className="w-5 h-5 text-orange-500" />}
            {toast.type === 'error' && <XCircle className="w-5 h-5 text-red-500" />}
            <span className="text-sm font-semibold text-gray-800">{toast.message}</span>
          </div>
        ))}
      </div>

      {/* Page Heading */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
        <div className="flex flex-col gap-1">
          <h1 className="text-4xl font-black leading-tight tracking-tight text-foreground">
            Lịch sử đơn hàng
          </h1>
          <p className="text-muted-foreground text-base">
            Quản lý và theo dõi các đơn hàng ăn uống của bạn.
            {ordersNeedingReview > 0 && (
              <span className="ml-2 text-orange-600 font-bold">
                • {ordersNeedingReview} đơn cần xem lại
              </span>
            )}
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-card rounded-xl shadow-[0_4px_20px_-2px_rgba(28,19,13,0.05)] border border-border p-2 mb-8">
        <div className="flex gap-3 px-2 pb-2 flex-wrap">
          <button
            type="button"
            onClick={() => setStatusFilter('all')}
            className={`flex h-9 shrink-0 items-center justify-center gap-x-2 rounded-lg px-4 transition-colors ${statusFilter === 'all'
              ? 'bg-primary text-primary-foreground'
              : 'bg-accent text-foreground hover:bg-accent/80'
              }`}
          >
            <span className="text-sm font-bold">Tất cả ({orders.length})</span>
          </button>
          <button
            type="button"
            onClick={() => setStatusFilter('needs_review')}
            className={`flex h-9 shrink-0 items-center justify-center gap-x-2 rounded-lg px-4 transition-colors ${statusFilter === 'needs_review'
              ? 'bg-orange-600 text-white'
              : 'bg-accent text-foreground hover:bg-accent/80'
              }`}
          >
            <span className="text-sm font-bold">⚠️ Cần xem lại ({ordersNeedingReview})</span>
          </button>
          <button
            type="button"
            onClick={() => setStatusFilter('delivered')}
            className={`flex h-9 shrink-0 items-center justify-center gap-x-2 rounded-lg px-4 transition-colors ${statusFilter === 'delivered'
              ? 'bg-primary text-primary-foreground'
              : 'bg-accent text-foreground hover:bg-accent/80'
              }`}
          >
            <span className="text-sm font-medium">Hoàn thành</span>
          </button>
          <button
            type="button"
            onClick={() => setStatusFilter('cancelled')}
            className={`flex h-9 shrink-0 items-center justify-center gap-x-2 rounded-lg px-4 transition-colors ${statusFilter === 'cancelled'
              ? 'bg-primary text-primary-foreground'
              : 'bg-accent text-foreground hover:bg-accent/80'
              }`}
          >
            <span className="text-sm font-medium">Đã hủy</span>
          </button>
        </div>
      </div>

      {/* Orders List */}
      <div className="space-y-6">
        {filteredOrders.map((order) => {
          const statusBadge = getStatusBadge(order.status);
          const isNeedsReview = order.status === 'needs_review';

          return (
            <div
              key={order.id}
              className={`flex flex-col rounded-xl bg-card shadow-sm hover:shadow-md border transition-all overflow-hidden ${isNeedsReview ? 'border-orange-300 ring-2 ring-orange-100' : 'border-border'
                }`}
            >
              {/* Staff Message Alert */}
              {isNeedsReview && order.staffMessage && (
                <div className="bg-orange-50 border-b border-orange-200 px-5 py-3">
                  <div className="flex items-start gap-3">
                    <AlertTriangle className="w-5 h-5 text-orange-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="font-bold text-orange-900 text-sm mb-1">Nhân viên yêu cầu xác nhận:</p>
                      <p className="text-orange-800 text-sm">{order.staffMessage}</p>
                    </div>
                  </div>
                </div>
              )}

              <div className="flex flex-col md:flex-row items-stretch">
                {/* Order Image */}
                <div
                  className="w-full md:w-48 bg-center bg-no-repeat aspect-video md:aspect-square bg-cover shrink-0"
                  style={{
                    backgroundImage: `url("${order.items[0].image}")`,
                  }}
                />

                {/* Order Details */}
                <div className="flex flex-1 flex-col justify-between p-5">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-xl font-bold leading-tight tracking-tight text-foreground mb-1">
                        {order.items[0].name}
                        {order.items.length > 1 && ` + ${order.items.length - 1} món khác`}
                      </h3>
                      <div className="flex items-center gap-2 text-muted-foreground text-sm">
                        <span className="material-symbols-outlined text-[16px]">schedule</span>
                        <span>{order.orderDate} • {order.orderTime}</span>
                      </div>
                      <div className="mt-2 flex items-center gap-2">
                        <span className="text-xs font-bold text-muted-foreground">Mã đơn:</span>
                        <span className="text-sm font-mono font-bold text-primary">{order.orderId}</span>
                      </div>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${statusBadge.className}`}>
                      {statusBadge.label}
                    </span>
                  </div>

                  <div className="mt-4 pt-4 border-t border-border flex flex-wrap items-center justify-between gap-4">
                    <div className="flex flex-col">
                      <p className="text-muted-foreground text-sm">
                        {order.items.length} món • <span className="text-foreground font-bold">{order.total.toLocaleString('vi-VN')}đ</span>
                      </p>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex items-center gap-3 flex-wrap">
                      {isNeedsReview ? (
                        <>
                          <button
                            onClick={() => handleConfirmOrder(order)}
                            type="button"
                            className="flex items-center justify-center gap-2 px-5 h-10 rounded-lg bg-green-600 text-white text-sm font-bold hover:bg-green-700 transition-colors"
                          >
                            <CheckCircle className="w-4 h-4" />
                            Xác nhận lại
                          </button>
                          <button
                            onClick={() => handleEditOrder(order)}
                            type="button"
                            className="flex items-center justify-center gap-2 px-5 h-10 rounded-lg bg-blue-600 text-white text-sm font-bold hover:bg-blue-700 transition-colors"
                          >
                            <Edit3 className="w-4 h-4" />
                            Chỉnh sửa
                          </button>
                          <button
                            onClick={() => handleCancelOrder(order)}
                            type="button"
                            className="flex items-center justify-center gap-2 px-5 h-10 rounded-lg bg-red-600 text-white text-sm font-bold hover:bg-red-700 transition-colors"
                          >
                            <XCircle className="w-4 h-4" />
                            Hủy đơn
                          </button>
                        </>
                      ) : (
                        <>
                          {order.status === 'delivered' && (
                            <button
                              onClick={() => navigate(`/rating`)}
                              type="button"
                              className="flex items-center justify-center px-4 h-10 rounded-lg bg-accent text-foreground text-sm font-bold hover:bg-accent/80 transition-colors"
                            >
                              Đánh giá
                            </button>
                          )}
                          <button
                            onClick={() => navigate(`/order-detail`)}
                            type="button"
                            className="flex items-center justify-center px-4 h-10 rounded-lg bg-accent text-foreground text-sm font-bold hover:bg-accent/80 transition-colors"
                          >
                            Chi tiết
                          </button>
                          <button
                            type="button"
                            className="flex items-center justify-center px-6 h-10 rounded-lg bg-primary text-primary-foreground text-sm font-bold shadow-lg shadow-primary/20 hover:bg-primary/90 transition-transform active:scale-95"
                          >
                            Đặt lại
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Empty State */}
      {filteredOrders.length === 0 && (
        <div className="text-center py-16">
          <p className="text-muted-foreground text-lg">Không có đơn hàng nào</p>
        </div>
      )}

      {/* Confirmation Modal */}
      {confirmationModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="p-6 border-b border-gray-100 flex items-center gap-4">
              {confirmationModal.type === 'confirm' && <CheckCircle className="w-12 h-12 text-green-600" />}
              {confirmationModal.type === 'cancel' && <XCircle className="w-12 h-12 text-red-600" />}
              <div>
                <h3 className="text-xl font-bold text-gray-900">
                  {confirmationModal.type === 'confirm' && 'Xác nhận đơn hàng'}
                  {confirmationModal.type === 'cancel' && 'Hủy đơn hàng'}
                </h3>
                <p className="text-sm text-gray-600 mt-1">{confirmationModal.message}</p>
              </div>
            </div>
            <div className="p-6 space-y-4">
              {confirmationModal.type === 'confirm' && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <p className="text-sm text-green-800 font-medium">
                    ✓ Đơn hàng sẽ được xử lý với thông tin hiện tại. Nhà hàng sẽ chuẩn bị món cho bạn.
                  </p>
                </div>
              )}
              {confirmationModal.type === 'cancel' && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <p className="text-sm text-red-800 font-medium">
                    ⚠️ Đơn hàng sẽ bị hủy và bạn sẽ được hoàn tiền (nếu đã thanh toán).
                  </p>
                </div>
              )}
              <div className="flex gap-3">
                <button
                  onClick={() => setConfirmationModal(null)}
                  className="flex-1 px-4 py-3 rounded-lg bg-gray-100 text-gray-800 font-bold hover:bg-gray-200 transition-colors"
                >
                  Hủy bỏ
                </button>
                <button
                  onClick={executeAction}
                  className="flex-1 px-4 py-3 rounded-lg bg-primary text-white font-bold hover:bg-primary/90 transition-colors"
                >
                  Xác nhận
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default OrderHistoryTabContent;
