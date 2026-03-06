import { useState, useEffect, useCallback } from 'react';

export interface User {
  id: string;
  steamId: string;
  name: string;
  avatar: string;
  balance: number;
  role: 'player' | 'moderator' | 'admin' | 'owner';
  banned: boolean;
  joinDate: string;
  playtime: number;
  purchases: Purchase[];
}

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category: 'weapons' | 'armor' | 'food' | 'medical' | 'vehicles' | 'base' | 'vip';
  image: string;
  inStock: boolean;
  popular?: boolean;
  discount?: number;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface Purchase {
  id: string;
  productName: string;
  price: number;
  date: string;
  status: 'delivered' | 'pending';
}

export interface NewsItem {
  id: string;
  title: string;
  content: string;
  date: string;
  category: 'update' | 'event' | 'news';
  image?: string;
}

export interface StaffMember {
  id: string;
  name: string;
  steamId: string;
  role: 'moderator' | 'admin';
  addedDate: string;
}

export interface Contest {
  id: string;
  title: string;
  description: string;
  prize: string;
  endDate: string;
  participants: number;
  active: boolean;
}

export interface PromoCode {
  id: string;
  code: string;
  discount: number;
  type: 'percent' | 'fixed';
  usesLeft: number;
  active: boolean;
}

const MOCK_PRODUCTS: Product[] = [
  { id: '1', name: 'AK-74', description: 'Легендарный автомат Калашникова. Надёжен в любых условиях.', price: 299, category: 'weapons', image: '🔫', inStock: true, popular: true },
  { id: '2', name: 'M4A1', description: 'Американская штурмовая винтовка. Точная и скорострельная.', price: 399, category: 'weapons', image: '🔫', inStock: true },
  { id: '3', name: 'Бронежилет Tier 3', description: 'Защита от пуль калибра 5.56. Выдержит несколько попаданий.', price: 249, category: 'armor', image: '🛡️', inStock: true, popular: true },
  { id: '4', name: 'VIP Статус (30 дней)', description: 'Особый статус на сервере: префикс, приоритетный слот, бонус +15% к опыту.', price: 199, category: 'vip', image: '⭐', inStock: true, discount: 20 },
  { id: '5', name: 'Стартовый набор', description: 'Еда, вода, аптечки и базовое оружие для быстрого старта.', price: 149, category: 'food', image: '🎒', inStock: true },
  { id: '6', name: 'Медицинский набор', description: 'Морфин, кровь, бинты. Полный комплект выживальщика.', price: 99, category: 'medical', image: '💊', inStock: true },
  { id: '7', name: 'Внедорожник', description: 'Полностью заправленный и исправный транспорт.', price: 599, category: 'vehicles', image: '🚗', inStock: false },
  { id: '8', name: 'Комплект для базы', description: 'Материалы для строительства базы: стены, ворота, замки.', price: 349, category: 'base', image: '🏗️', inStock: true },
];

const MOCK_NEWS: NewsItem[] = [
  { id: '1', title: 'Обновление 1.28 — Новое оружие и карта', content: 'Вышло крупное обновление DayZ 1.28! Добавлено 5 новых видов оружия, улучшена физика транспорта и переработаны военные локации на Chernarus.', date: '2026-03-05', category: 'update' },
  { id: '2', title: 'Турнир "Выживший" — регистрация открыта', content: 'Открываем регистрацию на ежемесячный турнир! Призовой фонд — 5000 рублей на баланс магазина. 32 участника, 3 раунда, один победитель.', date: '2026-03-03', category: 'event' },
  { id: '3', title: 'Технические работы 06.03', content: 'Сервер будет недоступен с 04:00 до 06:00 МСК. Проводим оптимизацию базы данных и установку нового оборудования.', date: '2026-03-01', category: 'news' },
  { id: '4', title: 'Wipe + Ивент "Первая кровь"', content: 'После вайпа запускаем трёхдневный ивент! Удвоенный лут в военных зонах, специальные тайники и уникальные предметы для первых 10 выживших.', date: '2026-02-28', category: 'event' },
];

