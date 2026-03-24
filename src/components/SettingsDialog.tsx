import type { ReactNode } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from './ui/dialog';
import { ThemeSelector } from './ThemeSelector';
import { useDialect } from '../contexts/DialectContext';
import type { DialectId } from '../types/theme-dialect';

interface SettingsDialogProps {
  trigger: ReactNode;
}

function DialectSelector() {
  const { currentDialect, setDialect, dialects } = useDialect();

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
      {dialects.map((dialect) => {
        const isSelected = currentDialect === dialect.id;
        return (
          <button
            key={dialect.id}
            onClick={() => setDialect(dialect.id as DialectId)}
            style={{
              minHeight: '44px',
              padding: '10px 16px',
              fontSize: '20px',
              fontWeight: isSelected ? 800 : 500,
              borderRadius: '10px',
              border: isSelected
                ? '3px solid var(--color-primary)'
                : '2px solid var(--color-border)',
              background: isSelected ? 'color-mix(in srgb, var(--color-primary) 10%, transparent)' : 'white',
              color: 'var(--color-text)',
              cursor: 'pointer',
              textAlign: 'left',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
            aria-pressed={isSelected}
          >
            <span>{dialect.name}</span>
            {isSelected && <span style={{ fontSize: '18px' }}>✅</span>}
          </button>
        );
      })}
    </div>
  );
}

export function SettingsDialog({ trigger }: SettingsDialogProps) {
  return (
    <Dialog>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent
        style={{
          maxWidth: '600px',
          maxHeight: '85vh',
          overflowY: 'auto',
          padding: '28px',
          background: 'var(--color-bg)',
          color: 'var(--color-text)',
        }}
      >
        <DialogHeader>
          <DialogTitle style={{ fontSize: '26px', fontWeight: 800, color: 'var(--color-text)' }}>
            ⚙️ 偏好设置
          </DialogTitle>
        </DialogHeader>

        {/* 主题选择区 */}
        <section style={{ marginTop: '20px' }}>
          <h3
            style={{
              fontSize: '22px',
              fontWeight: 800,
              marginBottom: '14px',
              color: 'var(--color-text)',
            }}
          >
            🎨 界面主题
          </h3>
          <ThemeSelector />
        </section>

        {/* 方言选择区 */}
        <section style={{ marginTop: '28px' }}>
          <h3
            style={{
              fontSize: '22px',
              fontWeight: 800,
              marginBottom: '14px',
              color: 'var(--color-text)',
            }}
          >
            🗣️ 朗读方言
          </h3>
          <DialectSelector />
        </section>

        {/* 返回按钮 */}
        <div style={{ marginTop: '28px', display: 'flex', justifyContent: 'flex-end' }}>
          <DialogClose asChild>
            <button
              style={{
                minHeight: '44px',
                minWidth: '100px',
                padding: '10px 24px',
                fontSize: '20px',
                fontWeight: 700,
                borderRadius: '12px',
                border: '2px solid var(--color-border)',
                background: 'var(--color-primary)',
                color: 'var(--color-primary-contrast)',
                cursor: 'pointer',
              }}
            >
              返回
            </button>
          </DialogClose>
        </div>
      </DialogContent>
    </Dialog>
  );
}
