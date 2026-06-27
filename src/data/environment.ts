import { Environment, PropertyType } from '@/constants/types';
import { Colors } from '@/constants/colors';

// Deterministic, realistic livability data for the no-backend demo. Values are
// derived from property type + a per-project jitter so each project is stable
// and distinct, and they roughly mirror real Hyderabad micro-market patterns
// (IT/commercial hubs are busier & more polluted; outskirts/farmland are
// cleaner & quieter).
const BASE: Record<PropertyType, { aqi: number; noise: number; green: number }> = {
  commercial: { aqi: 122, noise: 72, green: 18 },
  apartment: { aqi: 96, noise: 62, green: 32 },
  standalone: { aqi: 88, noise: 56, green: 40 },
  villa: { aqi: 78, noise: 52, green: 55 },
  plot: { aqi: 64, noise: 46, green: 50 },
  farmland: { aqi: 48, noise: 38, green: 78 },
};

export function getEnvironment(type: PropertyType, index: number): Environment {
  const base = BASE[type] ?? BASE.apartment;
  // Stable pseudo-jitter from the index so values vary per project.
  const j = ((index * 37) % 21) - 10; // -10..+10
  const j2 = ((index * 53) % 13) - 6; // -6..+6

  const aqi = Math.max(28, Math.round(base.aqi + j));
  const noiseDb = Math.max(32, Math.round(base.noise + j2));
  const greenCoverPct = Math.min(92, Math.max(8, Math.round(base.green - j2)));

  // Composite livability: good air + quiet + green => high score.
  const aqiScore = Math.max(0, 100 - (aqi / 200) * 100); // 0 aqi=100, 200 aqi=0
  const noiseScore = Math.max(0, 100 - ((noiseDb - 30) / 50) * 100); // 30db=100, 80db=0
  const greenScore = greenCoverPct;
  const livabilityScore = Math.round(aqiScore * 0.4 + noiseScore * 0.35 + greenScore * 0.25);

  return { aqi, noiseDb, greenCoverPct, livabilityScore };
}

export function aqiCategory(aqi: number): { label: string; color: string } {
  if (aqi <= 50) return { label: 'Good', color: Colors.success };
  if (aqi <= 100) return { label: 'Moderate', color: '#F1C40F' };
  if (aqi <= 150) return { label: 'Poor', color: Colors.warning };
  return { label: 'Unhealthy', color: Colors.error };
}

export function noiseCategory(db: number): { label: string; color: string } {
  if (db < 45) return { label: 'Quiet', color: Colors.success };
  if (db < 55) return { label: 'Calm', color: '#7FB3D5' };
  if (db < 65) return { label: 'Moderate', color: '#F1C40F' };
  if (db < 75) return { label: 'Busy', color: Colors.warning };
  return { label: 'Loud', color: Colors.error };
}

export function livabilityCategory(score: number): { label: string; color: string } {
  if (score >= 80) return { label: 'Excellent', color: Colors.success };
  if (score >= 65) return { label: 'Very Good', color: '#27AE60' };
  if (score >= 50) return { label: 'Good', color: '#F1C40F' };
  if (score >= 35) return { label: 'Average', color: Colors.warning };
  return { label: 'Below Avg', color: Colors.error };
}
