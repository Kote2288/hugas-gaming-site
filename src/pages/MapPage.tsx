import { useState } from 'react';
import Icon from '@/components/ui/icon';

const MAP_IMG = 'https://cdn.poehali.dev/projects/a6cbd089-012a-4d63-aa2c-4ebf4b7be9ea/files/c12d881a-afb2-46ed-aec8-21d608d4be66.jpg';

const LOCATIONS = [
  { id: 'military', label: 'Военные базы', icon: '⚔️', color: 'text-red-400 border-red-400/30 bg-red-900/10',
    items: ['Автоматы и снайперские винтовки', 'Военные разгрузки и каски', 'Рации и патроны', 'Медпакеты NATO', 'Военные консервы'] },
  { id: 'cities', label: 'Города', icon: '🏙️', color: 'text-blue-400 border-blue-400/30 bg-blue-900/10',
    items: ['Пистолеты и дробовики', 'Гражданская одежда', 'Еда и вода', 'Инструменты', 'Рюкзаки'] },
  { id: 'hospitals', label: 'Больницы', icon: '🏥', color: 'text-green-400 border-green-400/30 bg-green-900/10',
    items: ['Морфин и промедол', 'Кровь и капельницы', 'Бинты и тетрациклин', 'Хирургические наборы', 'Йод и спирт'] },
  { id: 'industrial', label: 'Промзоны', icon: '🏭', color: 'text-yellow-400 border-yellow-400/30 bg-yellow-900/10',
    items: ['Инструменты и кабели', 'Стройматериалы', 'Канистры и запчасти', 'Спецодежда', 'Генераторы'] },
  { id: 'villages', label: 'Деревни', icon: '🏡', color: 'text-orange-400 border-orange-400/30 bg-orange-900/10',
    items: ['Охотничьи ружья', 'Фермерская одежда', 'Еда и семена', 'Садовые инструменты', 'Животноводство'] },
  { id: 'forests', label: 'Леса', icon: '🌲', color: 'text-emerald-400 border-emerald-400/30 bg-emerald-900/10',
    items: ['Ягоды и грибы', 'Охота на животных', 'Материалы для костра', 'Ловушки', 'Маскировочные сети'] },
  { id: 'airfields', label: 'Аэродромы', icon: '✈️', color: 'text-purple-400 border-purple-400/30 bg-purple-900/10',
    items: ['Редкое военное оружие', 'Элитная броня', 'Военные ботинки', 'Ночные прицелы', 'Глушители'] },
  { id: 'coast', label: 'Побережье', icon: '⚓', color: 'text-cyan-400 border-cyan-400/30 bg-cyan-900/10',
    items: ['Рыбацкое снаряжение', 'Лодки', 'Навигация', 'Морские консервы', 'Верёвки'] },
];

const KNOWN_TOWNS = [
  'Чернорудск (Chernogorsk)', 'Электрозаводск (Elektrozavodsk)', 'Балота (Balota)', 
  'Солничный (Solnichniy)', 'Бор (Bor)', 'Бережки (Berezki)', 'Черногорск (Chernogorsk)',
  'Каменка (Kamenka)', 'Гвоздно (Gvozdno)', 'Могилевка (Mogilevka)',
];

export default function MapPage() {
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const active = LOCATIONS.find(l => l.id === activeCategory);

  return (
    <div className="min-h-screen bg-dark-bg pt-20 pb-16">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="py-8 border-b border-neon/20 mb-8">
          <div className="font-mono-tech text-xs text-neon/60 tracking-widest mb-2">// НАВИГАЦИЯ</div>
          <h1 className="font-oswald text-4xl text-white">КАРТА CHERNARUS</h1>
          <p className="text-gray-500 text-sm mt-2">Исследуй каждый уголок пост-апокалиптической Черноруссии</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Map */}
          <div className="lg:col-span-2">
            <div className="relative border border-neon/20 overflow-hidden">
              <img src={MAP_IMG} alt="Chernarus Map" className="w-full object-cover" />
              <div className="absolute inset-0 scanline opacity-20 pointer-events-none" />
              <div className="absolute inset-0 bg-gradient-to-b from-transparent to-dark-bg/30 pointer-events-none" />
              <div className="absolute top-3 left-3 font-mono-tech text-xs text-neon bg-dark-bg/80 px-3 py-1.5 border border-neon/30">
                CHERNARUS // DayZ 1.28
              </div>
              <div className="absolute bottom-3 right-3 font-mono-tech text-xs text-gray-500 bg-dark-bg/80 px-2 py-1">
                225 км² • 20 городов
              </div>
            </div>

            {/* Towns list */}
            <div className="mt-4 card-dark p-4">
              <div className="font-mono-tech text-xs text-neon/60 tracking-widest mb-3">// НАСЕЛЁННЫЕ ПУНКТЫ</div>
              <div className="grid grid-cols-2 gap-2">
                {KNOWN_TOWNS.map(town => (
                  <div key={town} className="flex items-center gap-2 text-sm text-gray-400">
                    <div className="w-1.5 h-1.5 bg-neon/60 rounded-full shrink-0" />
                    {town}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Categories */}
          <div>
            <div className="font-mono-tech text-xs text-neon/60 tracking-widest mb-4">// ЛОКАЦИИ И ЛУТ</div>
            <div className="space-y-2">
              {LOCATIONS.map(loc => (
                <button
                  key={loc.id}
                  onClick={() => setActiveCategory(activeCategory === loc.id ? null : loc.id)}
                  className={`w-full text-left border px-4 py-3 flex items-center justify-between transition-all ${
                    activeCategory === loc.id ? loc.color : 'border-neon/10 bg-dark-card text-gray-400 hover:border-neon/30'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-xl">{loc.icon}</span>
                    <span className="font-oswald tracking-wider">{loc.label}</span>
                  </div>
                  <Icon name={activeCategory === loc.id ? 'ChevronUp' : 'ChevronDown'} size={14} />
                </button>
              ))}
            </div>

            {/* Active Location Details */}
            {active && (
              <div className={`mt-3 border p-4 animate-fade-in ${active.color}`}>
                <div className="font-mono-tech text-xs tracking-widest mb-3 opacity-70">// ПРЕДМЕТЫ</div>
                <ul className="space-y-2">
                  {active.items.map(item => (
                    <li key={item} className="flex items-center gap-2 text-sm">
                      <Icon name="ChevronRight" size={12} className="opacity-60" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Danger Zones */}
            <div className="mt-6 border border-red-500/20 p-4 bg-red-900/5">
              <div className="font-mono-tech text-xs text-red-400 tracking-widest mb-3">// ОПАСНЫЕ ЗОНЫ</div>
              {[
                { name: 'Тисы — военный склад', danger: 'ЭКСТРЕМАЛЬНАЯ' },
                { name: 'НАТО аэродром Балота', danger: 'ВЫСОКАЯ' },
                { name: 'Нефтяная платформа', danger: 'ВЫСОКАЯ' },
                { name: 'Зоны радиации', danger: 'СМЕРТЕЛЬНАЯ' },
              ].map(z => (
                <div key={z.name} className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-400">{z.name}</span>
                  <span className={`font-mono-tech text-xs ${
                    z.danger === 'СМЕРТЕЛЬНАЯ' ? 'text-red-500' : 
                    z.danger === 'ЭКСТРЕМАЛЬНАЯ' ? 'text-red-400' : 'text-orange-400'
                  }`}>{z.danger}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
