import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="border-t border-neon/10 bg-dark-bg py-8 mt-auto">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 border border-neon flex items-center justify-center">
                <span className="font-oswald font-black text-neon text-sm">
                  HG
                </span>
              </div>
              <span className="font-oswald text-white font-bold">
                HUGAS GAMING
              </span>
            </div>
            <p className="text-gray-600 text-xs leading-relaxed font-mono-tech">
              DayZ Standalone 1.28 // Chernarus
              <br />
              Пост-апокалипсис без компромиссов
            </p>
          </div>
          <div>
            <div className="font-mono-tech text-xs text-neon/60 tracking-widest mb-3">
              // НАВИГАЦИЯ
            </div>
            <div className="grid grid-cols-2 gap-1">
              {[
                ["/news", "Новости"],
                ["/shop", "Магазин"],
                ["/map", "Карта"],
                ["/guide", "Гайды"],
                ["/contests", "Конкурсы"],
                ["/rules", "Правила"],
              ].map(([to, label]) => (
                <Link
                  key={to}
                  to={to}
                  className="text-gray-600 text-xs hover:text-neon transition-colors font-mono-tech"
                >
                  {label}
                </Link>
              ))}
            </div>
          </div>
          <div>
            <div className="font-mono-tech text-xs text-neon/60 tracking-widest mb-3">
              // КОНТАКТЫ
            </div>
            <div className="space-y-2">
              <a
                href="https://discord.gg/Bk8bPHF7QC"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-xs text-gray-600 hover:text-neon transition-colors font-mono-tech"
              >
                💬 Discord Odium Server
              </a>
              <div className="font-mono-tech text-xs text-gray-600">
                IP: play.hugasgaming.ru:2302
              </div>
            </div>
          </div>
        </div>
        <div className="border-t border-neon/10 pt-4 flex flex-col md:flex-row items-center justify-between gap-2">
          <p className="font-mono-tech text-xs text-gray-700">
            © 2026 Hugas Gaming. All rights reserved.
          </p>
          <p className="font-mono-tech text-xs text-gray-700">
            DayZ and related marks are trademarks of Bohemia Interactive a.s.
          </p>
        </div>
      </div>
    </footer>
  );
}
