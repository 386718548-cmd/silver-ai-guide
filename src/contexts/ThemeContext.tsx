import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import { THEMES, DEFAULT_THEME_ID } from '../data/themes';
import type { ThemeId, ThemeConfig } from '../types/theme-dialect';

const STORAGE_KEY = 'silver-ai-theme';

function applyThemeToDom(theme: ThemeConfig) {
  try {
    const root = document.documentElement;
    Object.entries(theme.cssVars).forEach(([key, value]) => {
      root.style.setProperty(key, value);
    });
  } catch {
    // 静默失败，保持当前样式
  }
}

function readStoredThemeId(): ThemeId {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored && THEMES.some((t) => t.id === stored)) {
      return stored as ThemeId;
    }
  } catch {
    // localStorage 不可用（如隐私模式）
  }
  return DEFAULT_THEME_ID;
}

interface ThemeContextValue {
  currentTheme: ThemeId;
  setTheme: (id: ThemeId) => void;
  themes: ThemeConfig[];
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [currentTheme, setCurrentTheme] = useState<ThemeId>(() => {
    const id = readStoredThemeId();
    // 在初始化阶段立即注入 CSS 变量，防止 FOUC
    const theme = THEMES.find((t) => t.id === id) ?? THEMES.find((t) => t.id === DEFAULT_THEME_ID)!;
    applyThemeToDom(theme);
    return id;
  });

  useEffect(() => {
    const theme = THEMES.find((t) => t.id === currentTheme);
    if (theme) {
      applyThemeToDom(theme);
    }
  }, [currentTheme]);

  const setTheme = (id: ThemeId) => {
    const theme = THEMES.find((t) => t.id === id);
    if (!theme) return;
    setCurrentTheme(id);
    try {
      localStorage.setItem(STORAGE_KEY, id);
    } catch {
      // 静默失败
    }
    applyThemeToDom(theme);
  };

  return (
    <ThemeContext.Provider value={{ currentTheme, setTheme, themes: THEMES }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme(): ThemeContextValue {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme must be used within ThemeProvider');
  return ctx;
}
