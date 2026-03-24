import { createContext, useContext, useState, type ReactNode } from 'react';
import { DIALECTS, DEFAULT_DIALECT_ID } from '../data/dialects';
import type { DialectId, DialectConfig } from '../types/theme-dialect';

const STORAGE_KEY = 'silver-ai-dialect';

function readStoredDialectId(): DialectId {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored && DIALECTS.some((d) => d.id === stored)) {
      return stored as DialectId;
    }
  } catch {
    // localStorage 不可用
  }
  return DEFAULT_DIALECT_ID;
}

interface DialectContextValue {
  currentDialect: DialectId;
  setDialect: (id: DialectId) => void;
  dialects: DialectConfig[];
  currentDialectConfig: DialectConfig;
}

const DialectContext = createContext<DialectContextValue | null>(null);

export function DialectProvider({ children }: { children: ReactNode }) {
  const [currentDialect, setCurrentDialect] = useState<DialectId>(readStoredDialectId);

  const setDialect = (id: DialectId) => {
    if (!DIALECTS.some((d) => d.id === id)) return;
    setCurrentDialect(id);
    try {
      localStorage.setItem(STORAGE_KEY, id);
    } catch {
      // 静默失败
    }
  };

  const currentDialectConfig =
    DIALECTS.find((d) => d.id === currentDialect) ??
    DIALECTS.find((d) => d.id === DEFAULT_DIALECT_ID)!;

  return (
    <DialectContext.Provider value={{ currentDialect, setDialect, dialects: DIALECTS, currentDialectConfig }}>
      {children}
    </DialectContext.Provider>
  );
}

export function useDialect(): DialectContextValue {
  const ctx = useContext(DialectContext);
  if (!ctx) throw new Error('useDialect must be used within DialectProvider');
  return ctx;
}
