import React, { useState } from 'react';
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
  
  // Using pollinations.ai for dynamic image generation based on prompt
  // Adding 'scenery' and 'high quality' to ensure better results for places
  const imageUrl = `https://image.pollinations.ai/prompt/${encodeURIComponent(activity.imagePrompt + " scenery high quality 4k realistic")}`;
  
  const [imageError, setImageError] = useState(false);

  return (
    <div className="bg-white border border-gray-100 rounded-xl hover:shadow-md transition-shadow duration-300 flex flex-col md:flex-row items-stretch relative overflow-hidden group">
      {/* Category Badge */}
      <div className="absolute top-0 right-0 md:left-0 md:right-auto bg-white/90 backdrop-blur text-xs font-bold px-3 py-1 rounded-bl-lg md:rounded-none md:rounded-br-lg text-gray-600 uppercase tracking-wider z-10 border-b border-l md:border-l-0 md:border-r border-gray-100 shadow-sm">
        {activity.category}
      </div>

      {/* Image Column */}
      <div className="w-full md:w-48 h-48 md:h-auto flex-shrink-0 bg-gray-100 relative overflow-hidden">
        {!imageError ? (
          <img 
            src={imageUrl} 
            alt={activity.name}
            className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
            loading="lazy"
            onError={() => setImageError(true)}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-300 bg-gray-50">
             <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-10 h-10">
                <path strokeLinecap="round" strokeLinejoin="round" d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 0 0 1.5-1.5V6a1.5 1.5 0 0 0-1.5-1.5H3.75A1.5 1.5 0 0 0 2.25 6v12a1.5 1.5 0 0 0 1.5 1.5Zm10.5-11.25h.008v.008h-.008V8.25Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
             </svg>
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent md:hidden"></div>
      </div>

      {/* Content Section */}
      <div className="flex flex-col md:flex-row flex-1 p-4 gap-4">
        
        {/* Text Info */}
        <div className="flex-1 space-y-2">
          <h4 className="text-lg font-bold text-gray-800 group-hover:text-blue-600 transition-colors">{activity.name}</h4>
          <p className="text-sm text-gray-600 leading-relaxed line-clamp-2 md:line-clamp-3">{activity.description}</p>
          
          <div className="flex flex-wrap gap-3 mt-2 text-sm pt-2">
            <div className="flex items-center text-gray-500 bg-gray-50 px-2.5 py-1 rounded-md border border-gray-100">
              <ClockIcon className="w-4 h-4 mr-1.5 text-blue-500" />
              {activity.openingHours}
            </div>
            <a
              href={searchUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center text-blue-600 hover:text-blue-800 bg-blue-50 hover:bg-blue-100 border border-blue-100 px-2.5 py-1 rounded-md transition-all"
              title="Verifikasi info real-time di Google"
            >
              <GlobeIcon className="w-4 h-4 mr-1.5" />
              Cek Info
            </a>
          </div>
        </div>

        {/* Budget Input Column */}
        <div className="w-full md:w-40 flex-shrink-0 flex flex-col justify-center pt-2 md:pt-0 md:border-l md:border-gray-100 md:pl-4">
          <label className="text-[10px] font-bold text-gray-400 uppercase mb-1.5 tracking-wide">
            Estimasi Biaya
          </label>
          <div className="relative rounded-lg shadow-sm">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-2.5">
              <span className="text-gray-500 sm:text-xs font-bold">{currencyCode}</span>
            </div>
            <input
              type="number"
              min="0"
              value={actualCost}
              onChange={(e) => onCostChange(parseFloat(e.target.value) || 0)}
              className="block w-full rounded-lg border-0 py-2 pl-10 pr-2 text-gray-900 ring-1 ring-inset ring-gray-200 placeholder:text-gray-300 focus:ring-2 focus:ring-inset focus:ring-blue-500 text-sm font-semibold sm:leading-6 bg-gray-50 focus:bg-white transition-all"
              placeholder="0"
            />
          </div>
          <div className="mt-2 text-[10px] text-gray-400 text-right font-medium">
             AI: {activity.estimatedCost}
          </div>
        </div>

      </div>
    </div>
  );
};

export default ActivityCard;