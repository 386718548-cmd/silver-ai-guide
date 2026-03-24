import { useState } from "react";
import { X, ShoppingCart, Store, Pill as Medicine, Coffee, Truck, Star, MapPin, Clock, Search, Plus } from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface Props {
  onClose: () => void;
}

// 购物应用 - 真实URL
const shoppingApps = [
  { id: "ele", name: "饿了么", icon: Coffee, color: "from-orange-400 to-orange-600", desc: "点外卖", scheme: "eleme://", webUrl: "https://www.ele.me/" },
  { id: "mt", name: "美团", icon: Store, color: "from-yellow-400 to-orange-500", desc: "外卖/团购", scheme: "imeituan://", webUrl: "https://www.meituan.com/" },
  { id: "jd", name: "京东", icon: ShoppingCart, color: "from-red-400 to-red-600", desc: "网购", scheme: "openapp.jdmobile://", webUrl: "https://www.jd.com/" },
  { id: "yp", name: "美团买药", icon: Medicine, color: "from-pink-400 to-rose-600", desc: "买药", scheme: null, webUrl: "https://pharmacy.waimai.meituan.com/" },
  { id: "ali", name: "阿里健康", icon: Medicine, color: "from-orange-300 to-orange-500", desc: "买药", scheme: "alipay://", webUrl: "https://www.alihealth.cn/" },
  { id: "tao", name: "淘宝", icon: ShoppingCart, color: "from-orange-400 to-orange-500", desc: "网购", scheme: "taobao://", webUrl: "https://www.taobao.com/" },
];

// 常用药品
const quickBuy = [
  { id: "1", name: "降压药", store: "美团买药", price: "29.9", distance: "2.5km", rating: 4.8, url: "https://pharmacy.waimai.meituan.com/" },
  { id: "2", name: "医用口罩", store: "京东", price: "15.9", distance: "次日达", rating: 4.9, url: "https://item.jd.com/100086924064.html" },
  { id: "3", name: "钙片", store: "阿里健康", price: "68.0", distance: "2.5km", rating: 4.7, url: "https://www.alihealth.cn/" },
  { id: "4", name: "感冒药", store: "美团买药", price: "18.5", distance: "1.5km", rating: 4.6, url: "https://pharmacy.waimai.meituan.com/" },
];

// 附近商家
const nearbyStores = [
  { name: "社区卫生服务站", distance: "500m", type: "药店", rating: 4.6, phone: "12345678901" },
  { name: "大润发超市", distance: "1.2km", type: "超市", rating: 4.5, phone: "" },
  { name: "百姓药房", distance: "800m", type: "药店", rating: 4.4, phone: "12345678902" },
];

const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

