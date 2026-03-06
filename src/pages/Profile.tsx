import { useState } from 'react';
import { useStore, steamLogin, topUpBalance } from '@/store/useStore';
import Icon from '@/components/ui/icon';

export default function Profile() {
  const { user } = useStore();
  const [topUpAmount, setTopUpAmount] = useState('');
  const [showTopUp, setShowTopUp] = useState(false);

  if (!user) {
    return (
      <div className="min-h-screen bg-dark-bg pt-20 flex items-center justify-center">
        <div className="text-center max-w-md px-4">
          <div className="text-8xl mb-6">🔒</div>
          <h2 className="font-oswald text-3xl text-white mb-3">ДОСТУП ЗАКРЫТ</h2>
          <p className="text-gray-500 text-sm mb-8">Войдите через Steam для просмотра профиля</p>
          <button onClick={steamLogin} className="btn-neon-filled px-8 py-4 flex items-center gap-3 mx-auto">
            <span className="text-xl">♨</span>ВОЙТИ ЧЕРЕЗ STEAM
          </button>
        </div>
      </div>
    );
  }

  const roleBadge: Record<string, { label: string; color: string }> = {
    player: { label: 'ВЫЖИВШИЙ', color: 'text-gray-400 border-gray-600' },
    moderator: { label: 'МОДЕРАТОР', color: 'text-blue-400 border-blue-500/50' },
    admin: { label: 'АДМИНИСТРАТОР', color: 'text-red-400 border-red-500/50' },
    owner: { label: 'ВЛАДЕЛЕЦ', color: 'text-neon border-neon' },
  };
  const badge = roleBadge[user.role];

  return (
    <div className="min-h-screen bg-dark-bg pt-20 pb-16">
      <div className="max-w-4xl mx-auto px-4">
        <div className="py-8 border-b border-neon/20 mb-8">
          <div className="font-mono-tech text-xs text-neon/60 tracking-widest mb-2">// ЛИЧНЫЙ КАБИНЕТ</div>
          <h1 className="font-oswald text-4xl text-white">ПРОФИЛЬ</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Profile Card */}
          <div className="lg:col-span-1">
            <div className="card-dark p-6 text-center">
              <div className="w-24 h-24 mx-auto mb-4 border-2 border-neon relative">
                {user.avatar ? (
                  <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full bg-neon/10 flex items-center justify-center text-neon text-4xl font-oswald font-black">
                    {user.name.charAt(0)}
                  </div>
                )}
                <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-400 border-2 border-dark-bg rounded-full" />
              </div>
              <h2 className="font-oswald text-2xl text-white mb-1">{user.name}</h2>
              <div className={`inline-block font-mono-tech text-xs border px-3 py-1 mb-4 ${badge.color}`}>
                {badge.label}
              </div>
              <div className="font-mono-tech text-xs text-gray-600 mb-6">
                STEAM ID: {user.steamId}
              </div>

              <div className="grid grid-cols-2 gap-3 mb-6">
                <div className="bg-dark-bg p-3">
                  <div className="font-mono-tech text-xs text-gray-600 mb-1">БАЛАНС</div>
                  <div className="font-oswald text-xl text-neon">{user.balance}₽</div>
                </div>
                <div className="bg-dark-bg p-3">
                  <div className="font-mono-tech text-xs text-gray-600 mb-1">ВРЕМЯ</div>
                  <div className="font-oswald text-xl text-white">{user.playtime}ч</div>
                </div>
              </div>

              <button onClick={() => setShowTopUp(true)} className="w-full btn-neon-filled py-3 flex items-center justify-center gap-2">
                <Icon name="Plus" size={16} />
                ПОПОЛНИТЬ БАЛАНС
              </button>

              <div className="mt-4 font-mono-tech text-xs text-gray-700">
                Игрок с {new Date(user.joinDate).toLocaleDateString('ru-RU')}
              </div>
            </div>

            {/* Stats */}
            <div className="card-dark p-5 mt-4">
              <div className="font-mono-tech text-xs text-neon/60 tracking-widest mb-4">// СТАТИСТИКА</div>
              {[
                { label: 'Покупок', value: user.purchases.length },
                { label: 'Дата регистрации', value: new Date(user.joinDate).toLocaleDateString('ru-RU') },
                { label: 'Наигранных часов', value: `${user.playtime}ч` },
              ].map(s => (
                <div key={s.label} className="flex justify-between items-center py-2 border-b border-neon/10 last:border-0">
                  <span className="text-gray-500 text-sm">{s.label}</span>
                  <span className="font-oswald text-white">{s.value}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Purchases */}
          <div className="lg:col-span-2">
            <div className="card-dark p-6 mb-4">
              <div className="flex items-center justify-between mb-4">
                <div className="font-mono-tech text-xs text-neon/60 tracking-widest">// ИСТОРИЯ ПОКУПОК</div>
                <span className="font-mono-tech text-xs text-gray-600">{user.purchases.length} покупок</span>
              </div>

              {user.purchases.length === 0 ? (
                <div className="text-center py-10">
                  <Icon name="ShoppingBag" size={40} className="mx-auto mb-3 text-gray-700" />
                  <p className="text-gray-600 font-oswald">Пока нет покупок</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {user.purchases.map(p => (
                    <div key={p.id} className="flex items-center justify-between p-3 border border-neon/10 hover:border-neon/20 transition-all">
                      <div>
                        <div className="font-oswald text-white">{p.productName}</div>
                        <div className="font-mono-tech text-xs text-gray-600">{p.date}</div>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="font-oswald text-neon">{p.price}₽</span>
                        <span className={`font-mono-tech text-xs px-2 py-1 border ${
                          p.status === 'delivered' ? 'border-green-500/30 text-green-400 bg-green-900/10' : 'border-yellow-500/30 text-yellow-400 bg-yellow-900/10'
                        }`}>
                          {p.status === 'delivered' ? '✓ ВЫДАН' : '⏳ ОЖИДАНИЕ'}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* How to get items */}
            <div className="card-dark p-6">
              <div className="font-mono-tech text-xs text-neon/60 tracking-widest mb-4">// КАК ПОЛУЧИТЬ КУПЛЕННЫЕ ТОВАРЫ</div>
              <div className="space-y-3">
                {[
                  { icon: 'LogIn', step: '1. Зайди на сервер Hugas Gaming' },
                  { icon: 'MessageSquare', step: '2. В чате введи команду /shop' },
                  { icon: 'Package', step: '3. Выбери купленный предмет и нажми "Получить"' },
                  { icon: 'CheckCircle', step: '4. Предмет появится в твоём инвентаре' },
                ].map(item => (
                  <div key={item.step} className="flex items-center gap-3 text-sm text-gray-400">
                    <Icon name={item.icon} size={16} className="text-neon/60 shrink-0" />
                    {item.step}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

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
              * Оплата через ЮКасса, СБП и карты. Пополнение мгновенное.
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
    </div>
  );
}
