import { useState, useRef, useEffect } from "react";
import { X, Mic, Send, Volume2, MicOff } from "lucide-react";
import { useSpeechRecognition } from "@/hooks/useSpeechRecognition";
import { useDialect } from "@/contexts/DialectContext";

interface Message {
  role: "user" | "assistant";
  content: string;
}

const quickQuestions = [
  "今天天气怎么样？",
  "降压药饭前还是饭后吃？",
  "帮我设个吃药提醒",
  "给孙子讲个故事",
];

// 支持语音识别的方言
const STT_SUPPORTED_DIALECTS = ['mandarin', 'cantonese'];

export default function AIChatDialog({ onClose }: { onClose: () => void }) {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content: "您好！我是您的AI助手 😊\n有什么需要帮忙的，直接说或者打字都行！",
    },
  ]);
  const [input, setInput] = useState("");
  const messagesEnd = useRef<HTMLDivElement>(null);
  const { currentDialectConfig } = useDialect();

  const {
    status,
    transcript,
    error,
    isSupported,
    startListening,
    stopListening,
  } = useSpeechRecognition();

  const isListening = status === "listening" || status === "processing";
  const isSttSupportedForDialect = STT_SUPPORTED_DIALECTS.includes(currentDialectConfig.id);

  useEffect(() => {
    messagesEnd.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // 当识别完成时，自动发送消息
  useEffect(() => {
    if (transcript && status === "idle" && !error) {
      sendMessage(transcript);
    }
  }, [transcript, status, error]);

  // 当有错误时显示
  useEffect(() => {
    if (error) {
      console.error("语音识别错误:", error);
    }
  }, [error]);

  const sendMessage = (text: string) => {
    if (!text.trim()) return;
    const userMsg: Message = { role: "user", content: text.trim() };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");

    // Simulate AI response
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: getSimulatedResponse(text),
        },
      ]);
    }, 1000);
  };

  const toggleListening = () => {
    if (isListening) {
      stopListening();
    } else {
      if (!isSupported) {
        alert("当前浏览器不支持语音识别，请使用打字输入");
        return;
      }
      startListening();
    }
  };

  // 获取提示文字
  const getHintText = () => {
    if (isListening) {
      if (!isSttSupportedForDialect) {
        return `🎙️ 正在聆听... 请用普通话说（${currentDialectConfig.name}语音识别暂不支持）`;
      }
      return `🎙️ 正在聆听，请说${currentDialectConfig.name}...`;
    }
    if (error) {
      return error;
    }
    return null;
  };

  const hintText = getHintText();

  return (
    <div className="fixed inset-0 z-50 bg-background flex flex-col fade-in">
      {/* Header */}
      <header className="bg-primary text-primary-foreground px-4 py-4 flex items-center justify-between">
        <h2 className="text-2xl font-bold">语音助手</h2>
        <button
          onClick={onClose}
          className="w-12 h-12 rounded-xl bg-primary-foreground/20 flex items-center justify-center active:scale-95"
        >
          <X className="w-7 h-7" />
        </button>
      </header>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`max-w-[85%] rounded-2xl px-5 py-4 text-lg leading-relaxed ${
                msg.role === "user"
                  ? "bg-primary text-primary-foreground"
                  : "bg-card text-card-foreground shadow-sm border border-border"
              }`}
            >
              {msg.content}
              {msg.role === "assistant" && (
                <button className="mt-2 flex items-center gap-2 text-base text-muted-foreground">
                  <Volume2 className="w-5 h-5" />
                  <span>点击朗读</span>
                </button>
              )}
            </div>
          </div>
        ))}
        <div ref={messagesEnd} />
      </div>

      {/* Quick questions */}
      <div className="px-4 py-2 flex gap-2 overflow-x-auto">
        {quickQuestions.map((q) => (
          <button
            key={q}
            onClick={() => sendMessage(q)}
            className="whitespace-nowrap px-4 py-3 rounded-xl bg-accent text-accent-foreground text-base font-medium active:scale-95 transition-transform"
          >
            {q}
          </button>
        ))}
      </div>

      {/* Input area */}
      <div className="px-4 py-4 border-t border-border bg-background">
        <div className="flex gap-3 items-center">
          <button
            onClick={toggleListening}
            className={`w-16 h-16 rounded-2xl flex items-center justify-center shrink-0 active:scale-95 transition-all ${
              isListening
                ? "bg-gradient-to-r from-orange-500 to-rose-500 text-white voice-pulse"
                : "bg-gradient-to-r from-teal-500 to-emerald-500 text-white"
            }`}
          >
            {isListening ? (
              <MicOff className="w-8 h-8" />
            ) : (
              <Mic className="w-8 h-8" />
            )}
          </button>
          <input
            value={isListening ? transcript : input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && sendMessage(input)}
            placeholder={isListening ? "正在识别中..." : "打字输入..."}
            disabled={isListening}
            className="flex-1 h-16 px-5 rounded-2xl bg-card border border-border text-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring disabled:opacity-50"
          />
          <button
            onClick={() => sendMessage(input)}
            disabled={isListening || !input.trim()}
            className="w-16 h-16 rounded-2xl bg-gradient-to-r from-orange-500 to-rose-500 text-white flex items-center justify-center shrink-0 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Send className="w-7 h-7" />
          </button>
        </div>
        {hintText && (
          <p className={`text-center text-base font-medium mt-2 ${isListening ? 'text-orange-600 animate-pulse' : 'text-rose-600'}`}>
            {hintText}
          </p>
        )}
      </div>
    </div>
  );
}

function getSimulatedResponse(input: string): string {
  if (input.includes("天气")) return "今天天气晴朗，温度22°C，适合出门散步！记得带件薄外套哦 🌤️";
  if (input.includes("药") || input.includes("吃药")) return "一般降压药建议在早晨起床后服用，饭前饭后都可以，但最好固定时间。具体请遵医嘱哦！💊";
  if (input.includes("提醒")) return "好的！我帮您设好了：每天早上8点提醒您吃药 ⏰ 到时候我会语音提醒您的！";
  if (input.includes("故事")) return "从前有一只小兔子住在山脚下，它每天早起去采蘑菇...🐰 要我继续讲吗？";
  if (input.includes("血压") || input.includes("高血压")) return "高血压要注意：\n1️⃣ 少吃盐，每天不超过6克\n2️⃣ 坚持运动，每天走路30分钟\n3️⃣ 按时吃药，不要自己停药\n4️⃣ 保持好心情，少生气 😊";
  return "好的，我明白了！还有什么需要帮忙的吗？随时跟我说 😊";
}
