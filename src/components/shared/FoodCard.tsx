import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

// ---- Types ----

export type HealthStatus = 'safe' | 'warning' | 'danger';

export interface FoodCardProps {
    id: string;
    name: string;
    image: string;
    price: number;
    rating: number;
    restaurant?: string;
    time?: string;
    tags?: string[];
    healthStatus?: HealthStatus;
    allergenInfo?: string;
    isFavorite?: boolean;
    onToggleFavorite?: (id: string) => void;
    onAddToCart?: (id: string) => void;
    className?: string;
}

// ---- Helpers ----

const formatPrice = (price: number) =>
    price.toLocaleString('vi-VN') + 'đ';

// ---- Component ----

export function FoodCard({
    id,
    name,
    image,
    price,
    rating,
    restaurant,
    time,
    tags,
    healthStatus = 'safe',
    allergenInfo,
    isFavorite = false,
    onToggleFavorite,
    onAddToCart,
    className = '',
}: FoodCardProps) {
    const navigate = useNavigate();
    const { t } = useTranslation(['customer', 'common']);

    const isDanger = healthStatus === 'danger';
    const isWarning = healthStatus === 'warning';

    return (
        <div
            className={`group relative bg-card rounded-2xl overflow-hidden border border-border shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer ${className}`}
            onClick={() => navigate(`/food/${id}`)}
        >
            {/* Image Container */}
            <div className="relative aspect-[4/3] overflow-hidden">
                <img
                    src={image}
                    alt={name}
                    loading="lazy"
                    className={`w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 ${isDanger ? 'brightness-50 saturate-50' : ''}`}
                />

                {/* Health Danger Overlay */}
                {isDanger && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center bg-red-900/40 backdrop-blur-[2px]">
                        <span className="material-symbols-outlined text-red-400 text-4xl mb-1">warning</span>
                        <span className="text-white text-xs font-bold bg-red-600 px-3 py-1 rounded-full">
                            {allergenInfo || t('customer:foodCard.allergyWarning')}
                        </span>
                    </div>
                )}

                {/* Health Warning Badge */}
                {isWarning && (
                    <div className="absolute top-3 left-3">
                        <span className="inline-flex items-center gap-1 text-xs font-bold bg-amber-100 text-amber-800 px-2.5 py-1 rounded-full border border-amber-200">
                            <span className="material-symbols-outlined text-[14px]">info</span>
                            {allergenInfo || t('customer:foodCard.caution')}
                        </span>
                    </div>
                )}

                {/* Safe / Healthy Badge */}
                {healthStatus === 'safe' && tags?.some(tag => ['healthy', 'Healthy', 'lành mạnh'].includes(tag)) && (
                    <div className="absolute top-3 left-3">
                        <span className="inline-flex items-center gap-1 text-xs font-bold bg-emerald-100 text-emerald-700 px-2.5 py-1 rounded-full border border-emerald-200">
                            <span className="material-symbols-outlined text-[14px]">eco</span>
                            Healthy
                        </span>
                    </div>
                )}

                {/* Favorite Button */}
                {onToggleFavorite && (
                    <button
                        onClick={(e) => { e.stopPropagation(); onToggleFavorite(id); }}
                        className="absolute top-3 right-3 w-9 h-9 rounded-full bg-white/80 backdrop-blur-sm flex items-center justify-center shadow-md hover:bg-white transition-colors"
                        aria-label={t('common:actions.toggleFavorite', 'Yêu thích')}
                    >
                        <span className={`material-symbols-outlined text-[20px] transition-colors ${isFavorite ? 'text-red-500 fill-current' : 'text-slate-400'}`}
                            style={isFavorite ? { fontVariationSettings: "'FILL' 1" } : undefined}
                        >
                            favorite
                        </span>
                    </button>
                )}

                {/* Time badge */}
                {time && (
                    <div className="absolute bottom-3 left-3">
                        <span className="inline-flex items-center gap-1 text-xs font-semibold bg-black/60 text-white px-2.5 py-1 rounded-full backdrop-blur-sm">
                            <span className="material-symbols-outlined text-[14px]">schedule</span>
                            {time}
                        </span>
                    </div>
                )}
            </div>

            {/* Content */}
            <div className="p-4">
                <h3 className="text-foreground text-base font-bold line-clamp-1 mb-1">{name}</h3>
                {restaurant && (
                    <p className="text-muted-foreground text-sm font-medium line-clamp-1 mb-2">{restaurant}</p>
                )}
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <span className="text-orange-600 font-black text-lg">{formatPrice(price)}</span>
                        <div className="flex items-center gap-1 text-sm text-muted-foreground">
                            <span className="material-symbols-outlined text-orange-400 text-[16px]" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                            <span className="font-semibold">{rating.toFixed(1)}</span>
                        </div>
                    </div>

                    {/* Quick Add to Cart */}
                    {onAddToCart && !isDanger && (
                        <button
                            onClick={(e) => { e.stopPropagation(); onAddToCart(id); }}
                            className="w-9 h-9 rounded-xl bg-orange-600 hover:bg-orange-500 text-white flex items-center justify-center shadow-md shadow-orange-600/25 active:scale-90 transition-all"
                            aria-label={t('customer:foodCard.addToCart')}
                        >
                            <span className="material-symbols-outlined text-[20px]">add_shopping_cart</span>
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}
