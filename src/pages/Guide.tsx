import { useState } from 'react';
import Icon from '@/components/ui/icon';

const SECTIONS = [
  {
    id: 'connect', icon: 'Wifi', title: 'Как подключиться',
    content: [
      { step: '01', title: 'Купи DayZ Standalone', desc: 'Зайди в Steam и приобрети игру DayZ. Нужна именно базовая версия Standalone, не DayZ (старый Mod).' },
      { step: '02', title: 'Запусти игру', desc: 'Открой Steam → Библиотека → DayZ → Играть. Дождись полной загрузки меню.' },
      { step: '03', title: 'Перейди в Community', desc: 'В главном меню нажми "Multiplayer" → "Community Servers". Включи фильтр по имени.' },
      { step: '04', title: 'Найди Hugas Gaming', desc: 'В строке поиска введи "Hugas" или вручную введи IP: play.hugasgaming.ru:2302' },
      { step: '05', title: 'Подключись!', desc: 'Два раза нажми на сервер в списке. Дождись загрузки — она может занять 1-3 минуты в первый раз.' },
    ]
  },
  {
    id: 'start', icon: 'BookOpen', title: 'Начало игры',
    content: [
      { step: '01', title: 'Спаун на берегу', desc: 'Ты появляешься на берегу Черноруссии с минимальным инвентарем. Первая задача — найти еду и воду.' },
      { step: '02', title: 'Первые минуты', desc: 'Беги к ближайшей деревне. Ищи фермы, дома, хозяйственные постройки. Не заходи сразу на военные базы — ты не выживешь.' },
      { step: '03', title: 'Состояние персонажа', desc: 'Следи за иконками: кровь (красная), температура (снежинка), голод (живот), жажда (капля). Все должны быть зелёными.' },
      { step: '04', title: 'Первое оружие', desc: 'Нож, топор или дубина — твои первые друзья. Ищи в домах, на кухнях, в сараях.' },
      { step: '05', title: 'Взаимодействие', desc: 'Нажми F2 для поднятия рук (сдача). Нажми F1 для жеста. Эти жесты помогут выжить при встрече с другими игроками.' },
    ]
  },
  {
    id: 'survival', icon: 'Heart', title: 'Выживание',
    content: [
      { step: '01', title: 'Еда и вода', desc: 'Пей воду только из помп (синие колонки в деревнях) или из водоёмов с таблетками очистки. Ешь любую еду из консервов.' },
      { step: '02', title: 'Кровотечение', desc: 'При ранении сразу перевяжи рану бинтом (Right Click → Перевязать). Без бинта умрёшь от кровопотери.' },
      { step: '03', title: 'Болезни', desc: 'Мокрая одежда → простуда. Лечись тетрациклином. Не пей грязную воду — холера убивает быстро.' },
      { step: '04', title: 'Температура', desc: 'Носи сухую одежду, разжигай костры. Гипотермия замедляет и убивает. Зелёный цвет иконки = норма.' },
      { step: '05', title: 'Ориентирование', desc: 'Солнце встаёт на востоке. Найди карту и компас в почтовых отделениях и военных базах.' },
    ]
  },
  {
    id: 'pvp', icon: 'Crosshair', title: 'PvP советы',
    content: [
      { step: '01', title: 'Не атакуй в лоб', desc: 'Используй укрытия, фланкируй. Прямая атака в DayZ — верная смерть даже с хорошим оружием.' },
      { step: '02', title: 'Звук решает', desc: 'Надень наушники. Шаги слышны за 30+ метров. Всегда знай, откуда идёт звук.' },
      { step: '03', title: 'Позиционирование', desc: 'Высота даёт преимущество. Крыши зданий, холмы — лучшие позиции для перестрелки.' },
      { step: '04', title: 'Не доверяй никому', desc: 'Даже friendly игрок может выстрелить в спину. Никогда не поворачивайся спиной к незнакомцу.' },
      { step: '05', title: 'Группа — сила', desc: 'В группе из 3+ человек шансы выжить кратно выше. Найди напарников в Discord Hugas Gaming.' },
    ]
  },
];

