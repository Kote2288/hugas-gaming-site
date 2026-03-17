import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import Icon from '@/components/ui/icon';
import { useStore } from '@/store/useStore';

const navLinks = [
  { to: '/', label: 'Главная' },
  { to: '/news', label: 'Новости' },
  { to: '/shop', label: 'Магазин' },
  { to: '/map', label: 'Карта' },
  { to: '/guide', label: 'Гайды' },
  { to: '/contests', label: 'Конкурсы' },
  { to: '/rules', label: 'Правила' },
];

export default function Navbar() {
  const { user, cart, steamLogin, logout } = useStore();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const [showAuthMenu, setShowAuthMenu] = useState(false);
  const cartCount = cart.reduce((s, i) => s + i.quantity, 0);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-neon/20 bg-dark-bg/95 backdrop-blur-sm">
      <div className="scanline absolute inset-0 pointer-events-none opacity-30" />
      <div className="max-w-7xl mx-auto px-4 flex items-center justify-between h-16">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 border-2 border-neon flex items-center justify-center neon-glow group-hover:scale-105 transition-transform">
            <span className="font-oswald font-black text-neon text-lg">HG</span>
          </div>
          <div>
            <div className="font-oswald font-bold text-white text-lg leading-none tracking-wider animate-flicker">
              HUGAS <span className="neon-text">GAMING</span>
            </div>
            <div className="font-mono-tech text-neon/60 text-xs tracking-widest">DAYZ 1.28 // LIVONIA</div>
          </div>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden lg:flex items-center gap-1">
          {navLinks.map(link => (
            <Link
              key={link.to}
              to={link.to}
              className={`px-3 py-1.5 font-oswald text-sm tracking-widest uppercase transition-all hover-neon ${
                location.pathname === link.to
                  ? 'neon-text border-b-2 border-neon'
                  : 'text-gray-400'
              }`}
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* Right Side */}
        <div className="flex items-center gap-3">
          {/* Cart */}
          <Link to="/shop" className="relative btn-neon px-3 py-2 text-sm hidden sm:flex items-center gap-2">
            <Icon name="ShoppingCart" size={16} />
            {cartCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-neon text-dark-bg text-xs font-bold rounded-full flex items-center justify-center">
                {cartCount}
              </span>
            )}
          </Link>

          {/* Auth */}
          {user ? (
            <div className="relative">
              <button
                onClick={() => setShowAuthMenu(!showAuthMenu)}
                className="flex items-center gap-2 border border-neon/30 px-3 py-1.5 hover:border-neon transition-colors"
              >
                <div className="w-7 h-7 bg-neon/20 border border-neon/40 flex items-center justify-center text-xs font-bold text-neon">
                  {user.name.charAt(0).toUpperCase()}
                </div>
                <span className="font-oswald text-sm text-white hidden sm:block">{user.name}</span>
                <span className="font-mono-tech text-neon text-xs">{user.balance}₽</span>
                <Icon name="ChevronDown" size={14} className="text-neon/60" />
              </button>

              {showAuthMenu && (
                <div className="absolute right-0 top-full mt-1 w-52 bg-dark-card border border-neon/30 shadow-2xl animate-fade-in z-50">
                  <Link to="/profile" className="flex items-center gap-2 px-4 py-3 text-sm hover:bg-neon/10 transition-colors" onClick={() => setShowAuthMenu(false)}>
                    <Icon name="User" size={15} className="text-neon" />
                    <span className="text-gray-300">Профиль</span>
                  </Link>
                  <Link to="/shop" className="flex items-center gap-2 px-4 py-3 text-sm hover:bg-neon/10 transition-colors" onClick={() => setShowAuthMenu(false)}>
                    <Icon name="ShoppingBag" size={15} className="text-neon" />
                    <span className="text-gray-300">История покупок</span>
                  </Link>
                  {(user.role === 'admin' || user.role === 'owner' || user.role === 'moderator') && (
                    <Link to="/admin" className="flex items-center gap-2 px-4 py-3 text-sm hover:bg-neon/10 transition-colors border-t border-neon/20" onClick={() => setShowAuthMenu(false)}>
                      <Icon name="Shield" size={15} className="text-red-400" />
                      <span className="text-red-400 font-semibold">Админ-панель</span>
                    </Link>
                  )}
                  <button
                    className="w-full flex items-center gap-2 px-4 py-3 text-sm hover:bg-red-900/20 transition-colors border-t border-neon/10 text-red-400"
                    onClick={() => { logout(); setShowAuthMenu(false); }}
                  >
                    <Icon name="LogOut" size={15} />
                    Выйти
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="flex gap-2">
              <button onClick={steamLogin} className="btn-neon-filled px-4 py-2 text-sm flex items-center gap-2">
                <span className="text-lg">♨</span>
                <span className="hidden sm:block">Войти через Steam</span>
                <span className="sm:hidden">Войти</span>
              </button>
            </div>
          )}

          {/* Admin Panel Button */}
          {user && (user.role === 'admin' || user.role === 'owner' || user.role === 'moderator') && (
            <Link to="/admin" className="hidden md:flex items-center gap-2 px-3 py-2 border border-red-500/50 text-red-400 text-xs font-oswald tracking-wider hover:border-red-400 hover:bg-red-900/20 transition-all">
              <Icon name="Shield" size={14} />
              АДМИН
            </Link>
          )}

          {/* Mobile Menu */}
          <button className="lg:hidden text-neon" onClick={() => setMenuOpen(!menuOpen)}>
            <Icon name={menuOpen ? "X" : "Menu"} size={24} />
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="lg:hidden bg-dark-card border-t border-neon/20 animate-fade-in">
          {navLinks.map(link => (
            <Link
              key={link.to}
              to={link.to}
              className="block px-6 py-3 font-oswald tracking-wider text-sm uppercase border-b border-neon/10 hover:bg-neon/10 hover:text-neon transition-colors"
              onClick={() => setMenuOpen(false)}
            >
              {link.label}
            </Link>
          ))}
          {!user && (
            <button onClick={() => { steamLogin(); setMenuOpen(false); }} className="w-full text-left px-6 py-3 font-oswald tracking-wider text-sm uppercase text-neon border-b border-neon/10">
              ♨ Войти через Steam
            </button>
          )}
        </div>
      )}
    </nav>
  );
}