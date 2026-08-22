import { TicketTier, CrossSellEvent } from '../types';

import heroImg from '../assets/images/korom_official_poster_1786140740649.jpg';
import galleryImg from '../assets/images/gallery_grill_thumb_1786139631760.jpg';
import cocktailImg from '../assets/images/cocktail_party_thumb_1786139641059.jpg';
import dancehallImg from '../assets/images/dancehall_concert_thumb_1786139651608.jpg';

export const EVENT_DETAILS = {
  id: 'korom-festival-2026',
  title: 'KOROM Festival',
  subtitle: 'Kenya\'s Premier Cultural & Lifestyle Celebration',
  category: 'ENTERTAINMENT & ARTS',
  dateFormatted: 'Sat, Oct 10, 2026',
  dateRange: 'Sat, Oct 10, 2026 - Sun, Oct 11, 2026',
  timeRange: '12:00 PM - 2:00 AM',
  daysRemaining: '64 days until event',
  locationTitle: 'TBA',
  locationDetails: 'Nairobi, Kenya (Venue announcement coming soon)',
  startingPriceFormatted: 'From KES 1500.00',
  startingPrice: 1500,
  aboutDescription: 'Korom Festival is Kenya\'s premier cultural and lifestyle celebration, blending heritage, music, art, fashion, and food into an unforgettable event.',
  organizer: 'KOROM Entertainment & Events',
  organizerVerified: true,
  organizerEventsCount: 14,
  heroImage: heroImg,
  ageRestriction: '18+ Only',
  expectedAttendance: '10,000+ Attendees',
  venueFeatures: ['Multi-stage Layout', 'Art Installations', 'Gourmet Food Village', 'VIP Skylounge', 'Secure Parking & Rideshare Drop-off'],
  lineup: [
    { artist: 'Burna Boy (Special Guest)', role: 'Headliner', genre: 'Afrobeats / Fusion' },
    { artist: 'Sauti Sol (Reunion Set)', role: 'Co-Headliner', genre: 'Afro-Pop' },
    { artist: 'Ayra Starr', role: 'Main Stage', genre: 'Afropop / R&B' },
    { artist: 'DJ Joe Mfalme', role: 'Electronic Stage', genre: 'Amapiano / House' },
    { artist: 'Nyashinski', role: 'Main Stage', genre: 'Hip-Hop / Urban' }
  ]
};

export const TICKET_TIERS: TicketTier[] = [
  {
    id: 'vibe-stars',
    name: 'VIBE STARS',
    price: 1500,
    currency: 'KES',
    formattedPrice: 'KES 1,500.00',
    description: 'General Admission access to the main festival grounds, food street, art showcase, and live performances.',
    highlights: [
      'Full Day & Night Festival Access',
      'Main Stage & Art Pavilion Entry',
      'Food & Beverage Village Access',
      'Official Festival Wristband'
    ],
    badge: 'REGULAR',
    available: 2500
  },
  {
    id: 'vip',
    name: 'VIP',
    price: 4000,
    currency: 'KES',
    formattedPrice: 'KES 4,000.00',
    description: 'Premium experience featuring expedited express entry, elevated stage views, private luxury lounge & bar access.',
    highlights: [
      'Fast-track Express VIP Gate Access',
      'Front-Row Stage Observation Deck',
      'Private VIP Bar & Air-Conditioned Restrooms',
      'Complimentary Welcome Cocktail & Swag Bag',
      'Dedicated VIP Parking Spot'
    ],
    badge: 'PREMIUM',
    popular: true,
    available: 450
  }
];

export const CROSS_SELL_EVENTS: CrossSellEvent[] = [
  {
    id: 'gallery-and-grill',
    title: 'Gallery And Grill An Art Showcase',
    date: 'Aug 15, 2026',
    venue: 'Oliveira Restaurant, Biashara Street',
    price: 'KES 1,000.00',
    rawPrice: 1000,
    category: 'Art & Dining',
    image: galleryImg
  },
  {
    id: 'cocktail-party-5',
    title: 'Cocktail party 5.0',
    date: 'Aug 22, 2026',
    venue: 'Aquarius garden ruiru',
    price: 'KES 2,000.00',
    rawPrice: 2000,
    category: 'Nightlife & Drinks',
    image: cocktailImg
  },
  {
    id: 'east-africa-dancehall-8',
    title: 'East africa Dancehall concert 8th edition',
    date: 'Aug 08, 2026',
    venue: 'Butterfly Pavilion mombasa',
    price: 'KES 2,500.00',
    rawPrice: 2500,
    category: 'Concert & Music',
    image: dancehallImg
  }
];
