import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Icon from "@/components/ui/icon";
import { useStore, steamLogin } from "@/store/useStore";

const HERO_IMG =
  "https://cdn.poehali.dev/projects/a6cbd089-012a-4d63-aa2c-4ebf4b7be9ea/files/a91db04e-cb62-49f0-a3b1-3bd14521f0f6.jpg";

function ServerStatus() {
  const [online] = useState(47);
  const [maxPlayers] = useState(60);
  const [ping] = useState(28);
  const [isOnline] = useState(true);
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {[
        {
          label: "Статус",
          value: isOnline ? "ОНЛАЙН" : "ОФЛАЙН",
          icon: "Wifi",
          color: isOnline ? "text-green-400" : "text-red-400",
          pulse: isOnline,
        },
        {
          label: "Игроки",
          value: `${online}/${maxPlayers}`,
          icon: "Users",
          color: "text-neon",
          pulse: false,
        },
        {
          label: "Карта",
          value: "Livonia",
          icon: "Map",
          color: "text-blue-400",
          pulse: false,
        },
        {
          label: "Пинг",
          value: `${ping}ms`,
          icon: "Activity",
          color: "text-yellow-400",
          pulse: false,
        },
      ].map((item) => (
        <div
          key={item.label}
          className="card-dark p-4 transition-all duration-300"
        >
          <div className="flex items-center gap-2 mb-2">
            <div
              className={`w-2 h-2 rounded-full ${item.pulse ? "bg-green-400 status-online" : "bg-gray-600"}`}
            />
            <span className="font-mono-tech text-xs text-gray-500 tracking-widest uppercase">
              {item.label}
            </span>
          </div>
          <div className={`font-oswald text-2xl font-bold ${item.color}`}>
            {item.value}
          </div>
        </div>
      ))}
    </div>
  );
}

interface NewsItem {
  id: string;
  title: string;
  content: string;
  date: string;
  category: string;
}
function NewsCard({ item }: { item: NewsItem }) {
  const catColors: Record<string, string> = {
    update: "text-blue-400 border-blue-400/30 bg-blue-900/10",
    event: "text-neon border-neon/30 bg-neon/10",
    news: "text-gray-400 border-gray-500/30 bg-gray-800/20",
  };
  const catLabel: Record<string, string> = {
    update: "ОБНОВЛЕНИЕ",
    event: "ИВЕНТ",
    news: "НОВОСТЬ",
  };
  return (
    <div className="card-dark p-5 hover:border-neon/40 transition-all duration-300 group">
      <div className="flex items-center justify-between mb-3">
        <span
          className={`font-mono-tech text-xs px-2 py-1 border ${catColors[item.category]}`}
        >
          {catLabel[item.category]}
        </span>
        <span className="font-mono-tech text-xs text-gray-600">
          {item.date}
        </span>
      </div>
      <h3 className="font-oswald text-lg text-white mb-2 group-hover:text-neon transition-colors">
        {item.title}
      </h3>
      <p className="text-gray-400 text-sm leading-relaxed line-clamp-3">
        {item.content}
      </p>
    </div>
  );
}

