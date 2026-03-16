import { useState } from "react";
import { X, Upload, Star, Play, BookOpen, Brush, Music } from "lucide-react";

interface Course {
  id: string;
  title: string;
  category: string;
  duration: string;
  icon: string;
}

const dailyCourses: Course[] = [
  { id: "1", title: "楷书基础：横竖撇捺", category: "书法", duration: "5分钟", icon: "✍️" },
  { id: "2", title: "水墨入门：画竹子", category: "国画", duration: "5分钟", icon: "🎨" },
  { id: "3", title: "今日诗词：《静夜思》", category: "诗词", duration: "3分钟", icon: "📖" },
  { id: "4", title: "养生太极：八式基础", category: "健身", duration: "5分钟", icon: "🧘" },
];

const sampleFeedback = {
  score: 85,
  praise: "笔画很有力！整体结构端正。",
  suggestion: "建议'田'字部分再方正一些，'口'的四角要更方。",
  tip: "给您看个示范：横要平、竖要直、撇出锋、捺铺开。",
};

export default function InterestLearning({ onClose }: { onClose: () => void }) {
  const [view, setView] = useState<"courses" | "upload" | "feedback">("courses");
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);

  return (
    <div className="fixed inset-0 z-50 bg-background flex flex-col fade-in">
      <header className="bg-primary text-primary-foreground px-4 py-4 flex items-center justify-between">
        <h2 className="text-2xl font-bold">🎨 兴趣学堂</h2>
        <button
          onClick={onClose}
          className="w-12 h-12 rounded-xl bg-primary-foreground/20 flex items-center justify-center active:scale-95"
        >
          <X className="w-7 h-7" />
        </button>
      </header>

      <div className="flex-1 overflow-y-auto px-4 py-6 space-y-5">
        {view === "courses" && (
          <>
            {/* Category tabs */}
            <div className="flex gap-2 overflow-x-auto pb-1">
              {[
                { icon: <Brush className="w-5 h-5" />, label: "书法" },
                { icon: <Star className="w-5 h-5" />, label: "国画" },
                { icon: <BookOpen className="w-5 h-5" />, label: "诗词" },
                { icon: <Music className="w-5 h-5" />, label: "健身" },
              ].map((cat) => (
                <button
                  key={cat.label}
                  className="flex items-center gap-2 px-5 py-3 rounded-xl bg-accent text-accent-foreground text-base font-bold whitespace-nowrap active:scale-95"
                >
                  {cat.icon}
                  {cat.label}
                </button>
              ))}
            </div>

            {/* Today's courses */}
            <p className="text-xl font-bold text-foreground">📚 今日课程</p>
            {dailyCourses.map((c) => (
              <button
                key={c.id}
                onClick={() => setSelectedCourse(c)}
                className="w-full text-left p-5 rounded-2xl bg-card border border-border active:scale-[0.98] transition-transform"
              >
                <div className="flex items-center gap-4">
                  <span className="text-4xl">{c.icon}</span>
                  <div className="flex-1">
                    <p className="text-xl font-bold text-foreground">{c.title}</p>
                    <p className="text-base text-muted-foreground mt-1">
                      {c.category} · {c.duration}
                    </p>
                  </div>
                  <Play className="w-8 h-8 text-primary" />
                </div>
              </button>
            ))}

            {/* Upload work */}
            <div className="rounded-2xl border-2 border-dashed border-primary/30 bg-primary/5 p-6 text-center">
              <Upload className="w-10 h-10 text-primary mx-auto mb-3" />
              <p className="text-xl font-bold text-foreground">上传您的作品</p>
              <p className="text-base text-muted-foreground mt-1">
                拍照上传书法或画作，AI 帮您点评
              </p>
              <button
                onClick={() => setView("upload")}
                className="mt-4 px-8 py-4 rounded-xl bg-primary text-primary-foreground text-lg font-bold active:scale-95"
              >
                📷 拍照上传
              </button>
            </div>

            {/* Progress */}
            <div className="rounded-2xl bg-accent p-5">
              <p className="text-lg text-accent-foreground font-medium">
                🏆 您已坚持学习 7 天，超过了 80% 的学员！
              </p>
            </div>
          </>
        )}

        {view === "upload" && (
          <div className="space-y-5 fade-in">
            <div className="rounded-2xl bg-muted border-2 border-dashed border-border aspect-square flex flex-col items-center justify-center gap-4">
              <Upload className="w-16 h-16 text-muted-foreground" />
              <p className="text-xl text-muted-foreground font-medium">
                点击拍照或从相册选择
              </p>
              <p className="text-base text-muted-foreground">（原型演示模式）</p>
            </div>

            <button
              onClick={() => setView("feedback")}
              className="w-full elder-button bg-primary text-primary-foreground"
            >
              模拟上传"福"字作品
            </button>

            <button
              onClick={() => setView("courses")}
              className="w-full elder-button bg-accent text-accent-foreground"
            >
              ← 返回课程
            </button>
          </div>
        )}

        {view === "feedback" && (
          <div className="space-y-5 fade-in">
            {/* Score */}
            <div className="rounded-2xl bg-card border-2 border-primary/20 p-6 text-center">
              <p className="text-lg text-muted-foreground mb-2">AI 评分</p>
              <p className="text-6xl font-black text-primary">{sampleFeedback.score}</p>
              <p className="text-xl font-bold text-foreground mt-2">优秀！</p>
            </div>

            {/* Feedback details */}
            <div className="rounded-2xl bg-secondary/10 border border-secondary/30 p-5">
              <p className="text-lg font-bold mb-2">👍 表扬</p>
              <p className="text-xl leading-relaxed text-foreground">{sampleFeedback.praise}</p>
            </div>

            <div className="rounded-2xl bg-accent p-5">
              <p className="text-lg font-bold mb-2">💡 建议</p>
              <p className="text-xl leading-relaxed text-foreground">{sampleFeedback.suggestion}</p>
            </div>

            <div className="rounded-2xl bg-card border border-border p-5">
              <p className="text-lg font-bold mb-2">📝 练习要点</p>
              <p className="text-xl leading-relaxed text-foreground">{sampleFeedback.tip}</p>
            </div>

            {/* Certificate */}
            <div className="rounded-2xl bg-primary/10 border-2 border-primary/20 p-6 text-center">
              <p className="text-4xl mb-2">🎖️</p>
              <p className="text-xl font-bold text-foreground">恭喜获得"每日练习"证书</p>
              <p className="text-base text-muted-foreground mt-1">可以分享给子女看哦！</p>
              <button className="mt-3 px-8 py-3 rounded-xl bg-primary text-primary-foreground text-lg font-bold active:scale-95">
                分享给家人
              </button>
            </div>

            <button
              onClick={() => setView("courses")}
              className="w-full elder-button bg-accent text-accent-foreground"
            >
              ← 返回课程
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
