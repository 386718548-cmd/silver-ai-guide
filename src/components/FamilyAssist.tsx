import { useState } from "react";
import { X, Users, Heart, Pill, Clock, Bell, Shield, Phone, ChevronRight, Plus, Check, Activity } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { toast } from "@/hooks/use-toast";

interface FamilyMember {
  id: string;
  name: string;
  relation: string;
  avatar: string;
  lastActive: string;
  healthScore: number;
  reminders: { label: string; time: string; type: "medication" | "blood_pressure"; done: boolean }[];
}

const mockParent: FamilyMember = {
  id: "1",
  name: "妈妈",
  relation: "母亲",
  avatar: "👩‍🦳",
  lastActive: "5分钟前",
  healthScore: 88,
  reminders: [
    { label: "降压药", time: "08:00", type: "medication", done: true },
    { label: "量血压", time: "09:00", type: "blood_pressure", done: true },
    { label: "降糖药", time: "12:00", type: "medication", done: false },
    { label: "钙片", time: "20:00", type: "medication", done: false },
  ],
};

const mockDad: FamilyMember = {
  id: "2",
  name: "爸爸",
  relation: "父亲",
  avatar: "👨‍🦳",
  lastActive: "1小时前",
  healthScore: 82,
  reminders: [
    { label: "降压药", time: "07:30", type: "medication", done: true },
    { label: "量血压", time: "08:30", type: "blood_pressure", done: false },
  ],
};

interface Props {
  onClose: () => void;
}

type View = "list" | "detail" | "add-reminder";

const FamilyAssist = ({ onClose }: Props) => {
  const [view, setView] = useState<View>("list");
  const [selected, setSelected] = useState<FamilyMember | null>(null);
  const [notifyMissed, setNotifyMissed] = useState(true);

  // Add reminder form
  const [newLabel, setNewLabel] = useState("");
  const [newTime, setNewTime] = useState("08:00");
  const [newType, setNewType] = useState<"medication" | "blood_pressure">("medication");

  const members = [mockParent, mockDad];

  const openDetail = (m: FamilyMember) => {
    setSelected(m);
    setView("detail");
  };

  const handleAddReminder = () => {
    if (!newLabel.trim()) {
      toast({ title: "请输入提醒名称", variant: "destructive" });
      return;
    }
    toast({
      title: "✅ 已为" + selected?.name + "添加提醒",
      description: `${newLabel} - 每天 ${newTime}`,
    });
    setNewLabel("");
    setNewTime("08:00");
    setView("detail");
  };

  const handleEmergencyCall = () => {
    toast({ title: "📞 正在拨打" + selected?.name + "的电话…" });
  };

  const getScoreColor = (score: number) => {
    if (score >= 85) return "hsl(var(--feature-health))";
    if (score >= 70) return "hsl(var(--feature-medication))";
    return "hsl(var(--destructive))";
  };

  return (
    <div className="fixed inset-0 z-50 bg-background flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-background border-b border-border px-4 py-4">
        <div className="max-w-lg mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            {view !== "list" ? (
              <button
                onClick={() => setView(view === "add-reminder" ? "detail" : "list")}
                className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center"
              >
                <ChevronRight className="w-5 h-5 text-muted-foreground rotate-180" />
              </button>
            ) : (
              <Users className="w-8 h-8 text-primary" />
            )}
            <h2 className="text-2xl font-black text-foreground">
              {view === "list" && "家人关怀"}
              {view === "detail" && selected?.name}
              {view === "add-reminder" && "添加提醒"}
            </h2>
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
          {/* === Member list === */}
          {view === "list" && (
            <>
              <div className="rounded-2xl bg-accent p-4 text-center">
                <p className="text-lg text-accent-foreground font-medium">
                  👨‍👩‍👧 远程查看父母健康状况，帮他们设置提醒
                </p>
              </div>

              {members.map((m) => {
                const doneCount = m.reminders.filter((r) => r.done).length;
                return (
                  <button
                    key={m.id}
                    onClick={() => openDetail(m)}
                    className="w-full rounded-2xl bg-card border border-border p-5 flex items-center gap-4 active:scale-[0.98] transition-transform text-left"
                  >
                    <div className="text-5xl">{m.avatar}</div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xl font-bold text-foreground">{m.name}</p>
                      <p className="text-base text-muted-foreground">
                        最后活跃：{m.lastActive}
                      </p>
                      <div className="flex items-center gap-2 mt-2">
                        <Activity className="w-4 h-4" style={{ color: getScoreColor(m.healthScore) }} />
                        <span className="text-lg font-bold" style={{ color: getScoreColor(m.healthScore) }}>
                          健康评分 {m.healthScore}
                        </span>
                        <span className="text-base text-muted-foreground ml-2">
                          今日 {doneCount}/{m.reminders.length} 已完成
                        </span>
                      </div>
                    </div>
                    <ChevronRight className="w-6 h-6 text-muted-foreground shrink-0" />
                  </button>
                );
              })}

              <button className="w-full h-16 rounded-2xl border-2 border-dashed border-border bg-card text-xl font-bold text-muted-foreground flex items-center justify-center gap-3 active:scale-[0.98] transition-transform">
                <Plus className="w-7 h-7" />
                绑定新的家人
              </button>

              {/* Settings */}
              <div className="rounded-2xl bg-card border border-border p-5">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-lg font-bold text-foreground">未服药自动通知</p>
                    <p className="text-base text-muted-foreground">提醒后10分钟无回应时通知您</p>
                  </div>
                  <Switch
                    checked={notifyMissed}
                    onCheckedChange={setNotifyMissed}
                    className="scale-125"
                  />
                </div>
              </div>
            </>
          )}

          {/* === Detail view === */}
          {view === "detail" && selected && (
            <>
              {/* Health overview */}
              <div className="rounded-2xl bg-card border border-border p-5 text-center">
                <div className="text-6xl mb-3">{selected.avatar}</div>
                <div
                  className="inline-flex items-center gap-2 px-5 py-2 rounded-full text-2xl font-black"
                  style={{
                    color: getScoreColor(selected.healthScore),
                    backgroundColor: `${getScoreColor(selected.healthScore)}20`,
                  }}
                >
                  <Heart className="w-6 h-6" />
                  {selected.healthScore} 分
                </div>
                <p className="text-base text-muted-foreground mt-2">
                  最后活跃：{selected.lastActive}
                </p>
              </div>

              {/* Today's reminders */}
              <div className="rounded-2xl bg-card border border-border p-5">
                <p className="text-xl font-bold text-foreground mb-4">📋 今日提醒</p>
                <div className="space-y-3">
                  {selected.reminders.map((r, i) => (
                    <div
                      key={i}
                      className={`flex items-center gap-3 p-3 rounded-xl ${
                        r.done ? "bg-muted/50" : "bg-background"
                      }`}
                    >
                      <div
                        className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                        style={{
                          backgroundColor: r.done
                            ? "hsl(var(--muted))"
                            : r.type === "medication"
                            ? "hsl(var(--feature-medication) / 0.15)"
                            : "hsl(var(--feature-health) / 0.15)",
                        }}
                      >
                        {r.done ? (
                          <Check className="w-5 h-5 text-muted-foreground" />
                        ) : r.type === "medication" ? (
                          <Pill className="w-5 h-5" style={{ color: "hsl(var(--feature-medication))" }} />
                        ) : (
                          <Heart className="w-5 h-5" style={{ color: "hsl(var(--feature-health))" }} />
                        )}
                      </div>
                      <div className="flex-1">
                        <p className={`text-lg font-bold ${r.done ? "text-muted-foreground line-through" : "text-foreground"}`}>
                          {r.label}
                        </p>
                      </div>
                      <span className={`text-lg font-medium ${r.done ? "text-muted-foreground" : "text-foreground"}`}>
                        {r.time}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Actions */}
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => setView("add-reminder")}
                  className="h-16 rounded-2xl bg-primary text-primary-foreground text-xl font-bold flex items-center justify-center gap-2 active:scale-95 transition-transform"
                >
                  <Bell className="w-6 h-6" />
                  添加提醒
                </button>
                <button
                  onClick={handleEmergencyCall}
                  className="h-16 rounded-2xl bg-destructive text-destructive-foreground text-xl font-bold flex items-center justify-center gap-2 active:scale-95 transition-transform"
                >
                  <Phone className="w-6 h-6" />
                  拨打电话
                </button>
              </div>

              <div className="rounded-2xl bg-accent p-4 text-center">
                <p className="text-base text-accent-foreground">
                  🔒 数据仅家人可见，已启用隐私保护
                </p>
              </div>
            </>
          )}

          {/* === Add reminder for parent === */}
          {view === "add-reminder" && selected && (
            <div className="space-y-5">
              <div className="rounded-2xl bg-accent p-4 text-center">
                <p className="text-lg text-accent-foreground font-medium">
                  为 {selected.name} 远程添加提醒
                </p>
              </div>

              {/* Type */}
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
                <label className="text-lg font-bold text-foreground block mb-2">提醒名称</label>
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
                <label className="text-lg font-bold text-foreground block mb-2">提醒时间</label>
                <input
                  type="time"
                  value={newTime}
                  onChange={(e) => setNewTime(e.target.value)}
                  className="w-full h-14 rounded-2xl border border-border bg-background px-4 text-xl text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              {/* Actions */}
              <div className="flex gap-3">
                <button
                  onClick={() => setView("detail")}
                  className="flex-1 h-14 rounded-2xl bg-muted text-muted-foreground text-xl font-bold active:scale-95 transition-transform"
                >
                  取消
                </button>
                <button
                  onClick={handleAddReminder}
                  className="flex-1 h-14 rounded-2xl bg-primary text-primary-foreground text-xl font-bold active:scale-95 transition-transform flex items-center justify-center gap-2"
                >
                  <Check className="w-6 h-6" />
                  确认添加
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FamilyAssist;
