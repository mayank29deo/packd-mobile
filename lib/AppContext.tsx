import React, { createContext, useContext, useState, useEffect } from 'react';
import { Session } from '@supabase/supabase-js';
import { supabase } from './supabase';

const API_BASE = 'https://packd.fit';

// ─── Mock fallback data (used until real API is wired) ────────────────────────
export const MOCK_USER = {
  id: 'u0',
  name: 'Mayank Narayan',
  firstName: 'Mayank',
  username: 'athlete1',
  initial: 'M',
  avatarColor: '#E8451A',
  level: 7,
  levelName: 'Trailblazer',
  xp: 3040,
  xpToNext: 500,
  streak: 14,
  sport: 'Running',
  sports: ['Running', 'Swimming', 'Cycling', 'Football'],
  area: 'Bangalore',
  bio: 'Morning runner. Yoga enthusiast. Coffee addict.',
  totalSessions: 63,
  totalKm: 284,
  eventsJoined: 47,
  packsCount: 3,
};

export const MOCK_ACTIVITIES = [
  { id: 'a1', icon: '🏃', title: '10K Morning Run',   date: 'Today',      distance: '10.2 km', pace: '5:13/km', xp: 280 },
  { id: 'a2', icon: '🚴', title: 'Nandi Hills Ride',  date: 'Yesterday',  distance: '45 km',   pace: '22 km/h', xp: 420 },
  { id: 'a3', icon: '🧘', title: 'Yoga — Lalbagh',    date: '2 days ago', distance: null,       pace: '45 min',  xp: 120 },
  { id: 'a4', icon: '🏃', title: 'Interval Training', date: '3 days ago', distance: '6.5 km',  pace: '4:48/km', xp: 190 },
];

const MOCK_EVENTS = [
  { id: 'e1', title: 'Sunday Long Run @ Cubbon', sport: 'Running', time: 'Sun 7 AM', venue: 'Cubbon Park', area: 'Central', level: 'All levels', cost: 'Free', rsvp: 22, max: 30, organizerId: 'p1', description: 'Join us for a relaxed long run through the park.' },
  { id: 'e2', title: 'Nandi Hills Cycling Ride', sport: 'Cycling', time: 'Sat 5 AM', venue: 'Nandi Hills', area: 'North', level: 'Intermediate', cost: '₹200', rsvp: 15, max: 20, organizerId: 'p2', description: 'Epic sunrise ride up to Nandi Hills.' },
  { id: 'e3', title: 'Yoga in the Park', sport: 'Yoga', time: 'Wed 6:30 AM', venue: 'Lalbagh', area: 'South', level: 'Beginner', cost: 'Free', rsvp: 18, max: 25, organizerId: 'p3', description: 'Morning yoga session in serene surroundings.' },
  { id: 'e4', title: 'Football 5s Tournament', sport: 'Football', time: 'Sat 4 PM', venue: 'KSCA Ground', area: 'Central', level: 'All levels', cost: '₹300', rsvp: 28, max: 30, organizerId: 'p4', description: '5-a-side football tournament with prizes.' },
];

const MOCK_PACKS = [
  { id: 'p1', name: 'Koramangala Runners', sport: 'Running', level: 'All levels', area: 'Koramangala', members: 312, events: 18, streak: 12, xp: 38000, icon: '🏃', verified: true, description: 'The most active running community in Koramangala.', tagline: 'Run together, grow together.' },
  { id: 'p2', name: 'Bangalore Cyclists', sport: 'Cycling', level: 'Intermediate', area: 'Bangalore', members: 245, events: 24, streak: 8, xp: 41000, icon: '🚴', verified: true, description: 'Weekend warriors and weekday commuters.', tagline: 'Every hill is a milestone.' },
  { id: 'p3', name: 'Zen Yoga Collective', sport: 'Yoga', level: 'Beginner', area: 'Lalbagh', members: 189, events: 10, streak: 21, xp: 22000, icon: '🧘', verified: false, description: 'Morning yoga for all levels.', tagline: 'Breathe. Move. Be.' },
  { id: 'p4', name: 'Weekend Footballers', sport: 'Football', level: 'Casual', area: 'Indiranagar', members: 156, events: 14, streak: 5, xp: 17000, icon: '⚽', verified: false, description: 'Casual football every weekend.', tagline: 'The beautiful game, every week.' },
];

export const MOCK_POSTS = [
  { id: 'post1', user: 'Mayank Narayan', initial: 'M', avatarColor: '#E8451A', sport: 'Running', time: '2d ago', xp: '+50 XP', content: 'First 5k done, thanks to the team and special mention to @Dhuman', images: ['https://images.unsplash.com/photo-1571008887538-b36bb32f4571?w=400&q=80', 'https://images.unsplash.com/photo-1552674605-db6ffd4facb5?w=400&q=80'], likes: 24, comments: 6, liked: false },
  { id: 'post2', user: 'Arjun M.', initial: 'A', avatarColor: '#E8451A', sport: 'Running', time: '23m ago', xp: '+420 XP', content: 'New PB! 10K in 45:22 🔥 The 5AM crew never disappoints.', images: [], likes: 47, comments: 12, liked: false },
  { id: 'post3', user: 'Priya S.', initial: 'P', avatarColor: '#7C3AED', sport: 'Yoga', time: '1h ago', xp: '+120 XP', content: 'Morning yoga session at Lalbagh was incredibly peaceful today 🧘', images: ['https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=400&q=80'], likes: 31, comments: 8, liked: false },
  { id: 'post4', user: 'Rahul K.', initial: 'R', avatarColor: '#2563EB', sport: 'Cycling', time: '2h ago', xp: '+380 XP', content: 'Nandi Hills at sunrise — nothing beats this. 45km done ✅', images: ['https://images.unsplash.com/photo-1541625602330-2277a4c46182?w=400&q=80'], likes: 64, comments: 19, liked: false },
];

