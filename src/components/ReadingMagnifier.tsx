import { useState } from "react";
import { X, ZoomIn, Volume2, RotateCcw, Camera } from "lucide-react";
import { Slider } from "@/components/ui/slider";

const sampleTexts = [
  {
    id: "1",
    title: "药品说明书",
    original: "用法用量：口服。成人一次2片，一日3次。饭后服用。儿童用量请咨询医师。不良反应：偶见恶心、腹泻。禁忌：对本品过敏者禁用。",
  },
  {
    id: "2",
    title: "报纸新闻",
    original: "市民健康大讲堂将于本周六上午9点在社区活动中心举办，主题为'老年人冬季养生要点'。欢迎广大居民参加，现场免费量血压、测血糖。",
  },
];

export default function ReadingMagnifier({ onClose }: { onClose: () => void }) {
  const [zoom, setZoom] = useState(1.5);
  const [mode, setMode] = useState<"camera" | "result">("camera");
  const [selectedText, setSelectedText] = useState<typeof sampleTexts[0] | null>(null);
  const [isReading, setIsReading] = useState(false);

  const simulateCapture = (text: typeof sampleTexts[0]) => {
    setSelectedText(text);
    setMode("result");
  };

  const simulateReadAloud = () => {
    setIsReading(true);
    setTimeout(() => setIsReading(false), 4000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-background flex flex-col fade-in">
      <header className="bg-primary text-primary-foreground px-4 py-4 flex items-center justify-between">
        <h2 className="text-2xl font-bold">🔍 阅读放大镜</h2>
        <button
          onClick={onClose}
          className="w-12 h-12 rounded-xl bg-primary-foreground/20 flex items-center justify-center active:scale-95"
        >
          <X className="w-7 h-7" />
        </button>
      </header>

      <div className="flex-1 overflow-y-auto px-4 py-6 space-y-5">
        {mode === "camera" ? (
          <>
            {/* Simulated camera view */}
            <div className="rounded-2xl bg-muted border-2 border-dashed border-border aspect-[4/3] flex flex-col items-center justify-center gap-4">
              <Camera className="w-16 h-16 text-muted-foreground" />
              <p className="text-xl text-muted-foreground font-medium text-center px-6">
                将摄像头对准要阅读的文字
              </p>
              <p className="text-base text-muted-foreground">（原型演示模式）</p>
            </div>

            {/* Zoom slider */}
            <div className="rounded-2xl bg-card border border-border p-5 space-y-3">
              <div className="flex items-center justify-between">
                <p className="text-lg font-bold text-foreground flex items-center gap-2">
                  <ZoomIn className="w-5 h-5" />
                  放大倍数
                </p>
                <span className="text-2xl font-black text-primary">{zoom.toFixed(1)}x</span>
              </div>
              <Slider
                value={[zoom]}
                onValueChange={([v]) => setZoom(v)}
                min={1}
                max={4}
                step={0.5}
                className="py-2"
              />
              <div className="flex justify-between text-base text-muted-foreground">
                <span>1x 正常</span>
                <span>4x 最大</span>
              </div>
            </div>

            {/* Demo samples */}
            <p className="text-xl font-bold text-foreground">👇 点击试试效果</p>
            {sampleTexts.map((t) => (
              <button
                key={t.id}
                onClick={() => simulateCapture(t)}
                className="w-full text-left p-5 rounded-2xl bg-card border border-border active:scale-[0.98] transition-transform"
              >
                <p className="text-xl font-bold text-foreground">{t.title}</p>
                <p className="text-base text-muted-foreground mt-1 line-clamp-2">{t.original}</p>
              </button>
            ))}
          </>
        ) : selectedText ? (
          <div className="space-y-5 fade-in">
            {/* Mode toggle */}
            <div className="flex gap-3">
              <button
                className="flex-1 py-4 rounded-xl bg-primary text-primary-foreground text-lg font-bold flex items-center justify-center gap-2 active:scale-95"
              >
                <ZoomIn className="w-6 h-6" />
                放大模式
              </button>
              <button
                onClick={simulateReadAloud}
                className={`flex-1 py-4 rounded-xl text-lg font-bold flex items-center justify-center gap-2 active:scale-95 transition-colors ${
                  isReading
                    ? "bg-secondary text-secondary-foreground"
                    : "bg-accent text-accent-foreground"
                }`}
              >
                <Volume2 className={`w-6 h-6 ${isReading ? "animate-pulse" : ""}`} />
                {isReading ? "正在朗读..." : "朗读模式"}
              </button>
            </div>

            {/* Enlarged text display */}
            <div className="rounded-2xl bg-card border-2 border-primary/20 p-6">
              <p className="text-lg font-bold text-muted-foreground mb-3">
                📄 {selectedText.title}
              </p>
              <p
                className="font-medium text-foreground leading-loose"
                style={{ fontSize: `${Math.round(18 * zoom)}px` }}
              >
                {selectedText.original}
              </p>
            </div>

            {isReading && (
              <div className="rounded-2xl bg-secondary/15 border-2 border-secondary/30 p-5 fade-in">
                <p className="text-xl font-bold text-foreground animate-pulse">
                  🔊 正在为您朗读...（0.8倍语速）
                </p>
                <p className="text-base text-muted-foreground mt-2">
                  每句话后停顿2秒，方便您理解
                </p>
              </div>
            )}

            {/* Action buttons */}
            <button
              onClick={simulateReadAloud}
              className="w-full elder-button bg-secondary text-secondary-foreground flex items-center justify-center gap-3"
            >
              <RotateCcw className="w-7 h-7" />
              <span>再读一遍</span>
            </button>

            <button
              onClick={() => { setMode("camera"); setSelectedText(null); }}
              className="w-full elder-button bg-accent text-accent-foreground"
            >
              ← 返回拍照
            </button>
          </div>
        ) : null}
      </div>
    </div>
  );
}
