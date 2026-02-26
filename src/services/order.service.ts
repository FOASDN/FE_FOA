import { apiClient } from '@/lib/api-client';

// ---- Types ----

export interface OrderItem {
    productId: string;
    name: string;
    price: number;
    quantity: number;
    size?: string;
    extras?: { id: string; name: string; price: number }[];
    note?: string;
}

export interface CreateOrderRequest {
    items: OrderItem[];
    addressId: string;
    paymentMethod: 'cod' | 'vnpay' | 'card';
    voucherCode?: string;
    note?: string;
}

export interface Order {
    _id: string;
    orderNumber: string;
    items: OrderItem[];
    status: 'pending' | 'confirmed' | 'preparing' | 'delivering' | 'completed' | 'cancelled';
    totalAmount: number;
    shippingFee: number;
    discount: number;
    paymentMethod: string;
    address: {
        label: string;
        address: string;
    };
    driver?: {
        name: string;
        phone: string;
    };
    estimatedDelivery?: string;
    createdAt: string;
    updatedAt: string;
}

export interface OrderListResponse {
    success: boolean;
    data: Order[];
    pagination: {
        page: number;
        limit: number;
        total: number;
        totalPages: number;
    };
}

// ---- Service ----

class OrderService {
    /** Create a new order */
    async createOrder(data: CreateOrderRequest): Promise<{ success: boolean; data: Order }> {
        const response = await apiClient.post('/orders', data);
        return response.data;
    }

    /** Get current user's order history */
    async getMyOrders(page = 1, limit = 10): Promise<OrderListResponse> {
        const response = await apiClient.get('/orders/me', { params: { page, limit } });
        return response.data;
    }

    /** Get order detail by ID */
    async getOrderById(id: string): Promise<{ success: boolean; data: Order }> {
        const response = await apiClient.get(`/orders/${id}`);
        return response.data;
    }

    /** Update order status (Admin/Staff) */
    async updateOrderStatus(id: string, status: Order['status']): Promise<{ success: boolean; data: Order }> {
        const response = await apiClient.patch(`/orders/${id}/status`, { status });
        return response.data;
    }

    /** Get all orders — Admin/Staff */
    async getAllOrders(params?: {
        status?: string;
        page?: number;
        limit?: number;
        sort?: string;
    }): Promise<OrderListResponse> {
        const response = await apiClient.get('/orders', { params });
        return response.data;
    }

    /** Cancel an order */
    async cancelOrder(id: string): Promise<{ success: boolean; message: string }> {
        const response = await apiClient.patch(`/orders/${id}/cancel`);
        return response.data;
    }
}

export default new OrderService();
