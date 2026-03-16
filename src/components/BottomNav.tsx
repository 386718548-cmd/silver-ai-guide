import { Home, User, Settings } from "lucide-react";

interface BottomNavProps {
  active: "home" | "profile" | "settings";
  onNavigate: (tab: "home" | "profile" | "settings") => void;
}

export default function BottomNav({ active, onNavigate }: BottomNavProps) {
  const items = [
    { id: "home" as const, icon: Home, label: "首页" },
    { id: "profile" as const, icon: User, label: "我的" },
    { id: "settings" as const, icon: Settings, label: "设置" },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-background border-t border-border">
      <div className="max-w-lg mx-auto flex">
        {items.map((item) => (
          <button
            key={item.id}
            onClick={() => onNavigate(item.id)}
            className={`flex-1 flex flex-col items-center gap-1 py-3 transition-colors active:scale-95 ${
              active === item.id
                ? "text-primary"
                : "text-muted-foreground"
            }`}
          >
            <item.icon className="w-7 h-7" />
            <span className="text-base font-bold">{item.label}</span>
          </button>
        ))}
      </div>
    </nav>
  );
}
