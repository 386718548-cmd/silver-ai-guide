import { X, Volume2 } from "lucide-react";

const steps = [
  {
    step: "第一步",
    title: "打开助手",
    desc: "在微信里找到「银龄AI助手」，点进来就行",
    emoji: "📱",
  },
  {
    step: "第二步",
    title: "对着手机说话",
    desc: "点橙色大按钮，然后说出您的需求，比如「帮我查药」",
    emoji: "🎙️",
  },
  {
    step: "第三步",
    title: "听它回答",
    desc: "AI会用文字和语音告诉您答案，不用打字也行",
    emoji: "🔊",
  },
  {
    step: "第四步",
    title: "付费很简单",
    desc: "如果需要付费，它会大声告诉您金额，您说「好的」就行",
    emoji: "💰",
  },
];

export default function HelpGuide({ onClose }: { onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 bg-background flex flex-col fade-in">
      <header className="bg-primary text-primary-foreground px-4 py-4 flex items-center justify-between">
        <h2 className="text-2xl font-bold">📖 使用说明书</h2>
        <button
          onClick={onClose}
          className="w-12 h-12 rounded-xl bg-primary-foreground/20 flex items-center justify-center active:scale-95"
        >
          <X className="w-7 h-7" />
        </button>
      </header>

      <div className="flex-1 overflow-y-auto px-4 py-6 space-y-4">
        {/* Audio button */}
        <button className="w-full elder-button bg-secondary text-secondary-foreground flex items-center justify-center gap-4 mb-4">
          <Volume2 className="w-8 h-8" />
          <span>点这里，听语音说明</span>
        </button>

        {steps.map((s, i) => (
          <div key={i} className="rounded-2xl bg-card border border-border p-6 fade-in" style={{ animationDelay: `${i * 100}ms` }}>
            <div className="flex items-start gap-4">
              <span className="text-5xl">{s.emoji}</span>
              <div>
                <p className="text-base font-medium text-primary">{s.step}</p>
                <p className="text-2xl font-bold text-foreground">{s.title}</p>
                <p className="text-lg text-muted-foreground mt-2 leading-relaxed">{s.desc}</p>
              </div>
            </div>
          </div>
        ))}

        {/* Emergency contact */}
        <div className="rounded-2xl bg-destructive/10 border-2 border-destructive/30 p-6 mt-6">
          <p className="text-2xl font-black text-destructive text-center">
            遇到问题？打电话找我们
          </p>
          <p className="text-3xl font-black text-destructive text-center mt-2">
            📞 400-XXX-XXXX
          </p>
          <p className="text-lg text-center text-muted-foreground mt-2">
            服务时间：每天 8:00 - 20:00
          </p>
        </div>

        {/* Tips for children */}
        <div className="rounded-2xl bg-accent p-6">
          <p className="text-xl font-bold text-accent-foreground mb-2">👨‍👩‍👧‍👦 给子女的话</p>
          <p className="text-lg text-accent-foreground leading-relaxed">
            建议您先自己试用一遍，然后耐心教爸妈。可以帮爸妈把这个小程序添加到微信首页，方便他们找到。
          </p>
        </div>
      </div>
    </div>
  );
}
