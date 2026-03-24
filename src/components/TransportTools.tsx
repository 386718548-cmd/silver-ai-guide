import { useState, useEffect } from "react";
import { X, Car, Bus, Train, MapPin, Navigation, Clock, Search, Plus, Trash2 } from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface Props {
  onClose: () => void;
}

// 出行应用 - 使用URL Scheme或Universal Links
const transportApps = [
  { 
    id: "didi", 
    name: "滴滴出行", 
    icon: Car, 
    color: "from-orange-400 to-orange-600", 
    desc: "叫出租车/网约车",
    scheme: "diditaxi://",
    webUrl: "https://www.didiglobal.com/",
  },
  { 
    id: "gaode", 
    name: "高德地图", 
    icon: Navigation, 
    color: "from-blue-400 to-blue-600", 
    desc: "导航、公交、打车",
    scheme: "iosamap://",
    webUrl: "https://www.amap.com/",
  },
  { 
    id: "baidu", 
    name: "百度地图", 
    icon: MapPin, 
    color: "from-blue-300 to-blue-500", 
    desc: "导航、公交、打车",
    scheme: "baidumap://",
    webUrl: "https://map.baidu.com/",
  },
  { 
    id: "bus", 
    name: "实时公交", 
    icon: Bus, 
    color: "from-green-400 to-green-600", 
    desc: "查看公交到站时间",
    scheme: null,
    webUrl: "https://www.baidu.com/s?wd=实时公交",
  },
  { 
    id: "train", 
    name: "火车票", 
    icon: Train, 
    color: "from-rose-400 to-rose-600", 
    desc: "购买火车票",
    scheme: null,
    webUrl: "https://www.12306.cn/",
  },
];

// 获取常去地点
const getRecentPlaces = () => {
  try {
    const stored = localStorage.getItem('favorite_places');
    if (stored) {
      return JSON.parse(stored);
    }
  } catch {}
  return [
    { name: "社区卫生服务中心", address: "距您 500 米", type: "医院" },
    { name: "儿子家", address: "距您 2.5 公里", type: "家庭" },
    { name: "菜市场", address: "距您 800 米", type: "购物" },
    { name: "公园", address: "距您 1 公里", type: "休闲" },
  ];
};

