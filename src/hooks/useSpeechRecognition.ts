import { useState, useCallback, useRef, useEffect } from 'react';
import { useDialect } from '../contexts/DialectContext';
import { XunfeiIATEngine } from '../services/xunfeiIAT';
import { isXunfeiConfigured } from '../services/xunfeiIAT';

type RecognitionStatus = 'idle' | 'listening' | 'processing' | 'error';

interface UseSpeechRecognitionReturn {
  status: RecognitionStatus;
  transcript: string;
  error: string;
  isSupported: boolean;
  startListening: () => void;
  stopListening: () => void;
}

/** 浏览器语音识别 API 类型定义 */
interface SpeechRecognitionEvent extends Event {
  results: SpeechRecognitionResultList;
  resultIndex: number;
}

interface SpeechRecognitionErrorEvent extends Event {
  error: string;
  message: string;
}

declare global {
  interface Window {
    SpeechRecognition: new () => SpeechRecognition;
    webkitSpeechRecognition: new () => SpeechRecognition;
  }
}

interface SpeechRecognition {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  onresult: ((event: SpeechRecognitionEvent) => void) | null;
  onerror: ((event: SpeechRecognitionErrorEvent) => void) | null;
  onend: (() => void) | null;
  onstart: (() => void) | null;
  start(): void;
  stop(): void;
  abort(): void;
}

/** 需要使用讯飞语音识别的方言 */
const XUNFEI_IAT_DIALECTS = ['hokkien', 'sichuan', 'shanghainese', 'northeastern'];

/** 判断是否应该使用讯飞语音识别 */
function shouldUseXunfei(dialectId: string): boolean {
  return XUNFEI_IAT_DIALECTS.includes(dialectId) && isXunfeiConfigured();
}

export function useSpeechRecognition(): UseSpeechRecognitionReturn {
  const { currentDialectConfig } = useDialect();
  const [status, setStatus] = useState<RecognitionStatus>('idle');
  const [transcript, setTranscript] = useState('');
  const [error, setError] = useState('');
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const xunfeiEngineRef = useRef<XunfeiIATEngine | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  const isSupported = typeof window !== 'undefined' &&
    ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window);

  // 根据方言获取语言代码
  const getLang = useCallback(() => {
    const langMap: Record<string, string> = {
      mandarin: 'zh-CN',
      cantonese: 'zh-HK',
      hokkien: 'zh-CN',
      sichuan: 'zh-CN',
      shanghainese: 'zh-CN',
      northeastern: 'zh-CN',
    };
    return langMap[currentDialectConfig.id] || 'zh-CN';
  }, [currentDialectConfig]);

  // 使用讯飞语音识别
  const startXunfeiRecognition = useCallback(async () => {
    try {
      setStatus('listening');
      setError('');
      setTranscript('');
      audioChunksRef.current = [];

      // 获取麦克风权限并开始录音
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: 'audio/webm;codecs=opus'
      });
      mediaRecorderRef.current = mediaRecorder;

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = async () => {
        setStatus('processing');
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });

        // 转换为WAV格式（讯飞需要）
        const wavBlob = await convertToWav(audioBlob);

        const engine = new XunfeiIATEngine();
        xunfeiEngineRef.current = engine;

        await engine.recognize(
          wavBlob,
          currentDialectConfig.id,
          (text) => {
            setTranscript(text);
          },
          (err) => {
            setError(err);
            setStatus('error');
          }
        );

        setStatus('idle');
        // 关闭麦克风
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorder.start();

      // 5秒后自动停止录音
      setTimeout(() => {
        if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
          mediaRecorderRef.current.stop();
        }
      }, 5000);

    } catch (err) {
      console.error('讯飞识别错误:', err);
      setError('无法访问麦克风，请检查权限设置');
      setStatus('error');
    }
  }, [currentDialectConfig]);

  const startWebSpeechRecognition = useCallback(() => {
    if (!isSupported) {
      setError('当前浏览器不支持语音识别');
      return;
    }

    // 停止之前的识别
    if (recognitionRef.current) {
      recognitionRef.current.abort();
    }

    const SpeechRecognitionClass = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognitionClass();

    recognition.continuous = false;
    recognition.interimResults = true;
    recognition.lang = getLang();

    let finalTranscript = '';

    recognition.onstart = () => {
      setStatus('listening');
      setError('');
      setTranscript('');
    };

    recognition.onresult = (event: SpeechRecognitionEvent) => {
      let interimTranscript = '';
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const result = event.results[i];
        if (result.isFinal) {
          finalTranscript += result[0].transcript;
        } else {
          interimTranscript += result[0].transcript;
        }
      }
      setTranscript(finalTranscript + interimTranscript);
    };

    recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
      console.error('语音识别错误:', event.error);
      if (event.error === 'no-speech') {
        setError('没有检测到语音，请再说一次');
      } else if (event.error === 'not-allowed') {
        setError('请允许麦克风权限');
      } else {
        setError(`识别失败: ${event.error}`);
      }
      setStatus('error');
    };

    recognition.onend = () => {
      if (status === 'listening') {
        setStatus('idle');
      }
      if (!transcript && !error) {
        setError('未识别到语音');
      }
    };

    recognitionRef.current = recognition;
    recognition.start();
  }, [isSupported, getLang, transcript, error, status]);

  const startListening = useCallback(() => {
    // 判断使用哪种识别方式
    if (shouldUseXunfei(currentDialectConfig.id)) {
      startXunfeiRecognition();
    } else {
      startWebSpeechRecognition();
    }
  }, [currentDialectConfig.id, startXunfeiRecognition, startWebSpeechRecognition]);

  const stopListening = useCallback(() => {
    // 停止Web Speech
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      recognitionRef.current = null;
    }
    // 停止讯飞识别
    if (xunfeiEngineRef.current) {
      xunfeiEngineRef.current.stop();
      xunfeiEngineRef.current = null;
    }
    // 停止录音
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
      mediaRecorderRef.current.stop();
    }
    if (status === 'listening' || status === 'processing') {
      setStatus('idle');
    }
  }, [status]);

  // 清理
  useEffect(() => {
    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.abort();
      }
      if (xunfeiEngineRef.current) {
        xunfeiEngineRef.current.stop();
      }
    };
  }, []);

  return {
    status,
    transcript,
    error,
    isSupported,
    startListening,
    stopListening,
  };
}