export default function ShoppingTools({ onClose }: Props) {
  const [searchText, setSearchText] = useState("");

  const handleOpenApp = (app: typeof shoppingApps[0]) => {
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

  const handleBuyNow = (item: typeof quickBuy[0]) => {
    window.open(item.url, '_blank');
    toast({ title: `正在购买 ${item.name}...`, description: `价格：¥${item.price}` });
  };

  const handleSearch = () => {
    if (!searchText.trim()) return;
    const keyword = encodeURIComponent(searchText);
    window.open(`https://s.taobao.com/search?q=${keyword}`, '_blank');
    toast({ title: `搜索: ${searchText}` });
  };

  const handleCallStore = (store: typeof nearbyStores[0]) => {
    if (store.phone) {
      window.location.href = `tel:${store.phone}`;
      toast({ title: `正在拨打 ${store.name}...` });
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-gradient-to-b from-pink-50 to-white flex flex-col">
      {/* Header */}
      <header className="bg-gradient-to-r from-pink-500 to-rose-500 text-white px-4 py-5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-white/20 flex items-center justify-center">
            <ShoppingCart className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-2xl font-black">网上购物</h2>
            <p className="text-white/80 text-sm">买菜、买药、点外卖</p>
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
            placeholder="想买什么？"
            className="w-full h-14 pl-12 pr-4 rounded-2xl bg-white shadow-md text-lg text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-pink-500"
          />
        </div>

        {/* 常用购物 */}
        <section>
          <h3 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-2">
            <span className="w-2 h-8 bg-pink-500 rounded-full"></span>
            常用应用
          </h3>
          <div className="grid grid-cols-3 gap-3">
            {shoppingApps.map((app) => (
              <button
                key={app.id}
                onClick={() => handleOpenApp(app)}
                className="bg-white rounded-2xl p-4 shadow-lg active:scale-95 transition-transform flex flex-col items-center gap-2"
              >
                <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${app.color} flex items-center justify-center shadow-md`}>
                  <app.icon className="w-7 h-7 text-white" />
                </div>
                <div className="text-center">
                  <p className="text-base font-bold text-slate-800">{app.name}</p>
                </div>
              </button>
            ))}
          </div>
        </section>

        {/* 快速下单 */}
        <section>
          <h3 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-2">
            <span className="w-2 h-8 bg-rose-500 rounded-full"></span>
            常用药品 一键下单
          </h3>
          <div className="space-y-3">
            {quickBuy.map((item) => (
              <button
                key={item.id}
                onClick={() => handleBuyNow(item)}
                className="w-full bg-white rounded-2xl p-4 shadow-md active:scale-[0.98] transition-transform flex items-center gap-4"
              >
                <div className="w-14 h-14 rounded-xl bg-pink-100 flex items-center justify-center">
                  <Medicine className="w-7 h-7 text-pink-600" />
                </div>
                <div className="flex-1">
                  <p className="text-lg font-bold text-slate-800">{item.name}</p>
                  <div className="flex items-center gap-3 mt-1">
                    <span className="text-sm text-slate-500">{item.store}</span>
                    <span className="flex items-center gap-1 text-sm text-amber-500">
                      <Star className="w-3 h-3 fill-current" /> {item.rating}
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-xl font-black text-rose-500">¥{item.price}</p>
                  <p className="text-xs text-slate-400">{item.distance}</p>
                </div>
              </button>
            ))}
          </div>
        </section>

        {/* 附近商家 */}
        <section>
          <h3 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-2">
            <span className="w-2 h-8 bg-orange-500 rounded-full"></span>
            附近商家
          </h3>
          <div className="space-y-3">
            {nearbyStores.map((store, i) => (
              <button
                key={i}
                onClick={() => store.phone ? handleCallStore(store) : handleOpenApp(shoppingApps[0])}
                className="w-full bg-white rounded-2xl p-4 shadow-md active:scale-[0.98] transition-transform flex items-center gap-4"
              >
                <div className="w-12 h-12 rounded-xl bg-orange-100 flex items-center justify-center">
                  <Store className="w-6 h-6 text-orange-600" />
                </div>
                <div className="flex-1">
                  <p className="text-lg font-bold text-slate-800">{store.name}</p>
                  <div className="flex items-center gap-3 mt-1">
                    <span className="text-sm text-slate-500">{store.type}</span>
                    <span className="flex items-center gap-1 text-sm text-amber-500">
                      <Star className="w-3 h-3 fill-current" /> {store.rating}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-1 text-slate-400">
                  <MapPin className="w-4 h-4" />
                  <span className="text-sm">{store.distance}</span>
                </div>
              </button>
            ))}
          </div>
        </section>

        {/* 配送说明 */}
        <div className="bg-gradient-to-r from-pink-100 to-rose-100 rounded-2xl p-4 flex items-center gap-4">
          <Truck className="w-8 h-8 text-pink-600" />
          <div className="flex-1">
            <p className="text-base font-bold text-slate-800">配送说明</p>
            <p className="text-sm text-slate-600">一般30分钟内送达，晚点可联系客服</p>
          </div>
        </div>
      </div>

      {/* 底部提示 */}
      <div className="px-4 py-3 bg-pink-100">
        <p className="text-center text-pink-700 text-base font-medium">
          💡 首次购物建议让家人帮助操作，设置常用地址
        </p>
      </div>
    </div>
  );
}
