import { Executive } from '@/constants/types';

const PORTRAIT = (id: string) =>
  `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=200&q=80`;

export const executives: Executive[] = [
  {
    id: 'exec-001',
    name: 'Rahul Verma',
    role: 'Senior Relationship Manager',
    photo: PORTRAIT('1507003211169-0a1dd7228f2d'),
    rating: 4.9,
    dealsClosed: 312,
    experienceYears: 8,
    languages: ['Telugu', 'Hindi', 'English'],
    specialization: ['villa', 'standalone'],
    phone: '+919876543210',
  },
  {
    id: 'exec-002',
    name: 'Sneha Reddy',
    role: 'Property Advisor',
    photo: PORTRAIT('1494790108377-be9c29b29330'),
    rating: 4.8,
    dealsClosed: 248,
    experienceYears: 6,
    languages: ['Telugu', 'English'],
    specialization: ['apartment', 'commercial'],
    phone: '+919876543211',
  },
  {
    id: 'exec-003',
    name: 'Arjun Kumar',
    role: 'Land & Plots Specialist',
    photo: PORTRAIT('1500648767791-00dcc994a43e'),
    rating: 4.7,
    dealsClosed: 189,
    experienceYears: 7,
    languages: ['Telugu', 'Hindi', 'English'],
    specialization: ['plot', 'farmland'],
    phone: '+919876543212',
  },
  {
    id: 'exec-004',
    name: 'Priya Nair',
    role: 'Luxury Homes Consultant',
    photo: PORTRAIT('1438761681033-6461ffad8d80'),
    rating: 5.0,
    dealsClosed: 156,
    experienceYears: 9,
    languages: ['English', 'Hindi', 'Malayalam'],
    specialization: ['villa', 'standalone', 'apartment'],
    phone: '+919876543213',
  },
];

// Pick the executive whose specialization best matches a property type,
// deterministically by project index so each project has a stable advisor.
export function getExecutiveForProject(type: Executive['specialization'][number], index: number): Executive {
  const matches = executives.filter((e) => e.specialization.includes(type));
  const pool = matches.length ? matches : executives;
  return pool[index % pool.length];
}
