import { useStore } from "@/store/useStore";

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

export default function News() {
  const { news } = useStore();

  return (
    <div className="min-h-screen bg-dark-bg pt-20 pb-16">
      <div className="max-w-4xl mx-auto px-4">
        <div className="py-8 border-b border-neon/20 mb-8">
          <div className="font-mono-tech text-xs text-neon/60 tracking-widest mb-2">
            // ЛЕНТА
          </div>
          <h1 className="font-oswald text-4xl text-white">НОВОСТИ</h1>
          <p className="text-gray-500 text-sm mt-2">
            Последние события Odium Dayz
          </p>
        </div>

        <div className="space-y-4">
          {news.map((item) => (
            <div
              key={item.id}
              className="card-dark p-6 hover:border-neon/40 transition-all"
            >
              <div className="flex items-center justify-between mb-4">
                <span
                  className={`font-mono-tech text-xs px-3 py-1 border ${catColors[item.category]}`}
                >
                  {catLabel[item.category]}
                </span>
                <span className="font-mono-tech text-xs text-gray-600">
                  {item.date}
                </span>
              </div>
              <h2 className="font-oswald text-2xl text-white mb-3">
                {item.title}
              </h2>
              <p className="text-gray-400 leading-relaxed">{item.content}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
