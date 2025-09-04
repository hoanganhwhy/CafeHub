import React from 'react';
import { DivideIcon as LucideIcon } from 'lucide-react';

interface StatsCardProps {
  icon: LucideIcon | (() => JSX.Element);
  title: string;
  value: string | number;
  color: 'blue' | 'green' | 'orange' | 'purple';
  trend?: {
    value: number;
    isPositive: boolean;
  };
}

const StatsCard: React.FC<StatsCardProps> = ({ icon, title, value, color, trend }) => {
  const Icon = typeof icon === 'function' ? icon : icon;
  
  const colorClasses = {
    blue: {
      bg: 'from-blue-500 to-blue-600',
      light: 'from-blue-100 to-blue-200',
      text: 'text-blue-600',
      shadow: 'shadow-blue-500/30'
    },
    green: {
      bg: 'from-green-500 to-green-600',
      light: 'from-green-100 to-green-200',
      text: 'text-green-600',
      shadow: 'shadow-green-500/30'
    },
    orange: {
      bg: 'from-orange-500 to-orange-600',
      light: 'from-orange-100 to-orange-200',
      text: 'text-orange-600',
      shadow: 'shadow-orange-500/30'
    },
    purple: {
      bg: 'from-purple-500 to-purple-600',
      light: 'from-purple-100 to-purple-200',
      text: 'text-purple-600',
      shadow: 'shadow-purple-500/30'
    }
  };

  const colors = colorClasses[color];

  return (
    <div className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden transform hover:scale-105 hover:-translate-y-1 border border-gray-100 hover:border-gray-200">
      <div className="p-6">
        <div className="flex items-center gap-4">
          <div className={`bg-gradient-to-br ${colors.light} p-4 rounded-2xl shadow-lg group-hover:shadow-xl transition-all duration-300 transform group-hover:scale-110 group-hover:rotate-3`}>
            {typeof Icon === 'function' ? (
              <Icon />
            ) : (
              <Icon className={`w-8 h-8 ${colors.text} transition-transform duration-300 group-hover:scale-110`} />
            )}
          </div>
          <div className="flex-1">
            <h3 className="text-sm font-semibold text-gray-600 mb-1 uppercase tracking-wide">
              {title}
            </h3>
            <p className="text-3xl font-bold text-gray-900 mb-1 transition-all duration-300 group-hover:scale-105">
              {value}
            </p>
            {trend && (
              <div className={`flex items-center gap-1 text-sm font-medium ${
                trend.isPositive ? 'text-green-600' : 'text-red-600'
              }`}>
                <span>{trend.isPositive ? '↗' : '↘'}</span>
                <span>{Math.abs(trend.value)}%</span>
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Bottom accent */}
      <div className={`h-2 bg-gradient-to-r ${colors.bg} transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left ${colors.shadow}`}></div>
    </div>
  );
};

export default StatsCard;