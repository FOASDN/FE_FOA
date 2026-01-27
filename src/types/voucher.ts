export const enum VoucherCategory {
    DISCOUNT = 'discount',
    FREESHIP = 'freeship',
    NEWUSER = 'newuser',
    SPECIAL = 'special',
}

export const enum DiscountType {
    NONE = 'none',
    PERCENTAGE = 'percentage',
    FIXED_AMOUNT = 'fixed_amount',
}

export interface Voucher {
    _id: string;
    code: string;
    title: string;
    description: string;
    category: VoucherCategory;
    discount_type: DiscountType;
    discount_value: number;
    max_discount_amount: number | null;
    min_order_amount: number;
    start_date: string;
    end_date: string;
    usage_limit_per_user: number;
    total_usage_limit: number | null;
    current_usage_count: number;
    conditions: string[];
    is_active: boolean;
    is_stackable: boolean;
    createdAt: string;
    updatedAt: string;
}

export interface VoucherListResponse {
    success: boolean;
    data: Voucher[];
    pagination: {
        page: number;
        limit: number;
        total: number;
        totalPages: number;
    };
}

export interface VoucherDetailResponse {
    success: boolean;
    data: Voucher;
}

export interface ValidateVoucherRequest {
    code: string;
    orderAmount: number;
    userId?: string;
}

export interface ValidateVoucherResponse {
    success: boolean;
    data?: {
        voucher: Voucher;
        discountAmount: number;
        finalAmount: number;
    };
    message?: string;
}

export interface CreateVoucherRequest {
    code: string;
    title: string;
    description: string;
    category: VoucherCategory;
    discount_type: DiscountType;
    discount_value: number;
    max_discount_amount?: number;
    min_order_amount: number;
    start_date: string;
    end_date: string;
    usage_limit_per_user: number;
    total_usage_limit?: number;
    conditions: string[];
    is_active?: boolean;
    is_stackable?: boolean;
}
