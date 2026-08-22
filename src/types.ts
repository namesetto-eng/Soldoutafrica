export interface TicketTier {
  id: string;
  name: string;
  price: number;
  currency: string;
  formattedPrice: string;
  description: string;
  highlights: string[];
  badge?: string;
  popular?: boolean;
  available: number;
}

export interface TicketQuantity {
  [tierId: string]: number;
}

export interface CrossSellEvent {
  id: string;
  title: string;
  date: string;
  venue: string;
  price: string;
  rawPrice: number;
  category: string;
  image: string;
}

export interface CustomerDetails {
  fullName: string;
  email: string;
  phone: string;
  paymentMethod: 'mpesa' | 'card' | 'airtel';
  mpesaNumber?: string;
  promoCode?: string;
}

export interface IssuedTicket {
  orderId: string;
  eventTitle: string;
  eventDate: string;
  venue: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  items: { tierName: string; quantity: number; price: number }[];
  totalAmount: number;
  purchaseDate: string;
  qrCodeValue: string;
}
