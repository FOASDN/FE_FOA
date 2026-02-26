import { create } from 'zustand';

// ---- Types ----

export interface CartItem {
    productId: string;
    name: string;
    image: string;
    price: number;
    quantity: number;
    size?: string;
    extras?: { id: string; name: string; price: number }[];
    note?: string;
}

interface CartState {
    items: CartItem[];
    // Computed
    totalItems: number;
    totalPrice: number;
    // Actions
    addItem: (item: CartItem) => void;
    removeItem: (productId: string) => void;
    updateQuantity: (productId: string, quantity: number) => void;
    clearCart: () => void;
    hydrate: () => void;
}

// ---- Storage ----

const CART_KEY = 'foodie_cart';

const saveCart = (items: CartItem[]) => {
    localStorage.setItem(CART_KEY, JSON.stringify(items));
};

const loadCart = (): CartItem[] => {
    const raw = localStorage.getItem(CART_KEY);
    if (!raw) return [];
    try {
        return JSON.parse(raw) as CartItem[];
    } catch {
        return [];
    }
};

// ---- Helpers ----

const computeTotals = (items: CartItem[]) => ({
    totalItems: items.reduce((sum, i) => sum + i.quantity, 0),
    totalPrice: items.reduce((sum, i) => {
        const extrasPrice = i.extras?.reduce((s, e) => s + e.price, 0) || 0;
        return sum + (i.price + extrasPrice) * i.quantity;
    }, 0),
});

// ---- Store ----

export const useCartStore = create<CartState>((set, get) => ({
    items: [],
    totalItems: 0,
    totalPrice: 0,

    addItem: (item) => {
        const { items } = get();
        const existingIndex = items.findIndex(
            (i) => i.productId === item.productId && i.size === item.size
        );

        let newItems: CartItem[];
        if (existingIndex >= 0) {
            // Merge quantities
            newItems = items.map((i, idx) =>
                idx === existingIndex
                    ? { ...i, quantity: i.quantity + item.quantity }
                    : i
            );
        } else {
            newItems = [...items, item];
        }

        saveCart(newItems);
        set({ items: newItems, ...computeTotals(newItems) });
    },

    removeItem: (productId) => {
        const newItems = get().items.filter((i) => i.productId !== productId);
        saveCart(newItems);
        set({ items: newItems, ...computeTotals(newItems) });
    },

    updateQuantity: (productId, quantity) => {
        if (quantity <= 0) {
            get().removeItem(productId);
            return;
        }
        const newItems = get().items.map((i) =>
            i.productId === productId ? { ...i, quantity } : i
        );
        saveCart(newItems);
        set({ items: newItems, ...computeTotals(newItems) });
    },

    clearCart: () => {
        localStorage.removeItem(CART_KEY);
        set({ items: [], totalItems: 0, totalPrice: 0 });
    },

    hydrate: () => {
        const items = loadCart();
        set({ items, ...computeTotals(items) });
    },
}));
