import { useState } from "react";
import { Pill, Mic, Heart, BookOpen, Palette, Camera, Phone, HelpCircle } from "lucide-react";
import AIChatDialog from "@/components/AIChatDialog";
import MedicationHelper from "@/components/MedicationHelper";
import HealthReminder from "@/components/HealthReminder";
import HelpGuide from "@/components/HelpGuide";

const features = [
  {
    id: "medication",
    icon: Pill,
    label: "AI 问药",
    desc: "拍照识别药品，语音讲解用法",
    colorVar: "--feature-medication",
  },
  {
    id: "voice",
    icon: Mic,
    label: "语音助手",
    desc: "有什么事，直接说就行",
    colorVar: "--feature-voice",
  },
  {
    id: "health",
    icon: Heart,
    label: "健康提醒",
    desc: "吃药、量血压，到点提醒您",
    colorVar: "--feature-health",
  },
  {
    id: "reading",
    icon: BookOpen,
    label: "阅读放大镜",
    desc: "看不清的字，帮您放大念出来",
    colorVar: "--feature-reading",
  },
  {
    id: "learning",
    icon: Palette,
    label: "兴趣学堂",
    desc: "书法、国画，AI 陪您练",
    colorVar: "--feature-learning",
  },
  {
    id: "album",
    icon: Camera,
    label: "记忆相册",
    desc: "整理照片，讲述您的故事",
    colorVar: "--feature-album",
  },
];

const Index = () => {
  const [activeFeature, setActiveFeature] = useState<string | null>(null);
  const [showHelp, setShowHelp] = useState(false);

  return (
    <div className="min-h-screen bg-background pb-8">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border px-4 py-4">
        <div className="max-w-lg mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-2xl md:text-3xl font-black text-foreground">
              银龄 AI 助手
            </h1>
            <p className="text-base text-muted-foreground">您的贴心生活伙伴</p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => setShowHelp(true)}
              className="w-14 h-14 rounded-2xl bg-accent flex items-center justify-center active:scale-95 transition-transform"
              aria-label="使用帮助"
            >
              <HelpCircle className="w-7 h-7 text-accent-foreground" />
            </button>
            <button
              className="w-14 h-14 rounded-2xl bg-destructive flex items-center justify-center active:scale-95 transition-transform"
              aria-label="紧急求助"
            >
              <Phone className="w-7 h-7 text-destructive-foreground" />
            </button>
          </div>
        </div>
      </header>

      {/* Main voice button */}
      <div className="max-w-lg mx-auto px-4 mt-8 mb-8 fade-in">
        <button
          onClick={() => setActiveFeature("voice")}
          className="w-full elder-button bg-primary text-primary-foreground flex items-center justify-center gap-4 voice-pulse"
        >
          <Mic className="w-8 h-8" />
          <span>按这里，对我说话</span>
        </button>
      </div>

      {/* Feature grid */}
      <div className="max-w-lg mx-auto px-4">
        <div className="grid grid-cols-2 gap-4">
          {features.map((f, i) => (
            <button
              key={f.id}
              onClick={() => setActiveFeature(f.id)}
              className="feature-card bg-card text-card-foreground fade-in"
              style={{ animationDelay: `${i * 80}ms` }}
            >
              <div
                className="feature-icon"
                style={{ backgroundColor: `hsl(var(${f.colorVar}) / 0.15)` }}
              >
                <f.icon
                  className="w-9 h-9 md:w-10 md:h-10"
                  style={{ color: `hsl(var(${f.colorVar}))` }}
                />
              </div>
              <div>
                <p className="feature-label">{f.label}</p>
                <p className="text-base text-muted-foreground mt-1">{f.desc}</p>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Bottom bar */}
      <div className="max-w-lg mx-auto px-4 mt-8">
        <div className="rounded-2xl bg-accent p-5 text-center">
          <p className="text-lg text-accent-foreground font-medium">
            💡 有问题？直接对着手机说话，或者点击上方按钮
          </p>
        </div>
      </div>

      {/* Dialogs */}
      {activeFeature === "voice" && (
        <AIChatDialog onClose={() => setActiveFeature(null)} />
      )}
      {activeFeature === "medication" && (
        <MedicationHelper onClose={() => setActiveFeature(null)} />
      )}
      {activeFeature === "health" && (
        <HealthReminder onClose={() => setActiveFeature(null)} />
      )}
      {showHelp && <HelpGuide onClose={() => setShowHelp(false)} />}
    </div>
  );
};

export default Index;
