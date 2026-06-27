import { Coordinates } from '@/constants/types';

function haversineKm(a: Coordinates, b: Coordinates): number {
  const R = 6371;
  const dLat = ((b.lat - a.lat) * Math.PI) / 180;
  const dLng = ((b.lng - a.lng) * Math.PI) / 180;
  const h =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((a.lat * Math.PI) / 180) *
      Math.cos((b.lat * Math.PI) / 180) *
      Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.asin(Math.sqrt(h));
}

function fmtMin(minutes: number): string {
  if (minutes < 60) return `${Math.round(minutes)} min`;
  const h = Math.floor(minutes / 60);
  const m = Math.round(minutes % 60);
  return m > 0 ? `${h}h ${m}min` : `${h}h`;
}

export interface TravelTimes {
  car: string;
  auto: string;
  walk: string;
  distanceKm: string;
}

export function calcTravelTime(from: Coordinates, to: Coordinates): TravelTimes {
  const km = haversineKm(from, to);
  // Multiply by 1.3 for road factor
  const roadKm = km * 1.3;
  return {
    distanceKm: `${roadKm.toFixed(1)} km`,
    car: fmtMin((roadKm / 35) * 60),
    auto: fmtMin((roadKm / 20) * 60),
    walk: fmtMin((roadKm / 5) * 60),
  };
}
