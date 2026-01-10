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
        <section className="bg-[#FAFAFA] min-h-screen flex flex-col relative pb-32">
            {/* Header - Simple & Spaced */}
            <div className="max-w-[1000px] w-full mx-auto px-6 pt-12 pb-6">
                <button
                    onClick={() => router.back()}
                    className="flex items-center gap-2 text-gray-400 hover:text-gray-900 transition-colors group font-black text-[10px] uppercase tracking-[0.2em]"
                >
                    <ChevronLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
                    <span>Back to Menu</span>
                </button>
            </div>

            {/* Main Content Area - Wider Card like Caterer Page */}
            <div className="max-w-[1000px] w-full mx-auto px-6 mb-12">
                <div className="bg-white rounded-[2.5rem] shadow-sm border border-gray-100/50 flex flex-col overflow-hidden">

                    {/* 1. Hero Image Section - Reduced Height for better balance */}
                    <div className="relative h-[400px] w-full">
                        <Image
                            src={dish.image_url || '/default_dish.jpg'}
                            alt={dish.name}
                            fill
                            className="object-cover"
                            priority
                        />
                        <div className="absolute top-8 right-8">
                            <span className="px-5 py-2 bg-[#2EB400] text-white rounded-full text-[10px] font-black uppercase tracking-widest shadow-xl">
                                Available
                            </span>
                        </div>
                    </div>

                    {/* 2. Content Sections Container */}
                    <div className="p-10 flex flex-col gap-12">

                        {/* Header Info Section */}
                        <div className="flex flex-col gap-5">
                            <div className="flex flex-wrap gap-3">
                                <span className="px-4 py-1.5 bg-blue-50 text-blue-600 rounded-full text-[10px] font-black uppercase tracking-widest border border-blue-100">
                                    {dish.cuisine_type.name}
                                </span>
                                <span className="px-4 py-1.5 bg-green-50 text-green-600 rounded-full text-[10px] font-black uppercase tracking-widest border border-green-100">
                                    {dish.category.name}
                                </span>
                            </div>

                            <div className="flex flex-col gap-3">
                                <h1 className="text-5xl font-black text-gray-900 tracking-tight">
                                    {dish.name}
                                </h1>
                                {dish.category.description && (
                                    <p className="text-gray-400 text-base font-medium italic">
                                        {dish.category.description}
                                    </p>
                                )}
                            </div>
                        </div>

                        {/* Metrics & Preview Row - 3 Balanced Boxes with more space */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="px-8 py-6 bg-white rounded-[2rem] border border-gray-100 shadow-[0_15px_40px_-20px_rgba(0,0,0,0.06)] text-center">
                                <p className="text-[10px] font-black text-gray-300 uppercase tracking-widest mb-3">Pieces</p>
                                <p className="text-3xl font-black text-gray-900 leading-none">{dish.pieces}</p>
                            </div>

                            <div className="px-8 py-6 bg-white rounded-[2rem] border border-gray-100 shadow-[0_15px_40px_-20px_rgba(0,0,0,0.06)] text-center">
                                <p className="text-[10px] font-black text-gray-300 uppercase tracking-widest mb-3">Weight</p>
                                <div className="flex items-baseline justify-center gap-2">
                                    <p className="text-3xl font-black text-gray-900 leading-none">{dish.quantity_in_gm || '--'}</p>
                                    <span className="text-sm font-black text-gray-300">g</span>
                                </div>
                            </div>

                            {dish.caterer && (
                                <div
                                    onClick={() => router.push(`/user/caterers/${dish.caterer?.id}`)}
                                    className="px-8 py-6 bg-white rounded-[2rem] border border-gray-100 shadow-[0_15px_40px_-20px_rgba(0,0,0,0.06)] flex items-center justify-between group cursor-pointer hover:bg-gray-50 transition-all"
                                >
                                    <div className="flex items-center gap-5">
                                        <div className="w-12 h-12 rounded-2xl bg-green-50 flex items-center justify-center shrink-0">
                                            <MapPin className="w-6 h-6 text-[#268700]" />
                                        </div>
                                        <div>
                                            <p className="text-[10px] font-black text-gray-300 uppercase tracking-widest mb-1.5 leading-none">Caterer</p>
                                            <p className="text-base font-black text-gray-900 truncate max-w-[100px]">{dish.caterer.name}</p>
                                        </div>
                                    </div>
                                    <ChevronRight className="w-5 h-5 text-gray-300 group-hover:text-[#2EB400] transition-transform group-hover:translate-x-1" />
                                </div>
                            )}
                        </div>

                        {/* Event Details Section */}
                        <div className="flex flex-col gap-8 pt-10 border-t border-gray-50">
                            <h2 className="text-lg font-black text-gray-900 flex items-center gap-3 uppercase tracking-widest">
                                <Calendar className="w-5 h-5 text-[#2EB400]" />
                                Event Details
                            </h2>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="flex flex-col gap-3">
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-1">Event Type</label>
                                    <select
                                        value={selectedEventType}
                                        onChange={(e) => setSelectedEventType(e.target.value)}
                                        className="w-full px-6 py-4.5 rounded-2xl bg-white border border-gray-100 shadow-sm text-sm font-black focus:outline-none focus:border-[#2EB400] transition-all appearance-none cursor-pointer"
                                    >
                                        <option value="">Select Event Type</option>
                                        {occasions.map((occ) => (
                                            <option key={occ.id} value={occ.id}>{occ.name}</option>
                                        ))}
                                    </select>
                                </div>

                                <div className="flex flex-col gap-3">
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-1">Location</label>
                                    <div className="relative">
                                        <MapPin className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300" />
                                        <select
                                            value={selectedLocation}
                                            onChange={(e) => setSelectedLocation(e.target.value)}
                                            className="w-full pl-14 pr-6 py-4.5 rounded-2xl bg-white border border-gray-100 shadow-sm text-sm font-black focus:outline-none focus:border-[#2EB400] transition-all appearance-none cursor-pointer"
                                        >
                                            <option value="">Select Location</option>
                                            <option value="Dubai Marina">Dubai Marina</option>
                                            <option value="Downtown">Downtown Dubai</option>
                                            <option value="JLT">JLT</option>
                                            <option value="Palm Jumeirah">Palm Jumeirah</option>
                                            <option value="UAE Wide">All over UAE</option>
                                        </select>
                                    </div>
                                </div>

                                <div className="flex flex-col gap-3">
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-1">Guests</label>
                                    <div className="relative">
                                        <Users className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300" />
                                        <input
                                            type="number"
                                            value={guestCount}
                                            onChange={(e) => setGuestCount(parseInt(e.target.value))}
                                            className="w-full pl-14 pr-6 py-4.5 rounded-2xl bg-white border border-gray-100 shadow-sm text-sm font-black focus:outline-none focus:border-[#2EB400] transition-all"
                                        />
                                    </div>
                                </div>

                                <div className="flex flex-col gap-3">
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-1">Date</label>
                                    <div className="relative">
                                        <Calendar className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300" />
                                        <input
                                            type="date"
                                            value={eventDate}
                                            onChange={(e) => setEventDate(e.target.value)}
                                            className="w-full pl-14 pr-6 py-4.5 rounded-2xl bg-white border border-gray-100 shadow-sm text-sm font-black focus:outline-none focus:border-[#2EB400] transition-all cursor-pointer"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Sticky Bottom Bar - Widened & Proportional like Caterer Page */}
            <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 shadow-[0_-10px_30px_rgba(0,0,0,0.03)] px-6 py-5 z-50">
                <div className="max-w-7xl mx-auto flex items-center justify-between">
                    <div className="flex flex-col">
                        <span className="text-[10px] font-black text-gray-400 uppercase tracking-wider mb-1 leading-none">Starting Price</span>
                        <div className="flex items-center gap-2">
                            <span className="text-base font-black text-gray-900 tracking-tight leading-none mb-1">AED</span>
                            <span className="text-2xl font-black text-gray-900 leading-none tracking-tight">{dish.price.toLocaleString()}</span>
                            <span className="text-xs font-bold text-gray-400 ml-1 italic">/ person</span>
                        </div>
                    </div>

                    <button
                        onClick={handleViewPackages}
                        className="bg-[#2EB400] text-white px-10 py-4 rounded-xl font-black text-xs uppercase tracking-widest hover:bg-[#268700] transition-all shadow-lg active:scale-95 flex items-center gap-4 group"
                    >
                        View Menu Package
                        <ChevronRight className="w-5 h-5 stroke-[3] transition-transform group-hover:translate-x-1" />
                    </button>
                </div>
            </div>
        </section>
    );
}
