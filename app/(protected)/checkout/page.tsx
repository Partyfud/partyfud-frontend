'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { userApi } from '@/lib/api/user.api';
import { Calendar, MapPin, Users, CreditCard, Lock, CheckCircle2 } from 'lucide-react';
import { Toast, useToast } from '@/components/ui/Toast';
import { formatDate } from '@/lib/constants';

interface CartItem {
  id: string;
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
  date: Date | string | null;
  price_at_time: number | null;
  created_at: Date | string;
  updated_at: Date | string;
}

export default function CheckoutPage() {
  const router = useRouter();
  const { toast, showToast, hideToast } = useToast();
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [placingOrder, setPlacingOrder] = useState(false);
  const [orderPlaced, setOrderPlaced] = useState(false);

  useEffect(() => {
    fetchCart();
  }, []);

  const fetchCart = async () => {
    setLoading(true);
    try {
      const res = await userApi.getCartItems();
      if (res.data?.data) {
        setCartItems(res.data.data);
      } else if (res.error) {
        showToast('error', res.error || 'Failed to load cart');
        if (res.status === 401) {
          router.push('/login?redirect=/checkout');
        }
      }
    } catch (err) {
      showToast('error', 'Failed to load cart');
    } finally {
      setLoading(false);
    }
  };

  const handlePlaceOrder = async () => {
    if (cartItems.length === 0) {
      showToast('error', 'Your cart is empty');
      return;
    }

    setPlacingOrder(true);
    try {
      const res = await userApi.createOrder({
        cart_item_ids: cartItems.map((item) => item.id),
        items: [],
      });

      if (res.error) {
        showToast('error', res.error);
        return;
      }

      if (res.data?.success) {
        setOrderPlaced(true);
        showToast('success', 'Order placed successfully!');
        setTimeout(() => {
          router.push('/orders');
        }, 2000);
      }
    } catch (err) {
      showToast('error', 'Failed to place order');
    } finally {
      setPlacingOrder(false);
    }
  };

  const subtotal = cartItems.reduce((sum, item) => {
    return sum + (item.price_at_time || item.package.total_price || 0);
  }, 0);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-green-600 mx-auto mb-3"></div>
          <p className="text-gray-500 text-sm">Loading checkout...</p>
        </div>
      </div>
    );
  }

  if (orderPlaced) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white rounded-xl border border-gray-200 p-12 text-center max-w-md w-full mx-4">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle2 className="w-8 h-8 text-green-600" />
          </div>
          <h2 className="text-2xl font-semibold text-gray-900 mb-2">
            Order Placed Successfully!
          </h2>
          <p className="text-gray-500 mb-6">
            Your order has been confirmed. Redirecting to orders page...
          </p>
        </div>
      </div>
    );
  }

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white rounded-xl border border-gray-200 p-12 text-center max-w-md w-full mx-4">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            Your cart is empty
          </h2>
          <p className="text-gray-500 mb-6">
            Add items to your cart before checkout
          </p>
          <button
            onClick={() => router.push('/cart')}
            className="bg-green-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-green-700 transition"
          >
            Go to Cart
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Checkout</h1>
          <p className="text-gray-500 text-sm mt-1">
            Review your order and complete your purchase
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Order Items */}
          <div className="lg:col-span-2 space-y-4">
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h2 className="font-semibold text-lg text-gray-900 mb-4">
                Order Items
              </h2>
              <div className="space-y-4">
                {cartItems.map((item) => (
                  <div
                    key={item.id}
                    className="flex gap-4 pb-4 border-b border-gray-100 last:border-0 last:pb-0"
                  >
                    <div className="relative w-20 h-20 shrink-0 bg-gray-50 rounded-lg overflow-hidden">
                      <Image
                        src={item.package.cover_image_url || '/logo2.svg'}
                        alt={item.package.name}
                        fill
                        className="object-contain p-1"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium text-gray-900 truncate">
                        {item.package.name}
                      </h3>
                      <p className="text-sm text-gray-500">
                        {item.package.caterer?.business_name || item.package.caterer?.name || 'Caterer'}
                      </p>
                      <div className="flex flex-wrap gap-3 mt-2 text-xs text-gray-600">
                        <div className="flex items-center gap-1">
                          <Users className="w-3 h-3" />
                          <span>{item.guests || item.package.people_count} guests</span>
                        </div>
                        {item.location && (
                          <div className="flex items-center gap-1">
                            <MapPin className="w-3 h-3" />
                            <span className="truncate max-w-[150px]">{item.location}</span>
                          </div>
                        )}
                        {item.date && (
                          <div className="flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            <span>{formatDate(item.date, false)}</span>
                          </div>
                        )}
                      </div>
                      <div className="mt-2">
                        <span className="font-semibold text-green-600">
                          {item.package.currency} {(item.price_at_time || item.package.total_price).toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Payment Method */}
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h2 className="font-semibold text-lg text-gray-900 mb-4">
                Payment Method
              </h2>
              <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg border border-gray-200">
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                  <CreditCard className="w-5 h-5 text-green-600" />
                </div>
                <div className="flex-1">
                  <p className="font-medium text-gray-900">Payment on Delivery</p>
                  <p className="text-sm text-gray-500">Pay when your order is delivered</p>
                </div>
                <Lock className="w-5 h-5 text-gray-400" />
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl border border-gray-200 p-5 sticky top-4">
              <h2 className="font-semibold text-lg text-gray-900 mb-4">
                Order Summary
              </h2>

              <div className="space-y-3 mb-4">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">
                    Subtotal ({cartItems.length} {cartItems.length === 1 ? 'item' : 'items'})
                  </span>
                  <span className="font-medium">AED {subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Delivery Fee</span>
                  <span className="text-gray-500">TBD</span>
                </div>
              </div>

              <div className="border-t border-gray-200 pt-4 mb-6">
                <div className="flex justify-between items-center">
                  <span className="font-semibold text-gray-900">Total</span>
                  <span className="text-xl font-bold text-green-600">
                    AED {subtotal.toLocaleString()}
                  </span>
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  *Delivery fee will be calculated separately
                </p>
              </div>

              <button
                onClick={handlePlaceOrder}
                disabled={placingOrder || cartItems.length === 0}
                className={`w-full py-3 rounded-lg font-medium transition flex items-center justify-center gap-2 ${
                  placingOrder || cartItems.length === 0
                    ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                    : 'bg-green-600 text-white hover:bg-green-700'
                }`}
              >
                {placingOrder ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    <span>Placing Order...</span>
                  </>
                ) : (
                  <>
                    <Lock className="w-4 h-4" />
                    <span>Place Order</span>
                  </>
                )}
              </button>

              <button
                onClick={() => router.push('/cart')}
                className="w-full mt-3 text-center py-3 rounded-lg border border-gray-200 text-gray-700 font-medium hover:bg-gray-50 transition"
              >
                Back to Cart
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Toast */}
      {toast && (
        <Toast type={toast.type} message={toast.message} onClose={hideToast} />
      )}
    </div>
  );
}
