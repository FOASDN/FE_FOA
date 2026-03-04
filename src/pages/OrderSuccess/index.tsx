import { useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";

interface OrderSuccessState {
  orderCode?: string;
  orderId?: string;
  totalPrice?: number;
}

const OrderSuccessPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useTranslation(["customer", "common"]);

  // Read the order info passed via navigation state from CheckoutPage
  const state = location.state as OrderSuccessState | null;
  const orderCode = state?.orderCode;
  const totalPrice = state?.totalPrice;
  const orderId = state?.orderId;

  // Security guard: if someone navigates here directly without placing an order,
  // redirect to home after a brief delay
  useEffect(() => {
    if (!orderCode) {
      const timer = setTimeout(() => navigate("/", { replace: true }), 100);
      return () => clearTimeout(timer);
    }
  }, [orderCode, navigate]);

  if (!orderCode) {
    return null; // Will redirect
  }

  return (
    <div className="bg-background-light dark:bg-background-dark font-display text-[#1b140d] antialiased min-h-screen relative">
      {/* Background Content (Blurred Skeleton) */}
      <div className="relative flex min-h-screen w-full flex-col overflow-x-hidden">
        <div className="layout-container flex h-full grow flex-col">
          <div className="px-4 md:px-40 flex flex-1 justify-center py-5">
            <div className="layout-content-container flex flex-col max-w-[960px] flex-1">
              {/* Skeleton background for blurred effect */}
              <div className="py-10 px-4 md:px-10 opacity-30 grayscale pointer-events-none">
                <div className="h-64 bg-gray-200 dark:bg-gray-800 rounded-xl mb-6" />
                <div className="h-8 w-1/3 bg-gray-200 dark:bg-gray-800 rounded mb-4" />
                <div className="h-4 w-full bg-gray-100 dark:bg-gray-800 rounded mb-2" />
                <div className="h-4 w-5/6 bg-gray-100 dark:bg-gray-800 rounded mb-2" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal Overlay */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-md bg-white/60 dark:bg-black/60">
        {/* Success Modal */}
        <div className="relative w-full max-w-[440px] bg-white dark:bg-[#181a1b] rounded-2xl p-8 flex flex-col items-center shadow-2xl border border-[#f3ede7] dark:border-gray-700 animate-in zoom-in-95 fade-in duration-300">
          {/* Success Icon */}
          <div className="mb-8 relative">
            <div className="absolute inset-0 bg-green-400/20 rounded-full scale-150 blur-xl" />
            <div className="relative w-20 h-20 rounded-full bg-green-400 flex items-center justify-center text-white shadow-lg shadow-green-400/30">
              <span className="material-symbols-outlined text-[48px] font-bold">
                check
              </span>
            </div>
          </div>

          {/* Headline */}
          <h1 className="text-[#1b140d] dark:text-white tracking-tight text-[28px] font-extrabold leading-tight text-center pb-2">
            {t("customer:orderSuccess.title")}
          </h1>

          {/* Order Code */}
          <p className="text-[#9a734c] dark:text-gray-400 text-base font-normal leading-relaxed text-center px-4 mb-2">
            Mã đơn hàng của bạn:
          </p>
          <div className="bg-primary/10 border border-primary/20 rounded-xl px-6 py-3 mb-6">
            <span className="font-black text-xl text-primary tracking-widest">
              #{orderCode}
            </span>
          </div>

          <p className="text-[#9a734c] dark:text-gray-400 text-sm text-center mb-6">
            Chúng tôi đã ghi nhận đơn hàng của bạn và sẽ xử lý ngay.
            {totalPrice && (
              <>
                {" "}
                Tổng thanh toán:{" "}
                <strong className="text-[#1b140d] dark:text-white">
                  {totalPrice.toLocaleString("vi-VN")}đ
                </strong>
              </>
            )}
          </p>

          {/* Delivery Estimate */}
          <div className="w-full bg-[#fcfaf8] dark:bg-gray-800 rounded-lg p-4 mb-8 flex items-center gap-4 border border-[#f3ede7] dark:border-gray-700">
            <div className="size-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
              <span className="material-symbols-outlined">local_shipping</span>
            </div>
            <div className="flex-1">
              <p className="text-xs font-semibold uppercase tracking-wider text-[#9a734c] dark:text-gray-500">
                Dự kiến giao hàng
              </p>
              <p className="text-sm font-bold text-[#1b140d] dark:text-white">
                Hôm nay, trong vòng 30–45 phút
              </p>
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col gap-3 w-full">
            {orderId && (
              <button
                id="view-order-btn"
                onClick={() => navigate(`/order-detail/${orderId}`)}
                className="flex items-center justify-center rounded-lg h-14 bg-primary text-white text-base font-bold leading-normal tracking-[0.015em] w-full shadow-lg shadow-primary/20 hover:scale-[1.02] transition-transform"
              >
                <span className="material-symbols-outlined mr-2">
                  visibility
                </span>
                <span>
                  {t("customer:orderSuccess.trackOrder", "Xem đơn hàng")}
                </span>
              </button>
            )}

            <Link to="/" replace>
              <button
                id="back-home-btn"
                className="flex items-center justify-center rounded-lg h-14 bg-[#f3ede7] dark:bg-gray-700 text-[#1b140d] dark:text-white text-base font-bold leading-normal tracking-[0.015em] w-full hover:bg-[#ebe2d9] dark:hover:bg-gray-600 transition-colors"
              >
                <span>{t("customer:orderSuccess.backToHome")}</span>
              </button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderSuccessPage;