export default function TransportTools({ onClose }: Props) {
  const [view] = useState<"home">("home");
  const [searchText, setSearchText] = useState("");
  const [recentPlaces, setRecentPlaces] = useState(getRecentPlaces());

  // 检测是否在移动设备
  const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

  const handleOpenApp = (app: typeof transportApps[0]) => {
    if (app.scheme && isMobile) {
      // 尝试打开APP
      window.location.href = app.scheme;
      // 如果没安装，会跳转失败，这里用setTimeout处理
      setTimeout(() => {
        toast({
          title: `正在打开 ${app.name}...`,
          description: "如未打开将跳转网页版",
        });
        // 跳转到网页版
        window.open(app.webUrl, '_blank');
      }, 500);
    } else {
      // 网页版
      window.open(app.webUrl, '_blank');
      toast({
        title: `正在打开 ${app.name}网页版...`,
      });
    }
  };

  const handleNavigateTo = (place: typeof recentPlaces[0]) => {
    const address = encodeURIComponent(place.name);
    if (isMobile) {
      // 使用高德地图导航
      window.location.href = `iosamap://navi?destination=${address}&name=${place.name}`;
      setTimeout(() => {
        window.open(`https://uri.amap.com/marker?position=&name=${address}&callnative=1`, '_blank');
      }, 500);
    } else {
      window.open(`https://www.amap.com/search?id=&keyword=${address}`, '_blank');
    }
    toast({
      title: `正在导航到 ${place.name}...`,
      description: place.address,
    });
  };

  const handleSearch = () => {
    if (!searchText.trim()) return;
    const keyword = encodeURIComponent(searchText);
    window.open(`https://www.amap.com/search?id=&keyword=${keyword}`, '_blank');
    toast({
      title: `搜索: ${searchText}`,
    });
  };

  const handleAddPlace = () => {
    const name = prompt("请输入地点名称:");
    if (!name) return;
    const address = prompt("请输入地址:") || "";
    const type = prompt("请输入类型（如：家、公司、医院）:") || "其他";
    
    const newPlace = { name, address, type };
    const updated = [...recentPlaces, newPlace];
    setRecentPlaces(updated);
    localStorage.setItem('favorite_places', JSON.stringify(updated));
    
    toast({ title: "✅ 已添加常去地点" });
  };

  const handleDeletePlace = (index: number) => {
    if (!confirm("确定要删除这个地点吗？")) return;
    const updated = recentPlaces.filter((_, i) => i !== index);
    setRecentPlaces(updated);
    localStorage.setItem('favorite_places', JSON.stringify(updated));
  };

  return (
    <div className="fixed inset-0 z-50 bg-gradient-to-b from-sky-50 to-white flex flex-col">
      {/* Header */}
      <header className="bg-gradient-to-r from-sky-500 to-blue-500 text-white px-4 py-5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-white/20 flex items-center justify-center">
            <Car className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-2xl font-black">出行助手</h2>
            <p className="text-white/80 text-sm">打车、公交、导航</p>
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
        {/* 搜索框 */}
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
          <input
            type="text"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            placeholder="想去哪里？"
            className="w-full h-14 pl-12 pr-4 rounded-2xl bg-white shadow-md text-lg text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500"
          />
        </div>

        {/* 常用出行方式 */}
        <section>
          <h3 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-2">
            <span className="w-2 h-8 bg-sky-500 rounded-full"></span>
            常用出行
          </h3>
          <div className="grid grid-cols-2 gap-4">
            {transportApps.map((app) => (
              <button
                key={app.id}
                onClick={() => handleOpenApp(app)}
                className="bg-white rounded-3xl p-5 shadow-lg active:scale-95 transition-transform flex flex-col items-center gap-3"
              >
                <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${app.color} flex items-center justify-center shadow-md`}>
                  <app.icon className="w-8 h-8 text-white" />
                </div>
                <div className="text-center">
                  <p className="text-lg font-bold text-slate-800">{app.name}</p>
                  <p className="text-sm text-slate-500">{app.desc}</p>
                </div>
              </button>
            ))}
          </div>
        </section>

        {/* 常去地点 */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-bold text-slate-800 flex items-center gap-2">
              <span className="w-2 h-8 bg-blue-500 rounded-full"></span>
              常去地点
            </h3>
            <button 
              onClick={handleAddPlace}
              className="flex items-center gap-1 text-sky-600 font-bold"
            >
              <Plus className="w-4 h-4" /> 添加
            </button>
          </div>
          <div className="space-y-3">
            {recentPlaces.map((place, i) => (
              <div
                key={i}
                className="w-full bg-white rounded-2xl p-4 shadow-md flex items-center gap-4"
              >
                <button
                  onClick={() => handleNavigateTo(place)}
                  className="flex-1 flex items-center gap-4 active:scale-[0.98] transition-transform"
                >
                  <div className="w-12 h-12 rounded-xl bg-sky-100 flex items-center justify-center">
                    <MapPin className="w-6 h-6 text-sky-600" />
                  </div>
                  <div className="flex-1 text-left">
                    <p className="text-lg font-bold text-slate-800">{place.name}</p>
                    <p className="text-sm text-slate-500">{place.address}</p>
                  </div>
                  <Navigation className="w-5 h-5 text-sky-500" />
                </button>
                <button 
                  onClick={() => handleDeletePlace(i)}
                  className="p-2 text-slate-400"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            ))}
          </div>
        </section>

        {/* 实用技巧 */}
        <div className="bg-gradient-to-r from-sky-100 to-blue-100 rounded-2xl p-4">
          <h4 className="text-lg font-bold text-slate-800 mb-2">💡 出行小贴士</h4>
          <ul className="text-sm text-slate-600 space-y-1">
            <li>• 点击"高德地图"可直接导航到目的地</li>
            <li>• 添加常去地点，下次一点就出发</li>
            <li>• 不会操作时，可以请家人帮忙设置</li>
          </ul>
        </div>
      </div>

      {/* 底部提示 */}
      <div className="px-4 py-3 bg-sky-100">
        <p className="text-center text-sky-700 text-base font-medium">
          💡 不会使用？可以让家人帮您设置常用地点
        </p>
      </div>
    </div>
  );
}
