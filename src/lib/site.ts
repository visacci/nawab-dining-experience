import { BISTRO_IMG, GARDENS_IMG } from "@/lib/images";

export const BISTRO = {
  name: "Nawab Asian Bistro",
  short: "Asian Bistro",
  address: "2nd Floor, Acacia Mall, Kololo, Kampala",
  phone: "+256 706 171712",
  phone2: "+256772727777",
  tel: "+256706171712",
  cuisine: "Pan-Asian",
  mapsQuery: "Nawab Asian Bistro, Acacia Mall, Kololo, Kampala, Uganda",
};

export const GARDENS = {
  name: "Nawab Gardens",
  short: "Gardens",
  address: "27 Bandali Rise, Bugolobi, Kampala",
  phone: null as string | null, // To be provided by the business
  cuisine: "Indian",
  mapsQuery: "27 Bandali Rise, Bugolobi, Kampala, Uganda",
};

export const directionsUrl = (q: string) =>
  `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(q)}`;
export const embedUrl = (q: string) =>
  `https://maps.google.com/maps?q=${encodeURIComponent(q)}&z=15&output=embed`;

export type NavItem = { label: string; to?: string; hash?: string; image?: string; children?: NavItem[] };

export const NAV: NavItem[] = [
  {
    label: "Nawab Asian Bistro",
    to: "/asian-bistro",
    children: [
      { label: "Restaurant", to: "/asian-bistro", hash: "restaurant", image: BISTRO_IMG.counter },
      { label: "Bar", to: "/asian-bistro", hash: "bar", image: BISTRO_IMG.terraceBar },
      { label: "Rooftop Terrace", to: "/asian-bistro", hash: "rooftop", image: BISTRO_IMG.terraceView },
      { label: "Conference / Party Room", to: "/asian-bistro", hash: "conference", image: BISTRO_IMG.banquet },
    ],
  },
  {
    label: "Nawab Gardens",
    to: "/nawab-gardens",
    children: [
      { label: "Restaurant", to: "/nawab-gardens", hash: "restaurant", image: GARDENS_IMG.diningRoom },
      { label: "Bar", to: "/nawab-gardens", hash: "bar", image: GARDENS_IMG.deck },
      { label: "Rooftop Terrace", to: "/nawab-gardens", hash: "rooftop", image: GARDENS_IMG.evening },
      { label: "Conference / Party Room", to: "/nawab-gardens", hash: "conference", image: GARDENS_IMG.lawnSet },
      { label: "Gardens", to: "/nawab-gardens", hash: "gardens", image: GARDENS_IMG.lawn },
    ],
  },
  {
    label: "Services & Experiences",
    to: "/services",
    children: [
      { label: "Weddings", to: "/services", hash: "weddings" },
      { label: "Parties & Celebrations", to: "/services", hash: "parties" },
      { label: "Corporate Meetings", to: "/services", hash: "corporate" },
      { label: "Private Events", to: "/services", hash: "private" },
      { label: "Dining Experiences", to: "/services", hash: "dining" },
    ],
  },
  {
    label: "Resources",
    children: [
      { label: "Blog", to: "/blog" },
      { label: "FAQs", to: "/faqs" },
      { label: "About Us", to: "/about" },
    ],
  },
  { label: "Contact Us", to: "/contact" },
];