/** 将 Blob 转换为 WAV 格式 */
async function convertToWav(blob: Blob): Promise<Blob> {
  const arrayBuffer = await blob.arrayBuffer();
  const audioContext = new AudioContext({ sampleRate: 16000 });
  const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);

  // 转换为 WAV
  const wavBuffer = audioBufferToWav(audioBuffer);
  return new Blob([wavBuffer], { type: 'audio/wav' });
}

/** AudioBuffer 转 WAV */
function audioBufferToWav(buffer: AudioBuffer): ArrayBuffer {
  const numChannels = buffer.numberOfChannels;
  const sampleRate = buffer.sampleRate;
  const format = 1; // PCM
  const bitDepth = 16;

  const bytesPerSample = bitDepth / 8;
  const blockAlign = numChannels * bytesPerSample;

  const dataLength = buffer.length * blockAlign;
  const bufferLength = 44 + dataLength;

  const arrayBuffer = new ArrayBuffer(bufferLength);
  const view = new DataView(arrayBuffer);

  // WAV 头
  writeString(view, 0, 'RIFF');
  view.setUint32(4, 36 + dataLength, true);
  writeString(view, 8, 'WAVE');
  writeString(view, 12, 'fmt ');
  view.setUint32(16, 16, true);
  view.setUint16(20, format, true);
  view.setUint16(22, numChannels, true);
  view.setUint32(24, sampleRate, true);
  view.setUint32(28, sampleRate * blockAlign, true);
  view.setUint16(32, blockAlign, true);
  view.setUint16(34, bitDepth, true);
  writeString(view, 36, 'data');
  view.setUint32(40, dataLength, true);

  // 写入音频数据
  const channelData: Float32Array[] = [];
  for (let i = 0; i < numChannels; i++) {
    channelData.push(buffer.getChannelData(i));
  }

  let offset = 44;
  for (let i = 0; i < buffer.length; i++) {
    for (let ch = 0; ch < numChannels; ch++) {
      const sample = Math.max(-1, Math.min(1, channelData[ch][i]));
      view.setInt16(offset, sample < 0 ? sample * 0x8000 : sample * 0x7FFF, true);
      offset += 2;
    }
  }

  return arrayBuffer;
}

function writeString(view: DataView, offset: number, str: string) {
  for (let i = 0; i < str.length; i++) {
    view.setUint8(offset + i, str.charCodeAt(i));
  }
}
