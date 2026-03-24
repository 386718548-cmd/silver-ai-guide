import { useState, useEffect, useRef, useCallback } from 'react';
import type { TTSStatus, DialectConfig } from '../types/theme-dialect';
import { XunfeiTTSEngine, isXunfeiConfigured } from '../services/xunfeiTTS';
import { DIALECTS } from '../data/dialects';
import { useDialect } from '../contexts/DialectContext';

export interface UseDialectTTSReturn {
  status: TTSStatus;
  statusMessage: string;
  speak: (text: string) => void;
  stop: () => void;
}

/** 检测 Web Speech API 是否支持指定语言（精确匹配，避免 zh-CN 匹配到 zh-HK） */
function findSupportedVoice(langs: string[]): SpeechSynthesisVoice | null {
  if (!('speechSynthesis' in window)) return null;
  const voices = window.speechSynthesis.getVoices();
  // 第一轮：精确匹配 lang
  for (const lang of langs) {
    const voice = voices.find((v) => v.lang === lang);
    if (voice) return voice;
  }
  // 第二轮：前缀匹配，但只在 langs 本身就是单语言代码（无区域）时才用
  for (const lang of langs) {
    if (lang.includes('-')) continue; // 有区域代码的不做前缀匹配
    const voice = voices.find((v) => v.lang.startsWith(lang));
    if (voice) return voice;
  }
  return null;
}

function speakWithWebSpeech(
  text: string,
  voice: SpeechSynthesisVoice | null,
  lang: string,
  onStart: () => void,
  onEnd: () => void,
  onError: () => void
): SpeechSynthesisUtterance {
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.rate = 0.8;
  utterance.lang = lang;
  if (voice) utterance.voice = voice;
  utterance.onstart = onStart;
  utterance.onend = onEnd;
  utterance.onerror = onError;
  window.speechSynthesis.speak(utterance);
  return utterance;
}

export function useDialectTTS(): UseDialectTTSReturn {
  const { currentDialectConfig } = useDialect();
  const [status, setStatus] = useState<TTSStatus>('idle');
  const [statusMessage, setStatusMessage] = useState('');
  const xunfeiEngineRef = useRef<XunfeiTTSEngine | null>(null);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);
  const isMountedRef = useRef(true);

  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
      stopAll();
    };
  }, []);

  const stopAll = useCallback(() => {
    // 停止 Web Speech API
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    utteranceRef.current = null;
    // 停止讯飞 TTS
    if (xunfeiEngineRef.current) {
      xunfeiEngineRef.current.stop();
      xunfeiEngineRef.current = null;
    }
  }, []);

  const stop = useCallback(() => {
    stopAll();
    if (isMountedRef.current) {
      setStatus('idle');
      setStatusMessage('');
    }
  }, [stopAll]);

  const speak = useCallback(
    (text: string) => {
      stopAll();
      if (!isMountedRef.current) return;

      const dialect: DialectConfig = currentDialectConfig;

      // 尝试 Web Speech API
      if ('speechSynthesis' in window && dialect.webSpeechLangs.length > 0) {
        const voice = findSupportedVoice(dialect.webSpeechLangs);
        const lang = dialect.webSpeechLangs[0];

        if (voice || dialect.id === 'mandarin' || dialect.id === 'hokkien') {
          // 普通话、粤语、闽南语直接尝试 Web Speech API
          setStatus('speaking');
          setStatusMessage(`正在用${dialect.name}朗读...`);

          utteranceRef.current = speakWithWebSpeech(
            text,
            voice,
            lang,
            () => {
              if (isMountedRef.current) {
                setStatus('speaking');
                setStatusMessage(`正在用${dialect.name}朗读...`);
              }
            },
            () => {
              if (isMountedRef.current) {
                setStatus('idle');
                setStatusMessage('');
              }
            },
            () => {
              if (isMountedRef.current) {
                // Web Speech API 出错，尝试降级
                tryXunfeiOrFallback(text, dialect);
              }
            }
          );
          return;
        }
      }

      // Web Speech API 不支持该方言，尝试讯飞 TTS 或回退
      tryXunfeiOrFallback(text, dialect);
    },
    [currentDialectConfig, stopAll]
  );

  const tryXunfeiOrFallback = useCallback(
    async (text: string, dialect: DialectConfig) => {
      if (!isMountedRef.current) return;

      if (isXunfeiConfigured() && dialect.xunfeiVcn) {
        // 使用讯飞 TTS
        setStatus('loading');
        setStatusMessage('正在连接语音服务...');

        const engine = new XunfeiTTSEngine();
        xunfeiEngineRef.current = engine;

        try {
          // 通知用户正在使用在线服务
          if (isMountedRef.current) {
            setStatusMessage('正在使用在线语音服务朗读');
          }
          await engine.speak(text, dialect);
          if (isMountedRef.current) {
            setStatus('speaking');
            setStatusMessage(`正在用${dialect.name}朗读...`);
          }
          // 等待播放完成（speak 已经处理了播放）
          if (isMountedRef.current) {
            setStatus('idle');
            setStatusMessage('');
          }
        } catch (err) {
          if (!isMountedRef.current) return;
          const msg = err instanceof Error ? err.message : '';
          if (msg === 'TIMEOUT') {
            setStatus('error');
            setStatusMessage('语音服务暂时不可用，请稍后重试');
          } else {
            setStatus('error');
            setStatusMessage('语音服务暂时不可用，请稍后重试');
          }
        }
        return;
      }

      // 回退普通话
      fallbackToMandarin(text, dialect);
    },
    []
  );

  const fallbackToMandarin = useCallback(
    (text: string, dialect: DialectConfig) => {
      if (!isMountedRef.current) return;

      if (dialect.fallbackToMandarin) {
        setStatus('speaking');
        setStatusMessage('当前方言暂不可用，已切换为普通话朗读');
      } else {
        setStatus('speaking');
        setStatusMessage(`正在用${dialect.name}朗读...`);
      }

      if (!('speechSynthesis' in window)) {
        if (isMountedRef.current) {
          setStatus('error');
          setStatusMessage('当前浏览器不支持语音朗读');
        }
        return;
      }

      const mandarinDialect = DIALECTS.find((d) => d.id === 'mandarin')!;
      const voice = findSupportedVoice(mandarinDialect.webSpeechLangs);

      utteranceRef.current = speakWithWebSpeech(
        text,
        voice,
        'zh-CN',
        () => {},
        () => {
          if (isMountedRef.current) {
            setStatus('idle');
            setStatusMessage('');
          }
        },
        () => {
          if (isMountedRef.current) {
            setStatus('error');
            setStatusMessage('语音朗读失败，请稍后重试');
          }
        }
      );
    },
    []
  );

  return { status, statusMessage, speak, stop };
}
