import { useState, useEffect } from "react";
import { X, Tv, Music, Radio, BookOpen, Gamepad2, Newspaper, Coffee, Play, Heart, Star, Plus, Trash2, Headphones } from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface Props {
  onClose: () => void;
}

const categories = [
  { id: "戏曲", name: "戏曲", icon: Music, color: "from-rose-400 to-pink-600" },
  { id: "电视", name: "电视直播", icon: Tv, color: "from-blue-400 to-indigo-600" },
  { id: "广播", name: "广播电台", icon: Radio, color: "from-amber-400 to-orange-500" },
  { id: "有声", name: "有声书", icon: BookOpen, color: "from-violet-400 to-purple-600" },
  { id: "新闻", name: "新闻资讯", icon: Newspaper, color: "from-slate-400 to-slate-600" },
  { id: "音乐", name: "经典老歌", icon: Music, color: "from-green-400 to-emerald-600" },
];

// 娱乐应用 - 真实URL
const entertainmentApps = [
  { id: "yangkai", name: "央视频", icon: Tv, color: "from-red-500 to-red-600", desc: "央视所有频道", scheme: "cctvvideo://", webUrl: "https://www.cctv.com/cctvvideo" },
  { id: "xmly", name: "喜马拉雅", icon: Headphones, color: "from-orange-400 to-orange-600", desc: "有声书、电台", scheme: "ximalaya://", webUrl: "https://www.ximalaya.com/" },
  { id: "qqmusic", name: "QQ音乐", icon: Music, color: "from-green-400 to-green-600", desc: "听歌、戏曲", scheme: "qqmusic://", webUrl: "https://y.qq.com/" },
  { id: "douyin", name: "抖音", icon: Play, color: "from-slate-800 to-slate-900", desc: "短视频", scheme: "snssdk1128://", webUrl: "https://www.douyin.com/" },
  { id: "kuaishou", name: "快手", icon: Play, color: "from-purple-500 to-purple-700", desc: "短视频", scheme: "kuaishou://", webUrl: "https://www.kuaishou.com/" },
  { id: "kugou", name: "酷狗音乐", icon: Music, color: "from-teal-400 to-teal-600", desc: "听歌", scheme: "kugou://", webUrl: "https://www.kugou.com/" },
];

// 获取播放历史
const getFavorites = () => {
  try {
    const stored = localStorage.getItem('entertainment_favorites');
    if (stored) {
      return JSON.parse(stored);
    }
  } catch {}
  return [
    { id: "1", title: "京剧选段", type: "戏曲", duration: "5:30", playCount: "1.2万" },
    { id: "2", title: "天气预报", type: "电视", duration: "2:15", playCount: "3.5万" },
    { id: "3", title: "养生堂", type: "电视", duration: "45:00", playCount: "8.9万" },
  ];
};

// 推荐的广播频率
const radioChannels = [
  { name: "中央人民广播电台", frequency: "FM106.1", type: "新闻" },
  { name: "音乐之声", frequency: "FM90.0", type: "音乐" },
  { name: "经典音乐广播", frequency: "FM101.8", type: "音乐" },
];

const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