export const MOCK_CONVERSATIONS: Record<string, any> = {
  'u1': { user: { id: 'u1', name: 'Arjun M.', initial: 'A', avatarColor: '#E8451A', sport: 'Running', online: true }, messages: [{ id: 'm1', text: 'Hey! See you at the 5AM run tomorrow?', fromMe: false, time: '9:42 AM' }, { id: 'm2', text: "Absolutely! Don't be late 😄", fromMe: true, time: '9:45 AM' }], unread: 1 },
  'u2': { user: { id: 'u2', name: 'Priya S.', initial: 'P', avatarColor: '#7C3AED', sport: 'Yoga', online: false }, messages: [{ id: 'm3', text: 'Great session today!', fromMe: false, time: 'Yesterday' }], unread: 1 },
};

export const SPORT_COLORS: Record<string, string> = {
  Running: '#F97316', Cycling: '#3B82F6', Yoga: '#8B5CF6', Swimming: '#06B6D4',
  Football: '#22C55E', Basketball: '#EA580C', Tennis: '#EAB308', Hiking: '#10B981',
  CrossFit: '#EF4444', Badminton: '#EC4899',
};

// ─── Build user object from Supabase session ──────────────────────────────────
function buildUserFromSession(session: Session): typeof MOCK_USER {
  const su = session.user;
  const meta = su.user_metadata || {};
  const name: string = meta.full_name || meta.name || su.email?.split('@')[0] || 'Athlete';
  const firstName = name.split(' ')[0];
  const initial = firstName[0]?.toUpperCase() ?? 'A';
  return {
    ...MOCK_USER,                      // keep XP/streak/level until real DB is wired
    id:         su.id,
    name,
    firstName,
    initial,
    username:   meta.preferred_username || meta.user_name || firstName.toLowerCase(),
    avatarColor: '#E8451A',
  };
}

// ─── Types ────────────────────────────────────────────────────────────────────
interface Post {
  id: string; user: string; initial: string; avatarColor: string; sport: string;
  time: string; xp: string; content: string; images: string[]; likes: number;
  comments: number; liked: boolean;
}

interface AppContextType {
  session: Session | null;
  authLoading: boolean;
  isGuest: boolean;
  enterGuestMode: () => void;
  user: typeof MOCK_USER;
  events: typeof MOCK_EVENTS;
  packs: typeof MOCK_PACKS;
  posts: Post[];
  conversations: Record<string, any>;
  unreadMessages: number;
  rsvps: Record<string, boolean>;
  joinedPacks: Record<string, boolean>;
  toggleRsvp: (id: string) => void;
  toggleJoinPack: (id: string) => void;
  toggleLike: (postId: string) => void;
  sendMessage: (userId: string, text: string) => void;
  markRead: (userId: string) => void;
  createPost: (content: string, images: string[], sport: string) => void;
  signOut: () => Promise<void>;
  apiBase: string;
}

const AppContext = createContext<AppContextType | null>(null);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession]           = useState<Session | null>(null);
  const [authLoading, setAuthLoading]   = useState(true);
  const [isGuest, setIsGuest]           = useState(false);
  const [rsvps, setRsvps]               = useState<Record<string, boolean>>({});
  const [joinedPacks, setJoinedPacks]   = useState<Record<string, boolean>>({ p1: true });
  const [posts, setPosts]               = useState<Post[]>(MOCK_POSTS);
  const [conversations, setConversations] = useState(MOCK_CONVERSATIONS);

  // ── Listen for auth changes ──────────────────────────────────────────────────
  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setAuthLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, sess) => {
      setSession(sess);
      setAuthLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  // ── Derive user from session or fall back to mock ────────────────────────────
  const user = session ? buildUserFromSession(session) : MOCK_USER;

  const unreadMessages = Object.values(conversations).reduce(
    (sum: number, c: any) => sum + (c.unread || 0), 0
  );

  const toggleRsvp     = (id: string) => setRsvps(p => ({ ...p, [id]: !p[id] }));
  const toggleJoinPack = (id: string) => setJoinedPacks(p => ({ ...p, [id]: !p[id] }));

  const toggleLike = (postId: string) =>
    setPosts(prev => prev.map(p =>
      p.id === postId ? { ...p, liked: !p.liked, likes: p.liked ? p.likes - 1 : p.likes + 1 } : p
    ));

  const sendMessage = (userId: string, text: string) =>
    setConversations(prev => ({
      ...prev,
      [userId]: { ...prev[userId], messages: [...prev[userId].messages, { id: `m${Date.now()}`, text, fromMe: true, time: 'Now' }], unread: 0 },
    }));

  const markRead = (userId: string) =>
    setConversations(prev => ({ ...prev, [userId]: { ...prev[userId], unread: 0 } }));

  const createPost = (content: string, images: string[], sport: string) =>
    setPosts(prev => [{
      id: `post${Date.now()}`,
      user: user.name, initial: user.initial, avatarColor: user.avatarColor,
      sport, time: 'Just now', xp: '+50 XP', content, images,
      likes: 0, comments: 0, liked: false,
    }, ...prev]);

  const signOut = async () => { await supabase.auth.signOut(); setIsGuest(false); };
  const enterGuestMode = () => setIsGuest(true);

  return (
    <AppContext.Provider value={{
      session, authLoading, isGuest, enterGuestMode, user,
      events: MOCK_EVENTS, packs: MOCK_PACKS, posts, conversations,
      unreadMessages, rsvps, joinedPacks,
      toggleRsvp, toggleJoinPack, toggleLike,
      sendMessage, markRead, createPost, signOut,
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
