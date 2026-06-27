export type PropertyType = 'villa' | 'apartment' | 'plot' | 'farmland' | 'commercial' | 'standalone';
export type PossessionStatus = 'ready' | 'under_construction' | 'new_launch';
export type NearbyPlaceType = 'school' | 'hospital' | 'it_park' | 'mall' | 'metro' | 'airport' | 'highway';

export interface Coordinates {
  lat: number;
  lng: number;
}

export interface Developer {
  id: string;
  name: string;
  logo?: string;
  yearsOfExperience: number;
  completedProjects: number;
  ongoingProjects: number;
  rating: number;
  phone: string;
  tagline: string;
}

export interface NearbyPlace {
  name: string;
  type: NearbyPlaceType;
  distanceKm: number;
  travelTimeMinutes?: number;
}

export interface Project {
  id: string;
  name: string;
  type: PropertyType;
  developer: Developer;
  location: {
    area: string;
    city: string;
    address: string;
    coordinates: Coordinates;
  };
  pricing: {
    minPrice: number;
    maxPrice: number;
    pricePerSqft?: number;
    currency: string;
  };
  specifications: {
    configurations: string[];
    minArea: number;
    maxArea: number;
    areaUnit: 'sqft' | 'sqyd' | 'acres' | 'guntas';
    totalUnits?: number;
    availableUnits?: number;
  };
  possession: {
    status: PossessionStatus;
    date?: string;
    constructionPct?: number;
  };
  amenities: string[];
  approvals: {
    rera?: string;
    dtcp?: string;
    hmda?: string;
  };
  images: string[];
  description: string;
  highlights: string[];
  nearbyPlaces: NearbyPlace[];
  investmentScore: number;
  rentalYield?: number;
  appreciationPct?: number;
  environment?: Environment;
}

// Livability intelligence — the differentiator vs. plain listing portals.
export interface Environment {
  aqi: number; // Air Quality Index (lower is better)
  noiseDb: number; // ambient noise level in decibels (lower is quieter)
  greenCoverPct: number; // % green cover around the project
  livabilityScore: number; // 0-100 composite (higher is better)
}

export interface SearchFilters {
  query: string;
  types: PropertyType[];
  areas: string[];
  minPrice: number;
  maxPrice: number;
  possessionStatus: PossessionStatus[];
  minBedrooms: number;
}

export type SortOption = 'relevance' | 'price_asc' | 'price_desc' | 'newest' | 'score';

export interface SavedLocation {
  id: string;
  label: string;
  coordinates: Coordinates;
  icon: string;
}

// A MODEX relationship manager / sales executive shown to buyers, MagicBricks-style.
export interface Executive {
  id: string;
  name: string;
  role: string;
  photo: string;
  rating: number;
  dealsClosed: number;
  experienceYears: number;
  languages: string[];
  specialization: PropertyType[];
  phone: string;
}

// Every buyer interaction funnels into one unified lead pipeline.
export type LeadType = 'enquiry' | 'site_visit' | 'callback' | 'interior';

export interface Lead {
  id: string;
  type: LeadType;
  name: string;
  phone: string;
  projectId?: string;
  projectName?: string;
  executiveId?: string;
  message?: string;
  // For site visits
  visitDate?: string;
  visitTime?: string;
  visitMode?: 'physical' | 'virtual';
  createdAt: number;
  status: 'new' | 'contacted' | 'scheduled';
}
