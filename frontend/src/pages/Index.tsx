
import Navbar from "./../components/Navbar";
import ServiceCard from "./../components/ServiceCard";
import { Wrench, HelpCircle, MapPin, MessageCircle, AlertTriangle } from "lucide-react";
import { useAuth } from "./../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import React from 'react';
import axios from "axios";
import { toast } from "sonner";

const Index = () => {
  const navigate = useNavigate();

  const { user } = useAuth(); // assuming AuthProvider provides `user`

  const services = [
    { title: "Request Service", Icon: Wrench, path: "/requestservice" },
    { title: "Help", Icon: HelpCircle, path: "/help" },
    { title: "Locate Stores", Icon: MapPin, path: "/locate" },
    { title: "Feedback", Icon: MessageCircle, path: "https://docs.google.com/forms/d/e/1FAIpQLSfu_Wryfw4o3ycOrsWQ2yILwrX_oax_arPWopfaU_bBAaJiGg/viewform?usp=sharing " },
    { title: "SOS", Icon: AlertTriangle, path: "sendHelp" },

  ];

  const handleServiceClick = async (path: string) => {
    if (path.startsWith("http")) {
      // Open external link
      window.open(path, "_blank");
    } else {
      // Navigate within the app
      if (path === "sendHelp") {
        // Handle SOS functionality here
        console.log("user", user);
        const response = await axios.post(`${import.meta.env.VITE_PROXY_URL}api/sos/send`, {user});

        if (response.status === 200) {
          toast.success("SOS message sent successfully!");
        } else {
          toast.error("Failed to send SOS message.");
        }
      } else { 
        navigate(path);
      }
    }
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
                onClick={() => navigate("/myrequests")}
              />
              <ServiceCard
                key="tools"
                title="My Tools"
                Icon={Wrench}
                onClick={() => { }}
              />
              <ServiceCard
                key="location"
                title="My Location"
                Icon={MapPin}
                onClick={() => { }}
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
