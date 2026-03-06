import { useState } from 'react';
import { useStore, addToCart, removeFromCart, updateCartQty, buyCart, topUpBalance, applyPromo, getCartTotal } from '@/store/useStore';
import type { Product } from '@/store/useStore';
import Icon from '@/components/ui/icon';

const CATEGORIES = [
  { id: 'all', label: 'Все товары', icon: '📦' },
  { id: 'weapons', label: 'Оружие', icon: '🔫' },
  { id: 'armor', label: 'Броня', icon: '🛡️' },
  { id: 'food', label: 'Снаряжение', icon: '🎒' },
  { id: 'medical', label: 'Медикаменты', icon: '💊' },
  { id: 'vehicles', label: 'Транспорт', icon: '🚗' },
  { id: 'base', label: 'База', icon: '🏗️' },
  { id: 'vip', label: 'VIP', icon: '⭐' },
];

function ProductCard({ product, onAdd }: { product: Product; onAdd: () => void }) {
  const discountedPrice = product.discount
    ? Math.round(product.price * (1 - product.discount / 100))
    : product.price;

  return (
    <div className="card-dark flex flex-col hover:border-neon/40 transition-all duration-300 group relative overflow-hidden">
      {product.popular && (
        <div className="absolute top-0 right-0 font-mono-tech text-xs bg-neon text-dark-bg px-2 py-1">
          ХИТ
        </div>
      )}
      {product.discount && (
        <div className="absolute top-0 left-0 font-mono-tech text-xs bg-red-600 text-white px-2 py-1">
          -{product.discount}%
        </div>
      )}
      <div className="p-6 flex flex-col flex-1">
        <div className="text-5xl mb-4 text-center">{product.image}</div>
        <h3 className="font-oswald text-lg text-white mb-1">{product.name}</h3>
        <p className="text-gray-500 text-xs leading-relaxed mb-4 flex-1">{product.description}</p>
        <div className="flex items-center justify-between">
          <div>
            {product.discount && (
              <div className="font-mono-tech text-xs text-gray-600 line-through">{product.price}₽</div>
            )}
            <div className="font-oswald text-2xl text-neon font-bold">{discountedPrice}₽</div>
          </div>
          <button
            onClick={onAdd}
            disabled={!product.inStock}
            className={`px-4 py-2 font-oswald text-sm tracking-wider flex items-center gap-1 transition-all ${
              product.inStock ? 'btn-neon-filled' : 'border border-gray-700 text-gray-600 cursor-not-allowed'
            }`}
          >
            <Icon name={product.inStock ? 'Plus' : 'X'} size={14} />
            {product.inStock ? 'КУПИТЬ' : 'НЕТ'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function Shop() {
  const { user, cart, products, purchases } = useStore() as ReturnType<typeof useStore> & { purchases?: unknown[] };
  const [category, setCategory] = useState('all');
  const [showCart, setShowCart] = useState(false);
  const [showTopUp, setShowTopUp] = useState(false);
  const [topUpAmount, setTopUpAmount] = useState('');
  const [promoCode, setPromoCode] = useState('');
  const [promoDiscount, setPromoDiscount] = useState<number | null>(null);
  const [promoMsg, setPromoMsg] = useState('');
  const [showGuide, setShowGuide] = useState(false);
  const [tab, setTab] = useState<'shop' | 'history'>('shop');

  const filtered = category === 'all' ? products : products.filter(p => p.category === category);
  const cartCount = cart.reduce((s, i) => s + i.quantity, 0);
  const rawTotal = getCartTotal();
  const discountedTotal = promoDiscount ? Math.round(rawTotal * (1 - promoDiscount / 100)) : rawTotal;

  const handleApplyPromo = () => {
    const result = applyPromo(promoCode);
    if (result) {
      if (result.type === 'percent') {
        setPromoDiscount(result.discount);
        setPromoMsg(`✓ Скидка ${result.discount}% применена`);
      } else {
        setPromoMsg(`✓ Скидка ${result.discount}₽ применена`);
      }
    } else {
      setPromoMsg('✗ Промокод не найден или истёк');
    }
  };

  const handleBuy = () => {
    const ok = buyCart();
    if (ok) {
      setShowCart(false);
      setPromoCode('');
      setPromoDiscount(null);
      setPromoMsg('');
    } else {
      alert('Недостаточно средств на балансе');
    }
  };

  return (
    <div className="min-h-screen bg-dark-bg pt-20 pb-16">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="py-8 border-b border-neon/20 mb-8">
          <div className="font-mono-tech text-xs text-neon/60 tracking-widest mb-2">// ВНУТРИИГРОВОЙ МАГАЗИН</div>
          <div className="flex items-center justify-between">
            <h1 className="font-oswald text-4xl text-white">МАГАЗИН</h1>
            <div className="flex items-center gap-3">
              {user && (
                <div className="flex items-center gap-2 border border-neon/30 px-4 py-2">
                  <span className="font-mono-tech text-xs text-gray-500">БАЛАНС:</span>
                  <span className="font-oswald text-lg text-neon">{user.balance}₽</span>
                  <button onClick={() => setShowTopUp(true)} className="ml-2 btn-neon px-2 py-1 text-xs">
                    <Icon name="Plus" size={12} />
                  </button>
                </div>
              )}
              <button onClick={() => setShowCart(true)} className="btn-neon px-4 py-2 flex items-center gap-2 relative">
                <Icon name="ShoppingCart" size={16} />
                КОРЗИНА
                {cartCount > 0 && (
                  <span className="absolute -top-2 -right-2 w-5 h-5 bg-neon text-dark-bg text-xs font-bold rounded-full flex items-center justify-center">{cartCount}</span>
                )}
              </button>
            </div>
          </div>

          {/* Tabs */}
          {user && (
            <div className="flex gap-4 mt-4">
              {([['shop', 'Каталог'], ['history', 'История покупок']] as const).map(([key, label]) => (
                <button key={key} onClick={() => setTab(key)}
                  className={`font-oswald text-sm tracking-wider px-4 py-2 border-b-2 transition-all ${tab === key ? 'border-neon text-neon' : 'border-transparent text-gray-500 hover:text-white'}`}>
                  {label}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* History Tab */}
        {tab === 'history' && user && (
          <div>
            <div className="flex items-center gap-3 mb-6">
              <button onClick={() => setShowGuide(true)} className="btn-neon px-4 py-2 text-sm flex items-center gap-2">
                <Icon name="HelpCircle" size={14} />КАК ПОЛУЧИТЬ ТОВАР
              </button>
            </div>
            <div className="space-y-3">
              {user.purchases.length === 0 ? (
                <div className="card-dark p-8 text-center text-gray-500">
                  <Icon name="Package" size={40} className="mx-auto mb-3 text-gray-700" />
                  <p className="font-oswald text-lg">Пока нет покупок</p>
                </div>
              ) : (
                user.purchases.map(p => (
                  <div key={p.id} className="card-dark p-4 flex items-center justify-between">
                    <div>
                      <div className="font-oswald text-white">{p.productName}</div>
                      <div className="font-mono-tech text-xs text-gray-500">{p.date}</div>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="font-oswald text-neon">{p.price}₽</span>
                      <span className={`font-mono-tech text-xs px-2 py-1 border ${p.status === 'delivered' ? 'border-green-500/30 text-green-400 bg-green-900/10' : 'border-yellow-500/30 text-yellow-400 bg-yellow-900/10'}`}>
                        {p.status === 'delivered' ? '✓ ВЫДАН' : '⏳ ОЖИДАНИЕ'}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* Shop Tab */}
        {tab === 'shop' && (
          <div className="flex gap-6">
            {/* Sidebar */}
            <div className="w-48 shrink-0 hidden md:block">
              <div className="font-mono-tech text-xs text-gray-600 tracking-widest mb-3">КАТЕГОРИИ</div>
              <div className="space-y-1">
                {CATEGORIES.map(cat => (
                  <button key={cat.id} onClick={() => setCategory(cat.id)}
                    className={`w-full text-left px-3 py-2.5 flex items-center gap-2 text-sm transition-all ${
                      category === cat.id ? 'bg-neon/10 border-l-2 border-neon text-neon font-oswald' : 'text-gray-500 hover:text-white hover:bg-white/5'
                    }`}>
                    <span>{cat.icon}</span>
                    <span className="font-oswald tracking-wide">{cat.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Grid */}
            <div className="flex-1">
              {/* Mobile category scroll */}
              <div className="flex gap-2 mb-6 overflow-x-auto pb-2 md:hidden">
                {CATEGORIES.map(cat => (
                  <button key={cat.id} onClick={() => setCategory(cat.id)}
                    className={`shrink-0 px-3 py-2 text-xs font-oswald tracking-wider flex items-center gap-1 border transition-all ${
                      category === cat.id ? 'border-neon text-neon bg-neon/10' : 'border-gray-700 text-gray-500'
                    }`}>
                    {cat.icon} {cat.label}
                  </button>
                ))}
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {filtered.map(product => (
                  <ProductCard key={product.id} product={product} onAdd={() => {
                    if (!user) { alert('Войдите через Steam для покупки'); return; }
                    addToCart(product);
                  }} />
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Cart Modal */}
      {showCart && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4" onClick={() => setShowCart(false)}>
          <div className="bg-dark-card border border-neon/30 w-full max-w-lg max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            <div className="p-6 border-b border-neon/20 flex items-center justify-between">
              <h2 className="font-oswald text-xl text-white">КОРЗИНА</h2>
              <button onClick={() => setShowCart(false)} className="text-gray-500 hover:text-neon"><Icon name="X" size={20} /></button>
            </div>
            <div className="p-6">
              {cart.length === 0 ? (
                <p className="text-gray-500 text-center py-8 font-oswald">Корзина пуста</p>
              ) : (
                <>
                  <div className="space-y-3 mb-6">
                    {cart.map(item => {
                      const price = item.product.discount
                        ? Math.round(item.product.price * (1 - item.product.discount / 100))
                        : item.product.price;
                      return (
                        <div key={item.product.id} className="flex items-center gap-3 border border-neon/10 p-3">
                          <div className="text-2xl">{item.product.image}</div>
                          <div className="flex-1">
                            <div className="font-oswald text-white text-sm">{item.product.name}</div>
                            <div className="font-mono-tech text-neon text-xs">{price}₽</div>
                          </div>
                          <div className="flex items-center gap-2">
                            <button onClick={() => updateCartQty(item.product.id, item.quantity - 1)} className="w-6 h-6 border border-neon/30 text-neon flex items-center justify-center hover:bg-neon/10">
                              <Icon name="Minus" size={10} />
                            </button>
                            <span className="font-mono-tech text-sm w-4 text-center">{item.quantity}</span>
                            <button onClick={() => updateCartQty(item.product.id, item.quantity + 1)} className="w-6 h-6 border border-neon/30 text-neon flex items-center justify-center hover:bg-neon/10">
                              <Icon name="Plus" size={10} />
                            </button>
                            <button onClick={() => removeFromCart(item.product.id)} className="ml-2 text-red-500 hover:text-red-400">
                              <Icon name="Trash2" size={14} />
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Promo */}
                  <div className="flex gap-2 mb-4">
                    <input
                      value={promoCode}
                      onChange={e => setPromoCode(e.target.value.toUpperCase())}
                      placeholder="ПРОМОКОД"
                      className="flex-1 bg-dark-bg border border-neon/20 px-3 py-2 font-mono-tech text-sm text-white placeholder:text-gray-600 focus:border-neon outline-none"
                    />
                    <button onClick={handleApplyPromo} className="btn-neon px-4 py-2 text-sm">ПРИМЕНИТЬ</button>
                  </div>
                  {promoMsg && (
                    <div className={`font-mono-tech text-xs mb-4 ${promoMsg.startsWith('✓') ? 'text-green-400' : 'text-red-400'}`}>{promoMsg}</div>
                  )}

                  <div className="border-t border-neon/20 pt-4">
                    <div className="flex justify-between mb-2">
                      <span className="font-mono-tech text-sm text-gray-500">ИТОГО:</span>
                      <span className="font-oswald text-xl text-neon">{discountedTotal}₽</span>
                    </div>
                    {user && (
                      <div className="flex justify-between mb-4">
                        <span className="font-mono-tech text-xs text-gray-600">ВАШ БАЛАНС:</span>
                        <span className={`font-mono-tech text-xs ${user.balance >= discountedTotal ? 'text-green-400' : 'text-red-400'}`}>{user.balance}₽</span>
                      </div>
                    )}
                    <button onClick={handleBuy} disabled={!user} className="w-full btn-neon-filled py-3 text-sm flex items-center justify-center gap-2">
                      <Icon name="CreditCard" size={16} />
                      ОПЛАТИТЬ {discountedTotal}₽
                    </button>
                    {!user && <p className="text-red-400 text-xs text-center mt-2 font-mono-tech">Войдите через Steam</p>}
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* TopUp Modal */}
      {showTopUp && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4" onClick={() => setShowTopUp(false)}>
          <div className="bg-dark-card border border-neon/30 w-full max-w-md p-6" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-oswald text-xl text-white">ПОПОЛНЕНИЕ БАЛАНСА</h2>
              <button onClick={() => setShowTopUp(false)} className="text-gray-500 hover:text-neon"><Icon name="X" size={20} /></button>
            </div>
            <div className="grid grid-cols-3 gap-2 mb-4">
              {[100, 200, 500, 1000, 2000, 5000].map(amt => (
                <button key={amt} onClick={() => setTopUpAmount(String(amt))}
                  className={`py-3 font-oswald text-sm border transition-all ${topUpAmount === String(amt) ? 'border-neon bg-neon/10 text-neon' : 'border-neon/20 text-gray-400 hover:border-neon/40'}`}>
                  {amt}₽
                </button>
              ))}
            </div>
            <input
              value={topUpAmount}
              onChange={e => setTopUpAmount(e.target.value)}
              placeholder="Своя сумма в рублях"
              className="w-full bg-dark-bg border border-neon/20 px-4 py-3 font-mono-tech text-white placeholder:text-gray-600 focus:border-neon outline-none mb-4"
            />
            <p className="text-gray-600 text-xs font-mono-tech mb-4">
              * Оплата через ЮКасса, СБП и банковские карты. Баланс пополняется мгновенно.
            </p>
            <button
              onClick={() => {
                if (topUpAmount && Number(topUpAmount) > 0) {
                  topUpBalance(Number(topUpAmount));
                  setShowTopUp(false);
                  setTopUpAmount('');
                }
              }}
              className="w-full btn-neon-filled py-3"
            >
              ПОПОЛНИТЬ {topUpAmount ? `${topUpAmount}₽` : ''}
            </button>
          </div>
        </div>
      )}

      {/* Guide Modal */}
      {showGuide && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4" onClick={() => setShowGuide(false)}>
          <div className="bg-dark-card border border-neon/30 w-full max-w-lg p-6" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-oswald text-xl text-white">КАК ПОЛУЧИТЬ ТОВАР</h2>
              <button onClick={() => setShowGuide(false)} className="text-gray-500 hover:text-neon"><Icon name="X" size={20} /></button>
            </div>
            <div className="space-y-4">
              {[
                { step: '01', title: 'Купите товар в магазине', desc: 'Выберите товар, добавьте в корзину и оплатите с баланса.' },
                { step: '02', title: 'Зайдите на сервер', desc: 'Подключитесь к Hugas Gaming через DayZ по IP play.hugasgaming.ru:2302' },
                { step: '03', title: 'Введите команду', desc: 'В игровом чате напишите /shop — откроется список ваших покупок.' },
                { step: '04', title: 'Получите предмет', desc: 'Нажмите "Получить" рядом с купленным товаром. Предмет появится в вашем инвентаре.' },
              ].map(s => (
                <div key={s.step} className="flex gap-4 border-b border-neon/10 pb-4">
                  <div className="font-mono-tech text-neon text-lg font-bold shrink-0">{s.step}</div>
                  <div>
                    <div className="font-oswald text-white mb-1">{s.title}</div>
                    <div className="text-gray-500 text-sm">{s.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
