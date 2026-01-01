'use client';

import { useMemo, useState } from 'react';
import Image from 'next/image';

interface Package {
    id: number;
    title: string;
    caterer: string;
    price: number;
    rating: number;
    image: string;
    customizable?: boolean;
    discount?: string;
    eventType: string;
}

const PACKAGES: Package[] = [
    {
        id: 1,
        title: 'Veg New Year Brunch',
        caterer: 'Al Sharbh Caterers',
        price: 2355,
        rating: 4.5,
        image: '/user/package1.svg',
        customizable: true,
        eventType: 'Engagement',
    },
    {
        id: 2,
        title: 'Gourmet Italian Feast',
        caterer: 'Cibo e Vino Catering',
        price: 2355,
        rating: 4.5,
        image: '/user/package2.svg',
        customizable: true,
        discount: '20% Off',
        eventType: 'Engagement',
    },
    {
        id: 3,
        title: 'Mediterranean Summer Soiree',
        caterer: 'Sunset Catering Co.',
        price: 2355,
        rating: 4.5,
        image: '/user/package3.svg',
        customizable: true,
        eventType: 'Engagement',
    },
    {
        id: 4,
        title: 'Autumn Harvest Dinner',
        caterer: 'Harvest Table Catering',
        price: 2500,
        rating: 4.5,
        image: '/user/package1.svg',
        customizable: true,
        eventType: 'Birthday',
    },
    {
        id: 5,
        title: 'Elegant Holiday Gala',
        caterer: 'Festive Flavors Catering',
        price: 2800,
        rating: 4.5,
        image: '/user/package2.svg',
        customizable: true,
        discount: '20% Off',
        eventType: 'Birthday',
    },
    {
        id: 6,
        title: 'Spring Garden Party',
        caterer: 'Fresh Start Catering',
        price: 2400,
        rating: 4.5,
        image: '/user/package3.svg',
        customizable: true,
        eventType: 'Wedding',
    },
    {
        id: 7,
        title: 'Exotic Tropical Escape',
        caterer: 'Island Breeze Catering',
        price: 2700,
        rating: 4.5,
        image: '/user/package1.svg',
        customizable: true,
        eventType: 'Wedding',
    },
    {
        id: 8,
        title: 'Classic French Bistro Night',
        caterer: 'Culinary Artistry',
        price: 3200,
        rating: 4.5,
        image: '/user/package2.svg',
        customizable: true,
        discount: '20% Off',
        eventType: 'Corporate',
    },
    {
        id: 9,
        title: 'Rustic Farm-to-Table Feast',
        caterer: 'Country Charm Catering',
        price: 2600,
        rating: 4.5,
        image: '/user/package3.svg',
        customizable: true,
        eventType: 'Corporate',
    },
];

