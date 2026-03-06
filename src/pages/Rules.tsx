import { useState } from 'react';
import Icon from '@/components/ui/icon';

const RULES = [
  {
    id: 'general', title: 'Общие правила', icon: 'BookOpen',
    rules: [
      { num: '1.1', text: 'Уважай других участников сервера. Оскорбления, расизм, дискриминация запрещены.' },
      { num: '1.2', text: 'Читерство, использование эксплойтов, дюпов предметов — моментальный перманентный бан.' },
      { num: '1.3', text: 'Кемпинг на точках спавна (в 500м от берега) запрещён.' },
      { num: '1.4', text: 'Griefing: намеренное разрушение баз без целей рейда — бан.' },
      { num: '1.5', text: 'Никакой рекламы других серверов в чате, Discord или личных сообщениях.' },
    ]
  },
  {
    id: 'pvp', title: 'PvP правила', icon: 'Crosshair',
    rules: [
      { num: '2.1', text: 'KoS (Kill on Sight) — разрешён везде, кроме трейдерских зон и спаун-зон.' },
      { num: '2.2', text: 'В трейдерских зонах оружие должно быть убрано. Стрельба = бан.' },
      { num: '2.3', text: 'Стреляй и грабь — запрещено брать предметы у союзников без согласия.' },
      { num: '2.4', text: 'Ruleplay запрещён: если взял игрока в плен — нельзя убивать без причины.' },
      { num: '2.5', text: 'Максимальный размер группы — 6 человек. Метагейминг с большими группами запрещён.' },
    ]
  },
  {
    id: 'base', title: 'Базостроительство', icon: 'Home',
    rules: [
      { num: '3.1', text: 'Raid разрешён только в период: 18:00 — 00:00 МСК (ежедневно).' },
      { num: '3.2', text: 'Нельзя строить базы вплотную к NPC-трейдерам (ближе 200м).' },
      { num: '3.3', text: 'Макс. количество объектов на группу: 200 элементов.' },
      { num: '3.4', text: 'Нельзя блокировать дороги и важные проходы строительством.' },
      { num: '3.5', text: 'Брошенные базы (без активности 7 дней) удаляются администрацией.' },
    ]
  },
  {
    id: 'chat', title: 'Правила чата', icon: 'MessageSquare',
    rules: [
      { num: '4.1', text: 'Русский и английский языки в чате. Другие языки запрещены.' },
      { num: '4.2', text: 'Флуд, спам, CAPS LOCK — мут на 30 минут.' },
      { num: '4.3', text: 'Ссылки в игровом чате запрещены (только в Discord).' },
      { num: '4.4', text: 'Ролевые разговоры приветствуются! Используй /me для действий.' },
    ]
  },
];

const PENALTIES = [
  { violation: 'Оскорбление игрока', penalty: 'Предупреждение / кик', color: 'text-yellow-400' },
  { violation: 'Спам / флуд в чате', penalty: 'Мут 30 мин — 24ч', color: 'text-yellow-400' },
  { violation: 'Кемпинг спаунов', penalty: 'Бан 1-3 дня', color: 'text-orange-400' },
  { violation: 'Реклама чужих серверов', penalty: 'Бан 7 дней', color: 'text-orange-400' },
  { violation: 'Нарушение raid-тайминга', penalty: 'Бан 3-7 дней', color: 'text-orange-400' },
  { violation: 'Использование читов', penalty: 'Перманентный бан', color: 'text-red-400' },
  { violation: 'Дюп предметов', penalty: 'Перманентный бан', color: 'text-red-400' },
  { violation: 'Эксплойты и баги', penalty: 'Бан до 30 дней', color: 'text-red-400' },
];

export default function Rules() {
  const [activeSection, setActiveSection] = useState('general');
  const current = RULES.find(r => r.id === activeSection)!;

  return (
    <div className="min-h-screen bg-dark-bg pt-20 pb-16">
      <div className="max-w-5xl mx-auto px-4">
        <div className="py-8 border-b border-neon/20 mb-8">
          <div className="font-mono-tech text-xs text-neon/60 tracking-widest mb-2">// РЕГЛАМЕНТ</div>
          <h1 className="font-oswald text-4xl text-white">ПРАВИЛА СЕРВЕРА</h1>
          <p className="text-gray-500 text-sm mt-2">Незнание правил не освобождает от ответственности</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <div className="lg:col-span-1">
            <div className="space-y-1 mb-6">
              {RULES.map(r => (
                <button key={r.id} onClick={() => setActiveSection(r.id)}
                  className={`w-full text-left px-4 py-3 flex items-center gap-3 transition-all border-l-2 ${
                    activeSection === r.id ? 'border-neon bg-neon/10 text-neon' : 'border-transparent text-gray-500 hover:text-white hover:bg-white/5'
                  }`}>
                  <Icon name={r.icon} size={15} />
                  <span className="font-oswald tracking-wider text-sm">{r.title}</span>
                </button>
              ))}
            </div>

            <div className="border border-red-500/20 p-4 bg-red-900/5">
              <div className="font-mono-tech text-xs text-red-400 tracking-widest mb-2">НАРУШЕНИЯ = БАН</div>
              <div className="text-xs text-gray-500">За нарушения правил выдаётся предупреждение или бан. Апелляции через Discord.</div>
            </div>
          </div>

          <div className="lg:col-span-3">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 border border-neon flex items-center justify-center">
                <Icon name={current.icon} size={18} className="text-neon" />
              </div>
              <h2 className="font-oswald text-2xl text-white">{current.title}</h2>
            </div>

            <div className="space-y-3 mb-8">
              {current.rules.map(rule => (
                <div key={rule.num} className="flex gap-4 card-dark p-4 hover:border-neon/20 transition-all">
                  <div className="font-mono-tech text-neon text-sm font-bold shrink-0">{rule.num}</div>
                  <p className="text-gray-300 text-sm leading-relaxed">{rule.text}</p>
                </div>
              ))}
            </div>

            <div className="card-dark p-6">
              <div className="font-mono-tech text-xs text-neon/60 tracking-widest mb-4">// ТАБЛИЦА НАКАЗАНИЙ</div>
              <div className="space-y-2">
                {PENALTIES.map(p => (
                  <div key={p.violation} className="flex items-center justify-between py-2 border-b border-neon/10 last:border-0">
                    <span className="text-gray-400 text-sm">{p.violation}</span>
                    <span className={`font-mono-tech text-xs ${p.color}`}>{p.penalty}</span>
                  </div>
                ))}
              </div>

              <div className="mt-4 pt-4 border-t border-neon/20 font-mono-tech text-xs text-gray-600">
                Апелляция бана: Discord → канал #апелляции. Решение в течение 48 часов.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
