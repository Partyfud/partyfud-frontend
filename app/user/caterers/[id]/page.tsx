'use client';

import Image from 'next/image';
import { useParams } from 'next/navigation';

interface Caterer {
  id: number;
  name: string;
  cuisines: string[];
  rating: number;
  description: string;
  priceRange: string;
}

interface Package {
  id: number;
  title: string;
  caterer: string;
  price: number;
  rating: number;
  image: string;
  customizable?: boolean;
  discount?: string;
}

/* ---- MOCK DATA (replace with API later) ---- */

const CATERERS: Caterer[] = [
  {
    id: 1,
    name: 'Aziz Caterers',
    cuisines: ['Italian', 'Indian'],
    rating: 4.5,
    description: 'Premium catering with a wide variety of cuisines.',
    priceRange: 'AED 120 – AED 160',
  },
  {
    id: 2,
    name: 'Shariah Caterers',
    cuisines: ['Italian', 'Middle Eastern'],
    rating: 4.5,
    description:
      'Award-winning catering service specializing in Mediterranean and French cuisine.',
    priceRange: 'AED 120 – AED 160',
  },
  {
    id: 3,
    name: 'Diamond',
    cuisines: ['Italian', 'Indian'],
    rating: 4.5,
    description: 'Luxury catering for premium events.',
    priceRange: 'AED 120 – AED 160',
  },
  {
    id: 4,
    name: "Mario's Bistro",
    cuisines: ['Mediterranean', 'Asian'],
    rating: 4.7,
    description: 'Authentic Mediterranean flavors with modern twists.',
    priceRange: 'AED 150 – AED 200',
  },
];


const PACKAGES: Package[] = [
  {
    id: 1,
    title: 'Veg New Year Brunch',
    caterer: 'Al Sharbh Caterers',
    price: 2355,
    rating: 4.5,
    image: '/user/package1.svg',
    customizable: true,
  },
  {
    id: 2,
    title: 'Gourmet Italian Feast',
    caterer: 'Cibo e Vino Catering',
    price: 2355,
    rating: 4.5,
    image: '/user/package2.svg',
    discount: '20% Off',
  },
  {
    id: 3,
    title: 'Mediterranean Summer Soiree',
    caterer: 'Sunset Catering Co.',
    price: 2355,
    rating: 4.5,
    image: '/user/package3.svg',
    customizable: true,
  },
  {
    id: 4,
    title: 'Autumn Harvest Dinner',
    caterer: 'Harvest Table Catering',
    price: 2500,
    rating: 4.5,
    image: '/user/package1.svg',
  },
  {
    id: 5,
    title: 'Elegant Holiday Gala',
    caterer: 'Festive Flavors Catering',
    price: 2800,
    rating: 4.5,
    image: '/user/package2.svg',
    discount: '20% Off',
  },
  {
    id: 6,
    title: 'Spring Garden Party',
    caterer: 'Fresh Start Catering',
    price: 2400,
    rating: 4.5,
    image: '/user/package3.svg',
    customizable: true,
  },
  {
    id: 7,
    title: 'Exotic Tropical Escape',
    caterer: 'Island Breeze Catering',
    price: 2700,
    rating: 4.5,
    image: '/user/package1.svg',
  },
  {
    id: 8,
    title: 'Classic French Bistro Night',
    caterer: 'Culinary Artistry',
    price: 3200,
    rating: 4.5,
    image: '/user/package2.svg',
    discount: '20% Off',
  },
  {
    id: 9,
    title: 'Rustic Farm-to-Table Feast',
    caterer: 'Country Charm Catering',
    price: 2600,
    rating: 4.5,
    image: '/user/package3.svg',
  },
];

export default function CatererMenuPage() {
  const params = useParams();
  const caterer = CATERERS.find((c) => c.id === Number(params.id));

  if (!caterer) {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <p className="text-gray-500">Caterer not found.</p>
    </div>
  );
}

  return (
    <section className="bg-white min-h-screen px-6 py-10">
        <label className='text-sm ml-24 underline cursor-pointer'>Menu</label><label className='text-sm cursor-pointer'> / Package Details</label>
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-[260px_1fr] gap-8">

        {/* LEFT CATERER INFO */}
        <aside className="border rounded-xl p-4 h-fit">
          <div className="bg-green-700 text-white text-center py-6 rounded-lg font-semibold text-lg">
            {caterer.name.split(' ')[0]}
          </div>

          <h3 className="mt-4 font-semibold">{caterer.name}</h3>

          <div className="flex gap-2 mt-2 flex-wrap">
            {caterer.cuisines.map((c) => (
              <span
                key={c}
                className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full"
              >
                {c}
              </span>
            ))}
          </div>

          <div className="text-sm text-gray-600 mt-2">⭐ {caterer.rating}</div>

          <p className="text-sm text-gray-600 mt-4">
            {caterer.description}
          </p>

          <p className="font-semibold mt-4">{caterer.priceRange}</p>
        </aside>

        {/* RIGHT PACKAGES */}
        <div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {PACKAGES.map((pkg) => (
              <div key={pkg.id} className="border rounded-xl p-3">
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
