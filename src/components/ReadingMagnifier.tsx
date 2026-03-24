import { useState } from "react";
import { X, Plus, Minus, Volume2, Zap } from "lucide-react";

export default function ReadingMagnifier({ onClose }: { onClose: () => void }) {
  const [zoom, setZoom] = useState(150);
  const [isReading, setIsReading] = useState(false);

  const sampleTexts = [
    "这是一篇老年人友好的阅读文章。我们致力于帮助长者们享受阅读的乐趣。",
    "今日天气晴朗，适合出门散步。建议您做好防晒准备，多喝水保持水分。",
    "健康小贴士：按时吃饭很重要，早饭要吃好，午饭要吃饱，晚饭要吃少。",
  ];

  return (
    <div className="fixed inset-0 z-50 bg-background flex flex-col fade-in">
      {/* Header */}
      <header className="bg-primary text-primary-foreground px-4 py-4 flex items-center justify-between">
        <h2 className="text-2xl font-bold">👀 阅读放大镜</h2>
        <button
          onClick={onClose}
          className="w-12 h-12 rounded-xl bg-primary-foreground/20 flex items-center justify-center active:scale-95"
        >
          <X className="w-7 h-7" />
        </button>
      </header>

      <div className="flex-1 overflow-y-auto px-4 py-6">
        {/* Quick tip */}
        <div className="rounded-2xl bg-accent p-4 text-center mb-6">
          <p className="text-lg text-accent-foreground font-medium">
            📖 把您要读的文字拍成照片，或者粘贴下面的文本
          </p>
        </div>

        {/* Text input area */}
        <div className="rounded-2xl bg-card border-2 border-border p-6 mb-6">
          <textarea
            defaultValue={sampleTexts[0]}
            className="w-full h-32 p-4 rounded-xl bg-background border border-border text-lg leading-relaxed focus:outline-none focus:ring-2 focus:ring-primary resize-none"
            style={{ fontSize: `${zoom}%` }}
          />
        </div>

        {/* Zoom controls */}
        <div className="rounded-2xl bg-card border border-border p-5 mb-6">
          <p className="text-lg font-bold text-foreground mb-4 text-center">
            放大倍数：{zoom}%
          </p>
          <div className="flex gap-4 items-center justify-center mb-6">
            <button
              onClick={() => setZoom(Math.max(100, zoom - 50))}
              className="w-14 h-14 rounded-2xl bg-destructive/10 text-destructive flex items-center justify-center active:scale-95 transition-transform"
            >
              <Minus className="w-7 h-7" />
            </button>
            <div className="flex-1">
              <input
                type="range"
                min="100"
                max="300"
                value={zoom}
                onChange={(e) => setZoom(Number(e.target.value))}
                className="w-full h-2 rounded-lg bg-muted appearance-none cursor-pointer"
              />
            </div>
            <button
              onClick={() => setZoom(Math.min(300, zoom + 50))}
              className="w-14 h-14 rounded-2xl bg-primary text-primary-foreground flex items-center justify-center active:scale-95 transition-transform"
            >
              <Plus className="w-7 h-7" />
            </button>
          </div>
        </div>

        {/* Text samples */}
        <div className="space-y-3 mb-6">
          <p className="text-lg font-bold text-foreground">📚 其他文本示例</p>
          {sampleTexts.map((text, i) => (
            <button
              key={i}
              className="w-full text-left p-4 rounded-2xl bg-card border border-border hover:bg-card/80 active:scale-[0.98] transition-transform"
            >
              <p className="text-base text-foreground line-clamp-2">{text}</p>
            </button>
          ))}
        </div>

        {/* Read aloud button */}
        <button
          onClick={() => setIsReading(!isReading)}
          className="w-full elder-button bg-secondary text-secondary-foreground flex items-center justify-center gap-4 mb-6"
        >
          <Volume2 className="w-8 h-8" />
          <span>{isReading ? "停止朗读" : "点这里，帮我读出来"}</span>
        </button>

        {isReading && (
          <div className="text-center">
            <p className="text-xl text-primary font-bold animate-pulse">
              🔊 正在为您朗读...
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
