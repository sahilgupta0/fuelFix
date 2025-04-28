import { Button } from "./../components/ui/button";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Wrench, MapPin, UserRound, Clock, Shield, Star } from "lucide-react";
import Navbar from "./../components/Navbar";
import React from 'react';
import { useAuth } from "./../contexts/AuthContext";

const Landing = () => {
  const navigate = useNavigate();

  const { user } = useAuth(); // assuming AuthProvider provides `user`
  
  
    useEffect(() => {
      if (user) {
        console.log("stop the user from going further back")
        navigate("/logmain", { replace: true }); // Already logged in, redirect
      }
    }, [user, navigate]);

  const features = [
    {
      title: "24/7 Roadside Assistance",
      description: "Get help anytime, anywhere with our reliable service.",
      icon: Clock,
    },
    {
      title: "Real-Time Tracking",
      description: "Track your mechanic's location in real-time.",
      icon: MapPin,
    },
    {
      title: "Verified Mechanics",
      description: "Only trusted, certified mechanics in our network.",
      icon: UserRound,
    },
    {
      title: "Quality Service",
      description: "Rated and reviewed by thousands of users.",
      icon: Star,
    },
    {
      title: "Safety First",
      description: "Built-in safety features for peace of mind.",
      icon: Shield,
    },
    {
      title: "Quick Response",
      description: "Fast and efficient service when you need it most.",
      icon: Wrench,
    },
  ];

  return (
    <div className="min-h-screen">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-purple-50 to-purple-100 dark:from-gray-900 dark:to-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6">
              Roadside Assistance <br />
              <span className="text-purple-600">When You Need It Most</span>
            </h1>
            <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
              Quick, reliable roadside assistance at your fingertips. Get connected with verified mechanics in minutes.
            </p>
            <div className="flex justify-center gap-4">
              <Button
                onClick={() => navigate("/signup")}
                className="bg-purple-600 hover:bg-purple-700"
                size="lg"
              >
                Get Started
              </Button>
              <Button
                variant="outline"
                onClick={() => navigate("/login")}
                className="border-purple-600 text-purple-600 hover:bg-purple-50"
                size="lg"
              >
                Sign In
              </Button>
            </div>
          </div>
        </div>
        
        {/* Decorative shape */}
        <div className="absolute bottom-0 w-full overflow-hidden">
          <svg
            viewBox="0 0 1440 200"
            className="fill-white dark:fill-gray-900"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M0,32L48,37.3C96,43,192,53,288,80C384,107,480,149,576,154.7C672,160,768,128,864,112C960,96,1056,96,1152,90.7C1248,85,1344,75,1392,69.3L1440,64L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
            />
          </svg>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-white dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Why Choose FuelFix
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              We provide reliable roadside assistance with real-time tracking and verified mechanics.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="p-6 rounded-xl bg-white dark:bg-gray-800 shadow-lg hover:shadow-xl transition-shadow border border-gray-100 dark:border-gray-700"
              >
                <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/50 rounded-lg flex items-center justify-center mb-4">
                  <feature.icon className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Landing;