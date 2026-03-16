import { useState } from "react";
import { Volume2, Sun, Moon, Type, Bell, Phone, ChevronRight } from "lucide-react";
import { Slider } from "@/components/ui/slider";

export default function SettingsPage() {
  const [fontSize, setFontSize] = useState(18);
  const [volume, setVolume] = useState(80);
  const [darkMode, setDarkMode] = useState(false);

  return (
    <div className="space-y-4">
      <p className="text-2xl font-black text-foreground">⚙️ 设置</p>

      {/* Font size */}
      <div className="rounded-2xl bg-card border border-border p-5 space-y-3">
        <div className="flex items-center justify-between">
          <p className="text-xl font-bold text-foreground flex items-center gap-2">
            <Type className="w-6 h-6" />
            字体大小
          </p>
          <span className="text-xl font-black text-primary">{fontSize}px</span>
        </div>
        <Slider
          value={[fontSize]}
          onValueChange={([v]) => setFontSize(v)}
          min={16}
          max={28}
          step={2}
          className="py-2"
        />
        <div className="flex justify-between text-base text-muted-foreground">
          <span>小</span>
          <span>大</span>
        </div>
        <p style={{ fontSize: `${fontSize}px` }} className="text-foreground mt-2">
          预览效果：这是一段示例文字
        </p>
      </div>

      {/* Volume */}
      <div className="rounded-2xl bg-card border border-border p-5 space-y-3">
        <div className="flex items-center justify-between">
          <p className="text-xl font-bold text-foreground flex items-center gap-2">
            <Volume2 className="w-6 h-6" />
            语音音量
          </p>
          <span className="text-xl font-black text-primary">{volume}%</span>
        </div>
        <Slider
          value={[volume]}
          onValueChange={([v]) => setVolume(v)}
          min={0}
          max={100}
          step={10}
          className="py-2"
        />
      </div>

      {/* Dark mode */}
      <div className="rounded-2xl bg-card border border-border p-5 flex items-center justify-between">
        <p className="text-xl font-bold text-foreground flex items-center gap-2">
          {darkMode ? <Moon className="w-6 h-6" /> : <Sun className="w-6 h-6" />}
          {darkMode ? "深色模式" : "浅色模式"}
        </p>
        <button
          onClick={() => setDarkMode(!darkMode)}
          className={`w-16 h-10 rounded-full transition-colors ${
            darkMode ? "bg-primary" : "bg-muted"
          } flex items-center ${darkMode ? "justify-end" : "justify-start"} px-1`}
        >
          <div className="w-8 h-8 rounded-full bg-primary-foreground shadow" />
        </button>
      </div>

      {/* Other settings */}
      {[
        { icon: Bell, label: "通知设置", desc: "管理提醒方式" },
        { icon: Phone, label: "紧急联系人", desc: "设置紧急电话" },
      ].map((item) => (
        <button
          key={item.label}
          className="w-full flex items-center gap-4 p-5 rounded-2xl bg-card border border-border active:scale-[0.98] transition-transform"
        >
          <item.icon className="w-7 h-7 text-muted-foreground" />
          <div className="flex-1 text-left">
            <p className="text-xl font-bold text-foreground">{item.label}</p>
            <p className="text-base text-muted-foreground">{item.desc}</p>
          </div>
          <ChevronRight className="w-6 h-6 text-muted-foreground" />
        </button>
      ))}

      {/* Help */}
      <div className="rounded-2xl bg-accent p-5 text-center">
        <p className="text-lg text-accent-foreground font-medium">
          遇到问题？拨打客服电话：<strong>400-XXX-XXXX</strong>
        </p>
        <p className="text-base text-muted-foreground mt-1">
          或让子女扫码远程帮忙
        </p>
      </div>
    </div>
  );
}
