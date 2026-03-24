import { useState } from "react";
import { X, Camera, Trash2, Heart, Share2, Volume2, MapPin, Calendar } from "lucide-react";

interface Memory {
  id: string;
  emoji: string;
  title: string;
  date: string;
  location: string;
  story: string;
  likes: number;
}

const sampleMemories: Memory[] = [
  {
    id: "1",
    emoji: "👶",
    title: "孙子的第一次笑容",
    date: "2024年2月14日",
    location: "家里客厅",
    story: "那天小宝宝第一次对我笑了，那一刻我的心都融化了。这是我人生中最幸福的时刻之一。",
    likes: 12,
  },
  {
    id: "2",
    emoji: "🌅",
    title: "晨间散步",
    date: "2024年3月10日",
    location: "公园",
    story: "早上5点出门散步，看到了美丽的日出。天气很好，空气很清新，遇见了几个散步的朋友。",
    likes: 8,
  },
  {
    id: "3",
    emoji: "🎂",
    title: "生日派对",
    date: "2024年3月15日",
    location: "家里",
    story: "子女们都回家了，一起给我庆祝生日。吃了美味的蛋糕，全家人一起聊天笑说，很温暖。",
    likes: 15,
  },
];

export default function MemoryAlbum({ onClose }: { onClose: () => void }) {
  const [memories, setMemories] = useState<Memory[]>(sampleMemories);
  const [selectedMemory, setSelectedMemory] = useState<Memory | null>(null);
  const [isEditing, setIsEditing] = useState(false);

  const handleLike = (id: string) => {
    setMemories((prev) =>
      prev.map((m) => (m.id === id ? { ...m, likes: m.likes + 1 } : m))
    );
  };

  const handleDelete = (id: string) => {
    setMemories((prev) => prev.filter((m) => m.id !== id));
    setSelectedMemory(null);
  };

  return (
    <div className="fixed inset-0 z-50 bg-background flex flex-col fade-in">
      {/* Header */}
      <header className="bg-primary text-primary-foreground px-4 py-4 flex items-center justify-between">
        <h2 className="text-2xl font-bold">
          {selectedMemory ? "📖 我的故事" : "📸 记忆相册"}
        </h2>
        <button
          onClick={() => {
            if (selectedMemory) {
              setSelectedMemory(null);
              setIsEditing(false);
            } else {
              onClose();
            }
          }}
          className="w-12 h-12 rounded-xl bg-primary-foreground/20 flex items-center justify-center active:scale-95"
        >
          <X className="w-7 h-7" />
        </button>
      </header>

      <div className="flex-1 overflow-y-auto px-4 py-6">
        <div className="max-w-lg mx-auto">
          {!selectedMemory ? (
            <>
              {/* Intro tip */}
              <div className="rounded-2xl bg-accent p-4 text-center mb-6">
                <p className="text-lg text-accent-foreground font-medium">
                  📸 珍藏您的美好回忆，讲述您的人生故事
                </p>
              </div>

              {/* Add memory button */}
              <button className="w-full elder-button bg-secondary text-secondary-foreground flex items-center justify-center gap-4 mb-6">
                <Camera className="w-8 h-8" />
                <span>上传新照片</span>
              </button>

              {/* Memories grid */}
              <div className="space-y-4">
                {memories.map((memory) => (
                  <button
                    key={memory.id}
                    onClick={() => setSelectedMemory(memory)}
                    className="w-full text-left rounded-2xl bg-card border border-border p-5 active:scale-[0.98] transition-transform"
                  >
                    <div className="flex items-start gap-4">
                      <div className="text-5xl shrink-0">{memory.emoji}</div>
                      <div className="flex-1 min-w-0">
                        <p className="text-2xl font-bold text-foreground truncate">
                          {memory.title}
                        </p>
                        <div className="space-y-1 mt-2">
                          <div className="flex items-center gap-2 text-base text-muted-foreground">
                            <Calendar className="w-4 h-4" />
                            <span>{memory.date}</span>
                          </div>
                          <div className="flex items-center gap-2 text-base text-muted-foreground">
                            <MapPin className="w-4 h-4" />
                            <span>{memory.location}</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-3 mt-3">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleLike(memory.id);
                            }}
                            className="flex items-center gap-1 px-3 py-1 rounded-lg bg-red-50 text-red-600 active:scale-95 transition-transform"
                          >
                            <Heart className="w-4 h-4 fill-current" />
                            <span className="text-sm">{memory.likes}</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </>
          ) : (
            <>
              {/* Memory detail */}
              <div className="mb-6">
                {/* Large emoji */}
                <div className="text-8xl text-center mb-4">{selectedMemory.emoji}</div>

                {/* Title and info */}
                <div className="rounded-2xl bg-card border border-border p-6 mb-4">
                  <p className="text-3xl font-black text-foreground mb-4">
                    {selectedMemory.title}
                  </p>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-lg text-muted-foreground">
                      <Calendar className="w-5 h-5" />
                      <span>{selectedMemory.date}</span>
                    </div>
                    <div className="flex items-center gap-2 text-lg text-muted-foreground">
                      <MapPin className="w-5 h-5" />
                      <span>{selectedMemory.location}</span>
                    </div>
                  </div>
                </div>

                {/* Story */}
                <div className="rounded-2xl bg-card border border-border p-6 mb-6">
                  <p className="text-xl leading-relaxed text-foreground italic">
                    "{selectedMemory.story}"
                  </p>
                </div>

                {/* Audio button */}
                <button className="w-full elder-button bg-secondary text-secondary-foreground flex items-center justify-center gap-4 mb-6">
                  <Volume2 className="w-8 h-8" />
                  <span>为我朗读这个故事</span>
                </button>

                {/* Actions */}
                <div className="grid grid-cols-3 gap-3">
                  <button
                    onClick={() => handleLike(selectedMemory.id)}
                    className="py-4 rounded-2xl bg-red-50 text-red-600 text-xl font-bold flex items-center justify-center gap-2 active:scale-95 transition-transform"
                  >
                    <Heart className="w-6 h-6 fill-current" />
                    <span>{selectedMemory.likes}</span>
                  </button>
                  <button className="py-4 rounded-2xl bg-accent text-accent-foreground text-xl font-bold flex items-center justify-center gap-2 active:scale-95 transition-transform">
                    <Share2 className="w-6 h-6" />
                    分享
                  </button>
                  <button
                    onClick={() => handleDelete(selectedMemory.id)}
                    className="py-4 rounded-2xl bg-destructive/10 text-destructive text-xl font-bold flex items-center justify-center gap-2 active:scale-95 transition-transform"
                  >
                    <Trash2 className="w-6 h-6" />
                    删除
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
