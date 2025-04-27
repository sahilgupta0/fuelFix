
import Navbar from "./../components/Navbar";
import ServiceCard from "./../components/ServiceCard";
import { Wrench, HelpCircle, MapPin } from "lucide-react";
import { useAuth } from "./../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import React from 'react';
const Index = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const services = [
    { title: "Request Service", Icon: Wrench, path: "/requestservice" },
    { title: "Help", Icon: HelpCircle, path: "/help" },
    { title: "Locate Stores", Icon: MapPin, path: "/locate" },
  ];

  const handleServiceClick = (path: string) => {
    navigate(path);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="max-w-7xl mx-auto px-6 py-12">
        {user?.userType === "mechanic" ? (
          <>
            <h2 className="text-3xl font-bold text-gray-800 mb-8">Mechanic Dashboard</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-3">
                <ServiceCard
                  key="requests"
                  title="View Service Requests"
                  Icon={Wrench}
                  onClick={() => navigate("/requests")}
                />
              </div>
              <ServiceCard
                key="schedule"
                title="My Schedule"
                Icon={HelpCircle}
                onClick={() => {}}
              />
              <ServiceCard
                key="tools"
                title="My Tools"
                Icon={Wrench}
                onClick={() => {}}
              />
              <ServiceCard
                key="location"
                title="My Location"
                Icon={MapPin}
                onClick={() => {}}
              />
            </div>
          </>
        ) : (
          <>
            <h2 className="text-3xl font-bold text-gray-800 mb-8">Our Services</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {services.map((service) => (
                <ServiceCard
                  key={service.title}
                  title={service.title}
                  Icon={service.Icon}
                  onClick={() => handleServiceClick(service.path)}
                />
              ))}
            </div>
          </>
        )}
      </main>
    </div>
  );
};

export default Index;
