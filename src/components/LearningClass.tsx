import { useState } from "react";
import { X, Play, Pause, RotateCw, Volume2, Check } from "lucide-react";

interface Lesson {
  id: string;
  title: string;
  emoji: string;
  duration: string;
  difficulty: string;
  description: string;
  steps: string[];
}

const lessons: Lesson[] = [
  {
    id: "calligraphy",
    title: "毛笔书法",
    emoji: "🖌️",
    duration: "20分钟",
    difficulty: "简单",
    description: "学习基本笔画，从点、横、竖开始",
    steps: [
      "准备好笔、墨、纸",
      "学习基本笔画：点、横、竖、撇、捺",
      "练习简单的字：一、二、三、木",
      "挑战自己写更复杂的字",
    ],
  },
  {
    id: "painting",
    title: "国画入门",
    emoji: "🎨",
    duration: "30分钟",
    difficulty: "中等",
    description: "学习传统国画的基本技法",
    steps: [
      "了解国画工具：毛笔、宣纸、颜料",
      "学习笔法和墨法",
      "练习画竹子、梅花",
      "尝试创作简单风景画",
    ],
  },
  {
    id: "paper-cutting",
    title: "剪纸艺术",
    emoji: "✂️",
    duration: "15分钟",
    difficulty: "简单",
    description: "用剪刀创作美丽的艺术作品",
    steps: [
      "准备彩纸和剪刀",
      "学习基本剪纸图案",
      "从简单的花朵开始",
      "创作属于自己的艺术作品",
    ],
  },
];

export default function LearningClass({ onClose }: { onClose: () => void }) {
  const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(null);
  const [isLearning, setIsLearning] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);

  const handleStartLesson = (lesson: Lesson) => {
    setSelectedLesson(lesson);
    setCurrentStep(0);
    setIsLearning(false);
  };

  const handleNext = () => {
    if (selectedLesson && currentStep < selectedLesson.steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-background flex flex-col fade-in">
      {/* Header */}
      <header className="bg-primary text-primary-foreground px-4 py-4 flex items-center justify-between">
        <h2 className="text-2xl font-bold">
          {selectedLesson ? "🎓 " + selectedLesson.title : "🎓 兴趣学堂"}
        </h2>
        <button
          onClick={() => {
            if (selectedLesson) {
              setSelectedLesson(null);
              setIsLearning(false);
            } else {
              onClose();
            }
          }}
          className="w-12 h-12 rounded-xl bg-primary-foreground/20 flex items-center justify-center active:scale-95"
        >
          <X className="w-7 h-7" />
        </button>
      </header>

      <div className="flex-1 overflow-y-auto px-4 py-6">
        <div className="max-w-lg mx-auto">
          {!selectedLesson ? (
            <>
              {/* Intro tip */}
              <div className="rounded-2xl bg-accent p-4 text-center mb-6">
                <p className="text-lg text-accent-foreground font-medium">
                  🎨 选择您感兴趣的课程，AI 会一步步教您
                </p>
              </div>

              {/* Lesson cards */}
              <div className="space-y-4">
                {lessons.map((lesson) => (
                  <button
                    key={lesson.id}
                    onClick={() => handleStartLesson(lesson)}
                    className="w-full text-left rounded-2xl bg-card border border-border p-6 active:scale-[0.98] transition-transform"
                  >
                    <div className="flex items-start gap-4">
                      <div className="text-5xl">{lesson.emoji}</div>
                      <div className="flex-1 min-w-0">
                        <p className="text-2xl font-bold text-foreground">
                          {lesson.title}
                        </p>
                        <p className="text-base text-muted-foreground mt-1">
                          {lesson.description}
                        </p>
                        <div className="flex gap-4 mt-3 flex-wrap">
                          <span className="text-sm bg-primary/10 text-primary px-3 py-1 rounded-lg font-medium">
                            ⏱️ {lesson.duration}
                          </span>
                          <span className="text-sm bg-accent/10 text-accent px-3 py-1 rounded-lg font-medium">
                            📊 {lesson.difficulty}
                          </span>
                        </div>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </>
          ) : (
            <>
              {/* Lesson detail */}
              <div className="rounded-2xl bg-card border border-border p-6 mb-6">
                <div className="text-6xl text-center mb-4">{selectedLesson.emoji}</div>
                <div className="text-center mb-4">
                  <p className="text-3xl font-black text-foreground">
                    {selectedLesson.title}
                  </p>
                  <p className="text-lg text-muted-foreground mt-2">
                    {selectedLesson.description}
                  </p>
                </div>
              </div>

              {/* Progress */}
              <div className="rounded-2xl bg-muted p-4 mb-6">
                <p className="text-lg font-bold text-foreground text-center">
                  第 {currentStep + 1} / {selectedLesson.steps.length} 步
                </p>
                <div className="w-full h-2 bg-background rounded-full mt-3 overflow-hidden">
                  <div
                    className="h-full bg-primary transition-all"
                    style={{
                      width: `${((currentStep + 1) / selectedLesson.steps.length) * 100}%`,
                    }}
                  />
                </div>
              </div>

              {/* Current step */}
              <div className="rounded-2xl bg-card border-2 border-primary p-6 mb-6">
                <p className="text-xl font-bold text-primary mb-3">
                  📝 第 {currentStep + 1} 步：
                </p>
                <p className="text-2xl leading-relaxed text-foreground">
                  {selectedLesson.steps[currentStep]}
                </p>
              </div>

              {/* Audio button */}
              <button className="w-full elder-button bg-secondary text-secondary-foreground flex items-center justify-center gap-4 mb-6">
                <Volume2 className="w-8 h-8" />
                <span>再读一遍</span>
              </button>

              {/* Navigation */}
              <div className="flex gap-3 mb-6">
                <button
                  onClick={handlePrev}
                  disabled={currentStep === 0}
                  className="flex-1 h-16 rounded-2xl bg-muted text-muted-foreground text-xl font-bold disabled:opacity-50 active:scale-95 transition-transform"
                >
                  ← 上一步
                </button>
                <button
                  onClick={handleNext}
                  disabled={currentStep === selectedLesson.steps.length - 1}
                  className="flex-1 h-16 rounded-2xl bg-primary text-primary-foreground text-xl font-bold disabled:opacity-50 active:scale-95 transition-transform"
                >
                  下一步 →
                </button>
              </div>

              {/* Complete button */}
              {currentStep === selectedLesson.steps.length - 1 && (
                <button className="w-full elder-button bg-accent text-accent-foreground flex items-center justify-center gap-4">
                  <Check className="w-8 h-8" />
                  <span>完成课程</span>
                </button>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
