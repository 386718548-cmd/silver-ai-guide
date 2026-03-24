import type { DialectConfig, DialectId } from '../types/theme-dialect';

export const DIALECTS: DialectConfig[] = [
  {
    id: 'mandarin',
    name: '普通话',
    webSpeechLangs: ['zh-CN'],
    xunfeiVcn: undefined,
    fallbackToMandarin: false,
  },
  {
    id: 'cantonese',
    name: '粤语（广东话）',
    webSpeechLangs: ['zh-HK', 'yue'],
    xunfeiVcn: 'x_xiaomei',
    fallbackToMandarin: true,
  },
  {
    id: 'hokkien',
    name: '闽南语（台湾话）',
    webSpeechLangs: ['zh-TW'],
    xunfeiVcn: 'x_hokkien',
    fallbackToMandarin: true,
  },
  {
    id: 'sichuan',
    name: '四川话',
    webSpeechLangs: [],
    xunfeiVcn: 'x_sichuan',
    fallbackToMandarin: true,
  },
  {
    id: 'shanghainese',
    name: '上海话',
    webSpeechLangs: [],
    xunfeiVcn: 'x_shanghai',
    fallbackToMandarin: true,
  },
  {
    id: 'northeastern',
    name: '东北话',
    webSpeechLangs: [],
    xunfeiVcn: 'x_dongbei',
    fallbackToMandarin: true,
  },
];

export const DIALECT_IDS: DialectId[] = DIALECTS.map((d) => d.id);

export const DEFAULT_DIALECT_ID: DialectId = 'mandarin';
