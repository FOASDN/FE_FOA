import { useCartStore } from '../store/cartStore';
import type { CartItem } from '../store/cartStore';

/**
 * Hook wrapper for Zustand cart store.
 *
 * Usage:
 * ```tsx
 * const { items, totalPrice, addItem, removeItem } = useCart();
 * ```
 */
export const useCart = () => {
    const items = useCartStore((s) => s.items);
    const totalItems = useCartStore((s) => s.totalItems);
    const totalPrice = useCartStore((s) => s.totalPrice);
    const addItem = useCartStore((s) => s.addItem);
    const removeItem = useCartStore((s) => s.removeItem);
    const updateQuantity = useCartStore((s) => s.updateQuantity);
    const clearCart = useCartStore((s) => s.clearCart);
    const hydrate = useCartStore((s) => s.hydrate);
    const orderNote = useCartStore((s) => s.orderNote);
    const setOrderNote = useCartStore((s) => s.setOrderNote);
    const clearOrderNote = useCartStore((s) => s.clearOrderNote);

    return {
        items,
        totalItems,
        totalPrice,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        hydrate,
        orderNote,
        setOrderNote,
        clearOrderNote,
    };
};

export type { CartItem };