export default function Index() {
  const { user, news } = useStore();
  const [typed, setTyped] = useState("");
  const fullText = "ВЫЖИВИ. АДАПТИРУЙСЯ. ДОМИНИРУЙ.";

  useEffect(() => {
    let i = 0;
    const interval = setInterval(() => {
      setTyped(fullText.slice(0, i + 1));
      i++;
      if (i >= fullText.length) clearInterval(interval);
    }, 60);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-dark-bg">
      {/* Hero */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url(${HERO_IMG})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-dark-bg/60 via-dark-bg/40 to-dark-bg" />
        <div className="absolute inset-0 scanline opacity-20" />
        <div className="absolute inset-0 grid-bg opacity-30" />
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-neon to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-neon to-transparent" />

        <div className="relative z-10 text-center max-w-5xl mx-auto px-4">
          <div className="inline-flex items-center gap-2 border border-neon/40 px-4 py-1.5 mb-8 font-mono-tech text-xs text-neon tracking-widest animate-fade-in">
            <div className="w-1.5 h-1.5 bg-green-400 rounded-full status-online" />
            СЕРВЕР АКТИВЕН // 47/60 ИГРОКОВ
          </div>
          <h1 className="font-oswald text-6xl md:text-8xl lg:text-9xl font-black text-white mb-4 tracking-tight animate-slide-up leading-none">
            HUGAS
            <br />
            <span className="neon-text animate-flicker">GAMING</span>
          </h1>
          <div className="font-mono-tech text-neon/80 text-sm md:text-base tracking-[0.3em] mb-6 min-h-6">
            {typed}
            <span className="animate-pulse">_</span>
          </div>
          <p className="text-gray-400 text-base md:text-lg max-w-2xl mx-auto mb-10 leading-relaxed">
            Уникальный DayZ Standalone 1.28 сервер на карте Livonia.
            Пост-апокалипсис без компромиссов. PvP/PvE, базостроительство,
            экономика и ежемесячные события.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            {user ? (
              <Link
                to="/shop"
                className="btn-neon-filled px-8 py-4 text-base flex items-center justify-center gap-2"
              >
                <Icon name="ShoppingBag" size={18} />
                МАГАЗИН
              </Link>
            ) : (
              <button
                onClick={steamLogin}
                className="btn-neon-filled px-8 py-4 text-base flex items-center justify-center gap-2"
              >
                <span className="text-xl">♨</span>ВОЙТИ ЧЕРЕЗ STEAM
              </button>
            )}
            <Link
              to="/guide"
              className="btn-neon px-8 py-4 text-base flex items-center justify-center gap-2"
            >
              <Icon name="BookOpen" size={18} />
              КАК НАЧАТЬ
            </Link>
            <Link
              to="/map"
              className="btn-neon px-8 py-4 text-base flex items-center justify-center gap-2 hidden sm:flex"
            >
              <Icon name="Map" size={18} />
              КАРТА
            </Link>
          </div>
          <div className="mt-10 inline-flex items-center gap-3 border border-neon/20 px-6 py-3 bg-dark-bg/60">
            <span className="font-mono-tech text-gray-500 text-xs">
              IP СЕРВЕРА:
            </span>
            <span className="font-mono-tech text-neon text-sm tracking-wider">
              play.hugasgaming.ru:2302
            </span>
            <button
              className="text-gray-500 hover:text-neon transition-colors"
              onClick={() =>
                navigator.clipboard?.writeText("play.hugasgaming.ru:2302")
              }
            >
              <Icon name="Copy" size={14} />
            </button>
          </div>
        </div>
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-neon/40 animate-bounce">
          <Icon name="ChevronDown" size={20} />
        </div>
      </section>

      {/* Server Status */}
      <section className="py-12 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center gap-3 mb-6">
            <div className="h-px flex-1 bg-neon/20" />
            <span className="font-mono-tech text-xs text-neon/60 tracking-widest">
              // СТАТУС СЕРВЕРА
            </span>
            <div className="h-px flex-1 bg-neon/20" />
          </div>
          <ServerStatus />
        </div>
      </section>

      {/* Features */}
      <section className="py-12 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center gap-3 mb-8">
            <div className="h-px flex-1 bg-neon/20" />
            <span className="font-mono-tech text-xs text-neon/60 tracking-widest">
              // ОСОБЕННОСТИ СЕРВЕРА
            </span>
            <div className="h-px flex-1 bg-neon/20" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              {
                icon: "Crosshair",
                title: "Хардкорный PvP",
                desc: "Full loot система. Каждое столкновение — вопрос жизни и смерти. Никакого сейфзона.",
              },
              {
                icon: "Home",
                title: "Базостроительство",
                desc: "Стройте укреплённые базы и целые поселения. Raid система с таймерами.",
              },
              {
                icon: "Award",
                title: "Еженедельные ивенты",
                desc: "Турниры, конкурсы, специальные рейды. Призы в виде игровой валюты.",
              },
              {
                icon: "Package",
                title: "Кастомный лут",
                desc: "Уникальные предметы, кастомные рецепты крафта, расширенный мирный трейдинг.",
              },
              {
                icon: "Users",
                title: "Дружное комьюнити",
                desc: "Discord с 2000+ участников. Кланы, наставники для новичков.",
              },
              {
                icon: "Zap",
                title: "Стабильный сервер",
                desc: "99.9% uptime. Анти-чит система. Автоматические бэкапы каждые 6 часов.",
              },
            ].map((f) => (
              <div
                key={f.title}
                className="card-dark p-6 hover:border-neon/40 transition-all duration-300 group"
              >
                <div className="w-12 h-12 border border-neon/30 flex items-center justify-center mb-4 group-hover:border-neon transition-all">
                  <Icon name={f.icon} size={22} className="text-neon" />
                </div>
                <h3 className="font-oswald text-lg text-white mb-2">
                  {f.title}
                </h3>
                <p className="text-gray-500 text-sm leading-relaxed">
                  {f.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Discord */}
      <section className="py-12 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="relative overflow-hidden border border-neon/20 p-8 md:p-12 bg-gradient-to-r from-indigo-900/20 via-dark-card to-dark-card">
            <div
              className="absolute top-0 right-0 bottom-0 w-1/3 opacity-10"
              style={{
                background:
                  "radial-gradient(ellipse at right, #5865F2 0%, transparent 70%)",
              }}
            />
            <div className="relative z-10 flex flex-col md:flex-row items-center gap-8">
              <div className="text-6xl md:text-8xl">💬</div>
              <div className="text-center md:text-left flex-1">
                <div className="font-mono-tech text-xs text-indigo-400 tracking-widest mb-2">
                  // СООБЩЕСТВО
                </div>
                <h2 className="font-oswald text-3xl md:text-4xl text-white mb-3">
                  Присоединись к Discord
                </h2>
                <p className="text-gray-400 text-sm leading-relaxed mb-6 max-w-md">
                  2000+ выживших в нашем Discord. Новости, ивенты, поиск
                  напарников, тех. поддержка.
                </p>
                <a
                  href="https://discord.gg/hugas"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-3 px-8 py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-oswald tracking-wider transition-all"
                >
                  <Icon name="MessageSquare" size={18} />
                  ВОЙТИ В DISCORD
                </a>
              </div>
              <div className="hidden md:block">
                <div className="border border-indigo-500/30 p-4 bg-indigo-900/10 min-w-36">
                  <div className="font-mono-tech text-xs text-indigo-400 mb-3">
                    ОНЛАЙН
                  </div>
                  {[
                    "Hugas 👑",
                    "DarkWolf 🛡",
                    "SurvivorX ⚔",
                    "Ghost_Rider",
                    "Nomad_99",
                  ].map((u) => (
                    <div key={u} className="flex items-center gap-2 mb-2">
                      <div className="w-2 h-2 rounded-full bg-green-400" />
                      <span className="text-xs text-gray-400">{u}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* News */}
      <section className="py-12 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <div className="h-px w-12 bg-neon/20" />
              <span className="font-mono-tech text-xs text-neon/60 tracking-widest">
                // ПОСЛЕДНИЕ НОВОСТИ
              </span>
            </div>
            <Link
              to="/news"
              className="font-mono-tech text-xs text-neon/60 hover:text-neon transition-colors flex items-center gap-1"
            >
              ВСЕ НОВОСТИ <Icon name="ArrowRight" size={12} />
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {news.slice(0, 4).map((item) => (
              <NewsCard key={item.id} item={item} />
            ))}
          </div>
        </div>
      </section>

      {/* How to Connect */}
      <section className="py-12 px-4 pb-20">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center gap-3 mb-8">
            <div className="h-px flex-1 bg-neon/20" />
            <span className="font-mono-tech text-xs text-neon/60 tracking-widest">
              // КАК ПОДКЛЮЧИТЬСЯ
            </span>
            <div className="h-px flex-1 bg-neon/20" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {[
              {
                step: "01",
                title: "Купи DayZ",
                desc: "Приобрети DayZ Standalone в Steam",
              },
              {
                step: "02",
                title: "Запусти игру",
                desc: "Открой лаунчер и дождись загрузки",
              },
              {
                step: "03",
                title: "Найди сервер",
                desc: "Введи IP в Community Servers",
              },
              {
                step: "04",
                title: "Выживи!",
                desc: "Удачи, выживший. Тебе понадобится.",
              },
            ].map((s) => (
              <div
                key={s.step}
                className="card-dark p-5 relative overflow-hidden"
              >
                <div className="absolute top-0 right-0 font-oswald text-6xl font-black text-neon/5 leading-none -mt-2 -mr-2">
                  {s.step}
                </div>
                <div className="font-mono-tech text-neon text-xs mb-3 tracking-widest">
                  {s.step}
                </div>
                <h3 className="font-oswald text-lg text-white mb-1">
                  {s.title}
                </h3>
                <p className="text-gray-500 text-sm">{s.desc}</p>
              </div>
            ))}
          </div>
          <div className="mt-6 text-center">
            <Link
              to="/guide"
              className="btn-neon px-8 py-3 inline-flex items-center gap-2"
            >
              <Icon name="BookOpen" size={16} />
              ПОЛНАЯ ИНСТРУКЦИЯ
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
