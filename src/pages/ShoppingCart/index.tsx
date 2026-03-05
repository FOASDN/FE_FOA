import { Link, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useCart } from "@/hooks/useCart";
import { MOCK_UPSELL_ITEMS } from "@/constants/mockOrders";
import { useEffect } from "react";
import { itemKey } from "@/store/cartStore";
import { buildVariantChips } from "@/utils/cartVariants";

const ShoppingCartPage = () => {
  const navigate = useNavigate();
  const { t } = useTranslation(["customer", "common"]);

  // ─── Real state from Zustand Store ───
  const {
    items: cartItems,
    totalPrice,
    updateQuantity,
    removeItem,
    addItem,
  } = useCart();

  // ─── Cleanup: Remove old mock data (ids not length 24) ───
  useEffect(() => {
    const invalidItems = cartItems.filter(
      (item) => item.productId.length !== 24,
    );
    if (invalidItems.length > 0) {
      console.warn("Removing legacy mock items from cart:", invalidItems);
      invalidItems.forEach((item) => removeItem(item.productId));
    }
  }, [cartItems, removeItem]);

  const subtotal = totalPrice;
  const deliveryFee = subtotal > 300000 || subtotal === 0 ? 0 : 50000;
  const discount = 0; // Logic voucher sẽ được xử lý ở trang Checkout
  const total = subtotal + deliveryFee - discount;

  // Mock upsell items (vẫn giữ để UI đẹp)
  const upsellItems = MOCK_UPSELL_ITEMS;

  return (
    <div className="bg-background-light dark:bg-background-dark text-text-main dark:text-background-light font-display min-h-screen">
      <main className="max-w-[1440px] mx-auto px-4 md:px-10 lg:px-20 py-8">
        {/* Breadcrumbs */}
        <div className="flex flex-wrap gap-2 mb-6">
          <Link
            to="/"
            className="text-[#9a734c] text-sm font-medium leading-normal hover:text-primary transition-colors"
          >
            {t("common:nav.home")}
          </Link>
          <span className="text-[#9a734c] text-sm font-medium leading-normal">
            /
          </span>
          <span className="text-text-main dark:text-white text-sm font-medium leading-normal">
            {t("customer:cart.title")}
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Left Column: Cart Items */}
          <div className="lg:col-span-2 flex flex-col gap-6">
            {/* Page Heading */}
            <div className="flex flex-col gap-1 mb-2">
              <h1 className="text-3xl md:text-4xl font-extrabold text-text-main dark:text-white leading-tight">
                {t("customer:cart.title")}
              </h1>
              <p className="text-[#9a734c] text-base font-normal">
                Bạn có {cartItems.reduce((acc, item) => acc + item.quantity, 0)}{" "}
                món trong giỏ hàng
              </p>
            </div>

            {/* List Items */}
            <div className="flex flex-col gap-2 bg-white dark:bg-white/5 rounded-xl overflow-hidden shadow-sm border border-gray-100 dark:border-white/10">
              {cartItems.length === 0 ? (
                <div className="text-center py-20 px-4">
                  <span className="material-symbols-outlined text-6xl text-gray-300 mb-4">
                    shopping_cart_off
                  </span>
                  <p className="text-xl font-bold text-gray-500 mb-4">
                    {t("customer:cart.empty")}
                  </p>
                  <Link
                    to="/menu"
                    className="inline-block px-6 py-3 bg-primary text-white font-bold rounded-lg hover:bg-primary/90 transition-colors"
                  >
                    {t("customer:cart.browsMenu")}
                  </Link>
                </div>
              ) : (
                cartItems.map((item, idx) => (
                  <div
                    key={itemKey(item)}
                    className="flex flex-col sm:flex-row gap-4 px-6 py-6 border-b border-gray-100 dark:border-white/10 last:border-b-0"
                  >
                    <div
                      className="bg-center bg-no-repeat aspect-video bg-cover rounded-lg h-[100px] w-full sm:w-[160px] shrink-0 bg-gray-100"
                      style={{ backgroundImage: `url("${item.image}")` }}
                    ></div>
                    <div className="flex flex-1 flex-col justify-between">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="text-lg font-bold text-text-main dark:text-white line-clamp-1">
                            {item.name}
                          </h3>
                          <p className="text-[#9a734c] text-sm mt-1">
                            {item.size || "Standard"}
                          </p>

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
                        <p className="text-lg font-bold text-text-main dark:text-white">
                          {(item.price * item.quantity).toLocaleString("vi-VN")}
                          đ
                        </p>
                      </div>
                      <div className="flex items-center justify-between mt-4 sm:mt-0">
                        <button
                          onClick={() => removeItem(itemKey(item))}
                          className="text-red-500 text-sm font-medium flex items-center gap-1 hover:underline"
                        >
                          <span className="material-symbols-outlined text-lg">
                            delete
                          </span>{" "}
                          {t("common:actions.delete")}
                        </button>
                        <div className="flex items-center gap-3">
                          <button
                            onClick={() =>
                              updateQuantity(itemKey(item), item.quantity - 1)
                            }
                            className="text-base font-bold flex h-8 w-8 items-center justify-center rounded-lg bg-gray-100 dark:bg-white/10 hover:bg-primary/20 transition-colors"
                          >
                            -
                          </button>
                          <span className="text-base font-bold w-8 text-center bg-transparent dark:text-white">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() =>
                              updateQuantity(itemKey(item), item.quantity + 1)
                            }
                            className="text-base font-bold flex h-8 w-8 items-center justify-center rounded-lg bg-gray-100 dark:bg-white/10 hover:bg-primary/20 transition-colors"
                          >
                            +
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Special Instructions & Add More */}
            {cartItems.length > 0 && (
              <div className="flex flex-col gap-6">
                <Link
                  to="/menu"
                  className="inline-flex items-center gap-2 text-primary font-bold hover:gap-3 transition-all"
                >
                  <span className="material-symbols-outlined">add_circle</span>{" "}
                  {t("customer:cart.continueShopping", "Thêm món khác")}
                </Link>
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-bold text-text-main dark:text-white">
                    {t("customer:checkout.orderNote")}
                  </label>
                  <textarea
                    className="w-full bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-lg p-3 text-sm focus:ring-primary focus:border-primary transition-all dark:text-white"
                    placeholder={t(
                      "customer:checkout.orderNotePlaceholder",
                      "Lời nhắn cho nhà hàng...",
                    )}
                    rows={3}
                  ></textarea>
                </div>
              </div>
            )}
          </div>

          {/* Right Column: Order Summary */}
          {cartItems.length > 0 && (
            <div className="flex flex-col gap-6">
              <div className="sticky top-24 flex flex-col gap-6">
                {/* Price Breakdown */}
                <div className="bg-white dark:bg-white/5 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-white/10">
                  <p className="text-text-main dark:text-white text-lg font-bold mb-6">
                    {t("customer:cart.grandTotal", "Tóm tắt đơn hàng")}
                  </p>
                  <div className="flex flex-col gap-4">
                    <div className="flex justify-between items-center text-[#9a734c]">
                      <span className="text-sm">
                        {t("customer:cart.subtotal")}
                      </span>
                      <span className="text-sm font-medium">
                        {subtotal.toLocaleString("vi-VN")}đ
                      </span>
                    </div>
                    <div className="flex justify-between items-center text-[#9a734c]">
                      <span className="text-sm">
                        {t("customer:cart.deliveryFee")}
                      </span>
                      <span className="text-sm font-medium text-green-600">
                        {deliveryFee === 0
                          ? t("common:status.free", "Miễn phí")
                          : `${deliveryFee.toLocaleString("vi-VN")}đ`}
                      </span>
                    </div>
                    <hr className="border-gray-100 dark:border-white/10 my-2" />
                    <div className="flex justify-between items-center text-text-main dark:text-white">
                      <span className="text-lg font-bold">
                        {t("customer:cart.grandTotal")}
                      </span>
                      <span className="text-2xl font-black text-primary">
                        {total.toLocaleString("vi-VN")}đ
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={() => navigate("/checkout")}
                    className="w-full bg-primary text-white py-4 rounded-xl font-bold text-lg mt-8 hover:bg-primary/90 shadow-lg shadow-primary/20 transition-all flex items-center justify-center gap-2"
                  >
                    {t("customer:cart.checkout", "Tiến hành thanh toán")}
                    <span className="material-symbols-outlined">
                      arrow_forward
                    </span>
                  </button>

                  <p className="text-center text-[10px] text-[#9a734c] mt-4 uppercase tracking-widest font-bold">
                    Thanh toán bảo mật qua cổng kết nối an toàn
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Upsell / People also ordered */}
        <div className="mt-16">
          <h3 className="text-text-main dark:text-white text-xl font-bold mb-6">
            {t("customer:cart.youMayLike", "Có thể bạn sẽ thích")}
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {upsellItems.map((item) => (
              <div
                key={item.id}
                className="bg-white dark:bg-white/5 p-4 rounded-xl border border-gray-100 dark:border-white/10 group hover:border-primary transition-all"
              >
                <div
                  className="bg-center bg-no-repeat aspect-video bg-cover rounded-lg mb-3"
                  style={{ backgroundImage: `url("${item.image}")` }}
                ></div>
                <p className="font-bold text-sm truncate text-text-main dark:text-white">
                  {item.name}
                </p>
                <div className="flex justify-between items-center mt-2">
                  <span className="text-primary font-bold text-sm">
                    {item.price.toLocaleString("vi-VN")}đ
                  </span>
                  <button
                    onClick={() =>
                      addItem({
                        productId: String(item.id),
                        name: item.name,
                        image: item.image,
                        price: item.price,
                        quantity: 1,
                      })
                    }
                    className="bg-gray-100 dark:bg-white/10 p-1 rounded-md text-primary hover:bg-primary hover:text-white transition-colors"
                  >
                    <span className="material-symbols-outlined text-sm">
                      add
                    </span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
};

export default ShoppingCartPage;
