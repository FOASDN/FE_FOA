import { apiClient } from "@/lib/api-client";
import type { Product, ProductListResponse, ProductFilters } from "@/types/product";

class ProductAPI {
    async getProducts(filters: ProductFilters = {}): Promise<ProductListResponse> {
        const response = await apiClient.get("/products", { params: filters });
        return response.data;
    }

    async getProductById(id: string): Promise<{ success: boolean; data: Product }> {
        const response = await apiClient.get(`/products/${id}`);
        return response.data;
    }
}

export default new ProductAPI();
