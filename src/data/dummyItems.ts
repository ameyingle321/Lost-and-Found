import type { Item } from '../types/database';

export const dummyItems: Item[] = [
  // ── Lost Items ──────────────────────────────────────────────
  {
    id: 'demo-1',
    created_at: '2026-05-15T09:30:00Z',
    title: 'AirPods Pro (Silver)',
    description:
      'Lost my AirPods Pro in the white case near the amphitheatre during the morning assembly. Has a small scratch on the lid.',
    category: 'Electronics',
    type: 'lost',
    status: 'active',
    location: 'Main Amphitheatre, Block A',
    date_logged: '2026-05-15T09:30:00Z',
    image_url: '/demo/airpods.png',
  },
  {
    id: 'demo-2',
    created_at: '2026-05-14T14:15:00Z',
    title: 'Car & Dorm Keys',
    description:
      'A set of car keys with a red keychain and two dorm room keys. Possibly dropped near the east parking lot after my 2 PM class.',
    category: 'Keys',
    type: 'lost',
    status: 'active',
    location: 'East Parking Lot, Gate 3',
    date_logged: '2026-05-14T14:15:00Z',
    image_url: '/demo/keys.png',
  },
  {
    id: 'demo-3',
    created_at: '2026-05-13T11:00:00Z',
    title: 'USB-C Laptop Charger',
    description:
      'Left my 65W USB-C laptop charger plugged into the outlet at the third-floor library study pod. Black cable, Dell branding.',
    category: 'Electronics',
    type: 'lost',
    status: 'active',
    location: 'Central Library, 3rd Floor',
    date_logged: '2026-05-13T11:00:00Z',
    image_url: '/demo/charger.png',
  },
  {
    id: 'demo-4',
    created_at: '2026-05-12T16:45:00Z',
    title: 'Student ID Card',
    description:
      'Lost my university ID card somewhere between the admin block and the canteen. Need it urgently for hostel entry.',
    category: 'IDs/Wallets',
    type: 'lost',
    status: 'active',
    location: 'Admin Block → Canteen Corridor',
    date_logged: '2026-05-12T16:45:00Z',
    image_url: '/demo/student_id.png',
  },

  // ── Found Items ─────────────────────────────────────────────
  {
    id: 'demo-5',
    created_at: '2026-05-16T08:00:00Z',
    title: 'Brown Leather Wallet',
    description:
      'Found a brown bi-fold leather wallet with a few cards inside on a cafeteria table. Handed to the counter but logging here too.',
    category: 'IDs/Wallets',
    type: 'found',
    status: 'active',
    location: 'Food Court, Table 12',
    date_logged: '2026-05-16T08:00:00Z',
    image_url: '/demo/wallet.png',
  },
  {
    id: 'demo-6',
    created_at: '2026-05-15T17:30:00Z',
    title: 'Navy Blue Hoodie',
    description:
      'Found a navy-blue hoodie with a college crest draped over a chair in Lecture Hall 204 after the evening lecture.',
    category: 'Clothing',
    type: 'found',
    status: 'active',
    location: 'Lecture Hall 204, Block C',
    date_logged: '2026-05-15T17:30:00Z',
    image_url: '/demo/hoodie.png',
  },
  {
    id: 'demo-7',
    created_at: '2026-05-14T10:20:00Z',
    title: 'Dorm Key with Blue Tag',
    description:
      'Single brass key with a blue silicone tag found on the basketball court bleachers. No name on it.',
    category: 'Keys',
    type: 'found',
    status: 'active',
    location: 'Basketball Court, Sports Complex',
    date_logged: '2026-05-14T10:20:00Z',
    image_url: '/demo/keys.png',
  },
  {
    id: 'demo-8',
    created_at: '2026-05-13T13:10:00Z',
    title: 'White Earbuds (Wired)',
    description:
      'Found wired white earbuds tangled up under a desk in the computer lab. Samsung branding on the jack.',
    category: 'Electronics',
    type: 'found',
    status: 'active',
    location: 'Computer Lab 3, Block B',
    date_logged: '2026-05-13T13:10:00Z',
    image_url: '/demo/airpods.png',
  },
];
