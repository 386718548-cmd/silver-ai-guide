import { useMemo, useState, useEffect } from "react";
import { lessons, type Lesson } from "./data/lessons";
import { ThemeProvider } from "./contexts/ThemeContext";
import { DialectProvider } from "./contexts/DialectContext";
import { SettingsDialog } from "./components/SettingsDialog";
import { DialectTTSButton } from "./components/DialectTTSButton";

function AppContent() {
  const [activeId, setActiveId] = useState<string>(lessons[0]?.id ?? "1");

  const activeLesson: Lesson | undefined = useMemo(
    () => lessons.find((l) => l.id === activeId),
    [activeId]
  );

  // 切换课程时停止朗读（通过 key 重新挂载 DialectTTSButton）
  const lessonText = activeLesson
    ? activeLesson.title + "。" + activeLesson.content.replace(/<[^>]+>/g, "")
    : "";

  return (
    <div className="min-h-screen" style={{ background: "var(--color-bg)" }}>
      <header
        className="p-6 shadow-lg"
        style={{
          background: "var(--color-primary)",
          color: "var(--color-primary-contrast)",
        }}
      >
        <div className="max-w-5xl mx-auto flex items-center justify-between gap-4">
          <div>
            <h1 className="text-4xl font-bold">🌟 银发 AI 指南</h1>
            <p className="text-xl mt-2 opacity-90">让科技温暖每一位长者</p>
          </div>
          <SettingsDialog
            trigger={
              <button
                style={{
                  minHeight: "44px",
                  minWidth: "44px",
                  padding: "10px 20px",
                  fontSize: "20px",
                  fontWeight: 700,
                  borderRadius: "12px",
                  border: "2px solid rgba(255,255,255,0.6)",
                  background: "rgba(255,255,255,0.15)",
                  color: "var(--color-primary-contrast)",
                  cursor: "pointer",
                  whiteSpace: "nowrap",
                }}
                aria-label="打开设置"
              >
                ⚙️ 设置
              </button>
            }
          />
        </div>
      </header>

      <main className="max-w-5xl mx-auto p-6 grid gap-6 md:grid-cols-[360px_1fr]">
        <section className="elder-card">
          <h2 className="text-2xl font-extrabold mb-4">📚 课程列表</h2>
          <div className="grid gap-3">
            {lessons.map((l) => {
              const isActive = l.id === activeId;
              return (
                <button
                  key={l.id}
                  className="w-full text-left rounded-2xl border-2 px-4 py-4 transition"
                  style={{
                    borderColor: isActive
                      ? "var(--color-primary)"
                      : "var(--color-border)",
                    background: isActive
                      ? "color-mix(in srgb, var(--color-primary) 10%, transparent)"
                      : "white",
                  }}
                  onClick={() => setActiveId(l.id)}
                >
                  <div className="flex items-center justify-between gap-3">
                    <div className="min-w-0">
                      <div className="text-xl font-extrabold truncate">
                        第 {l.id} 课：{l.title}
                      </div>
                      <div className="text-lg opacity-80 mt-1">
                        📌 {l.category} ⭐{"⭐".repeat(l.difficulty)}
                      </div>
                    </div>
                    <span aria-hidden className="text-2xl">
                      →
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </section>

        <section className="elder-card">
          <h2 className="text-2xl font-extrabold mb-4">📖 课程内容</h2>
          {activeLesson ? (
            <>
              {/* 朗读按钮，key 绑定 activeId 确保切换课程时重置状态 */}
              <div style={{ marginBottom: "16px" }}>
                <DialectTTSButton key={activeId} text={lessonText} />
              </div>
              <article
                className="prose max-w-none"
                style={{ fontSize: "22px", lineHeight: 1.9 }}
                dangerouslySetInnerHTML={{ __html: activeLesson.content }}
              />
            </>
          ) : (
            <p>未找到课程内容。</p>
          )}
        </section>
      </main>
    </div>
  );
}

function App() {
  return (
    <ThemeProvider>
      <DialectProvider>
        <AppContent />
      </DialectProvider>
    </ThemeProvider>
  );
}

export default App;