export default function Guide() {
  const [activeSection, setActiveSection] = useState('connect');
  const current = SECTIONS.find(s => s.id === activeSection)!;

  return (
    <div className="min-h-screen bg-dark-bg pt-20 pb-16">
      <div className="max-w-5xl mx-auto px-4">
        {/* Header */}
        <div className="py-8 border-b border-neon/20 mb-8">
          <div className="font-mono-tech text-xs text-neon/60 tracking-widest mb-2">// ОБУЧЕНИЕ</div>
          <h1 className="font-oswald text-4xl text-white">ГАЙДЫ ДЛЯ НОВИЧКОВ</h1>
          <p className="text-gray-500 text-sm mt-2">Всё что нужно знать для выживания в Черноруссии</p>
        </div>

        {/* Server Connect Box */}
        <div className="card-dark p-6 mb-8 border-neon/30">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div>
              <div className="font-mono-tech text-xs text-neon/60 tracking-widest mb-1">// БЫСТРОЕ ПОДКЛЮЧЕНИЕ</div>
              <div className="font-oswald text-2xl text-white">Hugas Gaming — DayZ 1.28</div>
            </div>
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-3 border border-neon/20 px-4 py-2 bg-dark-bg">
                <span className="font-mono-tech text-xs text-gray-500">IP:</span>
                <span className="font-mono-tech text-neon">play.hugasgaming.ru:2302</span>
                <button className="text-gray-500 hover:text-neon" onClick={() => navigator.clipboard?.writeText('play.hugasgaming.ru:2302')}>
                  <Icon name="Copy" size={14} />
                </button>
              </div>
              <div className="font-mono-tech text-xs text-gray-600 text-right">Chernarus • DayZ 1.28 • 60 слотов</div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="space-y-1">
              {SECTIONS.map(s => (
                <button key={s.id} onClick={() => setActiveSection(s.id)}
                  className={`w-full text-left px-4 py-3 flex items-center gap-3 transition-all border-l-2 ${
                    activeSection === s.id
                      ? 'border-neon bg-neon/10 text-neon'
                      : 'border-transparent text-gray-500 hover:text-white hover:bg-white/5'
                  }`}>
                  <Icon name={s.icon} size={16} />
                  <span className="font-oswald tracking-wider text-sm">{s.title}</span>
                </button>
              ))}
            </div>

            {/* Tips Box */}
            <div className="mt-6 border border-yellow-500/20 p-4 bg-yellow-900/5">
              <div className="font-mono-tech text-xs text-yellow-400 tracking-widest mb-3">// ПОЛЕЗНО ЗНАТЬ</div>
              {[
                'Свежий спаун — никакой агрессии, ищи лут',
                'Военные базы = хай-риск, хай-лут',
                'Кемпинг на спауне — нарушение правил',
                'F5 для перезагрузки позиции',
              ].map(tip => (
                <div key={tip} className="flex items-start gap-2 mb-2 text-xs text-gray-500">
                  <span className="text-yellow-400 shrink-0">›</span>
                  {tip}
                </div>
              ))}
            </div>
          </div>

          {/* Content */}
          <div className="lg:col-span-3">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 border border-neon flex items-center justify-center">
                <Icon name={current.icon} size={18} className="text-neon" />
              </div>
              <h2 className="font-oswald text-2xl text-white">{current.title}</h2>
            </div>

            <div className="space-y-4">
              {current.content.map((item, idx) => (
                <div key={idx} className="flex gap-5 card-dark p-5 hover:border-neon/30 transition-all">
                  <div className="font-mono-tech text-neon/60 text-sm font-bold shrink-0 mt-0.5">{item.step}</div>
                  <div>
                    <h3 className="font-oswald text-lg text-white mb-1">{item.title}</h3>
                    <p className="text-gray-400 text-sm leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Video placeholder */}
            <div className="mt-8 border border-neon/10 p-6 bg-dark-card text-center">
              <div className="w-16 h-16 border border-neon/20 flex items-center justify-center mx-auto mb-4">
                <Icon name="Youtube" size={28} className="text-neon/40" />
              </div>
              <div className="font-oswald text-lg text-gray-600 mb-2">ВИДЕО-ГАЙДЫ</div>
              <p className="text-gray-600 text-sm">Видеогайды для новичков скоро появятся на нашем YouTube канале</p>
              <a href="https://discord.gg/hugas" target="_blank" rel="noopener noreferrer"
                className="mt-4 btn-neon px-6 py-2 inline-flex items-center gap-2 text-sm">
                <Icon name="MessageSquare" size={14} />
                ЗАДАТЬ ВОПРОС В DISCORD
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}