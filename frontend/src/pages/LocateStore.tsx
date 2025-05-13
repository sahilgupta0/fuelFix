import React from "react";
import Navbar from "./../components/Navbar";
import { MapPin, Search, Wrench } from "lucide-react";

const LocateStores = () => {
  return (
    <div className="min-h-screen bg-white text-gray-800">
      <Navbar />
      <main className="max-w-7xl mx-auto px-6 py-12">
        <h2 className="text-4xl font-bold mb-4 text-center">Locate Nearby Stores & Mechanics</h2>
        <p className="text-center text-gray-600 mb-10">
          Find fuel stations, mechanics, and service centers near your location.
        </p>

        {/* Search/Filter Bar */}
        <div className="flex flex-col md:flex-row gap-4 items-center justify-center mb-8">
          <div className="flex items-center w-full md:w-1/3 bg-gray-100 p-3 rounded-xl shadow-sm">
            <Search className="w-5 h-5 text-gray-500 mr-2" />
            <input
              type="text"
              placeholder="Search location or service..."
              className="bg-transparent outline-none w-full"
            />
          </div>
          <button className="px-5 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition">
            Search
          </button>
        </div>

        {/* Map and Listings Layout */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Map Placeholder */}
          <div className="md:col-span-2 w-full h-[500px] bg-gray-200 rounded-lg shadow-md flex items-center justify-center">
            {/* Replace this with a live Map component like Google Maps or Leaflet */}
            <p className="text-gray-500 text-lg">Map will be displayed here</p>
          </div>

          {/* Nearby Stores / Mechanics */}
          <div className="bg-gray-50 p-4 rounded-xl shadow-md overflow-auto max-h-[500px]">
            <h3 className="text-xl font-semibold mb-4 flex items-center">
              <Wrench className="w-5 h-5 mr-2 text-blue-600" />
              Nearby Services
            </h3>
            <ul className="space-y-4">
              <li className="bg-white p-3 rounded-lg shadow border">
                <p className="font-semibold">FastFix Garage</p>
                <p className="text-sm text-gray-600">2.3 km away · Open 9 AM – 9 PM</p>
              </li>
              <li className="bg-white p-3 rounded-lg shadow border">
                <p className="font-semibold">PetroFuel Station</p>
                <p className="text-sm text-gray-600">1.1 km away · 24/7 Open</p>
              </li>
              <li className="bg-white p-3 rounded-lg shadow border">
                <p className="font-semibold">Speedy Repairs</p>
                <p className="text-sm text-gray-600">3.5 km away · Closes at 8 PM</p>
              </li>
              {/* Add dynamic listings here in future */}
            </ul>
          </div>
        </div>
      </main>
    </div>
  );
};

export default LocateStores;