import { useState, useMemo, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "./useCart";
import { useAuth } from "./useAuth";
import { useToast } from "./useToast";
import orderService from "@/services/order.service";
import type {
  PaymentMethod,
  PlaceOrderAddress,
} from "@/services/order.service";
import voucherService from "@/services/voucher.service";
import type { Voucher } from "@/types/voucher";
import type { AuthAddress } from "@/store/authStore";

// ────────────────────────────────────────────────────────────────────────────
// Types
// ────────────────────────────────────────────────────────────────────────────

export interface VoucherState {
  code: string;
  isValidating: boolean;
  appliedVoucher: Voucher | null;
  discountAmount: number;
  error: string | null;
}

// ────────────────────────────────────────────────────────────────────────────
// Hook
// ────────────────────────────────────────────────────────────────────────────

/**
 * useCheckout — encapsulates all business logic for the checkout flow.
 *
 * Responsibilities:
 *  - Reads cart items from cartStore (localStorage-backed Zustand)
 *  - Reads user addresses from authStore
 *  - Manages selected address state
 *  - Manages voucher validation (live, with BE round-trip)
 *  - Manages payment method selection
 *  - Handles order submission → clear cart → navigate to success
 */
export const useCheckout = () => {
  const navigate = useNavigate();
  const { items: cartItems, totalPrice, clearCart } = useCart();
  const { user } = useAuth();
  const { toast } = useToast();

  // ── Address ───────────────────────────────────────────────────────────────
  const addresses = useMemo(
    () => (user?.addresses ?? []) as AuthAddress[],
    [user],
  );

  // Find the default address; if none marked default, use first one
  const defaultAddress = useMemo(
    () => addresses.find((a: any) => a.isDefault) ?? addresses[0] ?? null,
    [addresses],
  );

  const [selectedAddress, setSelectedAddress] =
    useState<PlaceOrderAddress | null>(null);

  // Effective address for order submission (selectedAddress overrides default)
  const effectiveAddress =
    selectedAddress ?? (defaultAddress as PlaceOrderAddress | null);

  // ── Payment Method ────────────────────────────────────────────────────────
  const [paymentMethod, setPaymentMethod] =
    useState<PaymentMethod>("cash_on_delivery");

  // ── Voucher ───────────────────────────────────────────────────────────────
  const [voucherState, setVoucherState] = useState<VoucherState>({
    code: "",
    isValidating: false,
    appliedVoucher: null,
    discountAmount: 0,
    error: null,
  });

  const setVoucherCode = useCallback((code: string) => {
    setVoucherState((prev) => ({
      ...prev,
      code: code.toUpperCase(),
      // Reset applied state when user changes code
      appliedVoucher: null,
      discountAmount: 0,
      error: null,
    }));
  }, []);

  const applyVoucher = useCallback(async () => {
    const code = voucherState.code.trim();
    if (!code) return;

    setVoucherState((prev) => ({ ...prev, isValidating: true, error: null }));

    try {
      const res = await voucherService.validateVoucher({
        code,
        orderAmount: totalPrice,
      });

      if (res.data) {
        setVoucherState((prev) => ({
          ...prev,
          isValidating: false,
          appliedVoucher: res.data!.voucher,
          discountAmount: res.data!.discountAmount,
          error: null,
        }));
        toast(
          `Áp dụng voucher thành công! Giảm ${res.data.discountAmount.toLocaleString("vi-VN")}đ`,
          "success",
        );
      }
    } catch (err: any) {
      const message =
        err?.response?.data?.message ?? "Voucher không hợp lệ hoặc đã hết hạn";
      setVoucherState((prev) => ({
        ...prev,
        isValidating: false,
        appliedVoucher: null,
        discountAmount: 0,
        error: message,
      }));
      toast(message, "error");
    }
  }, [voucherState.code, totalPrice, toast]);

  const removeVoucher = useCallback(() => {
    setVoucherState({
      code: "",
      isValidating: false,
      appliedVoucher: null,
      discountAmount: 0,
      error: null,
    });
  }, []);

  // ── Pricing ───────────────────────────────────────────────────────────────
  const subtotal = totalPrice;
  const discount = voucherState.discountAmount;
  // Delivery fee: free if subtotal > 300k
  const deliveryFee = subtotal > 300_000 ? 0 : 50_000;
  const total = Math.max(0, subtotal - discount + deliveryFee);

  // ── Submission ────────────────────────────────────────────────────────────
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handlePlaceOrder = useCallback(async () => {
    if (isSubmitting) return;

    // Guard: cart must not be empty
    if (cartItems.length === 0) {
      toast("Giỏ hàng của bạn đang trống", "warning");
      navigate("/menu");
      return;
    }

    // Guard: must have delivery address
    if (!effectiveAddress) {
      toast("Vui lòng thêm địa chỉ giao hàng trước khi đặt hàng", "warning");
      return;
    }

    setIsSubmitting(true);

    try {
      const payload = {
        items: cartItems.map((item) => ({
          product_id: item.productId,
          quantity: item.quantity,
          variations: [], // CartItem currently has no variations
        })),
        payment_method: paymentMethod,
        // Only send voucher._id if one is applied (must be 24-char ObjectId)
        ...(voucherState.appliedVoucher
          ? { voucher: voucherState.appliedVoucher._id }
          : {}),
        // Send the selected/default address so BE doesn't need to look it up
        delivery_address: effectiveAddress,
        shipping_fee: deliveryFee,
      };

      const response = await orderService.placeOrder(payload);
      const order = response.data;

      // Clear FE cart after successful order
      clearCart();

      // If there's a checkoutUrl (PayOS), redirect to it
      if (order.checkoutUrl) {
        window.location.href = order.checkoutUrl;
        return;
      }

      // Navigate to success page, passing the order code via navigation state
      navigate("/success", {
        state: {
          orderCode: order.code,
          orderId: order._id,
          totalPrice: order.total_price,
        },
        replace: true, // Prevent back-navigation to checkout
      });
    } catch (err: any) {
      const message =
        err?.response?.data?.message ?? "Đặt hàng thất bại. Vui lòng thử lại.";
      toast(message, "error");
    } finally {
      setIsSubmitting(false);
    }
  }, [
    isSubmitting,
    cartItems,
    effectiveAddress,
    paymentMethod,
    voucherState.appliedVoucher,
    clearCart,
    navigate,
    toast,
  ]);

  // ────────────────────────────────────────────────────────────────────────
  return {
    // Cart
    cartItems,
    // Address
    addresses,
    defaultAddress,
    selectedAddress,
    effectiveAddress,
    setSelectedAddress,
    // Payment
    paymentMethod,
    setPaymentMethod,
    // Voucher
    voucherState,
    setVoucherCode,
    applyVoucher,
    removeVoucher,
    // Pricing
    subtotal,
    discount,
    deliveryFee,
    total,
    // Submit
    isSubmitting,
    handlePlaceOrder,
  };
};
