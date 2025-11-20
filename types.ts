export interface TripInput {
  destination: string;
  duration: number;
  interests: string;
  budget: number;
  currency: string;
}

export interface Activity {
  name: string;
  description: string;
  openingHours: string; // e.g., "09:00 - 17:00" or "24 Hours"
  estimatedCost: string; // e.g., "¥2000"
  price: number; // Numeric value for calculation (0 if free)
  category: string; // e.g., "Food", "Sightseeing"
}

export interface DayPlan {
  dayNumber: number;
  theme: string; // e.g., "Historical Temples", "Modern Shopping"
  activities: Activity[];
}

export interface ItineraryResponse {
  tripTitle: string;
  currencyCode: string; // e.g., "JPY", "USD"
  dailyPlans: DayPlan[];
}

export enum LoadingState {
  IDLE = 'IDLE',
  LOADING = 'LOADING',
  SUCCESS = 'SUCCESS',
  ERROR = 'ERROR',
}