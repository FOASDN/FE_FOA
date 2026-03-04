import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useCheckout } from "@/hooks/useCheckout";
import { useToast } from "@/hooks/useToast";
import { ToastContainer } from "@/hooks/useToast";

const CheckoutPage = () => {
  const navigate = useNavigate();
  const { t } = useTranslation(["customer", "common"]);

  const {
    cartItems,
    addresses,
    effectiveAddress,
    setSelectedAddress,
    paymentMethod,
    setPaymentMethod,
    voucherState,
    setVoucherCode,
    applyVoucher,
    removeVoucher,
    subtotal,
    discount,
    deliveryFee,
    total,
    isSubmitting,
    handlePlaceOrder,
  } = useCheckout();

  const { toasts, dismiss } = useToast();

  // Guard: redirect to menu if cart is empty
  useEffect(() => {
    if (cartItems.length === 0) {
      navigate("/menu", { replace: true });
    }
  }, [cartItems.length, navigate]);

  return (
    <div className="bg-background-light dark:bg-background-dark text-[#1b140d] dark:text-white min-h-screen font-display">
      {/* Toast notifications */}
      <ToastContainer toasts={toasts} dismiss={dismiss} />

      <div className="layout-container flex h-full grow flex-col">
        <main className="max-w-[1200px] mx-auto w-full px-6 py-8">
          {/* ── Progress ── */}
          <div className="w-full mb-8">
            <div className="flex flex-col gap-3">
              <div className="flex gap-6 justify-between items-end">
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => navigate("/cart")}
                    className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 dark:bg-zinc-800 hover:bg-gray-200 dark:hover:bg-zinc-700 transition-colors"
                    aria-label="Quay lại giỏ hàng"
                  >
                    <span className="material-symbols-outlined text-[18px]">
                      arrow_back
                    </span>
                  </button>
                  <h1 className="text-[32px] font-bold leading-tight">
                    {t("customer:checkout.title")}
                  </h1>
                </div>
                <p className="text-sm font-normal leading-normal opacity-70">
                  Bước 2 trên 3 (66%)
                </p>
              </div>
              <div className="rounded-full bg-gray-200 dark:bg-gray-700 h-2 overflow-hidden">
                <div
                  className="h-full rounded-full bg-primary"
                  style={{ width: "66%" }}
                />
              </div>
            </div>
          </div>

          {/* ── Two Column Layout ── */}
          <div className="flex flex-col lg:flex-row gap-8 items-start">
            {/* ── LEFT COLUMN ── */}
            <div className="flex-1 flex flex-col gap-8 w-full">
              {/* Delivery Address */}
              <section className="bg-white dark:bg-zinc-900 rounded-xl shadow-sm border border-gray-100 dark:border-gray-800 overflow-hidden">
                <div className="flex flex-wrap justify-between gap-3 p-6 border-b border-gray-100 dark:border-gray-800">
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-primary">
                      location_on
                    </span>
                    <p className="text-xl font-bold">
                      {t("customer:checkout.deliveryAddress")}
                    </p>
                  </div>
                  <button
                    onClick={() => navigate("/addresses")}
                    className="flex min-w-[84px] cursor-pointer items-center justify-center rounded-lg h-9 px-4 bg-primary/10 text-primary text-sm font-semibold hover:bg-primary/20 transition-all"
                  >
                    <span>{t("customer:checkout.addAddress")}</span>
                  </button>
                </div>

                <div className="p-6 flex flex-col gap-4">
                  {addresses.length === 0 ? (
                    <div className="text-center py-6">
                      <span className="material-symbols-outlined text-4xl text-gray-300 mb-2">
                        location_off
                      </span>
                      <p className="text-gray-500 text-sm mb-3">
                        Bạn chưa có địa chỉ giao hàng.
                      </p>
                      <button
                        onClick={() => navigate("/addresses")}
                        className="inline-flex items-center gap-1 text-sm text-primary font-semibold hover:underline"
                      >
                        <span className="material-symbols-outlined text-base">
                          add
                        </span>
                        Thêm địa chỉ mới
                      </button>
                    </div>
                  ) : (
                    addresses.map((addr: any, idx: number) => {
                      const isSelected =
                        effectiveAddress?.detail === addr.detail &&
                        effectiveAddress?.receiver_name === addr.receiver_name;
                      return (
                        <label
                          key={idx}
                          className={`flex items-center gap-4 rounded-xl border-2 p-4 cursor-pointer transition-all ${
                            isSelected
                              ? "border-primary bg-primary/5"
                              : "border-gray-200 dark:border-gray-800 hover:border-primary/50"
                          }`}
                          onClick={() => setSelectedAddress(addr)}
                        >
                          <input
                            readOnly
                            className="h-5 w-5 border-2 border-gray-300 text-primary focus:ring-primary focus:ring-offset-0 accent-primary"
                            name="address"
                            type="radio"
                            checked={isSelected}
                          />
                          <div className="flex grow flex-col">
                            <div className="flex items-center gap-2">
                              <p className="text-sm font-bold">
                                {addr.label || "Địa chỉ"}
                              </p>
                              {addr.isDefault && (
                                <span className="text-[10px] bg-primary text-white px-2 py-0.5 rounded-full uppercase">
                                  Mặc định
                                </span>
                              )}
                            </div>
                            <p className="text-gray-600 dark:text-gray-400 text-sm">
                              {addr.receiver_name} • {addr.phone}
                            </p>
                            <p className="text-gray-500 dark:text-gray-500 text-xs mt-0.5">
                              {addr.detail}, {addr.ward}, {addr.district},{" "}
                              {addr.city}
                            </p>
                          </div>
                        </label>
                      );
                    })
                  )}
                </div>
              </section>

              {/* Payment Method */}
              <section className="bg-white dark:bg-zinc-900 rounded-xl shadow-sm border border-gray-100 dark:border-gray-800 overflow-hidden">
                <div className="p-6 border-b border-gray-100 dark:border-gray-800 flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary">
                    payments
                  </span>
                  <p className="text-xl font-bold">
                    {t("customer:checkout.paymentMethod")}
                  </p>
                </div>

                <div className="p-6">
                  <div className="flex gap-4 mb-4">
                    {/* COD */}
                    <button
                      id="payment-cod"
                      onClick={() => setPaymentMethod("cash_on_delivery")}
                      className={`flex-1 flex flex-col items-center justify-center p-4 rounded-xl gap-2 transition-all ${
                        paymentMethod === "cash_on_delivery"
                          ? "border-2 border-primary bg-primary/5"
                          : "border border-gray-200 dark:border-gray-800 hover:border-primary/50"
                      }`}
                    >
                      <span className="material-symbols-outlined">
                        account_balance_wallet
                      </span>
                      <span className="text-sm font-bold">
                        {t("customer:checkout.cod")}
                      </span>
                    </button>

                    {/* Credit Card */}
                    <button
                      id="payment-card"
                      onClick={() => setPaymentMethod("credit_card")}
                      className={`flex-1 flex flex-col items-center justify-center p-4 rounded-xl gap-2 transition-all ${
                        paymentMethod === "credit_card"
                          ? "border-2 border-primary bg-primary/5"
                          : "border border-gray-200 dark:border-gray-800 hover:border-primary/50"
                      }`}
                    >
                      <span className="material-symbols-outlined">
                        credit_card
                      </span>
                      <span className="text-sm font-bold">
                        {t("customer:checkout.cardPayment", "Thẻ tín dụng")}
                      </span>
                    </button>
                  </div>

                  {/* COD Info */}
                  {paymentMethod === "cash_on_delivery" && (
                    <div className="bg-amber-50 dark:bg-amber-900/10 border border-amber-200 dark:border-amber-800/30 rounded-xl p-4">
                      <div className="flex items-start gap-3">
                        <span className="material-symbols-outlined text-amber-600 dark:text-amber-400 text-2xl">
                          info
                        </span>
                        <div>
                          <h4 className="font-bold text-amber-900 dark:text-amber-400 mb-1">
                            Thanh toán khi nhận hàng
                          </h4>
                          <p className="text-sm text-amber-800 dark:text-amber-500/80">
                            Vui lòng chuẩn bị số tiền{" "}
                            <strong>{total.toLocaleString("vi-VN")}đ</strong>{" "}
                            khi nhận hàng. Shipper sẽ thu tiền mặt và đưa hóa
                            đơn cho bạn.
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Card (placeholder — no real payment gateway) */}
                  {paymentMethod === "credit_card" && (
                    <div className="bg-blue-50 dark:bg-blue-900/10 border border-blue-200 dark:border-blue-800/30 rounded-xl p-4">
                      <div className="flex items-start gap-3">
                        <span className="material-symbols-outlined text-blue-600 text-2xl">
                          info
                        </span>
                        <p className="text-sm text-blue-800 dark:text-blue-300">
                          Thanh toán thẻ sẽ được hỗ trợ trong phiên bản tới.
                          Hiện tại vui lòng chọn thanh toán khi nhận hàng.
                        </p>
                      </div>
                    </div>
                  )}

                  {paymentMethod === "credit_card" && (
                    <div className="bg-gray-50 dark:bg-zinc-800/50 p-4 flex justify-center gap-6 opacity-60 mt-4 rounded-lg">
                      <span className="material-symbols-outlined text-2xl">
                        shield_lock
                      </span>
                      <p className="text-xs flex items-center gap-1 font-medium">
                        SECURE CHECKOUT SSL ENCRYPTED
                      </p>
                    </div>
                  )}
                </div>
              </section>
            </div>

            {/* ── RIGHT COLUMN — Order Summary (Sticky) ── */}
            <aside className="w-full lg:w-[380px] lg:sticky lg:top-24">
              <div className="bg-white dark:bg-zinc-900 rounded-xl shadow-lg border border-gray-100 dark:border-gray-800 overflow-hidden">
                <div className="p-6 border-b border-gray-100 dark:border-gray-800">
                  <h3 className="text-lg font-bold mb-4">
                    {t("customer:cart.grandTotal", "Tóm tắt đơn hàng")}
                  </h3>

                  {/* Item List */}
                  <div className="flex flex-col gap-3 mb-6 max-h-52 overflow-y-auto pr-1">
                    {cartItems.map((item) => (
                      <div
                        key={item.productId}
                        className="flex justify-between items-center gap-3"
                      >
                        <div className="flex gap-3 items-center min-w-0">
                          {item.image && (
                            <div
                              className="size-10 rounded-lg bg-gray-100 bg-cover bg-center shrink-0"
                              style={{
                                backgroundImage: `url('${item.image}')`,
                              }}
                            />
                          )}
                          <div className="min-w-0">
                            <p className="text-sm font-bold truncate">
                              {item.quantity}× {item.name}
                            </p>
                            {item.size && (
                              <p className="text-xs text-gray-500">
                                {item.size}
                              </p>
                            )}
                          </div>
                        </div>
                        <p className="text-sm font-bold shrink-0">
                          {(item.price * item.quantity).toLocaleString("vi-VN")}
                          đ
                        </p>
                      </div>
                    ))}
                  </div>

                  {/* Voucher Input */}
                  <div className="mb-5">
                    <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">
                      {t("customer:cart.voucherCode")}
                    </label>

                    {voucherState.appliedVoucher ? (
                      /* Applied voucher badge */
                      <div className="flex items-center justify-between bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-700 rounded-lg px-4 py-3">
                        <div className="flex items-center gap-2">
                          <span className="material-symbols-outlined text-green-600 text-lg">
                            local_offer
                          </span>
                          <span className="text-sm font-bold text-green-700 dark:text-green-400">
                            {voucherState.appliedVoucher.code}
                          </span>
                        </div>
                        <button
                          onClick={removeVoucher}
                          className="text-red-500 hover:text-red-700 text-xs font-semibold flex items-center gap-1"
                        >
                          <span className="material-symbols-outlined text-sm">
                            close
                          </span>
                          Bỏ
                        </button>
                      </div>
                    ) : (
                      /* Voucher input */
                      <div className="flex gap-2">
                        <input
                          id="voucher-input"
                          value={voucherState.code}
                          onChange={(e) => setVoucherCode(e.target.value)}
                          onKeyDown={(e) => e.key === "Enter" && applyVoucher()}
                          className="flex-1 rounded-lg border border-gray-200 dark:border-gray-700 dark:bg-zinc-800 focus:border-primary focus:ring-primary text-sm uppercase font-bold px-3 py-2 outline-none"
                          placeholder={t("customer:cart.voucherCode")}
                          type="text"
                          maxLength={20}
                          disabled={voucherState.isValidating}
                        />
                        <button
                          id="apply-voucher-btn"
                          onClick={applyVoucher}
                          disabled={
                            !voucherState.code.trim() ||
                            voucherState.isValidating
                          }
                          className="bg-primary text-white px-4 py-2 rounded-lg font-bold text-sm hover:brightness-110 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1"
                        >
                          {voucherState.isValidating ? (
                            <span className="material-symbols-outlined animate-spin text-sm">
                              progress_activity
                            </span>
                          ) : (
                            t("customer:cart.applyVoucher")
                          )}
                        </button>
                      </div>
                    )}

                    {voucherState.error && (
                      <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                        <span className="material-symbols-outlined text-sm">
                          error
                        </span>
                        {voucherState.error}
                      </p>
                    )}
                  </div>

                  {/* Cost Breakdown */}
                  <div className="flex flex-col gap-2 border-t border-dashed border-gray-200 dark:border-gray-800 pt-4">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">
                        {t("customer:cart.subtotal")}
                      </span>
                      <span>{subtotal.toLocaleString("vi-VN")}đ</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">
                        {t("customer:cart.deliveryFee")}
                      </span>
                      <span className="text-green-600">
                        {deliveryFee === 0
                          ? "MIỄN PHÍ"
                          : `${deliveryFee.toLocaleString("vi-VN")}đ`}
                      </span>
                    </div>
                    {discount > 0 && (
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-500">
                          Giảm giá (voucher)
                        </span>
                        <span className="text-red-500 font-semibold">
                          -{discount.toLocaleString("vi-VN")}đ
                        </span>
                      </div>
                    )}
                    <div className="flex justify-between text-xl font-bold mt-2 pt-4 border-t border-gray-100 dark:border-gray-800">
                      <span>{t("customer:cart.grandTotal")}</span>
                      <span className="text-primary">
                        {total.toLocaleString("vi-VN")}đ
                      </span>
                    </div>
                  </div>
                </div>

                {/* CTA Button */}
                <div className="p-6">
                  <button
                    id="place-order-btn"
                    onClick={handlePlaceOrder}
                    disabled={
                      isSubmitting ||
                      cartItems.length === 0 ||
                      !effectiveAddress
                    }
                    className="w-full bg-primary text-white py-4 rounded-xl font-bold text-lg shadow-lg shadow-primary/30 hover:shadow-primary/40 hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:translate-y-0"
                  >
                    {isSubmitting ? (
                      <>
                        <span className="material-symbols-outlined animate-spin text-xl">
                          progress_activity
                        </span>
                        <span>{t("common:processing", "Đang xử lý...")}</span>
                      </>
                    ) : (
                      <>
                        <span>{t("customer:checkout.placeOrder")}</span>
                        <span className="material-symbols-outlined">
                          arrow_forward
                        </span>
                      </>
                    )}
                  </button>

                  {!effectiveAddress && (
                    <p className="text-xs text-center text-amber-600 mt-2 flex items-center justify-center gap-1">
                      <span className="material-symbols-outlined text-sm">
                        warning
                      </span>
                      Vui lòng thêm địa chỉ giao hàng
                    </p>
                  )}

                  <p className="text-[10px] text-center text-gray-400 mt-4 leading-relaxed">
                    Bằng việc đặt hàng, bạn đồng ý với{" "}
                    <a className="underline" href="#">
                      Điều khoản dịch vụ
                    </a>{" "}
                    và{" "}
                    <a className="underline" href="#">
                      Chính sách quyền riêng tư
                    </a>{" "}
                    của FoodieDash
                  </p>
                </div>
              </div>

              {/* Trust Badges */}
              <div className="mt-6 flex justify-center gap-4 grayscale opacity-50">
                <img
                  alt="Visa"
                  className="h-4"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuCs__c9M-2vVKGK39Py16iaIlYcqaZ_fFqPRjQ1JYdrHwDhoWoO8wgUKjop6DCVzNX2nG8cjStqfaSLG0xZi-kU1MTLT36uib2zzzXNLNECIqmr4CMLoP_GihLv8GA8gZdmjBhoDxgSh9R-Yoyc8npF0INS8mHfyhsn6cV5DcJd7CDr2Zrc_xiSvuRWaBWw6457-vDhy1O3pmSMiJr6XUIZeJXmyLKCwVODJ1j_ypvM2u9LPXTQmnnpxff-zNyZRI7vF2acFkInJiQ"
                />
                <img
                  alt="Mastercard"
                  className="h-6"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuDMxVr6eBwHtfIFCaw585rSGpM0YrdmPjmsspstqNGuZGT3i94uMka9pKHVmDNB_fDda9tGltqt-qW0RVN3XFLhm_3nZ0t8Gyh4CGs5DQTL-gZ8lbaMD0B5816ZdT7Xhh_-nVCT_KfnPPPVVduRzSU4olUpM8Nu2dSCBA3N2Gm2M3W03uIJBhFNMAsThxzBPxh5FsdKP5XyVyTr3FgLn51XFCeSlaDeTMBpFstLToFCAckR1GZxREjn_miKjAK0EtebgSJKHMcaqyA"
                />
              </div>
            </aside>
          </div>
        </main>
      </div>
    </div>
  );
};

export default CheckoutPage;
