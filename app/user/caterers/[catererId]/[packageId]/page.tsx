'use client';

import Image from 'next/image';
import { useParams } from 'next/navigation';
import { useState } from 'react';
// import { Testimonials } from '@/user/Testimonials';

interface Package {
    id: number;
    title: string;
    caterer: string;
    price: number;
    rating: number;
    reviews: number;
    images: string[];
    menu: {
        starters: string[];
        mains: string[];
        desserts: string[];
    };
}

const PACKAGES: Package[] = [
    {
        id: 1,
        title: 'Veg New Year Brunch',
        caterer: 'Al Sharbh Caterers',
        price: 2355,
        rating: 4.5,
        reviews: 5120,
        images: [
            '/user/package1.svg',
            '/user/package2.svg',
            '/user/package3.svg',
            '/user/package4.svg',
        ],
        menu: {
            starters: [
                'Chicken Tikka',
                'Paneer Butter Masala',
                'Lamb Rogan Josh',
            ],
            mains: [
                'Butter Chicken',
                'Paneer Tikka Masala',
                'Biryani',
                'Chole Bhature',
            ],
            desserts: [
                'Paneer Tikka',
                'Chana Masala',
                'Biryani',
                'Rogan Josh',
            ],
        },
    },
    {
        id: 2,
        title: 'Veg New Year Brunch',
        caterer: 'Al Sharbh Caterers',
        price: 2355,
        rating: 4.5,
        reviews: 5120,
        images: [
            '/user/package1.svg',
            '/user/package2.svg',
            '/user/package3.svg',
            '/user/package4.svg',
        ],
        menu: {
            starters: [
                'Chicken Tikka',
                'Paneer Butter Masala',
                'Lamb Rogan Josh',
            ],
            mains: [
                'Butter Chicken',
                'Paneer Tikka Masala',
                'Biryani',
                'Chole Bhature',
            ],
            desserts: [
                'Paneer Tikka',
                'Chana Masala',
                'Biryani',
                'Rogan Josh',
            ],
        },
    },
    {
        id: 3,
        title: 'Veg New Year Brunch',
        caterer: 'Al Sharbh Caterers',
        price: 2355,
        rating: 4.5,
        reviews: 5120,
        images: [
            '/user/package1.svg',
            '/user/package2.svg',
            '/user/package3.svg',
            '/user/package4.svg',
        ],
        menu: {
            starters: [
                'Chicken Tikka',
                'Paneer Butter Masala',
                'Lamb Rogan Josh',
            ],
            mains: [
                'Butter Chicken',
                'Paneer Tikka Masala',
                'Biryani',
                'Chole Bhature',
            ],
            desserts: [
                'Paneer Tikka',
                'Chana Masala',
                'Biryani',
                'Rogan Josh',
            ],
        },
    },
    {
        id: 4,
        title: 'Veg New Year Brunch',
        caterer: 'Al Sharbh Caterers',
        price: 2355,
        rating: 4.5,
        reviews: 5120,
        images: [
            '/user/package1.svg',
            '/user/package2.svg',
            '/user/package3.svg',
            '/user/package4.svg',
        ],
        menu: {
            starters: [
                'Chicken Tikka',
                'Paneer Butter Masala',
                'Lamb Rogan Josh',
            ],
            mains: [
                'Butter Chicken',
                'Paneer Tikka Masala',
                'Biryani',
                'Chole Bhature',
            ],
            desserts: [
                'Paneer Tikka',
                'Chana Masala',
                'Biryani',
                'Rogan Josh',
            ],
        },
    },
];

