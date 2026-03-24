import { useState } from "react";
import { Pill, Mic, Heart, BookOpen, Palette, Camera, Phone, HelpCircle, Users, GraduationCap, Sparkles, ArrowRight, AlertTriangle, Car, Receipt, ShoppingCart, Tv } from "lucide-react";
import { useNavigate } from "react-router-dom";
import AIChatDialog from "@/components/AIChatDialog";
import MedicationHelper from "@/components/MedicationHelper";
import HealthReminder from "@/components/HealthReminder";
import FamilyAssist from "@/components/FamilyAssist";
import HelpGuide from "@/components/HelpGuide";
import ReadingMagnifier from "@/components/ReadingMagnifier";
import LearningClass from "@/components/LearningClass";
import MemoryAlbum from "@/components/MemoryAlbum";
import EmergencyTools from "@/components/EmergencyTools";
import TransportTools from "@/components/TransportTools";
import FinanceTools from "@/components/FinanceTools";
import ShoppingTools from "@/components/ShoppingTools";
import EntertainmentTools from "@/components/EntertainmentTools";
import { toast } from "@/hooks/use-toast";

const features = [
  {
    id: "medication",
    icon: Pill,
    label: "AI 问药",
    desc: "拍照识别药品，语音讲解用法",
    color: "bg-gradient-to-br from-orange-100 to-orange-200",
    iconColor: "text-orange-600",
  },
  {
    id: "voice",
    icon: Mic,
    label: "语音助手",
    desc: "有什么事，直接说就行",
    color: "bg-gradient-to-br from-teal-100 to-teal-200",
    iconColor: "text-teal-600",
  },
  {
    id: "health",
    icon: Heart,
    label: "健康提醒",
    desc: "吃药、量血压，到点提醒您",
    color: "bg-gradient-to-br from-rose-100 to-rose-200",
    iconColor: "text-rose-600",
  },
  {
    id: "reading",
    icon: BookOpen,
    label: "阅读放大镜",
    desc: "看不清的字，帮您放大念出来",
    color: "bg-gradient-to-br from-violet-100 to-violet-200",
    iconColor: "text-violet-600",
  },
  {
    id: "learning",
    icon: Palette,
    label: "兴趣学堂",
    desc: "书法、国画，AI 陪您练",
    color: "bg-gradient-to-br from-pink-100 to-pink-200",
    iconColor: "text-pink-600",
  },
  {
    id: "album",
    icon: Camera,
    label: "记忆相册",
    desc: "整理照片，讲述您的故事",
    color: "bg-gradient-to-br from-amber-100 to-amber-200",
    iconColor: "text-amber-600",
  },
  {
    id: "family",
    icon: Users,
    label: "家人关怀",
    desc: "子女远程协助，守护健康",
    color: "bg-gradient-to-br from-sky-100 to-sky-200",
    iconColor: "text-sky-600",
  },
  {
    id: "emergency",
    icon: AlertTriangle,
    label: "紧急求助",
    desc: "一键呼叫家人和急救",
    color: "bg-gradient-to-br from-red-100 to-red-200",
    iconColor: "text-red-600",
  },
  {
    id: "transport",
    icon: Car,
    label: "出行助手",
    desc: "打车、公交、导航",
    color: "bg-gradient-to-br from-blue-100 to-blue-200",
    iconColor: "text-blue-600",
  },
  {
    id: "finance",
    icon: Receipt,
    label: "生活缴费",
    desc: "水电燃气、话费等",
    color: "bg-gradient-to-br from-emerald-100 to-emerald-200",
    iconColor: "text-emerald-600",
  },
  {
    id: "shopping",
    icon: ShoppingCart,
    label: "网上购物",
    desc: "买菜、买药、点外卖",
    color: "bg-gradient-to-br from-pink-100 to-pink-200",
    iconColor: "text-pink-600",
  },
  {
    id: "entertainment",
    icon: Tv,
    label: "休闲娱乐",
    desc: "戏曲、电视、广播、有声书",
    color: "bg-gradient-to-br from-violet-100 to-violet-200",
    iconColor: "text-violet-600",
  },
];