const MOCK_CONTESTS: Contest[] = [
  { id: '1', title: 'Турнир "Выживший"', description: 'PvP турнир 32 участников. Выжить любой ценой.', prize: '5000₽ на баланс', endDate: '2026-03-15', participants: 24, active: true },
  { id: '2', title: 'Скриншот месяца', description: 'Лучший скриншот с сервера получает VIP на 3 месяца.', prize: 'VIP × 3 месяца', endDate: '2026-03-31', participants: 47, active: true },
  { id: '3', title: 'Конкурс баз', description: 'Самая красивая и укреплённая база по итогам голосования.', prize: '2000₽ + набор для базы', endDate: '2026-04-01', participants: 12, active: true },
];

const MOCK_STAFF: StaffMember[] = [
  { id: '1', name: 'Hugas', steamId: '76561198000000001', role: 'admin', addedDate: '2024-01-01' },
  { id: '2', name: 'DarkWolf', steamId: '76561198000000002', role: 'moderator', addedDate: '2024-06-15' },
  { id: '3', name: 'NightOwl', steamId: '76561198000000003', role: 'moderator', addedDate: '2025-01-20' },
];

const MOCK_PROMO: PromoCode[] = [
  { id: '1', code: 'DAYZ2026', discount: 15, type: 'percent', usesLeft: 100, active: true },
  { id: '2', code: 'WELCOME50', discount: 50, type: 'fixed', usesLeft: 50, active: true },
];

let globalUser: User | null = null;
let globalCart: CartItem[] = [];
let globalProducts: Product[] = [...MOCK_PRODUCTS];
let globalNews: NewsItem[] = [...MOCK_NEWS];
const globalContests: Contest[] = [...MOCK_CONTESTS];
let globalStaff: StaffMember[] = [...MOCK_STAFF];
let globalPromos: PromoCode[] = [...MOCK_PROMO];
const listeners: Set<() => void> = new Set();

function notify() {
  listeners.forEach(fn => fn());
}

export function getUser() { return globalUser; }
export function getCart() { return globalCart; }
export function getProducts() { return globalProducts; }
export function getNews() { return globalNews; }
export function getContests() { return globalContests; }
export function getStaff() { return globalStaff; }
export function getPromos() { return globalPromos; }

export function steamLogin() {
  globalUser = {
    id: '1',
    steamId: '76561198123456789',
    name: 'SurvivorX',
    avatar: 'https://avatars.steamstatic.com/b5bd56c1aa4644a474a2e4972be27ef9e82e517e_full.jpg',
    balance: 750,
    role: 'player',
    banned: false,
    joinDate: '2025-08-15',
    playtime: 1240,
    purchases: [
      { id: '1', productName: 'AK-74', price: 299, date: '2026-02-10', status: 'delivered' },
      { id: '2', productName: 'VIP Статус (30 дней)', price: 199, date: '2026-01-15', status: 'delivered' },
    ]
  };
  notify();
}

export function steamLoginAdmin() {
  globalUser = {
    id: '0',
    steamId: '76561198000000001',
    name: 'Hugas',
    avatar: '',
    balance: 99999,
    role: 'admin',
    banned: false,
    joinDate: '2024-01-01',
    playtime: 9999,
    purchases: []
  };
  notify();
}

export function logout() {
  globalUser = null;
  notify();
}

export function addToCart(product: Product) {
  const existing = globalCart.find(i => i.product.id === product.id);
  if (existing) {
    globalCart = globalCart.map(i => i.product.id === product.id ? { ...i, quantity: i.quantity + 1 } : i);
  } else {
    globalCart = [...globalCart, { product, quantity: 1 }];
  }
  notify();
}

export function removeFromCart(productId: string) {
  globalCart = globalCart.filter(i => i.product.id !== productId);
  notify();
}

export function updateCartQty(productId: string, qty: number) {
  if (qty <= 0) { removeFromCart(productId); return; }
  globalCart = globalCart.map(i => i.product.id === productId ? { ...i, quantity: qty } : i);
  notify();
}

export function clearCart() {
  globalCart = [];
  notify();
}

