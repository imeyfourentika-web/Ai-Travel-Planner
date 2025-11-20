import React from 'react';
import { Activity } from '../types';
import { ClockIcon, GlobeIcon } from './Icons';

interface ActivityCardProps {
  activity: Activity;
  currencyCode: string;
  actualCost: number;
  onCostChange: (val: number) => void;
}

const ActivityCard: React.FC<ActivityCardProps> = ({ activity, currencyCode, actualCost, onCostChange }) => {
  const searchUrl = `https://www.google.com/search?q=${encodeURIComponent(activity.name + " ticket price cost")}`;

  return (
    <div className="bg-white border border-gray-100 rounded-xl p-4 hover:shadow-md transition-shadow duration-300 flex flex-col md:flex-row gap-4 items-start relative overflow-hidden">
      {/* Category Badge */}
      <div className="absolute top-0 right-0 bg-gray-100 px-3 py-1 rounded-bl-lg text-xs font-semibold text-gray-500 uppercase tracking-wider z-10">
        {activity.category}
      </div>

      {/* Left Content: Info */}
      <div className="flex-1 space-y-2 w-full md:pr-4">
        <h4 className="text-lg font-bold text-gray-800 pr-16">{activity.name}</h4>
        <p className="text-sm text-gray-600 leading-relaxed">{activity.description}</p>
        
        <div className="flex flex-wrap gap-3 mt-2 text-sm">
          <div className="flex items-center text-gray-500 bg-gray-50 px-2 py-1 rounded-md">
            <ClockIcon className="w-4 h-4 mr-1.5 text-blue-500" />
            {activity.openingHours}
          </div>
          <a
            href={searchUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center text-blue-600 hover:text-blue-800 bg-blue-50 px-2 py-1 rounded-md transition-colors"
            title="Verifikasi info real-time di Google"
          >
            <GlobeIcon className="w-4 h-4 mr-1.5" />
            Cek Info
          </a>
        </div>
      </div>

      {/* Right Content: Budget Input */}
      <div className="w-full md:w-48 flex-shrink-0 bg-gray-50 rounded-lg p-3 border border-gray-100 flex flex-col justify-center">
        <label className="text-xs font-semibold text-gray-500 uppercase mb-1 block">
          Estimasi Biaya
        </label>
        <div className="relative rounded-md shadow-sm">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-2">
            <span className="text-gray-500 sm:text-sm font-medium">{currencyCode}</span>
          </div>
          <input
            type="number"
            min="0"
            value={actualCost}
            onChange={(e) => onCostChange(parseFloat(e.target.value) || 0)}
            className="block w-full rounded-md border-0 py-1.5 pl-12 pr-2 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6 bg-white"
            placeholder="0"
          />
        </div>
        <div className="mt-1 text-xs text-gray-400 text-right">
           Saran AI: {activity.estimatedCost}
        </div>
      </div>
    </div>
  );
};

export default ActivityCard;
