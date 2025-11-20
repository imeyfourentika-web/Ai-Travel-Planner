import React, { useState, useEffect } from 'react';
import { TripInput } from '../types';
import { MapPinIcon, CalendarIcon, HeartIcon, HeroIllustration } from './Icons';

interface TravelFormProps {
  onSubmit: (data: TripInput) => void;
  isLoading: boolean;
}

const CURRENCIES = ["IDR", "USD", "EUR", "JPY", "SGD", "MYR", "THB"];

const TravelForm: React.FC<TravelFormProps> = ({ onSubmit, isLoading }) => {
  const [destination, setDestination] = useState('');
  const [duration, setDuration] = useState<number | ''>(3);
  const [interests, setInterests] = useState('');
  
  // Budget State
  const [currency, setCurrency] = useState<string>('IDR');
  const [budget, setBudget] = useState<number>(5000000);

  // Adjust slider range based on currency
  const getSliderConfig = (curr: string) => {
    switch (curr) {
      case 'IDR': return { max: 50000000, step: 500000, default: 5000000 };
      case 'JPY': return { max: 500000, step: 5000, default: 50000 };
      case 'USD': 
      case 'EUR': return { max: 5000, step: 50, default: 1000 };
      case 'SGD': return { max: 5000, step: 50, default: 1000 };
      case 'MYR': return { max: 10000, step: 100, default: 2000 };
      case 'THB': return { max: 100000, step: 1000, default: 20000 };
      default: return { max: 10000, step: 100, default: 1000 };
    }
  };

  // Reset budget to a reasonable default when currency changes
  useEffect(() => {
    const config = getSliderConfig(currency);
    setBudget(config.default);
  }, [currency]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!destination || !duration || !interests) return;
    onSubmit({ 
      destination, 
      duration: Number(duration), 
      interests,
      budget,
      currency
    });
  };

  const formatBudgetDisplay = (val: number, curr: string) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: curr, maximumFractionDigits: 0 }).format(val);
  };

  const sliderConfig = getSliderConfig(currency);

  return (
    <div className="w-full max-w-5xl bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl overflow-hidden flex flex-col md:flex-row border border-white/20">
      
      {/* Left Side: Form Content */}
      <div className="p-8 md:p-10 flex-1 space-y-8">
        <div>
          <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight">Plan Your Journey</h2>
          <p className="text-gray-500 mt-2 text-sm font-medium">AI Travel Planner siap menyusun itinerary impian Anda.</p>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          
          {/* Destination Input */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Tujuan Wisata</label>
            <div className="group flex items-center bg-gray-50 rounded-xl px-4 py-3 border border-gray-200 focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-blue-500 focus-within:bg-white transition-all duration-200 hover:border-blue-300">
              <MapPinIcon className="h-5 w-5 text-blue-400 group-focus-within:text-blue-600 transition-colors mr-3" />
              <input
                type="text"
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
                placeholder="e.g., Kyoto, Japan"
                className="bg-transparent border-none focus:ring-0 w-full text-gray-800 placeholder-gray-400 font-semibold"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6">
            {/* Duration Input */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Durasi (Hari)</label>
              <div className="group flex items-center bg-gray-50 rounded-xl px-4 py-3 border border-gray-200 focus-within:ring-2 focus-within:ring-blue-500 focus-within:bg-white transition-all hover:border-blue-300">
                <CalendarIcon className="h-5 w-5 text-blue-400 group-focus-within:text-blue-600 transition-colors mr-3" />
                <input
                  type="number"
                  min="1"
                  max="30"
                  value={duration}
                  onChange={(e) => setDuration(Number(e.target.value))}
                  className="bg-transparent border-none focus:ring-0 w-full text-gray-800 font-semibold"
                  required
                />
              </div>
            </div>

            {/* Interests Input */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Minat Khusus</label>
              <div className="group flex items-center bg-gray-50 rounded-xl px-4 py-3 border border-gray-200 focus-within:ring-2 focus-within:ring-blue-500 focus-within:bg-white transition-all hover:border-blue-300">
                <HeartIcon className="h-5 w-5 text-blue-400 group-focus-within:text-blue-600 transition-colors mr-3" />
                <input
                  type="text"
                  value={interests}
                  onChange={(e) => setInterests(e.target.value)}
                  placeholder="Kuliner, Alam..."
                  className="bg-transparent border-none focus:ring-0 w-full text-gray-800 placeholder-gray-400 font-semibold"
                  required
                />
              </div>
            </div>
          </div>

          {/* Budget Slider Section */}
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50/50 rounded-2xl p-6 border border-blue-100/50 shadow-sm relative overflow-hidden">
             <div className="absolute top-0 right-0 w-32 h-32 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 -translate-y-1/2 translate-x-1/2"></div>
             
             <div className="flex justify-between items-center mb-4 relative z-10">
                <label className="text-xs font-bold text-blue-600 uppercase tracking-wider">Total Budget Saya</label>
                
                {/* Currency Selector */}
                <select 
                  value={currency}
                  onChange={(e) => setCurrency(e.target.value)}
                  className="bg-white/80 border border-blue-200 text-blue-700 text-xs font-bold rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer hover:bg-white transition-colors"
                >
                  {CURRENCIES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
             </div>

             <div className="flex items-baseline gap-2 mb-6 relative z-10">
                <span className="text-4xl font-black text-blue-900 tracking-tight">
                  {formatBudgetDisplay(budget, currency)}
                </span>
             </div>

             <div className="relative z-10">
               <input 
                  type="range"
                  min="0"
                  max={sliderConfig.max}
                  step={sliderConfig.step}
                  value={budget}
                  onChange={(e) => setBudget(Number(e.target.value))}
                  className="w-full h-2 bg-blue-200 rounded-lg appearance-none cursor-pointer accent-blue-600 hover:accent-blue-700 transition-all"
               />
               <div className="flex justify-between text-[10px] font-semibold text-blue-400 mt-2">
                  <span>0</span>
                  <span>Max: {formatBudgetDisplay(sliderConfig.max, currency)}</span>
               </div>
             </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className={`w-full py-4 rounded-xl font-bold text-white shadow-xl shadow-blue-500/20 transform transition-all duration-200 hover:-translate-y-1 active:translate-y-0 active:scale-[0.98]
              ${isLoading ? 'bg-gray-400 cursor-not-allowed shadow-none' : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700'}
            `}
          >
            {isLoading ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Sedang Merancang...
              </span>
            ) : (
              'Buat Rencana Perjalanan →'
            )}
          </button>
        </form>
      </div>

      {/* Right Side: Illustration (Hidden on Mobile) */}
      <div className="hidden md:flex w-2/5 bg-gradient-to-br from-blue-50 to-indigo-50 items-center justify-center relative overflow-hidden border-l border-white/50">
         <div className="absolute top-0 right-0 w-64 h-64 bg-blue-100 rounded-full mix-blend-multiply filter blur-3xl opacity-40 animate-blob"></div>
         <div className="absolute bottom-0 left-0 w-64 h-64 bg-indigo-200 rounded-full mix-blend-multiply filter blur-3xl opacity-40 animate-blob animation-delay-2000"></div>
         
         <div className="relative z-10 p-8">
           <HeroIllustration className="w-full max-w-xs drop-shadow-2xl transform transition hover:scale-105 duration-500" />
           <div className="mt-8 text-center">
              <p className="text-blue-900/60 text-sm font-semibold tracking-wide uppercase">AI Powered</p>
              <h3 className="text-2xl font-black text-blue-900 mt-1">Smart Itinerary</h3>
           </div>
         </div>
      </div>

    </div>
  );
};

export default TravelForm;