export function getCartTotal() {
  return globalCart.reduce((sum, i) => {
    const price = i.product.discount ? i.product.price * (1 - i.product.discount / 100) : i.product.price;
    return sum + price * i.quantity;
  }, 0);
}

export function buyCart() {
  if (!globalUser) return false;
  const total = getCartTotal();
  if (globalUser.balance < total) return false;
  const newPurchases: Purchase[] = globalCart.map(i => ({
    id: Date.now().toString() + i.product.id,
    productName: i.product.name,
    price: i.product.discount ? i.product.price * (1 - i.product.discount / 100) : i.product.price,
    date: new Date().toISOString().split('T')[0],
    status: 'pending' as const,
  }));
  globalUser = { ...globalUser, balance: globalUser.balance - total, purchases: [...(globalUser.purchases || []), ...newPurchases] };
  globalCart = [];
  notify();
  return true;
}

export function topUpBalance(amount: number) {
  if (!globalUser) return;
  globalUser = { ...globalUser, balance: globalUser.balance + amount };
  notify();
}

export function addProduct(product: Omit<Product, 'id'>) {
  const newProd: Product = { ...product, id: Date.now().toString() };
  globalProducts = [...globalProducts, newProd];
  notify();
}

export function updateProduct(id: string, updates: Partial<Product>) {
  globalProducts = globalProducts.map(p => p.id === id ? { ...p, ...updates } : p);
  notify();
}

export function deleteProduct(id: string) {
  globalProducts = globalProducts.filter(p => p.id !== id);
  notify();
}

export function addNews(item: Omit<NewsItem, 'id'>) {
  globalNews = [{ ...item, id: Date.now().toString() }, ...globalNews];
  notify();
}

export function deleteNews(id: string) {
  globalNews = globalNews.filter(n => n.id !== id);
  notify();
}

export function banPlayer(userId: string) {
  if (globalUser?.id === userId) { globalUser = { ...globalUser, banned: true }; }
  notify();
}

export function addStaff(member: Omit<StaffMember, 'id'>) {
  globalStaff = [...globalStaff, { ...member, id: Date.now().toString() }];
  notify();
}

export function removeStaff(id: string) {
  globalStaff = globalStaff.filter(s => s.id !== id);
  notify();
}

export function adminTopUp(userId: string, amount: number) {
  if (globalUser?.id === userId) { globalUser = { ...globalUser, balance: globalUser.balance + amount }; }
  notify();
}

export function addPromo(promo: Omit<PromoCode, 'id'>) {
  globalPromos = [...globalPromos, { ...promo, id: Date.now().toString() }];
  notify();
}

export function togglePromo(id: string) {
  globalPromos = globalPromos.map(p => p.id === id ? { ...p, active: !p.active } : p);
  notify();
}

export function applyPromo(code: string): PromoCode | null {
  const promo = globalPromos.find(p => p.code.toUpperCase() === code.toUpperCase() && p.active && p.usesLeft > 0);
  if (promo) {
    globalPromos = globalPromos.map(p => p.id === promo.id ? { ...p, usesLeft: p.usesLeft - 1 } : p);
    notify();
    return promo;
  }
  return null;
}

export function useStore() {
  const [, forceUpdate] = useState(0);

  const updater = useCallback(() => forceUpdate(n => n + 1), []);

  useEffect(() => {
    listeners.add(updater);
    return () => { listeners.delete(updater); };
  }, [updater]);

  return {
    user: globalUser,
    cart: globalCart,
    products: globalProducts,
    news: globalNews,
    contests: globalContests,
    staff: globalStaff,
    promos: globalPromos,
    steamLogin,
    steamLoginAdmin,
    logout,
    addToCart,
    removeFromCart,
    updateCartQty,
    clearCart,
    getCartTotal,
    buyCart,
    topUpBalance,
    addProduct,
    updateProduct,
    deleteProduct,
    addNews,
    deleteNews,
    banPlayer,
    addStaff,
    removeStaff,
    adminTopUp,
    addPromo,
    togglePromo,
    applyPromo,
  };
}