const Index = () => {
  const navigate = useNavigate();
  const [activeFeature, setActiveFeature] = useState<string | null>(null);
  const [showHelp, setShowHelp] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 via-orange-50/30 to-white pb-8">
      {/* 装饰背景 */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-32 h-32 bg-orange-200/30 rounded-full blur-3xl" />
        <div className="absolute top-40 right-20 w-40 h-40 bg-amber-200/30 rounded-full blur-3xl" />
        <div className="absolute bottom-40 left-1/4 w-36 h-36 bg-rose-100/30 rounded-full blur-3xl" />
      </div>

      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-orange-100/50 px-4 py-4 shadow-sm">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-orange-400 to-rose-500 flex items-center justify-center shadow-lg">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-black bg-gradient-to-r from-orange-600 to-rose-600 bg-clip-text text-transparent">
                银龄 AI 指南
              </h1>
              <p className="text-base text-slate-500 font-medium">让科技温暖每一位长者</p>
            </div>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => setShowHelp(true)}
              className="py-3 px-5 rounded-2xl bg-gradient-to-r from-orange-400 to-orange-500 text-white font-bold hover:from-orange-500 hover:to-orange-600 transition-all shadow-lg hover:shadow-xl active:scale-95"
            >
              <span className="flex items-center gap-2">
                <HelpCircle className="w-5 h-5" /> 帮助指南
              </span>
            </button>
            <button
              onClick={() => {
                toast({
                  title: "📞 正在拨打紧急求助热线...",
                  description: "400-XXX-XXXX",
                });
              }}
              className="py-3 px-5 rounded-2xl bg-gradient-to-r from-rose-500 to-rose-600 text-white font-bold hover:from-rose-600 hover:to-rose-700 transition-all shadow-lg hover:shadow-xl active:scale-95"
            >
              <span className="flex items-center gap-2">
                <Phone className="w-5 h-5" /> 紧急求助
              </span>
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="max-w-5xl mx-auto px-4 mt-10 mb-8">
        <div className="relative bg-gradient-to-br from-white via-white to-orange-50/50 rounded-[2rem] p-8 md:p-12 shadow-xl border border-orange-100/50 overflow-hidden">
          {/* 装饰 */}
          <div className="absolute -right-10 -top-10 w-40 h-40 bg-gradient-to-br from-orange-200 to-rose-200 rounded-full blur-2xl opacity-50" />

          <div className="relative z-10">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-orange-100 rounded-full mb-4">
              <Sparkles className="w-4 h-4 text-orange-600" />
              <span className="text-orange-700 font-semibold">智能新生活，触手可及</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-black text-slate-800 mb-4 leading-tight">
              您好！<br />
              <span className="bg-gradient-to-r from-orange-500 to-rose-500 bg-clip-text text-transparent">
                让AI帮您生活更轻松
              </span>
            </h2>
            <p className="text-xl text-slate-600 mb-8 max-w-2xl">
              说话就能操作，看不清有放大镜，健康有提醒。简单三步，让科技成为您的生活好帮手。
            </p>
            <button
              onClick={() => setActiveFeature("voice")}
              className="inline-flex items-center gap-3 bg-gradient-to-r from-orange-500 to-rose-500 text-white text-xl font-bold px-8 py-4 rounded-2xl hover:from-orange-600 hover:to-rose-600 transition-all shadow-xl hover:shadow-2xl active:scale-95"
            >
              <Mic className="w-7 h-7" />
              试试语音助手
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </section>

      {/* Quick Actions */}
      <section className="max-w-5xl mx-auto px-4 mb-8">
        <div className="grid md:grid-cols-2 gap-4">
          <button
            onClick={() => navigate("/lessons")}
            className="group relative bg-gradient-to-br from-violet-500 to-indigo-600 rounded-[2rem] p-6 text-left shadow-xl hover:shadow-2xl transition-all overflow-hidden"
          >
            <div className="absolute right-0 top-0 w-32 h-32 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />
            <div className="absolute right-8 bottom-0 w-24 h-24 bg-white/10 rounded-full translate-y-1/2" />
            <div className="relative z-10">
              <div className="w-14 h-14 rounded-2xl bg-white/20 flex items-center justify-center mb-4">
                <GraduationCap className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-2">课程速成</h3>
              <p className="text-white/80 text-base">按步学习 AI 常用技巧，帮助您快速上手</p>
            </div>
          </button>

          <button
            onClick={() => setActiveFeature("family")}
            className="group relative bg-gradient-to-br from-sky-500 to-blue-600 rounded-[2rem] p-6 text-left shadow-xl hover:shadow-2xl transition-all overflow-hidden"
          >
            <div className="absolute right-0 top-0 w-32 h-32 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />
            <div className="absolute right-8 bottom-0 w-24 h-24 bg-white/10 rounded-full translate-y-1/2" />
            <div className="relative z-10">
              <div className="w-14 h-14 rounded-2xl bg-white/20 flex items-center justify-center mb-4">
                <Users className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-2">家人关怀</h3>
              <p className="text-white/80 text-base">子女远程协助，守护您的健康</p>
            </div>
          </button>
        </div>
      </section>

      {/* Feature grid */}
      <section className="max-w-5xl mx-auto px-4">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-1 h-8 bg-gradient-to-b from-orange-500 to-rose-500 rounded-full" />
          <h2 className="text-2xl md:text-3xl font-black text-slate-800">实用功能</h2>
        </div>
        <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-5">
          {features.map((f) => (
            <button
              key={f.id}
              onClick={() => setActiveFeature(f.id)}
              className={`${f.color} rounded-3xl p-5 text-left shadow-md hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 group`}
            >
              <div className="flex items-center gap-4 mb-4">
                <div className="w-14 h-14 rounded-2xl bg-white shadow-md flex items-center justify-center group-hover:scale-110 transition-transform">
                  <f.icon className={`w-7 h-7 ${f.iconColor}`} />
                </div>
                <h3 className="text-xl font-black text-slate-800">{f.label}</h3>
              </div>
              <p className="text-base text-slate-600 font-medium pl-2">{f.desc}</p>
            </button>
          ))}
        </div>
      </section>

      {/* Bottom tip */}
      <div className="max-w-lg mx-auto px-4 mt-10">
        <div className="rounded-3xl bg-gradient-to-r from-orange-100 to-rose-100 p-6 text-center border border-orange-200">
          <p className="text-lg text-slate-700 font-medium">
            💡 有问题？点击上方按钮，或者让家人帮您设置
          </p>
        </div>
      </div>

      {/* Dialogs */}
      {activeFeature === "voice" && <AIChatDialog onClose={() => setActiveFeature(null)} />}
      {activeFeature === "medication" && <MedicationHelper onClose={() => setActiveFeature(null)} />}
      {activeFeature === "health" && <HealthReminder onClose={() => setActiveFeature(null)} />}
      {activeFeature === "family" && <FamilyAssist onClose={() => setActiveFeature(null)} />}
      {activeFeature === "reading" && <ReadingMagnifier onClose={() => setActiveFeature(null)} />}
      {activeFeature === "learning" && <LearningClass onClose={() => setActiveFeature(null)} />}
      {activeFeature === "album" && <MemoryAlbum onClose={() => setActiveFeature(null)} />}
      {activeFeature === "emergency" && <EmergencyTools onClose={() => setActiveFeature(null)} />}
      {activeFeature === "transport" && <TransportTools onClose={() => setActiveFeature(null)} />}
      {activeFeature === "finance" && <FinanceTools onClose={() => setActiveFeature(null)} />}
      {activeFeature === "shopping" && <ShoppingTools onClose={() => setActiveFeature(null)} />}
      {activeFeature === "entertainment" && <EntertainmentTools onClose={() => setActiveFeature(null)} />}
      {showHelp && <HelpGuide onClose={() => setShowHelp(false)} />}
    </div>
  );
};

export default Index;
