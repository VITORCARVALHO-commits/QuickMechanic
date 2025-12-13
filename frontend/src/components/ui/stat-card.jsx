import React from 'react';
import { EnhancedCard } from './enhanced-card';

export const StatCard = ({ title, value, icon: Icon, color = 'primary', trend = null }) => {
  const colorClasses = {
    primary: 'text-[#1EC6C6] bg-[#1EC6C6]/10',
    success: 'text-[#27AE60] bg-[#27AE60]/10',
    warning: 'text-[#F39C12] bg-[#F39C12]/10',
    danger: 'text-[#E84141] bg-[#E84141]/10'
  };

  return (
    <EnhancedCard className="p-6">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-600 mb-1">{title}</p>
          <p className="text-3xl font-bold text-[#0E1A2C]">{value}</p>
          {trend && (
            <p className={`text-sm mt-2 ${trend > 0 ? 'text-green-600' : 'text-red-600'}`}>
              {trend > 0 ? '↑' : '↓'} {Math.abs(trend)}% vs. mês passado
            </p>
          )}
        </div>
        {Icon && (
          <div className={`p-4 rounded-2xl ${colorClasses[color]}`}>
            <Icon className="h-8 w-8" />
          </div>
        )}
      </div>
    </EnhancedCard>
  );
};
