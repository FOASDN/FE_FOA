import { apiClient } from "@/lib/api-client";

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
  voucher?: string;
  shipping_fee?: number;
  delivery_address?: PlaceOrderAddress;
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

export interface Order {
  _id: string;
  code: string;
  user_id?:
    | string
    | {
        _id: string;
        username: string;
        email: string;
        phone: string;
      };
  items: Array<{
    product_id:
      | string
      | {
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
  status: string;
  sub_total: number;
  shipping_fee: number;
  total_price: number;
  payment: {
    method: PaymentMethod;
    paid_at: string | null;
  };
  delivery_address: PlaceOrderAddress;
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

class OrderService {
  async placeOrder(
    data: PlaceOrderRequest,
  ): Promise<{ success: boolean; data: PlacedOrder }> {
    const response = await apiClient.post("/orders", data);
    return response.data;
  }

  async getMyOrders(page = 1, limit = 10): Promise<OrderListResponse> {
    const response = await apiClient.get("/orders/me", {
      params: { page, limit },
    });
    return response.data;
  }

  async getOrderById(id: string): Promise<{ success: boolean; data: Order }> {
    const response = await apiClient.get(`/orders/${id}`);
    return response.data;
  }

  async updateOrderStatus(
    id: string,
    status: string,
  ): Promise<{ success: boolean; data: Order }> {
    const response = await apiClient.patch(`/orders/${id}/status`, { status });
    return response.data;
  }

  async getAllOrders(params?: {
    status?: string;
    page?: number;
    limit?: number;
    sort?: string;
  }): Promise<OrderListResponse> {
    const response = await apiClient.get("/orders", { params });
    return response.data;
  }

  async cancelOrder(
    id: string,
  ): Promise<{ success: boolean; message: string }> {
    const response = await apiClient.patch(`/orders/${id}/cancel`);
    return response.data;
  }
}

export default new OrderService();