export default function PackageDetailsPage() {
    const [eventType, setEventType] = useState('All');
    const [location, setLocation] = useState('All');
    const [guests, setGuests] = useState('All');
    const [date, setDate] = useState('');

    const params = useParams();
    const pkg = PACKAGES.find(
        (p) => p.id === Number(params.packageId)
    );

    if (!pkg) {
        return (
            <div className="min-h-screen flex items-center justify-center text-gray-500">
                Package not found
            </div>
        );
    }

    return (
        <>
        <section className="bg-white min-h-screen px-6 py-10">
            <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-8">

                {/* LEFT CONTENT */}
                <div>
                    {/* Image Gallery */}
                    <div className="grid grid-cols-4 gap-4 mb-6">
                        <div className="col-span-2 row-span-2 relative h-[260px] rounded-xl overflow-hidden">
                            <Image
                                src={pkg.images[0]}
                                alt={pkg.title}
                                fill
                                className="object-cover"
                            />
                        </div>

                        {pkg.images.slice(1, 4).map((img, i) => (
                            <div
                                key={i}
                                className="relative h-[120px] rounded-xl overflow-hidden"
                            >
                                <Image src={img} alt="" fill className="object-cover" />
                                {i === 2 && (
                                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center text-white text-sm font-medium">
                                        View All (45)
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>

                    {/* Menu Items */}
                    <div className="border rounded-xl p-4">
                        <h3 className="font-medium mb-2">
                            Menu Items (Fixed)
                        </h3>

                        <p className="text-sm text-gray-600 mb-4">
                            Award-winning catering service specializing in Mediterranean and
                            French cuisine. We bring restaurant-quality food to your events
                            with impeccable service.
                        </p>

                        {/* Starters */}
                        <h4 className="font-medium mt-4 mb-2">Starters</h4>
                        <ul className="text-sm text-gray-700 space-y-1">
                            {pkg.menu.starters.map((item) => (
                                <li key={item}>{item}</li>
                            ))}
                        </ul>

                        {/* Mains */}
                        <h4 className="font-medium mt-4 mb-2">Mains</h4>
                        <ul className="text-sm text-gray-700 space-y-1">
                            {pkg.menu.mains.map((item) => (
                                <li key={item}>{item}</li>
                            ))}
                        </ul>

                        {/* Desserts */}
                        <h4 className="font-medium mt-4 mb-2">Desserts</h4>
                        <ul className="text-sm text-gray-700 space-y-1">
                            {pkg.menu.desserts.map((item) => (
                                <li key={item}>{item}</li>
                            ))}
                        </ul>
                    </div>
                </div>

                {/* RIGHT SIDEBAR */}
                <aside className="border rounded-xl p-5 h-fit">
                    <button className="text-sm text-gray-600 mb-2">
                        ← {pkg.title}
                    </button>

                    <h2 className="font-semibold text-lg">{pkg.title}</h2>
                    <p className="text-sm text-gray-500">{pkg.caterer}</p>

                    <div className="text-sm mt-2">
                        ⭐ {pkg.rating} ({pkg.reviews} Reviews)
                    </div>

                    <p className="mt-2 font-semibold">
                        AED {pkg.price}/Person
                    </p>

                    {/* Controls */}
                    <div className="mt-4 space-y-3">
                        {/* Event Type */}
                        <div>
                            <label className="block px-1 text-sm py-2">
                                Event Type
                            </label>
                            <select
                                name="eventType"
                                value={eventType}
                                onChange={(e) => setEventType(e.target.value)}
                                className="w-full bg-transparent border border-black rounded-xl px-3 py-2 focus:outline-none focus:border-[#1ee87a]mb-3"
                            >
                                <option className="text-black">All</option>
                                <option className="text-black">Bakery</option>
                                <option className="text-black">Birthday</option>
                                <option className="text-black">Wedding</option>
                                <option className="text-black">Corporate</option>
                            </select>
                        </div>

                        <div>
                            <label className="block px-1 text-sm py-2">
                                Location
                            </label>
                            <select
                                name="location"
                                value={location}
                                onChange={(e) => setLocation(e.target.value)}
                                className="w-full bg-transparent border border-black rounded-xl px-3 py-2 focus:outline-none focus:border-[#1ee87a]mb-3"
                            >
                                <option className="text-black">Dubai</option>
                                <option className="text-black">Bakery</option>
                                <option className="text-black">Birthday</option>
                                <option className="text-black">Wedding</option>
                                <option className="text-black">Corporate</option>
                            </select>
                        </div>

                        <div>
                            <label className="block px-1 text-sm py-2">
                                Guests
                            </label>
                            <select
                                name="guests"
                                value={guests}
                                onChange={(e) => setGuests(e.target.value)}
                                className="w-full bg-transparent border border-black rounded-xl px-3 py-2 focus:outline-none focus:border-[#1ee87a]mb-3"
                            >
                                <option className="text-black">120</option>
                                <option className="text-black">Bakery</option>
                                <option className="text-black">Birthday</option>
                                <option className="text-black">Wedding</option>
                                <option className="text-black">Corporate</option>
                            </select>
                        </div>

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

                    </div>

                    <div className="mt-4 font-semibold">
                        Total Cost
                        <div className="text-lg">
                            AED {pkg.price.toLocaleString()}/Person
                        </div>
                    </div>

                    <button className="mt-4 w-full bg-green-600 text-white py-3 rounded-full hover:opacity-90 cursor-pointer">
                        Add to Cart
                    </button>
                </aside>
            </div>
        </section>
        {/* <Testimonials/> */}
        </>
    );
}