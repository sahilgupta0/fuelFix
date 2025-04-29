
import React from 'react';
import { Star } from 'lucide-react';

interface TestimonialCardProps {
  name: string;
  location: string;
  message: string;
  rating: number;
}

const TestimonialCard: React.FC<TestimonialCardProps> = ({
  name,
  location,
  message,
  rating
}) => {
  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-xl 
                  transform hover:-translate-y-2 transition-all duration-300 
                  border border-purple-100 dark:border-purple-900/30
                  hover:shadow-2xl hover:shadow-purple-200/50 dark:hover:shadow-purple-900/20
                  relative z-10 overflow-hidden group">
      {/* Quote mark decoration */}
      <div className="absolute -top-6 -left-6 text-9xl font-serif text-purple-100 dark:text-gray-700 opacity-60 select-none">
        "
      </div>
      
      {/* Content */}
      <div className="relative z-10">
        <div className="flex mb-4">
          {[...Array(5)].map((_, i) => (
            <Star 
              key={i}
              size={18} 
              className={`${i < rating ? 'text-yellow-500 fill-yellow-500' : 'text-gray-300 dark:text-gray-600'}`} 
            />
          ))}
        </div>
        <p className="text-gray-600 dark:text-gray-300 mb-6 italic">{message}</p>
        <div>
          <p className="font-semibold text-gray-800 dark:text-gray-200">{name}</p>
          <p className="text-gray-500 dark:text-gray-400 text-sm">{location}</p>
        </div>
      </div>
      
      {/* 3D effect hover glow */}
      <div className="absolute inset-0 bg-gradient-to-tr from-purple-600/0 to-purple-300/0 
                    group-hover:from-purple-600/5 group-hover:to-purple-300/10 transition-all duration-300"></div>
    </div>
  );
};

export default TestimonialCard;