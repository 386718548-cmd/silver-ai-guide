import { useState } from "react";
import { X, Heart, Pill, Plus, Clock, Trash2, Bell, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { toast } from "@/hooks/use-toast";

interface Reminder {
  id: string;
  type: "medication" | "blood_pressure";
  label: string;
  time: string;
  enabled: boolean;
  days: string[];
}

const DAYS = ["一", "二", "三", "四", "五", "六", "日"];

const defaultReminders: Reminder[] = [
  {
    id: "1",
    type: "medication",
    label: "降压药",
    time: "08:00",
    enabled: true,
    days: ["一", "二", "三", "四", "五", "六", "日"],
  },
  {
    id: "2",
    type: "blood_pressure",
    label: "量血压",
    time: "09:00",
    enabled: true,
    days: ["一", "三", "五"],
  },
];

interface Props {
  onClose: () => void;
}

const HealthReminder = ({ onClose }: Props) => {
  const [reminders, setReminders] = useState<Reminder[]>(defaultReminders);
  const [adding, setAdding] = useState(false);
  const [newType, setNewType] = useState<"medication" | "blood_pressure">("medication");
  const [newLabel, setNewLabel] = useState("");
  const [newTime, setNewTime] = useState("08:00");
  const [newDays, setNewDays] = useState<string[]>(["一", "二", "三", "四", "五", "六", "日"]);

  const toggleReminder = (id: string) => {
    setReminders((prev) =>
      prev.map((r) => (r.id === id ? { ...r, enabled: !r.enabled } : r))
    );
  };

  const deleteReminder = (id: string) => {
    setReminders((prev) => prev.filter((r) => r.id !== id));
    toast({ title: "已删除提醒" });
  };

  const toggleDay = (day: string) => {
    setNewDays((prev) =>
      prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day]
    );
  };

  const addReminder = () => {
    if (!newLabel.trim()) {
      toast({ title: "请输入提醒名称", variant: "destructive" });
      return;
    }
    if (newDays.length === 0) {
      toast({ title: "请至少选择一天", variant: "destructive" });
      return;
    }
    const reminder: Reminder = {
      id: Date.now().toString(),
      type: newType,
      label: newLabel.trim(),
      time: newTime,
      enabled: true,
      days: [...newDays],
    };
    setReminders((prev) => [...prev, reminder]);
    setAdding(false);
    setNewLabel("");
    setNewTime("08:00");
    setNewDays(["一", "二", "三", "四", "五", "六", "日"]);
    toast({ title: "✅ 提醒已添加", description: `${reminder.label} - 每天 ${reminder.time}` });
  };

  return (
    <div className="fixed inset-0 z-50 bg-background flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-background border-b border-border px-4 py-4">
        <div className="max-w-lg mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Heart className="w-8 h-8 text-destructive" />
            <h2 className="text-2xl font-black text-foreground">健康提醒</h2>
          </div>
          <button
            onClick={onClose}
            className="w-12 h-12 rounded-2xl bg-muted flex items-center justify-center active:scale-95 transition-transform"
            aria-label="关闭"
          >
            <X className="w-6 h-6 text-muted-foreground" />
          </button>
        </div>
      </header>

      {/* Content */}
      <div className="flex-1 overflow-y-auto px-4 py-6">
        <div className="max-w-lg mx-auto space-y-4">
          {/* Tip */}
          <div className="rounded-2xl bg-accent p-4 text-center">
            <p className="text-lg text-accent-foreground font-medium">
              🔔 到点会语音播报提醒您，10分钟没回应会通知家人
            </p>
          </div>

          {/* Reminder list */}
          {reminders.map((r) => (
            <div
              key={r.id}
              className="rounded-2xl bg-card border border-border p-5 flex items-center gap-4"
            >
              <div
                className="w-14 h-14 rounded-2xl flex items-center justify-center shrink-0"
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
              <div className="flex-1 min-w-0">
                <p className="text-xl font-bold text-foreground truncate">{r.label}</p>
                <div className="flex items-center gap-2 mt-1">
                  <Clock className="w-4 h-4 text-muted-foreground" />
                  <span className="text-lg text-muted-foreground font-medium">{r.time}</span>
                </div>
                <div className="flex gap-1 mt-2 flex-wrap">
                  {r.days.map((d) => (
                    <span
                      key={d}
                      className="text-sm bg-muted text-muted-foreground rounded-lg px-2 py-0.5 font-medium"
                    >
                      周{d}
                    </span>
                  ))}
                </div>
              </div>
              <div className="flex flex-col items-center gap-3 shrink-0">
                <Switch
                  checked={r.enabled}
                  onCheckedChange={() => toggleReminder(r.id)}
                  className="scale-125"
                />
                <button
                  onClick={() => deleteReminder(r.id)}
                  className="text-muted-foreground active:text-destructive transition-colors"
                  aria-label="删除"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            </div>
          ))}

          {/* Add form */}
          {adding ? (
            <div className="rounded-2xl bg-card border-2 border-primary p-5 space-y-5">
              <p className="text-xl font-bold text-foreground">添加新提醒</p>

              {/* Type selection */}
              <div className="flex gap-3">
                <button
                  onClick={() => setNewType("medication")}
                  className={`flex-1 py-4 rounded-2xl text-lg font-bold transition-all ${
                    newType === "medication"
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-muted-foreground"
                  }`}
                >
                  💊 吃药
                </button>
                <button
                  onClick={() => setNewType("blood_pressure")}
                  className={`flex-1 py-4 rounded-2xl text-lg font-bold transition-all ${
                    newType === "blood_pressure"
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-muted-foreground"
                  }`}
                >
                  ❤️ 量血压
                </button>
              </div>

              {/* Name */}
              <div>
                <label className="text-lg font-bold text-foreground block mb-2">
                  提醒名称
                </label>
                <input
                  type="text"
                  value={newLabel}
                  onChange={(e) => setNewLabel(e.target.value)}
                  placeholder={newType === "medication" ? "如：降压药" : "如：量血压"}
                  className="w-full h-14 rounded-2xl border border-border bg-background px-4 text-xl text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              {/* Time */}
              <div>
                <label className="text-lg font-bold text-foreground block mb-2">
                  提醒时间
                </label>
                <input
                  type="time"
                  value={newTime}
                  onChange={(e) => setNewTime(e.target.value)}
                  className="w-full h-14 rounded-2xl border border-border bg-background px-4 text-xl text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              {/* Days */}
              <div>
                <label className="text-lg font-bold text-foreground block mb-2">
                  重复日期
                </label>
                <div className="flex gap-2 flex-wrap">
                  {DAYS.map((d) => (
                    <button
                      key={d}
                      onClick={() => toggleDay(d)}
                      className={`w-12 h-12 rounded-xl text-lg font-bold transition-all ${
                        newDays.includes(d)
                          ? "bg-primary text-primary-foreground"
                          : "bg-muted text-muted-foreground"
                      }`}
                    >
                      {d}
                    </button>
                  ))}
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-3">
                <button
                  onClick={() => setAdding(false)}
                  className="flex-1 h-14 rounded-2xl bg-muted text-muted-foreground text-xl font-bold active:scale-95 transition-transform"
                >
                  取消
                </button>
                <button
                  onClick={addReminder}
                  className="flex-1 h-14 rounded-2xl bg-primary text-primary-foreground text-xl font-bold active:scale-95 transition-transform flex items-center justify-center gap-2"
                >
                  <Check className="w-6 h-6" />
                  确认添加
                </button>
              </div>
            </div>
          ) : (
            <button
              onClick={() => setAdding(true)}
              className="w-full h-16 rounded-2xl border-2 border-dashed border-border bg-card text-xl font-bold text-muted-foreground flex items-center justify-center gap-3 active:scale-[0.98] transition-transform"
            >
              <Plus className="w-7 h-7" />
              添加新提醒
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default HealthReminder;
