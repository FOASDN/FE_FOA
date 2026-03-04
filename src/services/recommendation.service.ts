import { apiClient } from '@/lib/api-client';
import type { Product } from '@/types/product';

export interface AIRecommendation {
    product: Product;
    aiReason: string;
    healthScore: number;
}

const recommendationService = {
    getAIRecommendations: () => {
        return apiClient.get<{ data: AIRecommendation[] }>('/products/recommendations');
    },
};

export default recommendationService;
