import { useState } from 'react';
import { useStore, applyPromo } from '@/store/useStore';
import Icon from '@/components/ui/icon';

export default function Contests() {
  const { contests, promos, user } = useStore();
  const [promoCode, setPromoCode] = useState('');
  const [promoMsg, setPromoMsg] = useState('');

  const handlePromo = () => {
    const result = applyPromo(promoCode);
    if (result) {
      const val = result.type === 'percent' ? `${result.discount}%` : `${result.discount}₽`;
      setPromoMsg(`✓ Промокод активирован! Скидка ${val} на следующую покупку в магазине`);
    } else {
      setPromoMsg('✗ Промокод не найден, истёк или лимит использован');
    }
  };

  return (
    <div className="min-h-screen bg-dark-bg pt-20 pb-16">
      <div className="max-w-5xl mx-auto px-4">
        <div className="py-8 border-b border-neon/20 mb-8">
          <div className="font-mono-tech text-xs text-neon/60 tracking-widest mb-2">// СОРЕВНОВАНИЯ</div>
          <h1 className="font-oswald text-4xl text-white">КОНКУРСЫ И ПРОМОКОДЫ</h1>
          <p className="text-gray-500 text-sm mt-2">Участвуй в событиях и выигрывай уникальные призы</p>
        </div>

        {/* Promo code block */}
        <div className="card-dark p-6 mb-8 relative overflow-hidden">
          <div className="absolute top-0 right-0 font-oswald text-8xl font-black text-neon/5 leading-none -mt-4 -mr-4 pointer-events-none">%</div>
          <div className="font-mono-tech text-xs text-neon/60 tracking-widest mb-4">// АКТИВАЦИЯ ПРОМОКОДА</div>
          <div className="flex gap-3 max-w-md">
            <input
              value={promoCode}
              onChange={e => setPromoCode(e.target.value.toUpperCase())}
              onKeyDown={e => e.key === 'Enter' && handlePromo()}
              placeholder="ВВЕДИ ПРОМОКОД"
              className="flex-1 bg-dark-bg border border-neon/20 px-4 py-3 font-mono-tech text-sm text-white placeholder:text-gray-600 focus:border-neon outline-none tracking-widest"
            />
            <button onClick={handlePromo} className="btn-neon-filled px-6 py-3 font-oswald text-sm tracking-wider">
              ПРИМЕНИТЬ
            </button>
          </div>
          {promoMsg && (
            <div className={`mt-3 font-mono-tech text-sm ${promoMsg.startsWith('✓') ? 'text-green-400' : 'text-red-400'}`}>
              {promoMsg}
            </div>
          )}
          <p className="text-gray-600 text-xs mt-3 font-mono-tech">
            Промокоды раздаются на ивентах, в Discord и соцсетях. Скидка применяется к следующей покупке.
          </p>
        </div>

        {/* Active Contests */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="h-px flex-1 bg-neon/20" />
            <span className="font-mono-tech text-xs text-neon/60 tracking-widest">// АКТИВНЫЕ КОНКУРСЫ</span>
            <div className="h-px flex-1 bg-neon/20" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {contests.filter(c => c.active).map(contest => (
              <div key={contest.id} className="card-dark p-6 hover:border-neon/40 transition-all flex flex-col relative overflow-hidden">
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-neon/50 to-transparent" />
                <div className="flex items-center justify-between mb-4">
                  <div className="font-mono-tech text-xs text-green-400 border border-green-500/30 px-2 py-1 bg-green-900/10">
                    АКТИВЕН
                  </div>
                  <div className="flex items-center gap-1 font-mono-tech text-xs text-gray-600">
                    <Icon name="Users" size={11} />
                    {contest.participants}
                  </div>
                </div>

                <h3 className="font-oswald text-xl text-white mb-2">{contest.title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed mb-4 flex-1">{contest.description}</p>

                <div className="border border-neon/20 p-3 bg-neon/5 mb-4">
                  <div className="font-mono-tech text-xs text-gray-600 mb-1">ПРИЗ</div>
                  <div className="font-oswald text-neon text-lg">{contest.prize}</div>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-mono-tech text-xs text-gray-600">ДО:</div>
                    <div className="font-oswald text-sm text-white">
                      {new Date(contest.endDate).toLocaleDateString('ru-RU')}
                    </div>
                  </div>
                  <a href="https://discord.gg/hugas" target="_blank" rel="noopener noreferrer"
                    className="btn-neon px-4 py-2 text-xs">
                    УЧАСТВОВАТЬ
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Available Promos */}
        {user && (user.role === 'admin' || user.role === 'owner') && (
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="h-px flex-1 bg-neon/20" />
              <span className="font-mono-tech text-xs text-neon/60 tracking-widest">// ПРОМОКОДЫ (ADMIN VIEW)</span>
              <div className="h-px flex-1 bg-neon/20" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {promos.map(promo => (
                <div key={promo.id} className={`card-dark p-4 flex items-center justify-between ${!promo.active ? 'opacity-50' : ''}`}>
                  <div>
                    <div className="font-mono-tech text-neon font-bold tracking-widest">{promo.code}</div>
                    <div className="font-mono-tech text-xs text-gray-600">
                      {promo.type === 'percent' ? `-${promo.discount}%` : `-${promo.discount}₽`} • {promo.usesLeft} использований
                    </div>
                  </div>
                  <div className={`font-mono-tech text-xs px-2 py-1 border ${promo.active ? 'border-green-500/30 text-green-400' : 'border-gray-700 text-gray-600'}`}>
                    {promo.active ? 'АКТИВЕН' : 'ОТКЛЮЧЁН'}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Past contests */}
        <div className="mt-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="h-px flex-1 bg-neon/10" />
            <span className="font-mono-tech text-xs text-gray-600 tracking-widest">// КАК УЧАСТВОВАТЬ</span>
            <div className="h-px flex-1 bg-neon/10" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              { icon: '💬', title: 'Следи за Discord', desc: 'Все анонсы конкурсов появляются в нашем Discord первыми' },
              { icon: '🎮', title: 'Участвуй в игре', desc: 'Большинство конкурсов проходят непосредственно на сервере' },
              { icon: '🏆', title: 'Побеждай', desc: 'Призы начисляются на баланс или выдаются предметами в игре' },
            ].map(item => (
              <div key={item.title} className="card-dark p-5 text-center">
                <div className="text-4xl mb-3">{item.icon}</div>
                <h3 className="font-oswald text-lg text-white mb-2">{item.title}</h3>
                <p className="text-gray-500 text-sm">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
