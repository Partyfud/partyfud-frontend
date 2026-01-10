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
        <section className="bg-[#FAFAFA] flex flex-col relative pb-2">
            {/* Header - Balanced */}
            <div className="max-w-[1000px] w-full mx-auto px-6 pt-2 pb-1">
                <button
                    onClick={() => router.back()}
                    className="flex items-center gap-2 text-gray-400 hover:text-gray-900 transition-colors group font-black text-[10px] uppercase tracking-[0.25em]"
                >
                    <ChevronLeft className="w-4 h-4 transform group-hover:-translate-x-1 transition-transform" />
                    <span>Back to Menu</span>
                </button>
            </div>

            {/* Main Content Area - Content Driven Height */}
            <div className="px-6 py-0">
                <div className="max-w-[1000px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">

                    {/* Left Column: Image and Menu Details (Significantly Narrower) */}
                    <div className="lg:col-span-5 flex flex-col gap-4">
                        {/* Image Section - Balanced height */}
                        <div className="relative h-[200px] w-full bg-white rounded-[1.5rem] overflow-hidden shadow-md border border-white/50 shrink-0">
                            <Image
                                src={dish.image_url || '/default_dish.jpg'}
                                alt={dish.name}
                                fill
                                className="object-cover"
                                priority
                            />
                            {/* Status Badge */}
                            <div className="absolute top-3 right-3">
                                <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest shadow-2xl backdrop-blur-md ${dish.is_active
                                    ? 'bg-[#268700]/95 text-white'
                                    : 'bg-red-500/95 text-white'
                                    }`}>
                                    {dish.is_active ? 'Available' : 'Unavailable'}
                                </span>
                            </div>
                        </div>

                        {/* Menu Details Card - Compact & Clean */}
                        <div className="bg-white rounded-[1.5rem] p-6 shadow-sm border border-gray-100 flex flex-col gap-5">
                            <div>
                                <h1 className="text-2xl font-black text-gray-900 mb-2 leading-tight tracking-tight">
                                    {dish.name}
                                </h1>

                                <div className="flex flex-wrap gap-2 text-[9px] mb-3">
                                    <span className="px-3 py-1 bg-blue-50 text-blue-600 rounded-full font-black uppercase tracking-widest border border-blue-100">
                                        {dish.cuisine_type.name}
                                    </span>
                                    <span className="px-3 py-1 bg-green-50 text-green-600 rounded-full font-black uppercase tracking-widest border border-green-100">
                                        {dish.category.name}
                                    </span>
                                </div>

                                {dish.category.description && (
                                    <p className="text-gray-400 text-xs leading-relaxed italic font-medium">
                                        "{dish.category.description}"
                                    </p>
                                )}
                            </div>

                            {/* Details Grid - Balanced Metrics */}
                            <div className="flex flex-wrap gap-2.5">
                                <div className="min-w-[75px] px-2.5 py-2.5 bg-gray-50/50 rounded-xl border border-gray-100 text-center">
                                    <p className="text-[8px] font-black text-gray-400 uppercase tracking-[0.1em] mb-1">Pieces</p>
                                    <p className="text-2xl font-black text-gray-900 leading-none tracking-tighter">{dish.pieces}</p>
                                </div>
                                {dish.quantity_in_gm && (
                                    <div className="min-w-[90px] px-3 py-2.5 bg-gray-50/50 rounded-xl border border-gray-100 text-center">
                                        <p className="text-[8px] font-black text-gray-400 uppercase tracking-[0.1em] mb-1">Weight</p>
                                        <div className="flex items-baseline justify-center gap-0.5">
                                            <p className="text-2xl font-black text-gray-900 leading-none tracking-tighter">{dish.quantity_in_gm}</p>
                                            <span className="text-[9px] font-black text-gray-400 uppercase">g</span>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Caterer Info - Compact Section */}
                            {dish.caterer && (
                                <div className="p-3 bg-white rounded-xl border border-gray-100 flex items-center justify-between group cursor-pointer hover:bg-gray-50 transition-all shadow-sm"
                                    onClick={() => router.push(`/user/caterers/${dish.caterer?.id}`)}>
                                    <div className="flex items-center gap-3">
                                        <div className="w-9 h-9 rounded-lg bg-green-50 flex items-center justify-center shrink-0">
                                            <MapPin className="w-4 h-4 text-[#268700]" />
                                        </div>
                                        <div>
                                            <p className="text-[9px] font-black text-gray-400 uppercase tracking-[0.1em] leading-none mb-1">Prepared by</p>
                                            <p className="text-sm font-black text-gray-900">{dish.caterer.name}</p>
                                        </div>
                                    </div>
                                    <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-[#268700] transition-colors" />
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Right Column: Event Form - Wider & Primary */}
                    <div className="lg:col-span-7">
                        <div className="bg-white rounded-[1.5rem] p-7 shadow-sm border border-gray-100 h-full">
                            <h2 className="text-lg font-black text-gray-900 mb-6 flex items-center gap-3 underline decoration-green-500/30 underline-offset-8">
                                <Calendar className="w-5 h-5 text-[#268700]" />
                                Event Details
                            </h2>

                            <div className="space-y-4">
                                <div>
                                    <label className="block text-[10px] font-black text-gray-400 uppercase tracking-[0.25em] mb-1.5 px-1">Event Type *</label>
                                    <select
                                        value={selectedEventType}
                                        onChange={(e) => setSelectedEventType(e.target.value)}
                                        className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-transparent text-sm font-black focus:outline-none focus:border-[#268700] focus:bg-white transition-all appearance-none cursor-pointer"
                                    >
                                        <option value="">Select Event Type</option>
                                        {occasions.map((occ) => (
                                            <option key={occ.id} value={occ.id}>{occ.name}</option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-[10px] font-black text-gray-400 uppercase tracking-[0.25em] mb-1.5 px-1">Location *</label>
                                    <div className="relative">
                                        <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                        <select
                                            value={selectedLocation}
                                            onChange={(e) => setSelectedLocation(e.target.value)}
                                            className="w-full pl-10 pr-4 py-3 rounded-xl bg-gray-50 border border-transparent text-sm font-black focus:outline-none focus:border-[#268700] focus:bg-white transition-all appearance-none cursor-pointer"
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

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-[10px] font-black text-gray-400 uppercase tracking-[0.25em] mb-1.5 px-1">Guests *</label>
                                        <div className="relative">
                                            <Users className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                            <input
                                                type="number"
                                                value={guestCount}
                                                onChange={(e) => setGuestCount(parseInt(e.target.value))}
                                                min="1"
                                                className="w-full pl-10 pr-4 py-3 rounded-xl bg-gray-50 border border-transparent text-sm font-black focus:outline-none focus:border-[#268700] focus:bg-white transition-all"
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-[10px] font-black text-gray-400 uppercase tracking-[0.25em] mb-1.5 px-1">Date *</label>
                                        <div className="relative">
                                            <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                            <input
                                                type="date"
                                                value={eventDate}
                                                onChange={(e) => setEventDate(e.target.value)}
                                                className="w-full pl-10 pr-1 py-3 rounded-xl bg-gray-50 border border-transparent text-sm font-black focus:outline-none focus:border-[#268700] focus:bg-white transition-all cursor-pointer"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="mt-8 pt-6 border-t border-gray-50 text-center">
                                <p className="text-[10px] text-gray-300 font-bold uppercase tracking-widest">
                                    Secure your booking now
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Sticky Bottom Bar - Integrated & Balanced */}
            <div className="fixed bottom-0 left-0 right-0 bg-white/95 border-t border-gray-100 shadow-[0_-10px_40px_rgba(0,0,0,0.05)] px-8 py-4 z-50 backdrop-blur-md">
                <div className="max-w-[1000px] mx-auto flex items-center justify-between gap-12">
                    <div className="flex flex-col shrink-0">
                        <span className="text-[9px] font-black text-gray-400 uppercase tracking-[0.4em] mb-1">Starting Price</span>
                        <div className="flex items-baseline gap-1.5">
                            <span className="text-xs font-black text-gray-900 tracking-tight">AED</span>
                            <span className="text-3xl font-black text-gray-900 tracking-tighter leading-none lowercase text-[#2EB400]">{dish.price.toLocaleString()}</span>
                            <span className="text-[11px] font-bold text-gray-400 ml-2">/ person</span>
                        </div>
                    </div>

                    <button
                        onClick={handleViewPackages}
                        className="bg-[#2EB400] text-white px-10 py-3.5 rounded-2xl font-black text-sm uppercase tracking-[0.25em] hover:bg-[#268700] transition-all shadow-xl shadow-green-100 active:scale-95 flex items-center gap-4 group flex-1 max-w-[400px] justify-center"
                    >
                        View Menu Package
                        <ChevronRight className="w-5 h-5 stroke-[3]" />
                    </button>
                </div>
            </div>
        </section>
    );
}
