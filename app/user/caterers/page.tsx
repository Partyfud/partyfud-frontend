'use client';

import { useMemo, useState } from 'react';

interface Caterer {
  id: number;
  name: string;
  logoText: string;
  logoBg: string;
  cuisines: string[];
  rating: number;
  minPrice: number;
  maxPrice: number;
  location: string;
  supports: {
    fixed: boolean;
    customizable: boolean;
    liveStations: boolean;
  };
}

const CATERERS: Caterer[] = [
  {
    id: 1,
    name: 'Aziz Caterers',
    logoText: 'AZIZ',
    logoBg: 'bg-orange-500',
    cuisines: ['Italian', 'Indian'],
    rating: 4.5,
    minPrice: 120,
    maxPrice: 160,
    location: 'Dubai',
    supports: { fixed: true, customizable: true, liveStations: true },
  },
  {
    id: 2,
    name: 'Shariah Caterers',
    logoText: 'Shariah',
    logoBg: 'bg-green-700',
    cuisines: ['Italian', 'Middle Eastern'],
    rating: 4.5,
    minPrice: 120,
    maxPrice: 160,
    location: 'Dubai',
    supports: { fixed: true, customizable: true, liveStations: true },
  },
  {
    id: 3,
    name: 'Diamond',
    logoText: 'DC',
    logoBg: 'bg-black',
    cuisines: ['Italian', 'Indian'],
    rating: 4.5,
    minPrice: 120,
    maxPrice: 160,
    location: 'Dubai',
    supports: { fixed: true, customizable: true, liveStations: true },
  },
  {
    id: 4,
    name: "Mario's Bistro",
    logoText: 'MARIO',
    logoBg: 'bg-orange-500',
    cuisines: ['Mediterranean', 'Asian'],
    rating: 4.7,
    minPrice: 150,
    maxPrice: 200,
    location: 'Dubai',
    supports: { fixed: true, customizable: true, liveStations: false },
  },
  {
    id: 5,
    name: "Lina's Kitchen",
    logoText: 'LINA',
    logoBg: 'bg-orange-500',
    cuisines: ['French', 'Mexican'],
    rating: 4.3,
    minPrice: 110,
    maxPrice: 150,
    location: 'Dubai',
    supports: { fixed: true, customizable: true, liveStations: false },
  },
  {
    id: 6,
    name: "Ravi's Delights",
    logoText: 'RAVI',
    logoBg: 'bg-orange-500',
    cuisines: ['Indian', 'Chinese'],
    rating: 4.8,
    minPrice: 130,
    maxPrice: 180,
    location: 'Dubai',
    supports: { fixed: true, customizable: true, liveStations: true },
  },
  {
    id: 7,
    name: 'Aziz Caterers',
    logoText: 'AZIZ',
    logoBg: 'bg-orange-500',
    cuisines: ['Italian', 'Indian'],
    rating: 4.5,
    minPrice: 120,
    maxPrice: 160,
    location: 'Dubai',
    supports: { fixed: true, customizable: true, liveStations: true },
  },
  {
    id: 8,
    name: 'Shariah Caterers',
    logoText: 'Shariah',
    logoBg: 'bg-green-700',
    cuisines: ['Italian', 'Middle Eastern'],
    rating: 4.5,
    minPrice: 120,
    maxPrice: 160,
    location: 'Dubai',
    supports: { fixed: true, customizable: true, liveStations: true },
  },
  {
    id: 9,
    name: 'Diamond',
    logoText: 'DC',
    logoBg: 'bg-black',
    cuisines: ['Italian', 'Indian'],
    rating: 4.5,
    minPrice: 120,
    maxPrice: 160,
    location: 'Dubai',
    supports: { fixed: true, customizable: true, liveStations: true },
  },
  {
    id: 10,
    name: "Mario's Bistro",
    logoText: 'MARIO',
    logoBg: 'bg-orange-500',
    cuisines: ['Mediterranean', 'Asian'],
    rating: 4.7,
    minPrice: 150,
    maxPrice: 200,
    location: 'Dubai',
    supports: { fixed: true, customizable: true, liveStations: false },
  },
  {
    id: 11,
    name: "Lina's Kitchen",
    logoText: 'LINA',
    logoBg: 'bg-orange-500',
    cuisines: ['French', 'Mexican'],
    rating: 4.3,
    minPrice: 110,
    maxPrice: 150,
    location: 'Dubai',
    supports: { fixed: true, customizable: true, liveStations: false },
  },
  {
    id: 12,
    name: "Ravi's Delights",
    logoText: 'RAVI',
    logoBg: 'bg-orange-500',
    cuisines: ['Indian', 'Chinese'],
    rating: 4.8,
    minPrice: 130,
    maxPrice: 180,
    location: 'Dubai',
    supports: { fixed: true, customizable: true, liveStations: true },
  },
];