export default function PackagesPage() {
    const [search, setSearch] = useState('');
    const [eventType, setEventType] = useState('All');
    const [budget, setBudget] = useState(3500);
    const [location, setLocation] = useState('All');
const [guests, setGuests] = useState('All');
const [date, setDate] = useState('');

    const filteredPackages = useMemo(() => {
  return PACKAGES.filter((pkg) => {
    if (eventType !== 'All' && pkg.eventType !== eventType) return false;
    if (pkg.price > budget) return false;
    if (!pkg.title.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });
}, [search, eventType, budget]);

    return (
        <section className="bg-white min-h-screen">
            <div className="max-w-7xl mx-auto px-6 py-10 grid grid-cols-1 lg:grid-cols-[260px_1fr] gap-8">

                {/* LEFT FILTERS */}
                <aside className="border rounded-xl p-4 h-fit">
                    <div className="flex justify-between mb-4">
                        <h3 className="font-medium">Filters</h3>
                        <button
                            onClick={() => {
                                setSearch('');
                                setEventType('Engagement');
                                setBudget(3000);
                            }}
                            className="text-sm text-gray-500 border border-black py-1 cursor-pointer px-2 rounded-xl"
                        >
                            Clear
                        </button>
                    </div>

                    <label className="text-sm text-gray-500">Event Type</label>
                    <select
                        value={eventType}
                        onChange={(e) => setEventType(e.target.value)}
                        className="w-full border rounded-lg px-3 py-2 mb-4"
                    >
                        <option>All</option>
                        <option>Engagement</option>
                        <option>Birthday</option>
                        <option>Wedding</option>
                        <option>Corporate</option>
                    </select>

                    <label className="text-sm text-gray-500">Location</label>
                    <select
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                        className="w-full border rounded-lg px-3 py-2 mb-4"
                    >
                        <option>Dubai</option>
                        <option>Birthday</option>
                        <option>Wedding</option>
                        <option>Corporate</option>
                    </select>

                    <label className="text-sm text-gray-500">Guests</label>
                    <select
                        value={guests}
                        onChange={(e) => setGuests(e.target.value)}
                        className="w-full border rounded-lg px-3 py-2 mb-4"
                    >
                        <option>120</option>
                        <option>Birthday</option>
                        <option>Wedding</option>
                        <option>Corporate</option>
                    </select>

                    {/* Date */}
                    <div>
                        <label className="block text-sm text-gray-400 mb-2">
                            Date
                        </label>
                        <input
                            type="date"
                            name="date"
                            value={date}
                            onChange={(e) => setDate(e.target.value)}
                            className="w-full bg-transparent border border-black rounded-xl px-3 py-2 mb-4 focus:outline-none focus:border-black"
                        />
                    </div>

                    <label className="text-sm text-gray-500">Budget (Per Person)</label>
                    <input
                        type="range"
                        min={1500}
                        max={3500}
                        step={100}
                        value={budget}
                        onChange={(e) => setBudget(Number(e.target.value))}
                        className="w-full mt-2"
                    />
                    <p className="text-sm mt-1">AED 120 – AED {budget}</p>

                    <div className="mt-4 space-y-2 text-sm">

                        <label className="text-sm">Menu Type</label>
                        <label className="flex gap-2">
                            <input type="checkbox" />
                            Fixed
                        </label>
                        <label className="flex gap-2">
                            <input type="checkbox" />
                            Customizable
                        </label>
                        <label className="flex gap-2">
                            <input type="checkbox" />
                            Live Stations
                        </label>
                    </div>
                </aside>

                {/* RIGHT CONTENT */}
                <div>
                    {/* Search Bar */}
                    <div className="flex items-center gap-4 mb-6">
                        <input
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Search for a Package, Food Item"
                            className="flex-1 border rounded-lg px-4 py-2"
                        />
                        <select className="border rounded-lg px-3 py-2">
                            <option>Recommended</option>
                            <option>Price: Low to High</option>
                            <option>Price: High to Low</option>
                        </select>
                    </div>

                    {/* Packages Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {filteredPackages.map((pkg) => (
                            <div
                                key={pkg.id}
                                className="border rounded-xl p-3 hover:shadow-md transition"
                            >
                                <div className="relative h-[180px] rounded-lg overflow-hidden">
                                    <Image
                                        src={pkg.image}
                                        alt={pkg.title}
                                        fill
                                        className="object-cover"
                                    />

                                    <div className="absolute top-2 left-2 flex gap-2">
                                        {pkg.discount && (
                                            <span className="bg-white text-xs px-2 py-1 rounded-full">
                                                {pkg.discount}
                                            </span>
                                        )}
                                        {pkg.customizable && (
                                            <span className="bg-green-100 text-green-700 text-xs px-2 py-1 rounded-full">
                                                Customisable
                                            </span>
                                        )}
                                    </div>

                                    <div className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded-full">
                                        ⭐ {pkg.rating}
                                    </div>
                                </div>

                                <h4 className="mt-3 font-medium">{pkg.title}</h4>
                                <p className="text-sm text-gray-500">{pkg.caterer}</p>
                                <p className="mt-2 font-semibold">
                                    AED {pkg.price.toLocaleString()}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}
