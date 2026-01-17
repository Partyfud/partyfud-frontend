// Utility functions for managing cart in localStorage

export interface LocalCartItem {
  id: string; // Temporary ID for localStorage items
  package_id: string;
  package: {
    id: string;
    name: string;
    people_count: number;
    total_price: number;
    price_per_person: number;
    currency: string;
    cover_image_url?: string | null;
    caterer: {
      id: string;
      business_name: string | null;
      name?: string;
    };
  };
  location: string | null;
  guests: number | null;
  date: string | null;
  price_at_time: number | null;
  created_at: string;
  updated_at: string;
}

const CART_STORAGE_KEY = 'partyfud_cart_items';

export const cartStorage = {
  // Get all cart items from localStorage
  getItems: (): LocalCartItem[] => {
    if (typeof window === 'undefined') return [];
    try {
      const stored = localStorage.getItem(CART_STORAGE_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (err) {
      console.error('Error reading cart from localStorage:', err);
    }
    return [];
  },

  // Add item to localStorage cart
  addItem: (item: Omit<LocalCartItem, 'id' | 'created_at' | 'updated_at'>): LocalCartItem => {
    const items = cartStorage.getItems();
    const newItem: LocalCartItem = {
      ...item,
      id: `local_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    items.push(newItem);
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
    return newItem;
  },

  // Remove item from localStorage cart
  removeItem: (itemId: string): void => {
    const items = cartStorage.getItems();
    const filtered = items.filter((item) => item.id !== itemId);
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(filtered));
  },

  // Clear all items from localStorage cart
  clear: (): void => {
    localStorage.removeItem(CART_STORAGE_KEY);
  },

  // Sync localStorage cart items to server
  syncToServer: async (): Promise<void> => {
    const items = cartStorage.getItems();
    if (items.length === 0) return;

    const { userApi } = await import('@/lib/api/user.api');
    
    // Try to add each item to server cart
    for (const item of items) {
      try {
        await userApi.createCartItem({
          package_id: item.package_id,
          location: item.location || undefined,
          guests: item.guests || undefined,
          date: item.date || undefined,
          price_at_time: item.price_at_time || undefined,
        });
      } catch (err) {
        console.error('Error syncing cart item to server:', err);
        // Continue with other items even if one fails
      }
    }

    // Clear localStorage after successful sync
    cartStorage.clear();
  },
};
