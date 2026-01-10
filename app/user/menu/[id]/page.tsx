'use client';

import Image from 'next/image';
import { useParams, useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { userApi, Dish, type Occasion } from '@/lib/api/user.api';
import {
    MapPin,
    Calendar,
    Users,
    ChevronLeft,
    Check,
    Info,
    Clock,
    Truck,
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
        <section className="bg-[#FAFAFA] min-h-screen pb-32">
            <div className="max-w-[1400px] mx-auto px-6 sm:px-10 py-8 transition-all duration-500 animate-in fade-in slide-in-from-bottom-4">
                {/* Back Button */}
                <button
                    onClick={() => router.back()}
                    className="flex items-center gap-2 text-gray-400 hover:text-gray-900 mb-8 transition-colors group font-black text-[10px] uppercase tracking-[0.2em]"
                >
                    <ChevronLeft className="w-4 h-4 transform group-hover:-translate-x-1 transition-transform" />
                    <span>Back to Menu</span>
                </button>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                    {/* Left Column: Image and Menu Details */}
                    <div className="lg:col-span-7 space-y-8">
                        {/* Image Section */}
                        <div className="relative h-[450px] w-full bg-white rounded-[2.5rem] overflow-hidden shadow-2xl shadow-gray-200/50 border border-white/50">
                            <Image
                                src={dish.image_url || '/default_dish.jpg'}
                                alt={dish.name}
                                fill
                                className="object-cover"
                                priority
                            />
                            {/* Status Badge */}
                            <div className="absolute top-6 right-6">
                                <span className={`px-5 py-2 rounded-full text-[10px] font-black uppercase tracking-widest shadow-xl backdrop-blur-md ${dish.is_active
                                        ? 'bg-[#268700]/90 text-white'
                                        : 'bg-red-500/90 text-white'
                                    }`}>
                                    {dish.is_active ? 'Available' : 'Unavailable'}
                                </span>
                            </div>
                        </div>

                        {/* Menu Details Card */}
                        <div className="bg-white rounded-[2.5rem] p-10 shadow-xl shadow-gray-100/50 border border-gray-100">
                            <div className="max-w-3xl mx-auto">
                                <div className="mb-10">
                                    <h1 className="text-4xl sm:text-5xl font-black text-gray-900 mb-6 leading-tight tracking-tight">
                                        {dish.name}
                                    </h1>

                                    <div className="flex flex-wrap gap-3 mb-8">
                                        <span className="px-5 py-2 bg-blue-50 text-blue-600 rounded-full text-[11px] font-black uppercase tracking-wider border border-blue-100">
                                            {dish.cuisine_type.name}
                                        </span>
                                        <span className="px-5 py-2 bg-green-50 text-green-600 rounded-full text-[11px] font-black uppercase tracking-wider border border-green-100">
                                            {dish.category.name}
                                        </span>
                                        {dish.sub_category && (
                                            <span className="px-5 py-2 bg-purple-50 text-purple-600 rounded-full text-[11px] font-black uppercase tracking-wider border border-purple-100">
                                                {dish.sub_category.name}
                                            </span>
                                        )}
                                    </div>

                                    {dish.category.description && (
                                        <p className="text-gray-400 text-xl leading-relaxed italic font-medium">
                                            "{dish.category.description}"
                                        </p>
                                    )}
                                </div>

                                {/* Details Grid */}
                                <div className="grid grid-cols-2 gap-6 mb-10">
                                    <div className="p-8 bg-gray-50/50 rounded-3xl border border-gray-100 transition-colors hover:bg-gray-50">
                                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-3">Pieces</p>
                                        <p className="text-3xl font-black text-gray-900">{dish.pieces}</p>
                                    </div>
                                    {dish.quantity_in_gm && (
                                        <div className="p-8 bg-gray-50/50 rounded-3xl border border-gray-100 transition-colors hover:bg-gray-50">
                                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-3">Weight</p>
                                            <div className="flex items-baseline gap-1">
                                                <p className="text-3xl font-black text-gray-900">{dish.quantity_in_gm}</p>
                                                <span className="text-lg font-bold text-gray-400">g</span>
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {/* Caterer Info */}
                                {dish.caterer && (
                                    <div className="p-8 bg-gradient-to-br from-white to-gray-50/30 rounded-3xl border-2 border-green-50/50 flex items-center justify-between group cursor-pointer hover:border-green-100 transition-all"
                                        onClick={() => router.push(`/user/caterers/${dish.caterer?.id}`)}>
                                        <div>
                                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-3">Prepared by</p>
                                            <p className="text-2xl font-black text-gray-900 mb-2 group-hover:text-[#268700] transition-colors">{dish.caterer.name}</p>
                                            {dish.caterer.location && (
                                                <p className="text-sm text-gray-500 font-bold flex items-center gap-2">
                                                    <div className="w-8 h-8 rounded-full bg-green-50 flex items-center justify-center">
                                                        <MapPin className="w-4 h-4 text-[#268700]" />
                                                    </div>
                                                    {dish.caterer.location}
                                                </p>
                                            )}
                                        </div>
                                        <div className="w-12 h-12 rounded-full border border-gray-200 flex items-center justify-center group-hover:bg-[#268700] group-hover:border-[#268700] transition-all">
                                            <ChevronLeft className="w-5 h-5 rotate-180 text-gray-400 group-hover:text-white transition-all" />
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Event Form */}
                    <div className="lg:col-span-5 h-full">
                        <div className="bg-white rounded-[2.5rem] p-10 shadow-xl shadow-gray-100/50 border border-gray-100 sticky top-10 flex flex-col h-full min-h-[600px]">
                            <h2 className="text-2xl font-black text-gray-900 mb-10 flex items-center gap-4">
                                <div className="w-12 h-12 rounded-2xl bg-green-50 flex items-center justify-center">
                                    <Calendar className="w-6 h-6 text-[#268700]" />
                                </div>
                                Event Details
                            </h2>

                            <div className="space-y-10 flex-1">
                                <div>
                                    <label className="block text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-4">Event Type *</label>
                                    <select
                                        value={selectedEventType}
                                        onChange={(e) => setSelectedEventType(e.target.value)}
                                        className="w-full px-6 py-5 rounded-2xl bg-gray-50 border-2 border-transparent text-sm font-black focus:outline-none focus:border-[#268700] focus:bg-white transition-all appearance-none cursor-pointer"
                                    >
                                        <option value="">Select Event Type</option>
                                        {occasions.map((occ) => (
                                            <option key={occ.id} value={occ.id}>{occ.name}</option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-4">Delivery Location *</label>
                                    <div className="relative">
                                        <MapPin className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                        <select
                                            value={selectedLocation}
                                            onChange={(e) => setSelectedLocation(e.target.value)}
                                            className="w-full pl-14 pr-6 py-5 rounded-2xl bg-gray-50 border-2 border-transparent text-sm font-black focus:outline-none focus:border-[#268700] focus:bg-white transition-all appearance-none cursor-pointer"
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

                                <div className="grid grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-4">Total Guests *</label>
                                        <div className="relative">
                                            <Users className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                            <input
                                                type="number"
                                                value={guestCount}
                                                onChange={(e) => setGuestCount(parseInt(e.target.value))}
                                                min="1"
                                                className="w-full pl-14 pr-6 py-5 rounded-2xl bg-gray-50 border-2 border-transparent text-sm font-black focus:outline-none focus:border-[#268700] focus:bg-white transition-all"
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-4">Event Date *</label>
                                        <div className="relative">
                                            <Calendar className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                            <input
                                                type="date"
                                                value={eventDate}
                                                onChange={(e) => setEventDate(e.target.value)}
                                                className="w-full pl-14 pr-6 py-5 rounded-2xl bg-gray-50 border-2 border-transparent text-sm font-black focus:outline-none focus:border-[#268700] focus:bg-white transition-all cursor-pointer shadow-sm"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="mt-auto pt-10">
                                <p className="text-[11px] text-gray-400 font-bold text-center flex items-center justify-center gap-2">
                                    <Info className="w-3 h-3" />
                                    Prices may vary based on guest count and location
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Sticky Bottom Bar - Redesigned to match image exactly */}
            <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 shadow-[0_-10px_40px_rgba(0,0,0,0.06)] px-10 py-6 z-50 backdrop-blur-md bg-white/95">
                <div className="max-w-[1400px] mx-auto flex items-center justify-between">
                    <div className="flex flex-col">
                        <span className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em] mb-2">Starting Price</span>
                        <div className="flex items-baseline gap-2">
                            <span className="text-xl font-black text-gray-900 tracking-tight">AED</span>
                            <span className="text-5xl font-black text-gray-900 tracking-tighter">{dish.price.toLocaleString()}</span>
                            <span className="text-sm font-bold text-gray-400 ml-2 tracking-wide">/ person</span>
                        </div>
                    </div>

                    <button
                        onClick={handleViewPackages}
                        className="bg-[#2EB400] text-white px-16 py-5 rounded-[1.5rem] font-black text-sm uppercase tracking-[0.2em] hover:bg-[#268700] transition-all shadow-2xl shadow-green-200/50 active:scale-95 flex items-center gap-4 group"
                    >
                        View Package
                        <ChevronLeft className="w-4 h-4 rotate-180 stroke-[3]" />
                    </button>
                </div>
            </div>
        </section>
    );
}
