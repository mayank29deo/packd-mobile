import React, { createContext, useContext, useState } from 'react';

const API_BASE = 'https://packd.fit';

export const SPORT_COLORS: Record<string, string> = {
  Running:    'text-orange-400 bg-orange-400/10',
  Cycling:    'text-blue-400 bg-blue-400/10',
  Yoga:       'text-purple-400 bg-purple-400/10',
  Swimming:   'text-cyan-400 bg-cyan-400/10',
  Football:   'text-green-400 bg-green-400/10',
  Basketball: 'text-orange-500 bg-orange-500/10',
  Tennis:     'text-yellow-400 bg-yellow-400/10',
  Hiking:     'text-emerald-400 bg-emerald-400/10',
  CrossFit:   'text-red-400 bg-red-400/10',
  Badminton:  'text-pink-400 bg-pink-400/10',
};

// Mirrors the web app's mock data — replace with real API calls when backend is ready
const MOCK_EVENTS = [
  { id: 'e1', title: 'Sunday Long Run @ Cubbon', sport: 'Running', time: 'Sun 7 AM', venue: 'Cubbon Park', area: 'Central', level: 'All levels', cost: 'Free', rsvp: 22, max: 30, organizerId: 'p1', description: 'Join us for a relaxed long run through the park.' },
  { id: 'e2', title: 'Nandi Hills Cycling Ride', sport: 'Cycling', time: 'Sat 5 AM', venue: 'Nandi Hills', area: 'North', level: 'Intermediate', cost: '₹200', rsvp: 15, max: 20, organizerId: 'p2', description: 'Epic sunrise ride up to Nandi Hills.' },
  { id: 'e3', title: 'Yoga in the Park', sport: 'Yoga', time: 'Wed 6:30 AM', venue: 'Lalbagh', area: 'South', level: 'Beginner', cost: 'Free', rsvp: 18, max: 25, organizerId: 'p3', description: 'Morning yoga session in serene surroundings.' },
  { id: 'e4', title: 'Football 5s Tournament', sport: 'Football', time: 'Sat 4 PM', venue: 'KSCA Ground', area: 'Central', level: 'All levels', cost: '₹300', rsvp: 28, max: 30, organizerId: 'p4', description: '5-a-side football tournament with prizes.' },
];

const MOCK_PACKS = [
  { id: 'p1', name: 'Koramangala Runners', sport: 'Running', members: 312, icon: '🏃', verified: true, description: 'The most active running community in Koramangala.' },
  { id: 'p2', name: 'Bangalore Cyclists', sport: 'Cycling', members: 245, icon: '🚴', verified: true, description: 'Weekend warriors and weekday commuters.' },
  { id: 'p3', name: 'Zen Yoga Collective', sport: 'Yoga', members: 189, icon: '🧘', verified: false, description: 'Morning yoga for all levels.' },
  { id: 'p4', name: 'Weekend Footballers', sport: 'Football', members: 156, icon: '⚽', verified: false, description: 'Casual football every weekend.' },
];

interface AppContextType {
  events: typeof MOCK_EVENTS;
  packs: typeof MOCK_PACKS;
  rsvps: Record<string, boolean>;
  joinedPacks: Record<string, boolean>;
  toggleRsvp: (id: string) => void;
  toggleJoinPack: (id: string) => void;
  apiBase: string;
}

const AppContext = createContext<AppContextType | null>(null);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [rsvps, setRsvps] = useState<Record<string, boolean>>({});
  const [joinedPacks, setJoinedPacks] = useState<Record<string, boolean>>({});

  const toggleRsvp = (id: string) =>
    setRsvps((prev) => ({ ...prev, [id]: !prev[id] }));

  const toggleJoinPack = (id: string) =>
    setJoinedPacks((prev) => ({ ...prev, [id]: !prev[id] }));

  return (
    <AppContext.Provider value={{
      events: MOCK_EVENTS,
      packs: MOCK_PACKS,
      rsvps,
      joinedPacks,
      toggleRsvp,
      toggleJoinPack,
      apiBase: API_BASE,
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}
