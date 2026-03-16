import { useState } from "react";
import { X, Play, Pause, Image, Heart, MessageCircle, ChevronRight } from "lucide-react";

interface PhotoGroup {
  id: string;
  title: string;
  date: string;
  count: number;
  emoji: string;
  story: string;
}

const photoGroups: PhotoGroup[] = [
  {
    id: "1",
    title: "2024年春节团圆",
    date: "2024年2月",
    count: 28,
    emoji: "🧧",
    story: "这是2024年春节，小明从北京回来过年。全家一起包了饺子，奶奶包的饺子最好看。除夕夜，全家围在一起看春晚，孙子给您拜年说'奶奶新年好'...",
  },
  {
    id: "2",
    title: "公园散步",
    date: "2024年3月",
    count: 15,
    emoji: "🌸",
    story: "三月的公园，桃花开了。您和老伴一起去散步，在湖边坐了很久。那天阳光特别好，老伴给您拍了好几张照片，笑得很开心...",
  },
  {
    id: "3",
    title: "孙子毕业典礼",
    date: "2024年6月",
    count: 42,
    emoji: "🎓",
    story: "小明大学毕业了！全家人都去参加了毕业典礼。您穿了那件红色的外套，和小明一起合了影。小明说'谢谢奶奶从小照顾我'...",
  },
];

const voiceMessages = [
  { id: "1", from: "儿子", text: "妈，今天天气好，出去走走吧！", time: "今天 09:30" },
  { id: "2", from: "孙子", text: "奶奶，我周末回来看您！", time: "昨天 20:15" },
];

export default function MemoryAlbum({ onClose }: { onClose: () => void }) {
  const [view, setView] = useState<"album" | "story" | "voices">("album");
  const [selectedGroup, setSelectedGroup] = useState<PhotoGroup | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const playStory = (group: PhotoGroup) => {
    setSelectedGroup(group);
    setView("story");
    setIsPlaying(true);
  };

  return (
    <div className="fixed inset-0 z-50 bg-background flex flex-col fade-in">
      <header className="bg-primary text-primary-foreground px-4 py-4 flex items-center justify-between">
        <h2 className="text-2xl font-bold">📷 记忆相册</h2>
        <button
          onClick={onClose}
          className="w-12 h-12 rounded-xl bg-primary-foreground/20 flex items-center justify-center active:scale-95"
        >
          <X className="w-7 h-7" />
        </button>
      </header>

      {/* Tab bar */}
      <div className="flex border-b border-border">
        <button
          onClick={() => setView("album")}
          className={`flex-1 py-4 text-lg font-bold text-center transition-colors ${
            view === "album" || view === "story"
              ? "text-primary border-b-2 border-primary"
              : "text-muted-foreground"
          }`}
        >
          📸 相册
        </button>
        <button
          onClick={() => setView("voices")}
          className={`flex-1 py-4 text-lg font-bold text-center transition-colors ${
            view === "voices"
              ? "text-primary border-b-2 border-primary"
              : "text-muted-foreground"
          }`}
        >
          🎙️ 家人留言
        </button>
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-6 space-y-5">
        {view === "album" && (
          <>
            {/* Storage status */}
            <div className="rounded-2xl bg-accent p-4 flex items-center justify-between">
              <p className="text-base text-accent-foreground font-medium">
                已保存 85 张照片（免费额度 100 张）
              </p>
              <ChevronRight className="w-5 h-5 text-accent-foreground" />
            </div>

            {/* Photo groups */}
            {photoGroups.map((group) => (
              <div
                key={group.id}
                className="rounded-2xl bg-card border border-border overflow-hidden"
              >
                {/* Simulated photo grid */}
                <div className="grid grid-cols-3 gap-0.5 bg-border">
                  {[...Array(3)].map((_, i) => (
                    <div
                      key={i}
                      className="aspect-square bg-muted flex items-center justify-center"
                    >
                      <Image className="w-8 h-8 text-muted-foreground" />
                    </div>
                  ))}
                </div>
                <div className="p-5">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xl font-bold text-foreground">
                        {group.emoji} {group.title}
                      </p>
                      <p className="text-base text-muted-foreground mt-1">
                        {group.date} · {group.count} 张
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => playStory(group)}
                    className="mt-3 w-full py-4 rounded-xl bg-primary text-primary-foreground text-lg font-bold flex items-center justify-center gap-2 active:scale-95"
                  >
                    <Play className="w-6 h-6" />
                    播放故事
                  </button>
                </div>
              </div>
            ))}
          </>
        )}

        {view === "story" && selectedGroup && (
          <div className="space-y-5 fade-in">
            {/* Now playing */}
            <div className="rounded-2xl bg-card border-2 border-primary/20 p-6 text-center">
              <p className="text-5xl mb-3">{selectedGroup.emoji}</p>
              <p className="text-2xl font-black text-foreground">{selectedGroup.title}</p>
              <p className="text-base text-muted-foreground mt-1">{selectedGroup.date}</p>
            </div>

            {/* Story text */}
            <div className="rounded-2xl bg-accent p-6">
              <p className="text-xl leading-loose text-foreground">{selectedGroup.story}</p>
            </div>

            {/* Playback controls */}
            <div className="flex items-center justify-center gap-6">
              <button
                onClick={() => setIsPlaying(!isPlaying)}
                className="w-20 h-20 rounded-full bg-primary text-primary-foreground flex items-center justify-center active:scale-95"
              >
                {isPlaying ? (
                  <Pause className="w-10 h-10" />
                ) : (
                  <Play className="w-10 h-10 ml-1" />
                )}
              </button>
            </div>

            {isPlaying && (
              <div className="rounded-2xl bg-secondary/15 border border-secondary/30 p-4 text-center fade-in">
                <p className="text-lg text-foreground animate-pulse">
                  🔊 正在为您讲述这段美好回忆...
                </p>
              </div>
            )}

            <div className="flex gap-3">
              <button className="flex-1 py-4 rounded-xl bg-accent text-accent-foreground text-lg font-bold flex items-center justify-center gap-2 active:scale-95">
                <Heart className="w-5 h-5" />
                收藏
              </button>
              <button className="flex-1 py-4 rounded-xl bg-accent text-accent-foreground text-lg font-bold flex items-center justify-center gap-2 active:scale-95">
                <MessageCircle className="w-5 h-5" />
                分享
              </button>
            </div>

            <button
              onClick={() => setView("album")}
              className="w-full elder-button bg-accent text-accent-foreground"
            >
              ← 返回相册
            </button>
          </div>
        )}

        {view === "voices" && (
          <>
            <p className="text-xl font-bold text-foreground">💌 家人的语音留言</p>

            {voiceMessages.map((msg) => (
              <div
                key={msg.id}
                className="rounded-2xl bg-card border border-border p-5"
              >
                <div className="flex items-center justify-between mb-3">
                  <p className="text-xl font-bold text-foreground">{msg.from}</p>
                  <p className="text-base text-muted-foreground">{msg.time}</p>
                </div>
                <p className="text-lg text-foreground mb-3">"{msg.text}"</p>
                <button className="w-full py-3 rounded-xl bg-secondary text-secondary-foreground text-lg font-bold flex items-center justify-center gap-2 active:scale-95">
                  <Play className="w-5 h-5" />
                  播放语音
                </button>
              </div>
            ))}

            <div className="rounded-2xl bg-accent p-5 text-center">
              <p className="text-lg text-accent-foreground font-medium">
                💡 子女可以在自己的微信上给您录制语音留言
              </p>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
