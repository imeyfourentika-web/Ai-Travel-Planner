import React, { useState, useRef } from 'react';
import TravelForm from './components/TravelForm';
import DayItinerary from './components/DayItinerary';
import LoadingState from './components/LoadingState';
import { generateItinerary } from './services/geminiService';
import { TripInput, ItineraryResponse, LoadingState as LoadStatus } from './types';
import { WalletIcon } from './components/Icons';

const App: React.FC = () => {
  const [status, setStatus] = useState<LoadStatus>(LoadStatus.IDLE);
  const [itinerary, setItinerary] = useState<ItineraryResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  // State to track user-editable costs. Key is "dayIdx-actIdx"
  const [userCosts, setUserCosts] = useState<Record<string, number>>({});
  
  // Store original request to compare budget
  const [tripRequest, setTripRequest] = useState<TripInput | null>(null);

  const resultRef = useRef<HTMLDivElement>(null);

  const handleFormSubmit = async (input: TripInput) => {
    setStatus(LoadStatus.LOADING);
    setError(null);
    setItinerary(null);
    setUserCosts({}); 
    setTripRequest(input);

    try {
      const data = await generateItinerary(input);
      setItinerary(data);
      
      // Initialize userCosts with AI estimates
      const initialCosts: Record<string, number> = {};
      data.dailyPlans.forEach((day, dIdx) => {
        day.activities.forEach((act, aIdx) => {
          initialCosts[`${dIdx}-${aIdx}`] = act.price || 0;
        });
      });
      setUserCosts(initialCosts);

      setStatus(LoadStatus.SUCCESS);
      
      setTimeout(() => {
        resultRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 100);
    } catch (err) {
      setStatus(LoadStatus.ERROR);
      setError("Gagal membuat itinerary. Mohon periksa koneksi internet atau API Key Anda, lalu coba lagi.");
    }
  };

  const handleCostUpdate = (dayIdx: number, actIdx: number, val: number) => {
    setUserCosts(prev => ({
      ...prev,
      [`${dayIdx}-${actIdx}`]: val
    }));
  };

  // Calculate Totals
  const totalCost: number = (Object.values(userCosts) as number[]).reduce((acc: number, curr: number) => acc + curr, 0);
  const tripDuration: number = itinerary?.dailyPlans?.length || 1;
  // averageDailyCost variable kept for potential future use, though not displayed currently
  // const averageDailyCost = totalCost / tripDuration; 
  
  // Budget Logic
  const userBudget = tripRequest?.budget || 0;
  const remainingBudget = userBudget - totalCost;
  const isOverBudget = remainingBudget < 0;
  const budgetProgress = userBudget > 0 ? Math.min((totalCost / userBudget) * 100, 100) : 0;

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-800 relative overflow-x-hidden">
      
      {/* Modern Mesh Gradient Background */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-blue-50 via-white to-slate-50"></div>
        <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-blue-200/30 blur-[120px] animate-pulse"></div>
        <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] rounded-full bg-indigo-200/30 blur-[120px] animate-pulse" style={{ animationDelay: '2s' }}></div>
      </div>

      {/* Main Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-6xl font-black tracking-tight mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-700 to-indigo-600 drop-shadow-sm">
            AI Travel Planner
          </h1>
          <p className="text-lg md:text-xl text-gray-500 max-w-2xl mx-auto font-medium leading-relaxed">
            Desain petualangan sempurna Anda dalam hitungan detik dengan kekuatan AI.
          </p>
        </div>
        
        {/* Form Section */}
        <div className="flex justify-center relative z-10 mb-24">
          <TravelForm onSubmit={handleFormSubmit} isLoading={status === LoadStatus.LOADING} />
        </div>

        {/* Results Section */}
        <div ref={resultRef}>
          {status === LoadStatus.LOADING && (
            <div className="bg-white/80 backdrop-blur-md rounded-3xl shadow-xl p-12 flex items-center justify-center max-w-3xl mx-auto border border-white/50">
              <LoadingState />
            </div>
          )}

          {status === LoadStatus.ERROR && (
            <div className="bg-white rounded-3xl shadow-xl p-8 border-l-8 border-red-500 max-w-3xl mx-auto">
              <div className="flex items-start gap-4">
                <div className="text-red-500 text-2xl">⚠️</div>
                <div>
                  <h3 className="text-xl font-bold text-red-700">Terjadi Kesalahan</h3>
                  <p className="text-gray-600 mt-2">{error}</p>
                  <button 
                    onClick={() => setStatus(LoadStatus.IDLE)}
                    className="mt-6 px-6 py-2 bg-red-100 text-red-700 rounded-lg font-semibold hover:bg-red-200 transition"
                  >
                    Coba Lagi
                  </button>
                </div>
              </div>
            </div>
          )}

          {status === LoadStatus.SUCCESS && itinerary && (
            <div className="space-y-12 animate-fade-in-up max-w-5xl mx-auto pb-20">
              
              {/* Trip Header */}
              <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-lg p-8 border border-blue-100 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">Itinerary</span>
                    <span className="bg-indigo-50 text-indigo-600 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">{tripDuration} Hari</span>
                  </div>
                  <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900">{itinerary.tripTitle}</h2>
                </div>
                <div className="bg-gradient-to-br from-gray-50 to-gray-100 px-6 py-4 rounded-2xl border border-gray-200 text-center min-w-[120px] shadow-inner">
                  <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Mata Uang</p>
                  <p className="text-3xl font-black text-gray-800 tracking-tight">{itinerary.currencyCode}</p>
                </div>
              </div>

              {/* Daily Plans */}
              <div className="bg-white rounded-3xl shadow-xl shadow-slate-200/50 p-6 md:p-12 border border-slate-100">
                {itinerary.dailyPlans.map((day, index) => (
                  <DayItinerary 
                    key={day.dayNumber} 
                    day={day}
                    dayIndex={index}
                    currencyCode={itinerary.currencyCode}
                    userCosts={userCosts}
                    onCostUpdate={handleCostUpdate}
                  />
                ))}
              </div>

              {/* Modern Budget Summary */}
              <div className="bg-slate-900 rounded-3xl shadow-2xl overflow-hidden text-white relative group">
                <div className="absolute inset-0 bg-gradient-to-r from-slate-900 to-slate-800 z-0"></div>
                
                {/* Decorative Elements */}
                <div className="absolute top-0 right-0 opacity-5 pointer-events-none z-0">
                   <WalletIcon className="w-96 h-96 transform translate-x-20 -translate-y-20" />
                </div>

                <div className="p-8 md:p-12 relative z-10">
                  <h2 className="text-2xl font-bold mb-10 flex items-center gap-3">
                    <div className="p-2 bg-emerald-500/20 rounded-xl ring-1 ring-emerald-500/30">
                      <WalletIcon className="w-6 h-6 text-emerald-400" />
                    </div>
                    Budget Overview
                  </h2>

                  {/* Budget Progress Bar */}
                  <div className="mb-12">
                    <div className="flex justify-between text-sm font-medium mb-3 text-slate-300">
                       <span>Penggunaan Budget</span>
                       <span className={isOverBudget ? 'text-red-400' : 'text-emerald-400'}>{budgetProgress.toFixed(0)}%</span>
                    </div>
                    <div className="w-full h-3 bg-slate-700/50 rounded-full overflow-hidden backdrop-blur-sm">
                       <div 
                          className={`h-full transition-all duration-1000 ease-out rounded-full shadow-[0_0_10px_rgba(0,0,0,0.3)] ${isOverBudget ? 'bg-gradient-to-r from-red-500 to-red-600' : 'bg-gradient-to-r from-emerald-500 to-teal-500'}`}
                          style={{ width: `${Math.min(budgetProgress, 100)}%` }}
                       ></div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Card 1: Total Cost */}
                    <div className="bg-white/5 rounded-2xl p-6 border border-white/10 backdrop-blur-sm hover:bg-white/10 transition-colors">
                       <p className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-2">Total Estimasi</p>
                       <div className="text-3xl font-bold text-white tracking-tight">
                         {totalCost.toLocaleString()} <span className="text-sm text-slate-500 font-normal ml-1">{itinerary.currencyCode}</span>
                       </div>
                    </div>

                    {/* Card 2: Remaining Budget */}
                    <div className={`rounded-2xl p-6 border backdrop-blur-sm transition-all ${isOverBudget ? 'bg-red-500/10 border-red-500/30' : 'bg-emerald-500/10 border-emerald-500/30'}`}>
                       <p className={`text-xs font-bold uppercase tracking-wider mb-2 ${isOverBudget ? 'text-red-300' : 'text-emerald-300'}`}>
                         {isOverBudget ? 'Defisit Budget' : 'Sisa Budget'}
                       </p>
                       <div className={`text-3xl font-bold tracking-tight ${isOverBudget ? 'text-red-400' : 'text-emerald-400'}`}>
                         {remainingBudget.toLocaleString()} <span className="text-sm opacity-60 font-normal ml-1">{itinerary.currencyCode}</span>
                       </div>
                    </div>

                    {/* Card 3: User Limit */}
                    <div className="bg-white/5 rounded-2xl p-6 border border-white/10 backdrop-blur-sm hover:bg-white/10 transition-colors">
                       <p className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-2">Limit Budget Anda</p>
                       <div className="text-3xl font-bold text-white tracking-tight">
                         {userBudget.toLocaleString()} <span className="text-sm text-slate-500 font-normal ml-1">{itinerary.currencyCode}</span>
                       </div>
                    </div>
                  </div>
                </div>
              </div>

            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default App;