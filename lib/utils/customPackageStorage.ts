// Utility functions for managing custom packages in localStorage

export interface CustomPackageData {
  id: string; // Temporary ID for localStorage items
  caterer_id: string;
  caterer_name: string;
  dish_ids: string[];
  people_count: number;
  dishes: Array<{
    id: string;
    name: string;
    price: number;
    currency: string;
    image_url?: string | null;
    category?: {
      name: string;
    };
  }>;
  total_price: number;
  currency: string;
  created_at: string;
}

const CUSTOM_PACKAGE_STORAGE_KEY = 'partyfud_custom_packages';

export const customPackageStorage = {
  // Get all custom packages from localStorage
  getPackages: (): CustomPackageData[] => {
    if (typeof window === 'undefined') return [];
    try {
      const stored = localStorage.getItem(CUSTOM_PACKAGE_STORAGE_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (err) {
      console.error('Error reading custom packages from localStorage:', err);
    }
    return [];
  },

  // Add custom package to localStorage
  addPackage: (packageData: Omit<CustomPackageData, 'id' | 'created_at'>): CustomPackageData => {
    const packages = customPackageStorage.getPackages();
    const newPackage: CustomPackageData = {
      ...packageData,
      id: `custom_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      created_at: new Date().toISOString(),
    };
    packages.push(newPackage);
    localStorage.setItem(CUSTOM_PACKAGE_STORAGE_KEY, JSON.stringify(packages));
    return newPackage;
  },

  // Remove custom package from localStorage
  removePackage: (packageId: string): void => {
    const packages = customPackageStorage.getPackages();
    const filtered = packages.filter((pkg) => pkg.id !== packageId);
    localStorage.setItem(CUSTOM_PACKAGE_STORAGE_KEY, JSON.stringify(filtered));
  },

  // Clear all custom packages from localStorage
  clear: (): void => {
    localStorage.removeItem(CUSTOM_PACKAGE_STORAGE_KEY);
  },

  // Sync custom packages to server (create actual packages)
  syncToServer: async (): Promise<void> => {
    const packages = customPackageStorage.getPackages();
    if (packages.length === 0) return;

    const { userApi } = await import('@/lib/api/user.api');
    
    // Try to create each package on the server
    for (const pkg of packages) {
      try {
        await userApi.createCustomPackage({
          dish_ids: pkg.dish_ids,
          people_count: pkg.people_count,
        });
      } catch (err) {
        console.error('Error syncing custom package to server:', err);
        // Continue with other packages even if one fails
      }
    }

    // Clear localStorage after successful sync
    customPackageStorage.clear();
  },
};
