// 主题相关类型
export type ThemeId = 'nature' | 'chinese-classic' | 'modern-clean' | 'ink-wellness';

export interface ThemeConfig {
  id: ThemeId;
  name: string;
  description: string;
  colors: {
    primary: string;
    bg: string;
    text: string;
    border: string;
    primaryContrast: string;
  };
  cssVars: Record<string, string>;
}

// 方言相关类型
export type DialectId = 'mandarin' | 'cantonese' | 'hokkien' | 'sichuan' | 'shanghainese' | 'northeastern';

export interface DialectConfig {
  id: DialectId;
  name: string;
  webSpeechLangs: string[];
  xunfeiVcn?: string;
  fallbackToMandarin: boolean;
}

// TTS 状态类型
export type TTSStatus = 'idle' | 'loading' | 'speaking' | 'error';
