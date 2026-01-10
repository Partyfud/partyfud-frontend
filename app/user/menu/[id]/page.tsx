'use client';

import Image from 'next/image';
import { useParams, useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { userApi, Dish, type Occasion } from '@/lib/api/user.api';
import {
    ChevronLeft,
    ChevronRight,
    Calendar,
    MapPin,
    Users,
    Info,
    Check,
    Truck,
    Clock,
    Star
} from 'lucide-react';

export default function DishDetailsPage() {
    const router = useRouter();
    const params = useParams();
    const dishId = params.id as string;

    const [dish, setDish] = useState<Dish | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [occasions, setOccasions] = useState<Occasion[]>([]);

    // Event Details State
    const [selectedEventType, setSelectedEventType] = useState('');
    const [selectedLocation, setSelectedLocation] = useState('');
    const [guestCount, setGuestCount] = useState<number>(20);
    const [eventDate, setEventDate] = useState('');

    useEffect(() => {
        const fetchData = async () => {
            if (!dishId) return;

            setLoading(true);
            setError(null);

            try {
                const [dishRes, occasionsRes] = await Promise.all([
                    userApi.getDishById(dishId),
                    userApi.getOccasions()
                ]);

                if (dishRes.error) {
                    setError(dishRes.error);
                } else if (dishRes.data?.data) {
                    setDish(dishRes.data.data);
                }

                if (occasionsRes.data?.data) {
                    setOccasions(occasionsRes.data.data);
                }
            } catch (err: any) {
                setError(err.message || 'Failed to fetch dish');
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [dishId]);

    const handleViewPackages = () => {
        // Redirect to packages page with occasion and dish filters
        let url = `/user/packages?dish_id=${dishId}`;
        if (selectedEventType) {
            url += `&occasion_id=${selectedEventType}`;
        }
        router.push(url);
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[#FAFAFA]">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-[#268700] mx-auto mb-4"></div>
                    <p className="text-gray-600 font-bold uppercase tracking-widest text-xs">Loading Details...</p>
                </div>
            </div>
        );
    }

    if (error || !dish) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[#FAFAFA]">
                <div className="text-center max-w-md px-4">
                    <div className="mb-4">
                        <Info className="w-16 h-16 text-gray-400 mx-auto" />
                    </div>
                    <p className="text-lg font-medium text-gray-900 mb-2">{error || 'Dish not found'}</p>
                    <p className="text-sm text-gray-600 mb-6">The dish you're looking for doesn't exist or has been removed.</p>
                    <button
                        onClick={() => router.back()}
                        className="inline-flex items-center gap-2 px-6 py-3 bg-[#268700] text-white rounded-xl hover:bg-[#1f6b00] transition-colors font-bold"
                    >
                        <ChevronLeft className="w-5 h-5" />
                        Go back
                    </button>
                </div>
            </div>
        );
    }

    const currency = dish.currency || 'AED';

    return (
        <section className="bg-[#FAFAFA] h-screen flex flex-col overflow-hidden">
            {/* Header - Compact */}
            <div className="max-w-[1000px] w-full mx-auto px-4 pt-3 pb-1">
                <button
                    onClick={() => router.back()}
                    className="flex items-center gap-2 text-gray-400 hover:text-gray-900 transition-colors group font-black text-[8px] uppercase tracking-[0.2em]"
                >
                    <ChevronLeft className="w-3 h-3 transform group-hover:-translate-x-1 transition-transform" />
                    <span>Back to Menu</span>
                </button>
            </div>

            {/* Main Content Area - Ultra tight */}
            <div className="flex-1 overflow-hidden px-4 pb-20">
                <div className="max-w-[1000px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-4 h-full items-stretch">

                    {/* Left Column: Image and Menu Details */}
                    <div className="lg:col-span-7 flex flex-col gap-3">
                        {/* Image Section - Compact */}
                        <div className="relative h-[200px] w-full bg-white rounded-2xl overflow-hidden shadow-sm border border-white/50 shrink-0">
                            <Image
                                src={dish.image_url || '/default_dish.jpg'}
                                alt={dish.name}
                                fill
                                className="object-cover"
                                priority
                            />
                            {/* Status Badge */}
                            <div className="absolute top-2 right-2">
                                <span className={`px-2 py-1 rounded-full text-[7px] font-black uppercase tracking-widest shadow-xl backdrop-blur-md ${dish.is_active
                                    ? 'bg-[#268700]/90 text-white'
                                    : 'bg-red-500/90 text-white'
                                    }`}>
                                    {dish.is_active ? 'Available' : 'Unavailable'}
                                </span>
                            </div>
                        </div>

                        {/* Menu Details Card - Compressed */}
                        <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 flex-1 flex flex-col justify-between">
                            <div className="mb-2">
                                <h1 className="text-lg sm:text-xl font-black text-gray-900 mb-0.5 leading-tight tracking-tight">
                                    {dish.name}
                                </h1>

                                <div className="flex flex-wrap gap-1 mb-1.5 text-[7px]">
                                    <span className="px-2 py-0.5 bg-blue-50 text-blue-600 rounded-full font-black uppercase tracking-wider border border-blue-100">
                                        {dish.cuisine_type.name}
                                    </span>
                                    <span className="px-2 py-0.5 bg-green-50 text-green-600 rounded-full font-black uppercase tracking-wider border border-green-100">
                                        {dish.category.name}
                                    </span>
                                </div>

                                {dish.category.description && (
                                    <p className="text-gray-400 text-[10px] leading-snug italic line-clamp-1">
                                        "{dish.category.description}"
                                    </p>
                                )}
                            </div>

                            {/* Details Grid - Tiny */}
                            <div className="grid grid-cols-2 gap-2 mb-2">
                                <div className="p-2 bg-gray-50/50 rounded-lg border border-gray-100">
                                    <p className="text-[6px] font-black text-gray-400 uppercase tracking-[0.2em]">Pieces</p>
                                    <p className="text-base font-black text-gray-900">{dish.pieces}</p>
                                </div>
                                {dish.quantity_in_gm && (
                                    <div className="p-2 bg-gray-50/50 rounded-lg border border-gray-100">
                                        <p className="text-[6px] font-black text-gray-400 uppercase tracking-[0.2em]">Weight</p>
                                        <div className="flex items-baseline gap-0.5">
                                            <p className="text-base font-black text-gray-900">{dish.quantity_in_gm}</p>
                                            <span className="text-[8px] font-bold text-gray-400">g</span>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Caterer Info - Minimal */}
                            {dish.caterer && (
                                <div className="p-2 bg-white rounded-lg border border-gray-100 flex items-center justify-between group cursor-pointer hover:bg-gray-50 transition-colors"
                                    onClick={() => router.push(`/user/caterers/${dish.caterer?.id}`)}>
                                    <div className="flex items-center gap-2">
                                        <div className="w-7 h-7 rounded bg-green-50 flex items-center justify-center shrink-0">
                                            <MapPin className="w-3 h-3 text-[#268700]" />
                                        </div>
                                        <div>
                                            <p className="text-[6px] font-black text-gray-400 uppercase tracking-[0.1em]">By {dish.caterer.name}</p>
                                        </div>
                                    </div>
                                    <ChevronRight className="w-3 h-3 text-gray-300 group-hover:text-[#268700] transition-colors" />
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Right Column: Event Form - Perfectly matched height */}
                    <div className="lg:col-span-5">
                        <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 flex flex-col h-full">
                            <h2 className="text-sm font-black text-gray-900 mb-3 flex items-center gap-2">
                                <Calendar className="w-4 h-4 text-[#268700]" />
                                Event Details
                            </h2>

                            <div className="space-y-3 flex-1 flex flex-col justify-center">
                                <div>
                                    <label className="block text-[6px] font-black text-gray-400 uppercase tracking-[0.2em] mb-1 px-1">Event Type *</label>
                                    <select
                                        value={selectedEventType}
                                        onChange={(e) => setSelectedEventType(e.target.value)}
                                        className="w-full px-3 py-1.5 rounded-lg bg-gray-50 border border-transparent text-[11px] font-black focus:outline-none focus:border-[#268700] focus:bg-white transition-all appearance-none cursor-pointer"
                                    >
                                        <option value="">Select Event Type</option>
                                        {occasions.map((occ) => (
                                            <option key={occ.id} value={occ.id}>{occ.name}</option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-[6px] font-black text-gray-400 uppercase tracking-[0.2em] mb-1 px-1">Location *</label>
                                    <div className="relative">
                                        <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-3 h-3 text-gray-400" />
                                        <select
                                            value={selectedLocation}
                                            onChange={(e) => setSelectedLocation(e.target.value)}
                                            className="w-full pl-8 pr-3 py-1.5 rounded-lg bg-gray-50 border border-transparent text-[11px] font-black focus:outline-none focus:border-[#268700] focus:bg-white transition-all appearance-none cursor-pointer"
                                        >
                                            <option value="">Select Location</option>
                                            <option value="Dubai Marina">Dubai Marina</option>
                                            <option value="Downtown Dubai">Downtown Dubai</option>
                                            <option value="JLT">JLT</option>
                                            <option value="Palm Jumeirah">Palm Jumeirah</option>
                                            <option value="All over UAE">All over UAE</option>
                                        </select>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-2">
                                    <div>
                                        <label className="block text-[6px] font-black text-gray-400 uppercase tracking-[0.2em] mb-1 px-1">Guests *</label>
                                        <div className="relative">
                                            <Users className="absolute left-3 top-1/2 -translate-y-1/2 w-3 h-3 text-gray-400" />
                                            <input
                                                type="number"
                                                value={guestCount}
                                                onChange={(e) => setGuestCount(parseInt(e.target.value))}
                                                min="1"
                                                className="w-full pl-8 pr-3 py-1.5 rounded-lg bg-gray-50 border border-transparent text-[11px] font-black focus:outline-none focus:border-[#268700] focus:bg-white transition-all"
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-[6px] font-black text-gray-400 uppercase tracking-[0.2em] mb-1 px-1">Date *</label>
                                        <div className="relative">
                                            <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-3 h-3 text-gray-400" />
                                            <input
                                                type="date"
                                                value={eventDate}
                                                onChange={(e) => setEventDate(e.target.value)}
                                                className="w-full pl-8 pr-1 py-1.5 rounded-lg bg-gray-50 border border-transparent text-[11px] font-black focus:outline-none focus:border-[#268700] focus:bg-white transition-all cursor-pointer"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="mt-2 pt-2 border-t border-gray-50">
                                <p className="text-[7px] text-gray-300 font-bold text-center">
                                    Prices vary based on guests and area
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Sticky Bottom Bar - Ultra Compact */}
            <div className="fixed bottom-0 left-0 right-0 bg-white/95 border-t border-gray-100 shadow-[0_-4px_20px_rgba(0,0,0,0.03)] px-4 py-3 z-50 backdrop-blur-md">
                <div className="max-w-[1000px] mx-auto flex items-center justify-between">
                    <div className="flex flex-col">
                        <span className="text-[7px] font-black text-gray-400 uppercase tracking-[0.3em] mb-0.5">Starting Price</span>
                        <div className="flex items-baseline gap-1">
                            <span className="text-[10px] font-black text-gray-900 tracking-tight">AED</span>
                            <span className="text-2xl font-black text-gray-900 tracking-tighter">{dish.price.toLocaleString()}</span>
                            <span className="text-[8px] font-bold text-gray-400 ml-1">/ person</span>
                        </div>
                    </div>

                    <button
                        onClick={handleViewPackages}
                        className="bg-[#2EB400] text-white px-6 py-2.5 rounded-xl font-black text-[10px] uppercase tracking-[0.2em] hover:bg-[#268700] transition-all shadow-lg active:scale-95 flex items-center gap-2 group"
                    >
                        View Package
                        <ChevronRight className="w-3 h-3 stroke-[3]" />
                    </button>
                </div>
            </div>
        </section>
    );
}