export default function EntertainmentTools({ onClose }: Props) {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [favorites, setFavorites] = useState(getFavorites());

  const handlePlay = (title: string, type: string) => {
    toast({
      title: `正在播放：${title}`,
      description: `${type}即将开始`,
    });
  };

  const handleOpenApp = (app: typeof entertainmentApps[0]) => {
    if (app.scheme && isMobile) {
      window.location.href = app.scheme;
      setTimeout(() => {
        window.open(app.webUrl, '_blank');
      }, 500);
    } else {
      window.open(app.webUrl, '_blank');
    }
    toast({ title: `正在打开 ${app.name}...` });
  };

  const handleCategoryClick = (categoryId: string) => {
    setSelectedCategory(categoryId);
    
    // 根据分类打开对应的应用
    if (categoryId === "电视") {
      window.open("https://www.cctv.com/cctvvideo", '_blank');
    } else if (categoryId === "广播") {
      window.open("https://www.ximalaya.com/", '_blank');
    } else if (categoryId === "有声") {
      window.open("https://www.ximalaya.com/", '_blank');
    } else if (categoryId === "戏曲" || categoryId === "音乐") {
      window.open("https://y.qq.com/", '_blank');
    } else if (categoryId === "新闻") {
      window.open("https://www.cctv.com/cctvvideo", '_blank');
    }
    
    toast({ title: `正在打开 ${categoryId}...` });
  };

  const handleAddToFavorites = () => {
    const title = prompt("请输入节目名称:");
    if (!title) return;
    const type = prompt("请输入类型（如：戏曲、电视、广播）:") || "其他";
    
    const newItem = {
      id: Date.now().toString(),
      title,
      type,
      duration: "未知",
      playCount: "0",
    };
    
    const updated = [newItem, ...favorites];
    setFavorites(updated);
    localStorage.setItem('entertainment_favorites', JSON.stringify(updated));
    toast({ title: "✅ 已添加到播放列表" });
  };

  const handleDeleteFavorite = (id: string) => {
    if (!confirm("确定要删除吗？")) return;
    const updated = favorites.filter(f => f.id !== id);
    setFavorites(updated);
    localStorage.setItem('entertainment_favorites', JSON.stringify(updated));
  };

  return (
    <div className="fixed inset-0 z-50 bg-gradient-to-b from-violet-50 to-white flex flex-col">
      {/* Header */}
      <header className="bg-gradient-to-r from-violet-500 to-purple-500 text-white px-4 py-5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-white/20 flex items-center justify-center">
            <Tv className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-2xl font-black">休闲娱乐</h2>
            <p className="text-white/80 text-sm">戏曲、电视、广播、有声书</p>
          </div>
        </div>
        <button
          onClick={onClose}
          className="w-12 h-12 rounded-2xl bg-white/20 flex items-center justify-center active:scale-95"
        >
          <X className="w-6 h-6" />
        </button>
      </header>

      <div className="flex-1 overflow-y-auto px-4 py-6 space-y-6">
        {/* 分类导航 */}
        <section>
          <div className="grid grid-cols-3 gap-3">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => handleCategoryClick(cat.id)}
                className="bg-white rounded-2xl p-4 shadow-md active:scale-95 transition-transform flex flex-col items-center gap-2"
              >
                <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${cat.color} flex items-center justify-center shadow-md`}>
                  <cat.icon className="w-7 h-7 text-white" />
                </div>
                <span className="text-base font-bold text-slate-800">{cat.name}</span>
              </button>
            ))}
          </div>
        </section>

        {/* 继续播放 */}
        {favorites.length > 0 && (
          <section>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                <span className="w-2 h-8 bg-violet-500 rounded-full"></span>
                最近播放
              </h3>
              <button onClick={handleAddToFavorites} className="flex items-center gap-1 text-violet-600 font-bold">
                <Plus className="w-4 h-4" /> 添加
              </button>
            </div>
            <div className="space-y-3">
              {favorites.map((item) => (
                <button
                  key={item.id}
                  onClick={() => handlePlay(item.title, item.type)}
                  className="w-full bg-white rounded-2xl p-4 shadow-md active:scale-[0.98] transition-transform flex items-center gap-4"
                >
                  <div className="w-14 h-14 rounded-xl bg-violet-100 flex items-center justify-center">
                    <Play className="w-6 h-6 text-violet-600" />
                  </div>
                  <div className="flex-1">
                    <p className="text-lg font-bold text-slate-800">{item.title}</p>
                    <p className="text-sm text-slate-500">{item.type} · {item.duration}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-slate-400">播放 {item.playCount}</p>
                  </div>
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteFavorite(item.id);
                    }}
                    className="p-2 text-slate-400"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </button>
              ))}
            </div>
          </section>
        )}

        {/* 广播电台 */}
        <section>
          <h3 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-2">
            <span className="w-2 h-8 bg-amber-500 rounded-full"></span>
            广播电台
          </h3>
          <div className="space-y-3">
            {radioChannels.map((channel, i) => (
              <button
                key={i}
                onClick={() => window.open("https://www.ximalaya.com/", '_blank')}
                className="w-full bg-white rounded-2xl p-4 shadow-md active:scale-[0.98] transition-transform flex items-center gap-4"
              >
                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center">
                  <Radio className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1">
                  <p className="text-lg font-bold text-slate-800">{channel.name}</p>
                  <p className="text-sm text-slate-500">{channel.frequency} · {channel.type}</p>
                </div>
                <Play className="w-6 h-6 text-amber-500" />
              </button>
            ))}
          </div>
        </section>

        {/* 更多应用 */}
        <section>
          <h3 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-2">
            <span className="w-2 h-8 bg-pink-500 rounded-full"></span>
            更多应用
          </h3>
          <div className="grid grid-cols-3 gap-3">
            {entertainmentApps.map((app) => (
              <button
                key={app.id}
                onClick={() => handleOpenApp(app)}
                className="bg-white rounded-2xl p-4 shadow-md active:scale-95 transition-transform flex flex-col items-center gap-2"
              >
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${app.color} flex items-center justify-center`}>
                  <app.icon className="w-6 h-6 text-white" />
                </div>
                <span className="text-sm font-bold text-slate-800">{app.name}</span>
              </button>
            ))}
          </div>
        </section>

        {/* 听模式提示 */}
        <div className="bg-gradient-to-r from-violet-100 to-purple-100 rounded-2xl p-4 flex items-center gap-4">
          <Headphones className="w-8 h-8 text-violet-600" />
          <div className="flex-1">
            <p className="text-base font-bold text-slate-800">听模式</p>
            <p className="text-sm text-slate-600">眼睛累了？点击"听"用耳朵享受内容</p>
          </div>
        </div>
      </div>

      {/* 底部提示 */}
      <div className="px-4 py-3 bg-violet-100">
        <p className="text-center text-violet-700 text-base font-medium">
          💡 眼睛累了？可以开启"听"模式
        </p>
      </div>
    </div>
  );
}
