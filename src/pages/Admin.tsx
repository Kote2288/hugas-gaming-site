import { useState } from 'react';
import { useStore, steamLogin, addProduct, updateProduct, deleteProduct, addNews, deleteNews, addStaff, removeStaff, adminTopUp, togglePromo, addPromo } from '@/store/useStore';
import type { Product } from '@/store/useStore';
import Icon from '@/components/ui/icon';

type AdminTab = 'dashboard' | 'products' | 'players' | 'staff' | 'promos' | 'news';

const MOCK_PLAYERS = [
  { id: '1', name: 'SurvivorX', steamId: '76561198123456789', balance: 750, banned: false, playtime: 1240 },
  { id: '2', name: 'Ghost_Rider', steamId: '76561198000111222', balance: 200, banned: false, playtime: 340 },
  { id: '3', name: 'Nomad_99', steamId: '76561198000333444', balance: 0, banned: true, playtime: 80 },
  { id: '4', name: 'IronWolf', steamId: '76561198000555666', balance: 1200, banned: false, playtime: 2100 },
];

export default function Admin() {
  const { user, products, news, staff, promos } = useStore();
  const [activeTab, setActiveTab] = useState<AdminTab>('dashboard');
  const [players, setPlayers] = useState(MOCK_PLAYERS);

  // Product form
  const [showProductForm, setShowProductForm] = useState(false);
  const [editProduct, setEditProduct] = useState<Partial<Product> | null>(null);

  // Staff form
  const [showStaffForm, setShowStaffForm] = useState(false);
  const [newStaffName, setNewStaffName] = useState('');
  const [newStaffSteam, setNewStaffSteam] = useState('');
  const [newStaffRole, setNewStaffRole] = useState<'moderator' | 'admin'>('moderator');

  // Promo form
  const [showPromoForm, setShowPromoForm] = useState(false);
  const [promoCodeNew, setPromoCodeNew] = useState('');
  const [promoDisc, setPromoDisc] = useState('');
  const [promoType, setPromoType] = useState<'percent' | 'fixed'>('percent');
  const [promoUses, setPromoUses] = useState('');

  // News form
  const [showNewsForm, setShowNewsForm] = useState(false);
  const [newsTitle, setNewsTitle] = useState('');
  const [newsContent, setNewsContent] = useState('');
  const [newsCategory, setNewsCategory] = useState<'update' | 'event' | 'news'>('news');

  // Player actions
  const [topUpPlayer, setTopUpPlayer] = useState<string | null>(null);
  const [topUpAmt, setTopUpAmt] = useState('');

  if (!user) {
    return (
      <div className="min-h-screen bg-dark-bg pt-20 flex items-center justify-center">
        <div className="text-center">
          <div className="text-8xl mb-6">🔒</div>
          <h2 className="font-oswald text-3xl text-white mb-3">ДОСТУП ЗАКРЫТ</h2>
          <p className="text-gray-500 text-sm mb-8">Войдите через Steam администратора</p>
          <button onClick={steamLogin} className="btn-neon-filled px-8 py-4 mx-auto flex items-center gap-3">
            <span className="text-xl">♨</span>ВОЙТИ ЧЕРЕЗ STEAM
          </button>
        </div>
      </div>
    );
  }

  if (user.role !== 'admin' && user.role !== 'owner' && user.role !== 'moderator') {
    return (
      <div className="min-h-screen bg-dark-bg pt-20 flex items-center justify-center">
        <div className="text-center">
          <div className="text-8xl mb-6">⛔</div>
          <h2 className="font-oswald text-3xl text-red-400 mb-3">ДОСТУП ЗАПРЕЩЁН</h2>
          <p className="text-gray-500 text-sm">У вас нет прав администратора</p>
        </div>
      </div>
    );
  }

  const tabs: { id: AdminTab; label: string; icon: string }[] = [
    { id: 'dashboard', label: 'Обзор', icon: 'LayoutDashboard' },
    { id: 'players', label: 'Игроки', icon: 'Users' },
    { id: 'products', label: 'Товары', icon: 'Package' },
    { id: 'news', label: 'Новости', icon: 'Newspaper' },
    { id: 'promos', label: 'Промокоды', icon: 'Tag' },
    { id: 'staff', label: 'Сотрудники', icon: 'Shield' },
  ];

  const handleBan = (playerId: string) => {
    setPlayers(prev => prev.map(p => p.id === playerId ? { ...p, banned: !p.banned } : p));
  };

  const handleTopUp = (playerId: string) => {
    if (!topUpAmt || Number(topUpAmt) <= 0) return;
    setPlayers(prev => prev.map(p => p.id === playerId ? { ...p, balance: p.balance + Number(topUpAmt) } : p));
    adminTopUp(playerId, Number(topUpAmt));
    setTopUpPlayer(null);
    setTopUpAmt('');
  };

  return (
    <div className="min-h-screen bg-dark-bg pt-20 pb-16">
      <div className="max-w-7xl mx-auto px-4">
        <div className="py-6 border-b border-red-500/20 mb-6">
          <div className="font-mono-tech text-xs text-red-400/60 tracking-widest mb-1">// RESTRICTED ACCESS</div>
          <div className="flex items-center justify-between">
            <h1 className="font-oswald text-3xl text-white flex items-center gap-3">
              <Icon name="Shield" size={28} className="text-red-400" />
              ПАНЕЛЬ АДМИНИСТРАТОРА
            </h1>
            <div className="flex items-center gap-2 border border-red-500/30 px-3 py-1.5">
              <div className="w-2 h-2 bg-red-400 rounded-full" />
              <span className="font-mono-tech text-xs text-red-400">{user.name} // {user.role.toUpperCase()}</span>
            </div>
          </div>
        </div>

        <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
          {tabs.map(tab => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)}
              className={`shrink-0 flex items-center gap-2 px-4 py-2 font-oswald text-sm tracking-wider border transition-all ${
                activeTab === tab.id ? 'border-red-500/50 text-red-400 bg-red-900/20' : 'border-neon/10 text-gray-500 hover:text-white hover:border-neon/20'
              }`}>
              <Icon name={tab.icon} size={14} />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Dashboard */}
        {activeTab === 'dashboard' && (
          <div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              {[
                { label: 'Игроков', value: players.length, icon: 'Users', color: 'text-blue-400' },
                { label: 'Товаров', value: products.length, icon: 'Package', color: 'text-neon' },
                { label: 'Сотрудников', value: staff.length, icon: 'Shield', color: 'text-red-400' },
                { label: 'Банов', value: players.filter(p => p.banned).length, icon: 'Ban', color: 'text-orange-400' },
              ].map(s => (
                <div key={s.label} className="card-dark p-5">
                  <Icon name={s.icon} size={20} className={`${s.color} mb-3`} />
                  <div className={`font-oswald text-3xl font-bold ${s.color}`}>{s.value}</div>
                  <div className="font-mono-tech text-xs text-gray-600 mt-1">{s.label}</div>
                </div>
              ))}
            </div>
            <div className="card-dark p-6">
              <div className="font-mono-tech text-xs text-neon/60 tracking-widest mb-4">// БЫСТРЫЕ ДЕЙСТВИЯ</div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {[
                  { label: 'Добавить товар', icon: 'Plus', action: () => { setEditProduct({}); setShowProductForm(true); setActiveTab('products'); } },
                  { label: 'Добавить новость', icon: 'Newspaper', action: () => { setShowNewsForm(true); setActiveTab('news'); } },
                  { label: 'Добавить промокод', icon: 'Tag', action: () => { setShowPromoForm(true); setActiveTab('promos'); } },
                  { label: 'Добавить сотрудника', icon: 'UserPlus', action: () => { setShowStaffForm(true); setActiveTab('staff'); } },
                ].map(btn => (
                  <button key={btn.label} onClick={btn.action} className="btn-neon p-4 text-sm flex flex-col items-center gap-2">
                    <Icon name={btn.icon} size={18} />
                    <span className="font-oswald text-xs text-center">{btn.label}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Players */}
        {activeTab === 'players' && (
          <div>
            <div className="space-y-2">
              {players.map(p => (
                <div key={p.id} className={`card-dark p-4 flex flex-col md:flex-row md:items-center justify-between gap-4 ${p.banned ? 'border-red-500/30' : ''}`}>
                  <div className="flex items-center gap-4">
                    <div className={`w-10 h-10 flex items-center justify-center border font-oswald font-bold ${p.banned ? 'border-red-500/40 text-red-400 bg-red-900/10' : 'border-neon/30 text-neon bg-neon/5'}`}>
                      {p.name.charAt(0)}
                    </div>
                    <div>
                      <div className="font-oswald text-white flex items-center gap-2">
                        {p.name}
                        {p.banned && <span className="font-mono-tech text-xs text-red-400 border border-red-500/30 px-1">БАН</span>}
                      </div>
                      <div className="font-mono-tech text-xs text-gray-600">ID: {p.steamId}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-center">
                      <div className="font-mono-tech text-xs text-gray-600">БАЛАНС</div>
                      <div className="font-oswald text-neon">{p.balance}₽</div>
                    </div>
                    <div className="text-center">
                      <div className="font-mono-tech text-xs text-gray-600">ЧАСОВ</div>
                      <div className="font-oswald text-white">{p.playtime}</div>
                    </div>
                    <div className="flex gap-2 ml-4">
                      {topUpPlayer === p.id ? (
                        <div className="flex gap-2">
                          <input value={topUpAmt} onChange={e => setTopUpAmt(e.target.value)} placeholder="Сумма"
                            className="w-24 bg-dark-bg border border-neon/30 px-2 py-1 font-mono-tech text-xs text-white outline-none" />
                          <button onClick={() => handleTopUp(p.id)} className="btn-neon-filled px-3 py-1 text-xs">OK</button>
                          <button onClick={() => setTopUpPlayer(null)} className="btn-neon px-2 py-1 text-xs">✕</button>
                        </div>
                      ) : (
                        <>
                          <button onClick={() => setTopUpPlayer(p.id)} className="btn-neon px-3 py-1.5 text-xs flex items-center gap-1">
                            <Icon name="Plus" size={12} />₽
                          </button>
                          <button onClick={() => handleBan(p.id)}
                            className={`px-3 py-1.5 text-xs font-oswald tracking-wider border flex items-center gap-1 transition-all ${
                              p.banned ? 'border-green-500/50 text-green-400 hover:bg-green-900/20' : 'border-red-500/50 text-red-400 hover:bg-red-900/20'
                            }`}>
                            <Icon name={p.banned ? 'CheckCircle' : 'Ban'} size={12} />
                            {p.banned ? 'РАЗБАН' : 'БАН'}
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Products */}
        {activeTab === 'products' && (
          <div>
            <div className="flex justify-end mb-4">
              <button onClick={() => { setEditProduct({}); setShowProductForm(true); }} className="btn-neon-filled px-4 py-2 flex items-center gap-2 text-sm">
                <Icon name="Plus" size={14} />ДОБАВИТЬ ТОВАР
              </button>
            </div>
            <div className="space-y-2">
              {products.map(p => (
                <div key={p.id} className="card-dark p-4 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <div className="text-2xl">{p.image}</div>
                    <div>
                      <div className="font-oswald text-white">{p.name}</div>
                      <div className="font-mono-tech text-xs text-gray-600">{p.category} • {p.price}₽</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={`font-mono-tech text-xs border px-2 py-1 ${p.inStock ? 'border-green-500/30 text-green-400' : 'border-red-500/30 text-red-400'}`}>
                      {p.inStock ? 'В НАЛИЧИИ' : 'НЕТ'}
                    </span>
                    <button onClick={() => updateProduct(p.id, { inStock: !p.inStock })} className="btn-neon px-3 py-1.5 text-xs">
                      {p.inStock ? 'СНЯТЬ' : 'ВЕРНУТЬ'}
                    </button>
                    <button onClick={() => deleteProduct(p.id)} className="border border-red-500/40 text-red-400 px-3 py-1.5 text-xs hover:bg-red-900/20 transition-all">
                      <Icon name="Trash2" size={13} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* News */}
        {activeTab === 'news' && (
          <div>
            <div className="flex justify-end mb-4">
              <button onClick={() => setShowNewsForm(true)} className="btn-neon-filled px-4 py-2 flex items-center gap-2 text-sm">
                <Icon name="Plus" size={14} />ДОБАВИТЬ НОВОСТЬ
              </button>
            </div>
            <div className="space-y-3">
              {news.map(n => (
                <div key={n.id} className="card-dark p-4 flex items-start justify-between gap-4">
                  <div>
                    <div className="font-oswald text-white mb-1">{n.title}</div>
                    <div className="font-mono-tech text-xs text-gray-600">{n.date} • {n.category}</div>
                  </div>
                  <button onClick={() => deleteNews(n.id)} className="border border-red-500/40 text-red-400 px-3 py-1.5 text-xs hover:bg-red-900/20 transition-all shrink-0">
                    <Icon name="Trash2" size={13} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Promos */}
        {activeTab === 'promos' && (
          <div>
            <div className="flex justify-end mb-4">
              <button onClick={() => setShowPromoForm(true)} className="btn-neon-filled px-4 py-2 flex items-center gap-2 text-sm">
                <Icon name="Plus" size={14} />СОЗДАТЬ ПРОМОКОД
              </button>
            </div>
            <div className="space-y-2">
              {promos.map(p => (
                <div key={p.id} className={`card-dark p-4 flex items-center justify-between ${!p.active ? 'opacity-60' : ''}`}>
                  <div>
                    <div className="font-mono-tech text-neon font-bold tracking-widest">{p.code}</div>
                    <div className="font-mono-tech text-xs text-gray-600">
                      {p.type === 'percent' ? `-${p.discount}%` : `-${p.discount}₽`} • Осталось: {p.usesLeft}
                    </div>
                  </div>
                  <button onClick={() => togglePromo(p.id)}
                    className={`px-4 py-1.5 font-oswald text-xs tracking-wider border transition-all ${
                      p.active ? 'border-red-500/40 text-red-400 hover:bg-red-900/20' : 'border-green-500/40 text-green-400 hover:bg-green-900/20'
                    }`}>
                    {p.active ? 'ОТКЛЮЧИТЬ' : 'ВКЛЮЧИТЬ'}
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Staff */}
        {activeTab === 'staff' && (
          <div>
            <div className="flex justify-end mb-4">
              <button onClick={() => setShowStaffForm(true)} className="btn-neon-filled px-4 py-2 flex items-center gap-2 text-sm">
                <Icon name="UserPlus" size={14} />ДОБАВИТЬ СОТРУДНИКА
              </button>
            </div>
            <div className="space-y-2">
              {staff.map(s => (
                <div key={s.id} className="card-dark p-4 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className={`w-10 h-10 border flex items-center justify-center font-oswald font-bold ${s.role === 'admin' ? 'border-red-500/40 text-red-400' : 'border-blue-500/40 text-blue-400'}`}>
                      {s.name.charAt(0)}
                    </div>
                    <div>
                      <div className="font-oswald text-white">{s.name}</div>
                      <div className="font-mono-tech text-xs text-gray-600">{s.steamId}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={`font-mono-tech text-xs border px-2 py-1 ${s.role === 'admin' ? 'border-red-500/30 text-red-400' : 'border-blue-500/30 text-blue-400'}`}>
                      {s.role.toUpperCase()}
                    </span>
                    <span className="font-mono-tech text-xs text-gray-600">с {new Date(s.addedDate).toLocaleDateString('ru-RU')}</span>
                    {user.role === 'owner' && (
                      <button onClick={() => removeStaff(s.id)} className="border border-red-500/40 text-red-400 px-2 py-1.5 text-xs hover:bg-red-900/20 transition-all">
                        <Icon name="UserMinus" size={13} />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Add Product Modal */}
      {showProductForm && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4" onClick={() => setShowProductForm(false)}>
          <div className="bg-dark-card border border-neon/30 w-full max-w-md p-6" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-oswald text-xl text-white">ДОБАВИТЬ ТОВАР</h2>
              <button onClick={() => setShowProductForm(false)} className="text-gray-500 hover:text-neon"><Icon name="X" size={20} /></button>
            </div>
            <div className="space-y-3">
              {[
                { placeholder: 'Название', key: 'name' },
                { placeholder: 'Описание', key: 'description' },
                { placeholder: 'Цена (₽)', key: 'price' },
                { placeholder: 'Иконка (эмодзи)', key: 'image' },
              ].map(f => (
                <input key={f.key} placeholder={f.placeholder}
                  value={(editProduct?.[f.key as keyof typeof editProduct] as string) || ''}
                  onChange={e => setEditProduct(prev => ({ ...prev, [f.key]: e.target.value }))}
                  className="w-full bg-dark-bg border border-neon/20 px-4 py-2.5 font-mono-tech text-sm text-white placeholder:text-gray-600 focus:border-neon outline-none"
                />
              ))}
              <select
                value={editProduct?.category || 'weapons'}
                onChange={e => setEditProduct(prev => ({ ...prev, category: e.target.value as Product['category'] }))}
                className="w-full bg-dark-bg border border-neon/20 px-4 py-2.5 font-mono-tech text-sm text-white focus:border-neon outline-none"
              >
                {['weapons', 'armor', 'food', 'medical', 'vehicles', 'base', 'vip'].map(c => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
              <button onClick={() => {
                if (editProduct?.name && editProduct.description && editProduct.price) {
                  addProduct({
                    name: editProduct.name as string,
                    description: editProduct.description as string,
                    price: Number(editProduct.price),
                    category: (editProduct.category as Product['category']) || 'weapons',
                    image: (editProduct.image as string) || '📦',
                    inStock: true,
                  });
                  setShowProductForm(false);
                  setEditProduct(null);
                }
              }} className="w-full btn-neon-filled py-3">
                ДОБАВИТЬ
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add News Modal */}
      {showNewsForm && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4" onClick={() => setShowNewsForm(false)}>
          <div className="bg-dark-card border border-neon/30 w-full max-w-md p-6" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-oswald text-xl text-white">ДОБАВИТЬ НОВОСТЬ</h2>
              <button onClick={() => setShowNewsForm(false)} className="text-gray-500 hover:text-neon"><Icon name="X" size={20} /></button>
            </div>
            <div className="space-y-3">
              <input value={newsTitle} onChange={e => setNewsTitle(e.target.value)} placeholder="Заголовок"
                className="w-full bg-dark-bg border border-neon/20 px-4 py-2.5 font-mono-tech text-sm text-white placeholder:text-gray-600 focus:border-neon outline-none" />
              <textarea value={newsContent} onChange={e => setNewsContent(e.target.value)} placeholder="Содержание" rows={4}
                className="w-full bg-dark-bg border border-neon/20 px-4 py-2.5 font-mono-tech text-sm text-white placeholder:text-gray-600 focus:border-neon outline-none resize-none" />
              <select value={newsCategory} onChange={e => setNewsCategory(e.target.value as 'update' | 'event' | 'news')}
                className="w-full bg-dark-bg border border-neon/20 px-4 py-2.5 font-mono-tech text-sm text-white focus:border-neon outline-none">
                <option value="news">Новость</option>
                <option value="update">Обновление</option>
                <option value="event">Ивент</option>
              </select>
              <button onClick={() => {
                if (newsTitle && newsContent) {
                  addNews({ title: newsTitle, content: newsContent, date: new Date().toISOString().split('T')[0], category: newsCategory });
                  setShowNewsForm(false); setNewsTitle(''); setNewsContent('');
                }
              }} className="w-full btn-neon-filled py-3">ОПУБЛИКОВАТЬ</button>
            </div>
          </div>
        </div>
      )}

      {/* Add Promo Modal */}
      {showPromoForm && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4" onClick={() => setShowPromoForm(false)}>
          <div className="bg-dark-card border border-neon/30 w-full max-w-md p-6" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-oswald text-xl text-white">СОЗДАТЬ ПРОМОКОД</h2>
              <button onClick={() => setShowPromoForm(false)} className="text-gray-500 hover:text-neon"><Icon name="X" size={20} /></button>
            </div>
            <div className="space-y-3">
              <input value={promoCodeNew} onChange={e => setPromoCodeNew(e.target.value.toUpperCase())} placeholder="КОД"
                className="w-full bg-dark-bg border border-neon/20 px-4 py-2.5 font-mono-tech text-sm text-white placeholder:text-gray-600 focus:border-neon outline-none tracking-widest" />
              <div className="flex gap-2">
                <select value={promoType} onChange={e => setPromoType(e.target.value as 'percent' | 'fixed')}
                  className="w-1/2 bg-dark-bg border border-neon/20 px-3 py-2.5 font-mono-tech text-sm text-white focus:border-neon outline-none">
                  <option value="percent">Процент %</option>
                  <option value="fixed">Фиксированно ₽</option>
                </select>
                <input value={promoDisc} onChange={e => setPromoDisc(e.target.value)} placeholder={promoType === 'percent' ? '% скидки' : 'Сумма ₽'}
                  className="w-1/2 bg-dark-bg border border-neon/20 px-4 py-2.5 font-mono-tech text-sm text-white placeholder:text-gray-600 focus:border-neon outline-none" />
              </div>
              <input value={promoUses} onChange={e => setPromoUses(e.target.value)} placeholder="Количество использований"
                className="w-full bg-dark-bg border border-neon/20 px-4 py-2.5 font-mono-tech text-sm text-white placeholder:text-gray-600 focus:border-neon outline-none" />
              <button onClick={() => {
                if (promoCodeNew && promoDisc && promoUses) {
                  addPromo({ code: promoCodeNew, discount: Number(promoDisc), type: promoType, usesLeft: Number(promoUses), active: true });
                  setShowPromoForm(false); setPromoCodeNew(''); setPromoDisc(''); setPromoUses('');
                }
              }} className="w-full btn-neon-filled py-3">СОЗДАТЬ</button>
            </div>
          </div>
        </div>
      )}

      {/* Add Staff Modal */}
      {showStaffForm && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4" onClick={() => setShowStaffForm(false)}>
          <div className="bg-dark-card border border-neon/30 w-full max-w-md p-6" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-oswald text-xl text-white">ДОБАВИТЬ СОТРУДНИКА</h2>
              <button onClick={() => setShowStaffForm(false)} className="text-gray-500 hover:text-neon"><Icon name="X" size={20} /></button>
            </div>
            <div className="space-y-3">
              <input value={newStaffName} onChange={e => setNewStaffName(e.target.value)} placeholder="Никнейм"
                className="w-full bg-dark-bg border border-neon/20 px-4 py-2.5 font-mono-tech text-sm text-white placeholder:text-gray-600 focus:border-neon outline-none" />
              <input value={newStaffSteam} onChange={e => setNewStaffSteam(e.target.value)} placeholder="Steam ID (76561198...)"
                className="w-full bg-dark-bg border border-neon/20 px-4 py-2.5 font-mono-tech text-sm text-white placeholder:text-gray-600 focus:border-neon outline-none" />
              <select value={newStaffRole} onChange={e => setNewStaffRole(e.target.value as 'moderator' | 'admin')}
                className="w-full bg-dark-bg border border-neon/20 px-4 py-2.5 font-mono-tech text-sm text-white focus:border-neon outline-none">
                <option value="moderator">Модератор</option>
                <option value="admin">Администратор</option>
              </select>
              <button onClick={() => {
                if (newStaffName && newStaffSteam) {
                  addStaff({ name: newStaffName, steamId: newStaffSteam, role: newStaffRole, addedDate: new Date().toISOString().split('T')[0] });
                  setShowStaffForm(false); setNewStaffName(''); setNewStaffSteam('');
                }
              }} className="w-full btn-neon-filled py-3">ДОБАВИТЬ</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
