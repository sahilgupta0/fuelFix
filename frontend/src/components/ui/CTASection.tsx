
import React from 'react';
import { Button } from './button';
import { useNavigate } from 'react-router-dom';

const CTASection: React.FC = () => {
  const navigate = useNavigate();

  return (
    <section className="py-24 relative overflow-hidden">
      {/* Background with 3D-like depth */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-900 to-blue-900 opacity-90"></div>
      
      {/* 3D floating circles */}
      <div className="absolute -top-20 -left-20 w-80 h-80 bg-purple-600/20 rounded-full blur-3xl animate-float"></div>
      <div className="absolute -bottom-20 -right-20 w-80 h-80 bg-blue-600/20 rounded-full blur-3xl animate-float animation-delay-2000"></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-12 border border-white/20
                      shadow-[0_8px_32px_rgba(0,0,0,0.2)]
                      transform perspective-1000 hover:rotate-x-1 hover:scale-[1.01] transition-all duration-500">
          <div className="text-center mb-10">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
              Ready for Reliable Roadside Assistance?
            </h2>
            <p className="text-lg text-white/80 max-w-2xl mx-auto mb-8">
              Join thousands of drivers who rely on FuelFix for immediate help during road emergencies. 
              Our network of verified mechanics is ready to assist you 24/7.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4 max-w-md mx-auto">
              <Button
                variant="outline"
                onClick={() => navigate("/signup")}
                className="border-white text-purple-900 hover:bg-white/10
                          transform hover:translate-y-[-2px] transition-all
                          text-lg py-6 px-8 w-full sm:w-auto"
                size="lg"
              >
                Get Started Now
              </Button>
              <Button
                variant="outline"
                onClick={() => navigate("/login")}
                className="border-white text-purple-900 hover:bg-white/10
                          transform hover:translate-y-[-2px] transition-all
                          text-lg py-6 px-8 w-full sm:w-auto"
                size="lg"
              >
                Sign In
              </Button>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center text-white/90">
            <div className="p-4">
              <p className="text-4xl font-bold mb-2">1</p>
              <p>Sign up and create your profile</p>
            </div>
            <div className="p-4">
              <p className="text-4xl font-bold mb-2">2</p>
              <p>Request help with your location</p>
            </div>
            <div className="p-4">
              <p className="text-4xl font-bold mb-2">3</p>
              <p>Get connected with a nearby mechanic</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTASection;