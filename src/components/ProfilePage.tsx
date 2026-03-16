import { User, CreditCard, Shield, Phone, ChevronRight } from "lucide-react";

export default function ProfilePage() {
  const menuItems = [
    { icon: CreditCard, label: "我的会员", desc: "基础版（免费）", color: "hsl(var(--feature-medication))" },
    { icon: Shield, label: "健康档案", desc: "已记录 30 天", color: "hsl(var(--feature-health))" },
    { icon: Phone, label: "紧急联系人", desc: "已设置 2 人", color: "hsl(var(--destructive))" },
    { icon: User, label: "子女绑定", desc: "已绑定 1 人", color: "hsl(var(--feature-voice))" },
  ];

  return (
    <div className="space-y-5">
      {/* User card */}
      <div className="rounded-2xl bg-card border border-border p-6 flex items-center gap-5">
        <div className="w-20 h-20 rounded-full bg-primary/15 flex items-center justify-center">
          <User className="w-10 h-10 text-primary" />
        </div>
        <div>
          <p className="text-2xl font-black text-foreground">张爷爷</p>
          <p className="text-lg text-muted-foreground">已使用 30 天</p>
        </div>
      </div>

      {/* Usage stats */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { num: "42", label: "问药次数" },
          { num: "30", label: "坚持天数" },
          { num: "85", label: "张照片" },
        ].map((s) => (
          <div key={s.label} className="rounded-xl bg-card border border-border p-4 text-center">
            <p className="text-2xl font-black text-primary">{s.num}</p>
            <p className="text-base text-muted-foreground">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Menu items */}
      {menuItems.map((item) => (
        <button
          key={item.label}
          className="w-full flex items-center gap-4 p-5 rounded-2xl bg-card border border-border active:scale-[0.98] transition-transform"
        >
          <div
            className="w-12 h-12 rounded-xl flex items-center justify-center"
            style={{ backgroundColor: `${item.color}20` }}
          >
            <item.icon className="w-6 h-6" style={{ color: item.color }} />
          </div>
          <div className="flex-1 text-left">
            <p className="text-xl font-bold text-foreground">{item.label}</p>
            <p className="text-base text-muted-foreground">{item.desc}</p>
          </div>
          <ChevronRight className="w-6 h-6 text-muted-foreground" />
        </button>
      ))}

      {/* Membership promo */}
      <div className="rounded-2xl bg-primary/10 border-2 border-primary/20 p-5 text-center">
        <p className="text-xl font-bold text-foreground">🎁 升级会员，享无限次 AI 问药</p>
        <p className="text-lg text-muted-foreground mt-1">月卡仅 9.9 元，子女可代付</p>
        <button className="mt-3 px-8 py-4 rounded-xl bg-primary text-primary-foreground text-lg font-bold active:scale-95">
          立即开通
        </button>
      </div>
    </div>
  );
}
