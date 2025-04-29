
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Wrench, MapPin, UserRound, Clock, Shield, Star, CarFront, Navigation, Truck } from 'lucide-react';
import { Button } from '../components/ui/button';
import { useAuth } from "./../contexts/AuthContext";
import Navbar from "./../components/Navbar";
import TestimonialCard from '../components/ui/Testimonial';
import StatsCard from '../components/ui/StatsCard';
import CTASection from '../components/ui/CTASection';

const Landing = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      console.log("stop the user from going further back");
      navigate("/logmain", { replace: true }); // Already logged in, redirect
    }
  }, [user, navigate]);

  const features = [
    {
      title: "24/7 Roadside Help",
      description: "Get immediate assistance anytime, anywhere with our reliable network of mechanics.",
      icon: Clock,
      color: "bg-blue-100 dark:bg-blue-900/40"
    },
    {
      title: "Live GPS Tracking",
      description: "Monitor your mechanic's location in real-time as they come to your rescue.",
      icon: MapPin,
      color: "bg-green-100 dark:bg-green-900/40"
    },
    {
      title: "Certified Mechanics",
      description: "All technicians are background-checked, certified, and customer-rated.",
      icon: UserRound,
      color: "bg-amber-100 dark:bg-amber-900/40"
    },
    {
      title: "Premium Service",
      description: "Top-rated assistance with thousands of positive reviews nationwide.",
      icon: Star,
      color: "bg-yellow-100 dark:bg-yellow-900/40"
    },
    {
      title: "Safety Features",
      description: "Built-in emergency protocols and live monitoring for your security.",
      icon: Shield,
      color: "bg-red-100 dark:bg-red-900/40"
    },
    {
      title: "Rapid Response",
      description: "Our smart system finds the nearest qualified mechanic for fastest service.",
      icon: Wrench,
      color: "bg-purple-100 dark:bg-purple-900/40"
    },
  ];

  const services = [
    {
      title: "Engine Diagnostics",
      icon: <Wrench className="w-8 h-8" />,
      description: "Professional analysis of engine issues with advanced diagnostic tools."
    },
    {
      title: "Fuel Delivery",
      icon: <Truck className="w-8 h-8" />,
      description: "Emergency fuel delivery when you're stranded with an empty tank."
    },
    {
      title: "Battery Jump Start",
      icon: <CarFront className="w-8 h-8" />,
      description: "Quick jump-start service for dead or drained batteries."
    },
    {
      title: "Flat Tire Change",
      icon: <Navigation className="w-8 h-8" />,
      description: "Fast tire replacement or repair service wherever you are."
    }
  ];

  const testimonials = [
    {
      name: "Aayush Sharma",
      location: "New Delhi",
      message: "FuelFix saved me during a late-night breakdown on the highway. The mechanic arrived in 20 minutes and fixed my car quickly. The real-time tracking feature was incredibly reassuring.",
      rating: 5
    },
    {
      name: "Priya Patel",
      location: "Mumbai",
      message: "As a woman who travels alone, safety is my priority. FuelFix's verified mechanics and safety features gave me peace of mind when my car broke down in an unfamiliar area.",
      rating: 5
    },
    {
      name: "Raushan Kumar Gupta",
      location: "Bangalore",
      message: "I've used FuelFix multiple times for different issues. Their service is consistently professional, fast, and the app is very user-friendly. Highly recommend!",
      rating: 4
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-tr from-purple-50 via-white to-purple-100 dark:from-gray-900 dark:to-gray-800 text-gray-800 dark:text-white">
      <Navbar />

      {/* Hero with 3D effects */}
      <section className="py-24 md:py-32 relative overflow-hidden">
        {/* 3D floating blobs in the background */}
        <div className="absolute top-40 left-10 w-72 h-72 bg-purple-300/30 dark:bg-purple-900/20 rounded-full blur-3xl animate-float"></div>
        <div className="absolute bottom-20 right-10 w-80 h-80 bg-blue-300/20 dark:bg-blue-900/20 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }}></div>
        
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="text-center">
            <h1 className="text-5xl md:text-7xl font-extrabold mb-6 leading-tight 
                         bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-blue-600
                         filter drop-shadow-sm">
              FuelFix – Your Roadside <br className="hidden md:block" />Lifesaver
            </h1>
            <p className="text-xl max-w-2xl mx-auto mb-6 text-gray-600 dark:text-gray-300">
              Stuck on the road? Don't worry. FuelFix connects you with verified, nearby mechanics in real-time – 
              so you get back on track, fast.
            </p>
            <p className="text-lg max-w-xl mx-auto mb-10 font-semibold text-purple-600 dark:text-purple-400">
              "One tap. One fix. Wherever you are."
            </p>

            {/* 3D Car Animation */}
            
            <div className="flex flex-col sm:flex-row justify-center gap-5 mt-10">
              <Button
                onClick={() => navigate('/signup')}
                className="bg-purple-600 hover:bg-purple-700 
                          transform hover:translate-y-[-4px] hover:shadow-lg hover:shadow-purple-500/20
                          transition-all duration-300 scale-105 
                          text-lg py-7 px-8"
                size="lg"
              >
                Get Started
              </Button>
              <Button
                variant="outline"
                onClick={() => navigate('/login')}
                className="border-purple-600 text-purple-600 hover:bg-purple-100 
                          transform hover:translate-y-[-4px] transition-all duration-300
                          text-lg py-7 px-8"
                size="lg"
              >
                Sign In
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Wave separator */}
      <div className="relative bg-white dark:bg-gray-900 w-full overflow-hidden">
        <svg className="fill-purple-50 dark:fill-gray-800 -mt-px" viewBox="0 0 1440 80" xmlns="http://www.w3.org/2000/svg">
          <path d="M0,64L80,58.7C160,53,320,43,480,48C640,53,800,75,960,74.7C1120,75,1280,53,1360,42.7L1440,32L1440,0L1360,0C1280,0,1120,0,960,0C800,0,640,0,480,0C320,0,160,0,80,0L0,0Z"></path>
        </svg>
      </div>

      {/* Features with 3D cards */}
      <section className="py-24 bg-white dark:bg-gray-900 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Why Choose FuelFix?</h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Designed for travelers, optimized for emergencies. Whether it's a flat tire, empty fuel tank, 
              or engine problem — we've got you covered with our network of trusted mechanics.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {features.map((feature, index) => (
              <div
                key={index}
                className="p-8 rounded-3xl bg-white dark:bg-gray-800 
                          shadow-lg hover:shadow-2xl
                          border border-gray-200 dark:border-gray-700 
                          transform perspective-1000
                          hover:rotate-y-2 hover:rotate-x-1 hover:-translate-y-2 
                          transition-all duration-300
                          relative overflow-hidden group"
              >
                {/* 3D gradient lighting effect on hover */}
                <div className="absolute inset-0 bg-gradient-to-br from-purple-500/0 via-transparent to-blue-500/0
                              group-hover:from-purple-500/10 group-hover:to-blue-500/10
                              transition-all duration-500"></div>
                
                {/* Icon with specialized background */}
                <div className={`w-14 h-14 ${feature.color} rounded-2xl flex items-center justify-center mb-6
                                transform group-hover:scale-110 transition-transform duration-300
                                shadow-lg`}>
                  <feature.icon className="w-7 h-7 text-purple-600 dark:text-purple-400" />
                </div>
                
                <h3 className="text-xl font-semibold mb-3 relative z-10">{feature.title}</h3>
                <p className="text-gray-600 dark:text-gray-300 relative z-10">{feature.description}</p>
                
                {/* 3D lighting effect */}
                <div className="absolute -top-20 -right-20 w-40 h-40 bg-purple-300/10 dark:bg-purple-500/10 
                              rounded-full blur-2xl opacity-0 group-hover:opacity-100
                              transition-opacity duration-500"></div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-24 bg-purple-50 dark:bg-gray-800 relative overflow-hidden">
        {/* Background 3D elements */}
        <div className="absolute left-0 right-0 top-0 h-40 bg-gradient-to-b from-white to-transparent dark:from-gray-900 dark:to-transparent"></div>
        <div className="absolute -bottom-16 -left-16 w-32 h-32 bg-purple-300 rounded-full opacity-20 blur-3xl"></div>
        <div className="absolute -top-16 -right-16 w-32 h-32 bg-blue-300 rounded-full opacity-20 blur-3xl"></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Our Emergency Services</h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              FuelFix provides comprehensive roadside assistance services to get you back on the road quickly and safely.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {services.map((service, index) => (
              <div key={index} className="bg-white dark:bg-gray-900 rounded-3xl p-8 text-center
                                        shadow-lg hover:shadow-xl
                                        border border-purple-100/50 dark:border-purple-700/30
                                        transform transition-all duration-300
                                        hover:-translate-y-2 hover:scale-105">
                <div className="w-16 h-16 bg-purple-100 dark:bg-purple-900/40 rounded-2xl flex items-center justify-center mx-auto mb-6
                              text-purple-600 dark:text-purple-400">
                  {service.icon}
                </div>
                <h3 className="text-xl font-bold mb-3">{service.title}</h3>
                <p className="text-gray-600 dark:text-gray-300">{service.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Statistics Section */}
      <section className="py-24 bg-white dark:bg-gray-900 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">FuelFix in Numbers</h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              We're proud of the service we provide to drivers across the country.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <StatsCard 
              title="Active Users"
              value="150,000+"
              description="Drivers who trust our service"
            />
            <StatsCard 
              title="Mechanics"
              value="5,000+"
              description="Verified professionals nationwide"
            />
            <StatsCard 
              title="Response Time"
              value="15 min"
              description="Average arrival time"
            />
            <StatsCard 
              title="Success Rate"
              value="98.7%"
              description="Issues resolved on first visit"
            />
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 bg-purple-50 dark:bg-gray-800 relative overflow-hidden">
        {/* 3D background elements */}
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-200/50 dark:bg-purple-700/20 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-200/50 dark:bg-blue-700/20 rounded-full blur-3xl"></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Customer Stories</h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Hear from drivers who've experienced the FuelFix difference in their moment of need.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <TestimonialCard
                key={index}
                name={testimonial.name}
                location={testimonial.location}
                message={testimonial.message}
                rating={testimonial.rating}
              />
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <CTASection />

      {/* Footer with modern design */}
      <footer className="bg-gray-900 text-gray-300 py-16 px-4">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          <div>
            <h4 className="text-2xl font-bold mb-6 text-white">
              <span className="text-purple-400">Fuel</span>Fix
            </h4>
            <p className="mb-6 text-gray-400">
              FuelFix is your emergency roadside companion. Whether your car breaks down or runs out of fuel — help is just a tap away.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="h-10 w-10 rounded-full bg-gray-800 flex items-center justify-center hover:bg-purple-600 transition-colors">
                <span className="sr-only">Facebook</span>
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" />
                </svg>
              </a>
              <a href="#" className="h-10 w-10 rounded-full bg-gray-800 flex items-center justify-center hover:bg-purple-600 transition-colors">
                <span className="sr-only">Instagram</span>
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" clipRule="evenodd" />
                </svg>
              </a>
              <a href="#" className="h-10 w-10 rounded-full bg-gray-800 flex items-center justify-center hover:bg-purple-600 transition-colors">
                <span className="sr-only">Twitter</span>
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                </svg>
              </a>
            </div>
          </div>
          
          <div>
            <h4 className="text-lg font-semibold mb-6 text-white">Quick Links</h4>
            <ul className="space-y-3">
              <li><a href="#" className="hover:text-purple-400 transition-colors">Home</a></li>
              <li><a href="#" className="hover:text-purple-400 transition-colors">About Us</a></li>
              <li><a href="#" className="hover:text-purple-400 transition-colors">Services</a></li>
              <li><a href="#" className="hover:text-purple-400 transition-colors">How It Works</a></li>
              <li><a href="/signup" className="hover:text-purple-400 transition-colors">Sign Up</a></li>
              <li><a href="/login" className="hover:text-purple-400 transition-colors">Login</a></li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-lg font-semibold mb-6 text-white">Our Services</h4>
            <ul className="space-y-3">
              <li><a href="#" className="hover:text-purple-400 transition-colors">Fuel Delivery</a></li>
              <li><a href="#" className="hover:text-purple-400 transition-colors">Battery Jump Start</a></li>
              <li><a href="#" className="hover:text-purple-400 transition-colors">Flat Tire Change</a></li>
              <li><a href="#" className="hover:text-purple-400 transition-colors">Engine Diagnostics</a></li>
              <li><a href="#" className="hover:text-purple-400 transition-colors">Lockout Service</a></li>
              <li><a href="#" className="hover:text-purple-400 transition-colors">Towing</a></li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-lg font-semibold mb-6 text-white">Contact Us</h4>
            <ul className="space-y-3">
              <li className="flex items-start space-x-3">
                <MapPin size={18} className="mt-1 text-purple-400 flex-shrink-0" />
                <span>Bangalore, India</span>
              </li>
              <li className="flex items-start space-x-3">
                <svg className="h-5 w-5 text-purple-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <span>support@fuelfix.app</span>
              </li>
              <li className="flex items-start space-x-3">
                <svg className="h-5 w-5 text-purple-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                <span>+91-9876543210</span>
              </li>
            </ul>
            
            <div className="mt-8">
              <h5 className="text-white font-medium mb-4">Download Our App</h5>
              <div className="flex space-x-3">
                <a href="#" className="bg-gray-800 hover:bg-gray-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors">
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24"><path d="M17.707 9.293l-5-5a.999.999 0 00-1.414 0l-5 5a.999.999 0 101.414 1.414L12 6.414l4.293 4.293a.997.997 0 001.414 0 .999.999 0 000-1.414zM12 18.586l-4.293-4.293a.999.999 0 10-1.414 1.414l5 5a.997.997 0 001.414 0l5-5a.999.999 0 10-1.414-1.414L12 18.586z"></path></svg>
                  <span>App Store</span>
                </a>
                <a href="#" className="bg-gray-800 hover:bg-gray-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors">
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24"><path d="M17.707 9.293l-5-5a.999.999 0 00-1.414 0l-5 5a.999.999 0 101.414 1.414L12 6.414l4.293 4.293a.997.997 0 001.414 0 .999.999 0 000-1.414zM12 18.586l-4.293-4.293a.999.999 0 10-1.414 1.414l5 5a.997.997 0 001.414 0l5-5a.999.999 0 10-1.414-1.414L12 18.586z"></path></svg>
                  <span>Play Store</span>
                </a>
              </div>
            </div>
          </div>
        </div>
        
        <div className="max-w-7xl mx-auto mt-12 pt-8 border-t border-gray-800 flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          <p className="text-sm text-gray-500">
            © {new Date().getFullYear()} FuelFix. All rights reserved.
          </p>
          <div className="flex space-x-6 text-sm text-gray-500">
            <a href="#" className="hover:text-purple-400 transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-purple-400 transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-purple-400 transition-colors">Cookie Policy</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;