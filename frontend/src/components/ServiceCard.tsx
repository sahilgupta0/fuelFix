
import { LucideIcon } from "lucide-react";
import { Card } from "./../components/ui/card";
import React from 'react';

interface ServiceCardProps {
  title: string;
  Icon: LucideIcon;
  onClick?: () => void;
}

const ServiceCard = ({ title, Icon, onClick }: ServiceCardProps) => {
  return (
    <Card 
      className="p-6 hover:shadow-lg transition-shadow cursor-pointer"
      onClick={onClick}
    >
      <div className="flex flex-col items-center gap-4">
        <div className="p-3 bg-purple-100 rounded-full">
          <Icon className="h-8 w-8 text-purple-600" />
        </div>
        <h3 className="text-xl font-semibold text-gray-800">{title}</h3>
      </div>
    </Card>
  );
};

export default ServiceCard;
