import { useState } from "react";
import { X, Camera, Search, Volume2 } from "lucide-react";

const sampleMedications = [
  {
    name: "阿莫西林胶囊",
    usage: "口服，一次0.5克，每6-8小时一次",
    tips: "饭后服用，多喝水",
    warnings: "对青霉素过敏者禁用",
    storage: "密封，阴凉干燥处保存",
  },
  {
    name: "硝苯地平控释片",
    usage: "口服，一次30mg，每日一次",
    tips: "早晨起床后服用，整片吞服，不要掰开",
    warnings: "服药期间不要吃西柚",
    storage: "避光，密封保存",
  },
];

export default function MedicationHelper({ onClose }: { onClose: () => void }) {
  const [searchText, setSearchText] = useState("");
  const [selectedMed, setSelectedMed] = useState<typeof sampleMedications[0] | null>(null);

  const filteredMeds = searchText
    ? sampleMedications.filter((m) => m.name.includes(searchText))
    : sampleMedications;

  return (
    <div className="fixed inset-0 z-50 bg-background flex flex-col fade-in">
      <header className="bg-primary text-primary-foreground px-4 py-4 flex items-center justify-between">
        <h2 className="text-2xl font-bold">💊 AI 问药</h2>
        <button
          onClick={onClose}
          className="w-12 h-12 rounded-xl bg-primary-foreground/20 flex items-center justify-center active:scale-95"
        >
          <X className="w-7 h-7" />
        </button>
      </header>

      <div className="flex-1 overflow-y-auto px-4 py-6 space-y-6">
        {/* Camera button */}
        <button className="w-full elder-button bg-secondary text-secondary-foreground flex items-center justify-center gap-4">
          <Camera className="w-8 h-8" />
          <span>拍照识别药品</span>
        </button>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-6 h-6 text-muted-foreground" />
          <input
            value={searchText}
            onChange={(e) => { setSearchText(e.target.value); setSelectedMed(null); }}
            placeholder="输入药品名称搜索..."
            className="w-full h-16 pl-14 pr-5 rounded-2xl bg-card border border-border text-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
          />
        </div>

        {/* Results */}
        {!selectedMed ? (
          <div className="space-y-3">
            <p className="text-xl font-bold text-foreground">常用药品</p>
            {filteredMeds.map((med) => (
              <button
                key={med.name}
                onClick={() => setSelectedMed(med)}
                className="w-full text-left p-5 rounded-2xl bg-card border border-border active:scale-[0.98] transition-transform"
              >
                <p className="text-xl font-bold text-foreground">{med.name}</p>
                <p className="text-base text-muted-foreground mt-1">{med.usage}</p>
              </button>
            ))}
            {filteredMeds.length === 0 && (
              <div className="text-center py-8">
                <p className="text-xl text-muted-foreground">没有找到相关药品</p>
                <p className="text-lg text-muted-foreground mt-2">试试拍照识别吧 📷</p>
              </div>
            )}
          </div>
        ) : (
          <div className="space-y-4 fade-in">
            <div className="flex items-center justify-between">
              <h3 className="text-2xl font-black text-foreground">{selectedMed.name}</h3>
              <button className="flex items-center gap-2 px-4 py-2 rounded-xl bg-accent text-accent-foreground">
                <Volume2 className="w-5 h-5" />
                <span className="text-base font-medium">朗读</span>
              </button>
            </div>

            <InfoCard title="📋 怎么吃" content={selectedMed.usage} />
            <InfoCard title="💡 小提示" content={selectedMed.tips} />
            <InfoCard title="⚠️ 注意事项" content={selectedMed.warnings} highlight />
            <InfoCard title="📦 怎么存放" content={selectedMed.storage} />

            <button
              onClick={() => setSelectedMed(null)}
              className="w-full elder-button bg-accent text-accent-foreground mt-4"
            >
              ← 返回搜索
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

function InfoCard({ title, content, highlight }: { title: string; content: string; highlight?: boolean }) {
  return (
    <div
      className={`rounded-2xl p-5 ${
        highlight ? "bg-destructive/10 border-2 border-destructive/30" : "bg-card border border-border"
      }`}
    >
      <p className="text-lg font-bold mb-2">{title}</p>
      <p className="text-xl leading-relaxed">{content}</p>
    </div>
  );
}
