import { useState } from "react";
import { BookOpen, ChevronLeft, Volume2, Check } from "lucide-react";
import { lessons, type Lesson } from "@/data/lessons";

export default function LessonsPage() {
  const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(null);
  const [isReading, setIsReading] = useState(false);

  const handleSpeak = (text: string) => {
    if (typeof window === "undefined" || !("speechSynthesis" in window) || typeof SpeechSynthesisUtterance === "undefined") {
      setIsReading(false);
      alert("当前浏览器不支持语音朗读，请换个浏览器或升级系统后再试。");
      return;
    }

    // 停止之前的朗读
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "zh-CN";
    utterance.rate = 0.8; // 放慢语速
    utterance.pitch = 1;

    utterance.onstart = () => setIsReading(true);
    utterance.onend = () => setIsReading(false);
    utterance.onerror = () => setIsReading(false);

    window.speechSynthesis.speak(utterance);
  };

  const handleStop = () => {
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.cancel();
    }
    setIsReading(false);
  };

  if (selectedLesson) {
    return (
      <div className="min-h-screen bg-white pb-8">
        {/* Header */}
        <header className="sticky top-0 z-50 bg-blue-600 text-white px-4 py-6 shadow-lg">
          <div className="max-w-4xl mx-auto flex items-center justify-between">
            <button
              onClick={() => {
                setSelectedLesson(null);
                handleStop();
              }}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/20 hover:bg-white/30 transition-colors"
            >
              <ChevronLeft className="w-6 h-6" />
              <span className="text-lg font-bold">返回</span>
            </button>
          </div>
        </header>

        {/* Content */}
        <div className="max-w-4xl mx-auto px-4 py-8">
          {/* Title */}
          <div className="text-center mb-8">
            <div className="text-6xl mb-4">{selectedLesson.emoji}</div>
            <h1 className="text-4xl font-black text-gray-900 mb-2">
              {selectedLesson.title}
            </h1>
            <div className="flex justify-center gap-6 text-xl text-gray-600 mt-4">
              <span>⏱️ {selectedLesson.duration}</span>
              <span>📊 难度：{selectedLesson.difficulty}/3</span>
            </div>
          </div>

          {/* Audio button */}
          <div className="text-center mb-8">
            <button
              onClick={() => {
                if (isReading) {
                  handleStop();
                } else {
                  const fullText = selectedLesson.sections
                    .map((s) => `${s.heading}。${s.content}`)
                    .join("。");
                  handleSpeak(fullText);
                }
              }}
              className={`elder-button px-8 py-4 text-2xl font-bold rounded-2xl transition-all ${
                isReading
                  ? "bg-red-500 text-white"
                  : "bg-blue-500 text-white hover:bg-blue-600"
              }`}
            >
              <Volume2 className="inline-block mr-3 w-8 h-8" />
              {isReading ? "⏹ 停止朗读" : "🔊 语音朗读全文"}
            </button>
            {isReading && (
              <p className="text-lg text-blue-600 font-bold mt-4 animate-pulse">
                正在为您朗读...
              </p>
            )}
          </div>

          {/* Sections */}
          <div className="space-y-8">
            {selectedLesson.sections.map((section, idx) => (
              <div
                key={idx}
                className="rounded-2xl bg-gray-50 border-2 border-gray-200 p-8"
              >
                <h2 className="text-3xl font-bold text-gray-900 mb-4">
                  {section.heading}
                </h2>

                <p className="text-2xl leading-relaxed text-gray-700 mb-4 whitespace-pre-line">
                  {section.content}
                </p>

                {section.tips && (
                  <div className="mt-6 space-y-3">
                    {section.tips.map((tip, tipIdx) => (
                      <div
                        key={tipIdx}
                        className="flex items-start gap-4 p-4 bg-blue-50 rounded-xl border-l-4 border-blue-500"
                      >
                        <Check className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" />
                        <span className="text-xl text-gray-800">{tip}</span>
                      </div>
                    ))}
                  </div>
                )}

                {section.warning && (
                  <div className="mt-6 p-6 bg-red-50 rounded-xl border-2 border-red-300">
                    <p className="text-xl text-red-800 font-bold whitespace-pre-line">
                      {section.warning}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Next lesson button */}
          {lessons.findIndex((l) => l.id === selectedLesson.id) <
            lessons.length - 1 && (
            <button
              onClick={() => {
                handleStop();
                const nextIdx =
                  lessons.findIndex((l) => l.id === selectedLesson.id) + 1;
                setSelectedLesson(lessons[nextIdx]);
              }}
              className="mt-8 w-full py-4 px-6 rounded-2xl bg-green-600 text-white text-2xl font-bold hover:bg-green-700 transition-colors"
            >
              下一课 →
            </button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-600 to-blue-50 pb-8">
      {/* Hero Section */}
      <header className="bg-blue-600 text-white px-4 py-12 text-center">
        <div className="max-w-4xl mx-auto">
          <div className="text-6xl mb-4">🌟</div>
          <h1 className="text-4xl md:text-5xl font-black mb-4">
            银发 AI 指南
          </h1>
          <p className="text-2xl opacity-90">
            让每位长者都能安全、简单地享受 AI 的便利
          </p>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 py-12">
        {/* Quick Info */}
        <div className="grid md:grid-cols-3 gap-4 mb-12">
          <div className="bg-white rounded-2xl p-6 text-center shadow-lg">
            <div className="text-4xl mb-2">📚</div>
            <p className="text-xl font-bold text-gray-900">5 堂课程</p>
            <p className="text-lg text-gray-600">从入门到安全</p>
          </div>
          <div className="bg-white rounded-2xl p-6 text-center shadow-lg">
            <div className="text-4xl mb-2">🔊</div>
            <p className="text-xl font-bold text-gray-900">语音朗读</p>
            <p className="text-lg text-gray-600">边听边学</p>
          </div>
          <div className="bg-white rounded-2xl p-6 text-center shadow-lg">
            <div className="text-4xl mb-2">⏱️</div>
            <p className="text-xl font-bold text-gray-900">15 分钟</p>
            <p className="text-lg text-gray-600">学完全部课程</p>
          </div>
        </div>

        {/* Course List */}
        <h2 className="text-3xl font-black text-gray-900 mb-6 text-center">
          📖 选择课程
        </h2>

        <div className="grid gap-4">
          {lessons.map((lesson) => (
            <button
              key={lesson.id}
              onClick={() => {
                setSelectedLesson(lesson);
                handleStop();
              }}
              className="w-full text-left rounded-2xl bg-white p-6 shadow-lg hover:shadow-xl hover:scale-105 transition-all border-2 border-transparent hover:border-blue-500"
            >
              <div className="flex items-start gap-4">
                <div className="text-5xl flex-shrink-0">{lesson.emoji}</div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h3 className="text-2xl font-black text-gray-900">
                        第 {lesson.id} 课：{lesson.title}
                      </h3>
                      <p className="text-xl text-gray-600 mt-1">
                        {lesson.description}
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-4 mt-3 flex-wrap">
                    <span className="px-4 py-2 bg-blue-100 text-blue-700 rounded-lg text-lg font-bold">
                      📊 {lesson.category}
                    </span>
                    <span className="px-4 py-2 bg-green-100 text-green-700 rounded-lg text-lg font-bold">
                      {'⭐'.repeat(lesson.difficulty)}
                    </span>
                    <span className="px-4 py-2 bg-orange-100 text-orange-700 rounded-lg text-lg font-bold">
                      ⏱️ {lesson.duration}
                    </span>
                  </div>
                </div>
                <ChevronLeft className="w-8 h-8 text-gray-400 rotate-180 flex-shrink-0 mt-2" />
              </div>
            </button>
          ))}
        </div>

        {/* Tips */}
        <div className="mt-12 bg-yellow-50 rounded-2xl border-2 border-yellow-300 p-6">
          <p className="text-2xl font-bold text-yellow-900 mb-2">
            💡 学习建议
          </p>
          <div className="text-lg text-yellow-800 space-y-2">
            <p>✅ 按照顺序学习，从第 1 课开始</p>
            <p>✅ 每课可以多听几遍，了解更深入</p>
            <p>✅ 第 5 课「防诈骗」特别重要，一定要记住</p>
            <p>✅ 学完后可以分享给家里的其他长者</p>
          </div>
        </div>
      </div>
    </div>
  );
}
