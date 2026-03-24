import type { ThemeConfig, ThemeId } from '../types/theme-dialect';

export const THEMES: ThemeConfig[] = [
  {
    id: 'nature',
    name: '自然草本风',
    description: '清新自然，舒缓眼睛',
    colors: {
      primary: '#4a7c59',
      bg: '#f5f0e8',
      text: '#2d2416',
      border: '#c8dcc0',
      primaryContrast: '#ffffff',
    },
    cssVars: {
      '--color-primary': '#4a7c59',
      '--color-bg': '#f5f0e8',
      '--color-text': '#2d2416',
      '--color-border': '#c8dcc0',
      '--color-primary-contrast': '#ffffff',
    },
  },
  {
    id: 'chinese-classic',
    name: '中华传统风',
    description: '古典雅致，文化底蕴',
    colors: {
      primary: '#c0392b',
      bg: '#fdf6ec',
      text: '#1a0a00',
      border: '#d4a853',
      primaryContrast: '#ffffff',
    },
    cssVars: {
      '--color-primary': '#c0392b',
      '--color-bg': '#fdf6ec',
      '--color-text': '#1a0a00',
      '--color-border': '#d4a853',
      '--color-primary-contrast': '#ffffff',
    },
  },
  {
    id: 'modern-clean',
    name: '现代简约风',
    description: '简洁明快，清晰易读',
    colors: {
      primary: '#0891b2',
      bg: '#ffffff',
      text: '#1a1a1a',
      border: '#d1d5db',
      primaryContrast: '#ffffff',
    },
    cssVars: {
      '--color-primary': '#0891b2',
      '--color-bg': '#ffffff',
      '--color-text': '#1a1a1a',
      '--color-border': '#d1d5db',
      '--color-primary-contrast': '#ffffff',
    },
  },
  {
    id: 'ink-wellness',
    name: '水墨养生风',
    description: '沉稳内敛，养眼护目',
    colors: {
      primary: '#2c3e50',
      bg: '#f4ede0',
      text: '#2c1810',
      border: '#c9b99a',
      primaryContrast: '#ffffff',
    },
    cssVars: {
      '--color-primary': '#2c3e50',
      '--color-bg': '#f4ede0',
      '--color-text': '#2c1810',
      '--color-border': '#c9b99a',
      '--color-primary-contrast': '#ffffff',
    },
  },
];

export const THEME_IDS: ThemeId[] = THEMES.map((t) => t.id);

export const DEFAULT_THEME_ID: ThemeId = 'modern-clean';
