import { create } from 'zustand';

// ---- Types ----

export interface CartItem {
  productId: string;
  name: string;
  image: string;
  price: number;
  quantity: number;
  size?: string;
  variations?: { name: string; choice: string }[];
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
  removeItem: (key: string) => void;
  updateQuantity: (key: string, quantity: number) => void;
  clearCart: () => void;
  hydrate: () => void;
}

// ---- Storage ----

const CART_KEY = "foodie_cart";

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

const normalizeVariations = (vars?: { name: string; choice: string }[]) =>
  (vars ?? [])
    .map((v) => ({ name: v.name.trim(), choice: v.choice.trim() }))
    .sort((a, b) => (a.name + a.choice).localeCompare(b.name + b.choice));

const normalizeExtras = (
  extras?: { id: string; name: string; price: number }[],
) =>
  (extras ?? [])
    .map((e) => ({
      id: String(e.id),
      name: e.name,
      price: Number(e.price ?? 0),
    }))
    .sort((a, b) => (a.id + a.name).localeCompare(b.id + b.name));

export const itemKey = (i: CartItem) =>
  JSON.stringify({
    productId: i.productId,
    size: i.size ?? "",
    variations: normalizeVariations(i.variations),
    extras: normalizeExtras(i.extras),
    note: (i.note ?? "").trim(),
  });
// ---- Store ----

export const useCartStore = create<CartState>((set, get) => ({
  items: [],
  totalItems: 0,
  totalPrice: 0,

  addItem: (item) => {
    const { items } = get();
    const incomingKey = itemKey(item);
    const existingIndex = items.findIndex((i) => itemKey(i) === incomingKey);

    let newItems: CartItem[];
    if (existingIndex >= 0) {
      // Merge quantities
      newItems = items.map((i, idx) =>
        idx === existingIndex
          ? { ...i, quantity: i.quantity + item.quantity }
          : i,
      );
    } else {
      newItems = [...items, item];
    }

    saveCart(newItems);
    set({ items: newItems, ...computeTotals(newItems) });
  },

  removeItem: (key) => {
    const newItems = get().items.filter((i) => itemKey(i) !== key);
    saveCart(newItems);
    set({ items: newItems, ...computeTotals(newItems) });
  },

  updateQuantity: (key, quantity) => {
  if (quantity <= 0) {
    get().removeItem(key);
    return;
  }
  const newItems = get().items.map((i) =>
    itemKey(i) === key ? { ...i, quantity } : i
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
