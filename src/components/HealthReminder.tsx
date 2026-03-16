import { useState } from "react";
import { X, Plus, Clock, Pill, Heart, Check, Bell, Trash2 } from "lucide-react";

interface Reminder {
  id: string;
  type: "medication" | "bloodPressure";
  label: string;
  time: string;
  enabled: boolean;
}

const defaultReminders: Reminder[] = [
  { id: "1", type: "medication", label: "降压药", time: "08:00", enabled: true },
  { id: "2", type: "bloodPressure", label: "量血压", time: "09:00", enabled: true },
  { id: "3", type: "medication", label: "降糖药", time: "12:00", enabled: false },
];

export default function HealthReminder({ onClose }: { onClose: () => void }) {
  const [reminders, setReminders] = useState<Reminder[]>(defaultReminders);
  const [showAdd, setShowAdd] = useState(false);
  const [newType, setNewType] = useState<"medication" | "bloodPressure">("medication");
  const [newLabel, setNewLabel] = useState("");
  const [newTime, setNewTime] = useState("08:00");
  const [confirmedId, setConfirmedId] = useState<string | null>(null);

  const toggleReminder = (id: string) => {
    setReminders((prev) =>
      prev.map((r) => (r.id === id ? { ...r, enabled: !r.enabled } : r))
    );
  };

  const deleteReminder = (id: string) => {
    setReminders((prev) => prev.filter((r) => r.id !== id));
  };

  const addReminder = () => {
    if (!newLabel.trim()) return;
    const r: Reminder = {
      id: Date.now().toString(),
      type: newType,
      label: newLabel.trim(),
      time: newTime,
      enabled: true,
    };
    setReminders((prev) => [...prev, r]);
    setNewLabel("");
    setNewTime("08:00");
    setShowAdd(false);
  };

  const simulateReminder = (r: Reminder) => {
    setConfirmedId(r.id);
    setTimeout(() => setConfirmedId(null), 3000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-background flex flex-col fade-in">
      <header className="bg-primary text-primary-foreground px-4 py-4 flex items-center justify-between">
        <h2 className="text-2xl font-bold">⏰ 健康提醒</h2>
        <button
          onClick={onClose}
          className="w-12 h-12 rounded-xl bg-primary-foreground/20 flex items-center justify-center active:scale-95"
        >
          <X className="w-7 h-7" />
        </button>
      </header>

      <div className="flex-1 overflow-y-auto px-4 py-6 space-y-4">
        {/* Status banner */}
        <div className="rounded-2xl bg-secondary/15 border-2 border-secondary/30 p-5">
          <p className="text-xl font-bold text-foreground flex items-center gap-2">
            <Bell className="w-6 h-6 text-secondary" />
            今日提醒
          </p>
          <p className="text-lg text-muted-foreground mt-2">
            已设置 {reminders.filter((r) => r.enabled).length} 个提醒，守护您的健康 💪
          </p>
        </div>

        {/* Reminder list */}
        {reminders.map((r) => (
          <div
            key={r.id}
            className={`rounded-2xl p-5 border-2 transition-all ${
              confirmedId === r.id
                ? "bg-secondary/15 border-secondary"
                : r.enabled
                ? "bg-card border-border"
                : "bg-muted/50 border-border opacity-60"
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div
                  className="w-14 h-14 rounded-2xl flex items-center justify-center"
                  style={{
                    backgroundColor:
                      r.type === "medication"
                        ? "hsl(var(--feature-medication) / 0.15)"
                        : "hsl(var(--feature-health) / 0.15)",
                  }}
                >
                  {r.type === "medication" ? (
                    <Pill
                      className="w-7 h-7"
                      style={{ color: "hsl(var(--feature-medication))" }}
                    />
                  ) : (
                    <Heart
                      className="w-7 h-7"
                      style={{ color: "hsl(var(--feature-health))" }}
                    />
                  )}
                </div>
                <div>
                  <p className="text-xl font-bold text-foreground">{r.label}</p>
                  <p className="text-lg text-muted-foreground flex items-center gap-1">
                    <Clock className="w-5 h-5" />
                    每天 {r.time}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => deleteReminder(r.id)}
                  className="w-10 h-10 rounded-xl flex items-center justify-center text-muted-foreground active:scale-95"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
                <button
                  onClick={() => toggleReminder(r.id)}
                  className={`w-16 h-10 rounded-full transition-colors ${
                    r.enabled ? "bg-secondary" : "bg-muted"
                  } flex items-center ${r.enabled ? "justify-end" : "justify-start"} px-1`}
                >
                  <div className="w-8 h-8 rounded-full bg-primary-foreground shadow" />
                </button>
              </div>
            </div>

            {/* Simulate reminder confirmation */}
            {confirmedId === r.id ? (
              <div className="mt-4 p-4 rounded-xl bg-secondary/20 fade-in">
                <p className="text-lg font-bold text-foreground">
                  🎙️ "{r.label}到时间了，请{r.type === "medication" ? "记得吃药" : "量一下血压"}！"
                </p>
                <div className="flex gap-3 mt-3">
                  <button className="flex-1 py-3 rounded-xl bg-secondary text-secondary-foreground text-lg font-bold active:scale-95">
                    <Check className="w-5 h-5 inline mr-2" />
                    {r.type === "medication" ? "吃了" : "量了"}
                  </button>
                  <button className="flex-1 py-3 rounded-xl bg-accent text-accent-foreground text-lg font-bold active:scale-95">
                    等会儿
                  </button>
                </div>
                <p className="text-base text-muted-foreground mt-2 text-center">
                  10分钟不回应，会通知子女 📱
                </p>
              </div>
            ) : (
              r.enabled && (
                <button
                  onClick={() => simulateReminder(r)}
                  className="mt-3 text-base text-secondary font-medium active:scale-95"
                >
                  👆 点击模拟提醒效果
                </button>
              )
            )}
          </div>
        ))}

        {/* Add new reminder */}
        {showAdd ? (
          <div className="rounded-2xl border-2 border-primary/30 bg-card p-5 space-y-4 fade-in">
            <p className="text-xl font-bold text-foreground">添加新提醒</p>

            <div className="flex gap-3">
              <button
                onClick={() => setNewType("medication")}
                className={`flex-1 py-4 rounded-xl text-lg font-bold active:scale-95 transition-colors ${
                  newType === "medication"
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-muted-foreground"
                }`}
              >
                💊 吃药
              </button>
              <button
                onClick={() => setNewType("bloodPressure")}
                className={`flex-1 py-4 rounded-xl text-lg font-bold active:scale-95 transition-colors ${
                  newType === "bloodPressure"
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-muted-foreground"
                }`}
              >
                ❤️ 量血压
              </button>
            </div>

            <input
              value={newLabel}
              onChange={(e) => setNewLabel(e.target.value)}
              placeholder={newType === "medication" ? "药品名称，如：降压药" : "提醒名称，如：量血压"}
              className="w-full h-16 px-5 rounded-2xl bg-background border border-border text-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            />

            <div className="flex items-center gap-4">
              <label className="text-lg font-bold text-foreground">提醒时间：</label>
              <input
                type="time"
                value={newTime}
                onChange={(e) => setNewTime(e.target.value)}
                className="h-14 px-5 rounded-xl bg-background border border-border text-xl text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setShowAdd(false)}
                className="flex-1 py-4 rounded-xl bg-muted text-muted-foreground text-lg font-bold active:scale-95"
              >
                取消
              </button>
              <button
                onClick={addReminder}
                className="flex-1 py-4 rounded-xl bg-primary text-primary-foreground text-lg font-bold active:scale-95"
              >
                确定添加
              </button>
            </div>
          </div>
        ) : (
          <button
            onClick={() => setShowAdd(true)}
            className="w-full elder-button bg-accent text-accent-foreground flex items-center justify-center gap-3"
          >
            <Plus className="w-7 h-7" />
            <span>添加新提醒</span>
          </button>
        )}

        {/* Health tip */}
        <div className="rounded-2xl bg-accent p-5">
          <p className="text-lg text-accent-foreground font-medium">
            💡 小贴士：坚持按时用药，血压更稳定。如果忘记吃药，不要一次补两顿哦！
          </p>
        </div>
      </div>
    </div>
  );
}
