
import React from 'react';

interface StatsCardProps {
  title: string;
  value: string;
  description: string;
}

const StatsCard: React.FC<StatsCardProps> = ({ title, value, description }) => {
  return (
    <div className="relative bg-white dark:bg-gray-800 rounded-xl p-6 text-center
                  transform perspective-1000 transition-all duration-500 
                  shadow-md hover:shadow-xl hover:-translate-y-1 group
                  border border-gray-100 dark:border-gray-700">
      {/* 3D hover effect layers */}
      <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-purple-600/0 to-blue-400/0
                    group-hover:from-purple-600/5 group-hover:to-blue-400/10
                    transition-all duration-500"></div>
                    
      <div className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100
                    bg-[radial-gradient(circle_at_50%_0%,rgba(255,255,255,0.1),transparent_70%)]
                    transition-opacity duration-500"></div>
      
      {/* Content */}
      <div className="relative z-10">
        <h3 className="text-lg font-medium text-gray-500 dark:text-gray-400 mb-2">{title}</h3>
        <p className="text-4xl font-bold text-purple-600 dark:text-purple-400 mb-2">{value}</p>
        <p className="text-sm text-gray-600 dark:text-gray-300">{description}</p>
      </div>
    </div>
  );
};

export default StatsCard;