export default function BrowseCaterersPage() {
  const [search, setSearch] = useState('');
  const [location, setLocation] = useState('Dubai');
  const [budget, setBudget] = useState(160);
  const [menuType, setMenuType] = useState({
    fixed: true,
    customizable: true,
    liveStations: true,
  });

  const filteredCaterers = useMemo(() => {
    return CATERERS.filter((c) => {
      if (search && !c.name.toLowerCase().includes(search.toLowerCase()))
        return false;

      if (location !== 'All' && c.location !== location) return false;

      if (c.minPrice > budget) return false;

      if (menuType.fixed && !c.supports.fixed) return false;
      if (menuType.customizable && !c.supports.customizable) return false;
      // if (menuType.liveStations && !c.supports.liveStations) return false;

      return true;
    });
  }, [search, location, budget, menuType]);

  return (
    <section className="bg-white min-h-screen">
      <div className="max-w-7xl mx-auto px-6 py-10 grid grid-cols-1 lg:grid-cols-[260px_1fr] gap-8">
        
        {/* LEFT FILTERS */}
        <aside className="border rounded-xl p-4 h-fit">
          <div className="flex justify-between mb-4">
            <h3 className="font-medium">Filters</h3>
            <button
              className="text-sm text-gray-500 border border-black px-2 py-1 cursor-pointer rounded-xl  "
              onClick={() => {
                setSearch('');
                setLocation('Dubai');
                setBudget(160);
                setMenuType({ fixed: true, customizable: true, liveStations: true });
              }}
            >
              Clear
            </button>
          </div>

          <label className="text-sm text-gray-500">Location</label>
          <select
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="w-full border rounded-lg px-3 py-2 mb-4"
          >
            <option>Dubai</option>
            <option>Abu Dhabi</option>
          </select>

          <label className="text-sm text-gray-500">Guests</label>
          <select className="w-full border rounded-lg px-3 py-2 mb-4">
            <option>120</option>
            <option>200</option>
            <option>300</option>
          </select>

          <label className="text-sm text-gray-500">Date</label>
          <input
            type="date"
            className="w-full border rounded-lg px-3 py-2 mb-4"
          />

          <label className="text-sm text-gray-500">Budget (Per Person)</label>
          <input
            type="range"
            min={100}
            max={300}
            step={10}
            value={budget}
            onChange={(e) => setBudget(Number(e.target.value))}
            className="w-full mt-2"
          />
          <p className="text-sm mt-1">AED 120 – AED {budget}</p>

          <div className="mt-4 space-y-2 text-sm">
            <label className="font-medium">Menu Type</label>

            <label className="flex gap-2">
              <input
                type="checkbox"
                // checked={menuType.fixed}
                onChange={(e) =>
                  setMenuType({ ...menuType, fixed: e.target.checked })
                }
              />
              Fixed
            </label>

            <label className="flex gap-2">
              <input
                type="checkbox"
                // checked={menuType.customizable}
                onChange={(e) =>
                  setMenuType({ ...menuType, customizable: e.target.checked })
                }
              />
              Customizable
            </label>

            <label className="flex gap-2">
              <input
                type="checkbox"
                // checked={menuType.liveStations}
                onChange={(e) =>
                  setMenuType({ ...menuType, liveStations: e.target.checked })
                }
              />
              Live Stations
            </label>
          </div>
        </aside>

        {/* RIGHT CONTENT */}
        <div>
          <div className="flex items-center gap-4 mb-6">
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search for a Package, Food Item"
              className="flex-1 border rounded-lg px-4 py-2"
            />
            <select className="border rounded-lg px-3 py-2">
              <option>Recommended</option>
              <option>Rating</option>
            </select>
          </div>

          {/* Caterer Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {filteredCaterers.map((c) => (
              <div
                key={c.id}
                className="border rounded-xl p-4 hover:shadow-md transition"
              >
                <div className="flex items-center gap-4">
                  <div
                    className={`w-16 h-16 rounded-lg flex items-center justify-center text-white font-bold ${c.logoBg}`}
                  >
                    {c.logoText}
                  </div>
                  <div>
                    <h4 className="font-medium">{c.name}</h4>
                    <div className="flex gap-2 mt-1 flex-wrap">
                      {c.cuisines.map((cu) => (
                        <span
                          key={cu}
                          className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full"
                        >
                          {cu}
                        </span>
                      ))}
                    </div>
                    <div className="text-sm text-gray-600 mt-1">
                      ⭐ {c.rating}
                    </div>
                  </div>
                </div>

                <div className="flex justify-between items-center mt-4">
                  <span className="font-semibold text-sm">
                    AED {c.minPrice} – AED {c.maxPrice}
                  </span>
                  <button className="bg-green-600 text-white text-xs px-3 py-1 rounded-full hover:opacity-90">
                    View Menu
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}