import React from 'react';
import { SparklesIcon } from './Icons';

const LoadingState: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center px-4">
      <div className="relative">
        <div className="absolute inset-0 bg-blue-100 rounded-full animate-ping opacity-75"></div>
        <div className="relative bg-white p-4 rounded-full shadow-xl border border-blue-100">
          <SparklesIcon className="w-10 h-10 text-blue-600 animate-pulse" />
        </div>
      </div>
      <h3 className="mt-8 text-xl font-semibold text-gray-800">Merancang Perjalanan Impian Anda</h3>
      <p className="mt-2 text-gray-500 max-w-sm">
        AI sedang mencari tempat terbaik, menghitung estimasi biaya, dan menyusun jadwal harian...
      </p>
    </div>
  );
};

export default LoadingState;