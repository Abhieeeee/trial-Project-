import {
  CreditCard,
  Headphones,
  Mail,
  RefreshCcw,
  Ruler,
  ShieldCheck,
  Truck,
} from "lucide-react";

export type Product = {
  id: string;
  slug: string;
  name: string;
  price: string;
  numericPrice: number;
  category: string;
  image: string;
  material: string;
  colorways: number;
  sizes: string[];
  description: string;
  details: string[];
  stock: number;
  badge?: string;
};

export const products: Product[] = [
  {
    id: "AS-HDY-001",
    slug: "aura-3d-hoodie",
    name: "Aura 3D Hoodie",
    price: "EUR 245",
    numericPrice: 245,
    category: "Hoodies",
    image: "/hero-editorial.png",
    material: "450GSM Heavy Fleece",
    colorways: 3,
    sizes: ["S", "M", "L", "XL"],
    description:
      "A sculptural heavyweight hoodie with an oversized shoulder, dense cotton handfeel, and the signature sky-blue hardware note.",
    details: ["450GSM organic cotton", "Oversized pattern block", "Ribbed hem and cuffs", "Sky-blue internal label"],
    stock: 24,
    badge: "3D Config",
  },
  {
    id: "AS-JKT-002",
    slug: "aura-moto-jacket",
    name: "Aura Moto Jacket",
    price: "EUR 680",
    numericPrice: 680,
    category: "Jackets",
    image: "/moto-jacket.png",
    material: "Premium Calf Leather",
    colorways: 1,
    sizes: ["M", "L", "XL"],
    description:
      "A sharp leather moto silhouette built with premium calf leather, brushed chrome trims, and a cropped streetwear fit.",
    details: ["Premium calf leather", "Brushed chrome zipper", "Structured shoulder", "Satin interior lining"],
    stock: 8,
    badge: "Limited",
  },
  {
    id: "AS-PNT-003",
    slug: "gore-tex-tech-cargos",
    name: "Gore-Tex Tech Cargos",
    price: "EUR 320",
    numericPrice: 320,
    category: "Pants",
    image: "/tech-cargos.png",
    material: "Waterproof // Modular",
    colorways: 3,
    sizes: ["28", "30", "32", "34"],
    description:
      "Waterproof modular cargo pants with engineered pocketing, sealed seams, and adjustable hems for daily utility.",
    details: ["Waterproof technical shell", "Six-pocket utility layout", "Adjustable hem system", "Reinforced knee panels"],
    stock: 18,
  },
  {
    id: "AS-SNK-004",
    slug: "aura-street-runner",
    name: "Aura Street Runner",
    price: "EUR 410",
    numericPrice: 410,
    category: "Sneakers",
    image: "/street-sneaker.png",
    material: "Futuristic // Chrome Accent",
    colorways: 5,
    sizes: ["40", "41", "42", "43", "44"],
    description:
      "A futuristic street runner with full-grain panels, chrome accents, and a high-rebound sculpted outsole.",
    details: ["Full-grain leather panels", "Chrome heel detail", "High-rebound outsole", "Reflective lace system"],
    stock: 31,
  },
  {
    id: "AS-SHL-005",
    slug: "tech-shell-jacket",
    name: "Tech Shell Jacket",
    price: "EUR 520",
    numericPrice: 520,
    category: "Jackets",
    image: "/collections-banner.png",
    material: "Gore-Tex Pro",
    colorways: 2,
    sizes: ["S", "M", "L", "XL"],
    description:
      "A storm-ready shell with taped seams, reflective micro-marking, and a clean architectural profile.",
    details: ["20,000mm water resistance", "Taped seams", "Two-way zipper", "Packable hood"],
    stock: 12,
    badge: "New",
  },
  {
    id: "AS-ACC-006",
    slug: "aura-beanie",
    name: "Aura Beanie",
    price: "EUR 65",
    numericPrice: 65,
    category: "Accessories",
    image: "/editorial-spread.png",
    material: "Merino Wool",
    colorways: 6,
    sizes: ["OS"],
    description:
      "A compact merino beanie with tonal embroidery and a sky-blue interior seam marker.",
    details: ["Merino wool blend", "Tonal embroidery", "Compact crown", "One size"],
    stock: 44,
  },
];

export const categories = ["All", "Hoodies", "Jackets", "Pants", "Sneakers", "Accessories"];

export const supportLinks = [
  { title: "Sizing Guide", href: "/sizing", icon: Ruler },
  { title: "Shipping & Duty", href: "/shipping", icon: Truck },
  { title: "Returns Policy", href: "/returns", icon: RefreshCcw },
  { title: "FAQ", href: "/faq", icon: Headphones },
];

export const orderRows = [
  { id: "ORD-8924", customer: "Alex Chen", email: "alex@example.com", date: "Jun 20, 2026", total: "EUR 680.00", status: "Pending", items: 1 },
  { id: "ORD-8923", customer: "Sarah Miller", email: "sarah@example.com", date: "Jun 20, 2026", total: "EUR 245.00", status: "Shipped", items: 1 },
  { id: "ORD-8922", customer: "David Kim", email: "david@example.com", date: "Jun 19, 2026", total: "EUR 520.00", status: "Delivered", items: 1 },
  { id: "ORD-8921", customer: "Emma Wilson", email: "emma@example.com", date: "Jun 18, 2026", total: "EUR 1,200.00", status: "Cancelled", items: 3 },
  { id: "ORD-8920", customer: "James Lee", email: "james@example.com", date: "Jun 18, 2026", total: "EUR 265.00", status: "Delivered", items: 1 },
  { id: "ORD-8919", customer: "Maria Garcia", email: "maria@example.com", date: "Jun 17, 2026", total: "EUR 410.00", status: "Shipped", items: 1 },
];

export const checkoutFeatures = [
  { icon: ShieldCheck, title: "Secure checkout", text: "Encrypted card flow, Apple Pay ready, Google Pay ready, and fraud-aware order review." },
  { icon: Truck, title: "Global shipping", text: "Tracked delivery with duty notes, status updates, and delivery confirmation emails." },
  { icon: CreditCard, title: "Flexible payment", text: "Card, wallet, bank transfer, and cash-on-delivery UI states are represented." },
  { icon: Mail, title: "Email automation", text: "Welcome, order confirmation, shipping, delivery, reset, newsletter, and cart recovery touchpoints." },
];
