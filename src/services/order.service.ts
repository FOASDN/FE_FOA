import { apiClient } from "@/lib/api-client";

// ────────────────────────────────────────────────────────────────────────────
// Types — aligned with BE order.validator.ts & IOrder
// ────────────────────────────────────────────────────────────────────────────

export interface PlaceOrderItemVariation {
  name: string;
  choice: string;
  extra_price?: number;
}

export interface PlaceOrderItem {
  product_id: string;
  quantity: number;
  variations?: PlaceOrderItemVariation[];
}

export interface PlaceOrderAddress {
  label?: string;
  receiver_name: string;
  phone: string;
  detail: string;
  ward: string;
  district: string;
  city: string;
}

export type PaymentMethod =
  | "cash_on_delivery"
  | "credit_card"
  | "paypal"
  | "bank_transfer";

export interface PlaceOrderRequest {
  items: PlaceOrderItem[];
  payment_method?: PaymentMethod;
  voucher?: string; // ObjectId string (24 chars) — optional
  shipping_fee?: number;
  delivery_address?: PlaceOrderAddress; // optional, BE falls back to default address
  note?: string;
}

export interface PlacedOrder {
  _id: string;
  code: string;
  status: string;
  items: Array<{
    product_id: string;
    quantity: number;
    variations: Array<{ name: string; choice: string; extra_price: number }>;
    sub_total: number;
  }>;
  sub_total: number;
  note?: string;
  staff_note_items?: string[];
  shipping_fee: number;
  total_price: number;
  payment: {
    method: PaymentMethod;
    paid_at: string | null;
  };
  delivery_address: PlaceOrderAddress;
  voucher: string | null;
  checkoutUrl?: string;
  createdAt: string;
}

// Unified Order interface for the app
export interface Order {
  _id: string;
  code: string;
  user_id?: {
    _id: string;
    username: string;
    email: string;
    phone: string;
  };
  items: Array<{
    product_id: {
      _id: string;
      name: string;
      image: string | { secure_url: string };
      price: number;
    };
    quantity: number;
    variations: Array<{ name: string; choice: string; extra_price?: number }>;
    sub_total: number;
  }>;
  note?: string;
  staff_note_items?: string[];
  status:
  | "pending"
  | "confirmed"
  | "processing"
  | "ready_for_delivery"
  | "shipping"
  | "completed"
  | "cancelled";
  sub_total: number;
  shipping_fee: number;
  total_price: number;
  payment: {
    method: PaymentMethod;
    paid_at: string | null;
  };
  delivery_address: PlaceOrderAddress;
  delivery_info?: {
    shipped_at?: string;
    delivered_at?: string;
    driver_id?: string | null;
  };
  voucher?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface OrderListResponse {
  success: boolean;
  data: Order[];
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// ────────────────────────────────────────────────────────────────────────────
// Service
// ────────────────────────────────────────────────────────────────────────────

class OrderService {
  /** Place a new order — Customer */
  async placeOrder(
    data: PlaceOrderRequest,
  ): Promise<{ success: boolean; data: PlacedOrder }> {
    const response = await apiClient.post("/orders", data);
    return response.data;
  }

  /** Get current user's order history */
  async getMyOrders(page = 1, limit = 10): Promise<OrderListResponse> {
    const response = await apiClient.get("/orders/me", {
      params: { page, limit },
    });
    return response.data;
  }

  /** Get order detail by ID */
  async getOrderById(id: string): Promise<{ success: boolean; data: Order }> {
    const response = await apiClient.get(`/orders/${id}`);
    return response.data;
  }

  /** Update order status (Admin/Staff) */
  async updateOrderStatus(
    id: string,
    status: Order["status"],
  ): Promise<{ success: boolean; data: Order }> {
    const response = await apiClient.patch(`/orders/${id}/status`, { status });
    return response.data;
  }

  /** Get all orders — Admin/Staff */
  async getAllOrders(params?: {
    status?: string;
    driver_id?: string;
    page?: number;
    limit?: number;
    sort?: string;
  }): Promise<OrderListResponse> {
    const response = await apiClient.get("/orders", { params });
    return response.data;
  }

  /** Cancel an order */
  async cancelOrder(
    id: string,
  ): Promise<{ success: boolean; message: string }> {
    const response = await apiClient.patch(`/orders/${id}/cancel`);
    return response.data;
  }

  // ── Staff actions ────────────────────────────────────────────────────────

  /** Staff: Nhận đơn (PENDING → CONFIRMED) */
  async confirmOrder(id: string): Promise<{ success: boolean; data: Order }> {
    const response = await apiClient.patch(`/orders/${id}/confirm`);
    return response.data;
  }

  /** Staff: Từ chối đơn (PENDING → CANCELLED) */
  async rejectOrder(
    id: string,
    reason: string,
  ): Promise<{ success: boolean; data: Order }> {
    const response = await apiClient.patch(`/orders/${id}/reject`, { reason });
    return response.data;
  }

  /** Staff: Đánh dấu nấu xong (CONFIRMED/PROCESSING → READY_FOR_DELIVERY) */
  async markOrderReady(id: string): Promise<{ success: boolean; data: Order }> {
    const response = await apiClient.patch(`/orders/${id}/ready`);
    return response.data;
  }

  /** Staff: Đi giao đơn hàng (READY_FOR_DELIVERY → SHIPPING) */
  async assignDelivery(id: string): Promise<{ success: boolean; data: Order }> {
    const response = await apiClient.patch(`/orders/${id}/deliver`);
    return response.data;
  }

  /** Staff: Giao thành công (SHIPPING → COMPLETED) */
  async completeDelivery(id: string): Promise<{ success: boolean; data: Order }> {
    const response = await apiClient.patch(`/orders/${id}/complete`);
    return response.data;
  }
}

export default new OrderService();
