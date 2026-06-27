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
