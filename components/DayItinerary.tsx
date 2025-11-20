import React from 'react';
import { DayPlan } from '../types';
import ActivityCard from './ActivityCard';

interface DayItineraryProps {
  day: DayPlan;
  currencyCode: string;
  dayIndex: number;
  userCosts: Record<string, number>;
  onCostUpdate: (dayIdx: number, actIdx: number, val: number) => void;
}

const DayItinerary: React.FC<DayItineraryProps> = ({ day, currencyCode, dayIndex, userCosts, onCostUpdate }) => {
  return (
    <div className="mb-8 relative pl-8 sm:pl-0">
      {/* Timeline Line for Desktop */}
      <div className="hidden sm:block absolute left-8 top-0 bottom-0 w-0.5 bg-gradient-to-b from-blue-200 to-gray-100"></div>
      
      <div className="mb-6 sm:ml-20 relative">
         {/* Day Badge */}
         <div className="hidden sm:flex absolute -left-[4.5rem] top-0 items-center justify-center w-12 h-12 rounded-full bg-blue-600 text-white font-bold text-xl shadow-lg ring-4 ring-blue-50 z-10">
           {day.dayNumber}
         </div>
         
         {/* Mobile Header */}
         <div className="sm:hidden flex items-center gap-3 mb-2">
           <div className="flex items-center justify-center w-10 h-10 rounded-full bg-blue-600 text-white font-bold shadow-lg">
             {day.dayNumber}
           </div>
           <span className="text-sm font-semibold text-blue-600 uppercase tracking-wide">Hari Ke-{day.dayNumber}</span>
         </div>

         <h3 className="text-2xl font-bold text-gray-900 mb-1">{day.theme}</h3>
         <p className="text-gray-500 text-sm">Jelajahi keajaiban hari ini</p>
      </div>

      <div className="space-y-4 sm:ml-20">
        {day.activities.map((activity, actIndex) => {
            const costKey = `${dayIndex}-${actIndex}`;
            return (
              <ActivityCard 
                key={costKey} 
                activity={activity} 
                currencyCode={currencyCode}
                actualCost={userCosts[costKey] ?? activity.price}
                onCostChange={(val) => onCostUpdate(dayIndex, actIndex, val)}
              />
            );
        })}
      </div>
    </div>
  );
};

export default DayItinerary;