import { useState, useEffect } from "react";
import { X, Phone, AlertTriangle, MapPin, Heart, User, Ambulance, Shield } from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface Props {
  onClose: () => void;
}

// 紧急联系人 - 可从本地存储读取
const getQuickContacts = () => {
  try {
    const stored = localStorage.getItem('emergency_contacts');
    if (stored) {
      return JSON.parse(stored);
    }
  } catch {}
  // 默认联系人
  return [
    { id: "1", name: "儿子", phone: "13800008888", relation: "子女" },
    { id: "2", name: "女儿", phone: "13800009999", relation: "子女" },
    { id: "3", name: "老伴", phone: "13800007777", relation: "配偶" },
  ];
};

const emergencyServices = [
  { id: "ambulance", name: "120 急救", phone: "120", icon: Ambulance, desc: "救护车" },
  { id: "police", name: "110 报警", phone: "110", icon: AlertTriangle, desc: "警方" },
  { id: "fire", name: "119 火警", phone: "119", icon: Heart, desc: "消防" },
];

// 社区服务中心
const communityServices = [
  { name: "社区卫生服务中心", phone: "12345678901", address: "距您 500 米" },
  { name: "辖区派出所", phone: "12345678902", address: "距您 1.2 公里" },
];

export default function EmergencyTools({ onClose }: Props) {
  const [selectedContact, setSelectedContact] = useState<string | null>(null);
  const [currentAddress, setCurrentAddress] = useState<string>("正在获取位置...");
  const [quickContacts, setQuickContacts] = useState(getQuickContacts());

  useEffect(() => {
    // 尝试获取当前位置
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setCurrentAddress(`经度:${position.coords.latitude.toFixed(4)}, 纬度:${position.coords.longitude.toFixed(4)}`);
        },
        () => {
          setCurrentAddress("北京市朝阳区某街道");
        }
      );
    }
  }, []);

  const handleCall = (phone: string, name: string) => {
    // 检测是否是手机设备
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
    
    if (isMobile) {
      // 手机端直接拨打
      window.location.href = `tel:${phone}`;
    } else {
      // 电脑端复制号码
      navigator.clipboard.writeText(phone);
      toast({
        title: `📞 ${name} 的电话已复制`,
        description: `号码：${phone}，请在手机上拨打`,
      });
    }
  };

  const handleEmergencyCall = (phone: string, name: string) => {
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
    
    if (isMobile) {
      window.location.href = `tel:${phone}`;
    } else {
      navigator.clipboard.writeText(phone);
      toast({
        title: `🚨 ${name} 已复制`,
        description: `号码：${phone}，请在手机上拨打`,
      });
    }
  };

  const handleAddContact = () => {
    const name = prompt("请输入联系人姓名:");
    if (!name) return;
    const phone = prompt("请输入电话号码:");
    if (!phone) return;
    const relation = prompt("请输入关系（如：子女、配偶、邻居）:") || "其他";
    
    const newContact = {
      id: Date.now().toString(),
      name,
      phone: phone.replace(/\D/g, ''), // 只保留数字
      relation,
    };
    
    const updated = [...quickContacts, newContact];
    setQuickContacts(updated);
    localStorage.setItem('emergency_contacts', JSON.stringify(updated));
    
    toast({
      title: "✅ 已添加联系人",
      description: `${name} - ${phone}`,
    });
  };

  const handleDeleteContact = (id: string) => {
    if (!confirm("确定要删除这个联系人吗？")) return;
    const updated = quickContacts.filter(c => c.id !== id);
    setQuickContacts(updated);
    localStorage.setItem('emergency_contacts', JSON.stringify(updated));
    toast({
      title: "已删除联系人",
    });
  };

  return (
    <div className="fixed inset-0 z-50 bg-gradient-to-b from-rose-50 to-orange-50 flex flex-col">
      {/* Header */}
      <header className="bg-gradient-to-r from-rose-500 to-orange-500 text-white px-4 py-5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-white/20 flex items-center justify-center">
            <AlertTriangle className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-2xl font-black">紧急求助</h2>
            <p className="text-white/80 text-sm">一键呼叫，及时响应</p>
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
        {/* 紧急服务 */}
        <section>
          <h3 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-2">
            <span className="w-2 h-8 bg-rose-500 rounded-full"></span>
            紧急救援
          </h3>
          <div className="grid grid-cols-3 gap-3">
            {emergencyServices.map((service) => (
              <button
                key={service.id}
                onClick={() => handleEmergencyCall(service.phone, service.name)}
                className="bg-white rounded-3xl p-4 shadow-lg active:scale-95 transition-transform flex flex-col items-center gap-2"
              >
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-rose-100 to-rose-200 flex items-center justify-center">
                  <service.icon className="w-8 h-8 text-rose-600" />
                </div>
                <span className="text-lg font-bold text-slate-800">{service.name}</span>
              </button>
            ))}
          </div>
        </section>

        {/* 快速联系人 */}
        <section>
          <h3 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-2">
            <span className="w-2 h-8 bg-orange-500 rounded-full"></span>
            家人联系
          </h3>
          <div className="space-y-3">
            {quickContacts.map((contact) => (
              <button
                key={contact.id}
                onClick={() => handleCall(contact.phone, contact.name)}
                onLongPress={() => handleDeleteContact(contact.id)}
                className="w-full bg-white rounded-2xl p-4 shadow-md active:scale-[0.98] transition-transform flex items-center gap-4"
              >
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-orange-100 to-amber-200 flex items-center justify-center">
                  <User className="w-7 h-7 text-orange-600" />
                </div>
                <div className="flex-1 text-left">
                  <p className="text-xl font-bold text-slate-800">{contact.name}</p>
                  <p className="text-base text-slate-500">{contact.relation} · {contact.phone}</p>
                </div>
                <div className="w-12 h-12 rounded-full bg-green-500 flex items-center justify-center">
                  <Phone className="w-5 h-5 text-white" />
                </div>
              </button>
            ))}
          </div>
        </section>

        {/* 添加更多联系人 */}
        <button 
          onClick={handleAddContact}
          className="w-full h-16 rounded-2xl border-2 border-dashed border-slate-300 bg-white text-xl font-bold text-slate-500 flex items-center justify-center gap-2"
        >
          <span className="text-2xl">+</span> 添加更多联系人
        </button>

        {/* 社区服务 */}
        <section>
          <h3 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-2">
            <span className="w-2 h-8 bg-red-500 rounded-full"></span>
            社区服务
          </h3>
          <div className="space-y-3">
            {communityServices.map((service, i) => (
              <button
                key={i}
                onClick={() => handleCall(service.phone, service.name)}
                className="w-full bg-white rounded-2xl p-4 shadow-md active:scale-[0.98] transition-transform flex items-center gap-4"
              >
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-red-100 to-rose-200 flex items-center justify-center">
                  <Shield className="w-7 h-7 text-red-600" />
                </div>
                <div className="flex-1 text-left">
                  <p className="text-lg font-bold text-slate-800">{service.name}</p>
                  <p className="text-base text-slate-500">{service.address}</p>
                </div>
                <Phone className="w-5 h-5 text-green-500" />
              </button>
            ))}
          </div>
        </section>

        {/* 当前位置 */}
        <div className="bg-white rounded-2xl p-4 shadow-md">
          <div className="flex items-center gap-3">
            <MapPin className="w-6 h-6 text-rose-500" />
            <div>
              <p className="text-base font-bold text-slate-800">当前位置</p>
              <p className="text-sm text-slate-500">{currentAddress}</p>
            </div>
          </div>
        </div>

        {/* 健康信息卡 */}
        <div className="bg-white rounded-2xl p-4 shadow-md">
          <h4 className="text-lg font-bold text-slate-800 mb-3">健康信息卡</h4>
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div>
              <p className="text-slate-500">血型</p>
              <p className="font-bold text-slate-800">A型</p>
            </div>
            <div>
              <p className="text-slate-500">过敏史</p>
              <p className="font-bold text-slate-800">无</p>
            </div>
            <div>
              <p className="text-slate-500">病史</p>
              <p className="font-bold text-slate-800">高血压</p>
            </div>
            <div>
              <p className="text-slate-500">用药</p>
              <p className="font-bold text-slate-800">降压药</p>
            </div>
          </div>
        </div>
      </div>

      {/* 底部提示 */}
      <div className="px-4 py-3 bg-rose-100">
        <p className="text-center text-rose-700 text-base font-medium">
          💡 电脑端点击会复制号码，手机端点击直接拨打
        </p>
      </div>
    </div>
  );
}
