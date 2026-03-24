import { useTheme } from '../contexts/ThemeContext';
import type { ThemeConfig } from '../types/theme-dialect';

function ThemeCard({ theme, isSelected, onSelect }: {
  theme: ThemeConfig;
  isSelected: boolean;
  onSelect: () => void;
}) {
  return (
    <button
      onClick={onSelect}
      style={{
        flex: '1 1 160px',
        minHeight: '110px',
        border: isSelected ? `3px solid ${theme.colors.primary}` : '2px solid #e5e7eb',
        borderRadius: '16px',
        padding: '16px',
        background: theme.colors.bg,
        cursor: 'pointer',
        textAlign: 'left',
        position: 'relative',
        boxShadow: isSelected ? `0 0 0 3px ${theme.colors.primary}33` : '0 1px 4px rgba(0,0,0,0.08)',
        transition: 'box-shadow 0.2s, border-color 0.2s',
      }}
      aria-pressed={isSelected}
      aria-label={`选择主题：${theme.name}`}
    >
      {/* 色块预览 */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '10px' }}>
        {[theme.colors.primary, theme.colors.border, theme.colors.bg === '#ffffff' ? '#f3f4f6' : theme.colors.bg].map((c, i) => (
          <span key={i} style={{
            width: '24px', height: '24px', borderRadius: '50%',
            background: c, display: 'inline-block',
            border: '1.5px solid rgba(0,0,0,0.12)',
          }} />
        ))}
      </div>
      <div style={{ fontSize: '18px', fontWeight: 800, color: theme.colors.text, marginBottom: '4px' }}>
        {theme.name}
      </div>
      <div style={{ fontSize: '14px', color: theme.colors.text, opacity: 0.65, lineHeight: 1.4 }}>
        {theme.description}
      </div>
      {isSelected && (
        <div style={{
          position: 'absolute', top: '10px', right: '10px',
          background: theme.colors.primary, color: '#fff',
          fontSize: '12px', fontWeight: 700,
          padding: '2px 8px', borderRadius: '20px',
        }}>
          ✓ 已选
        </div>
      )}
    </button>
  );
}

export function ThemeSelector() {
  const { currentTheme, setTheme, themes } = useTheme();

  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px' }}>
      {themes.map((theme) => (
        <ThemeCard
          key={theme.id}
          theme={theme}
          isSelected={currentTheme === theme.id}
          onSelect={() => setTheme(theme.id)}
        />
      ))}
    </div>
  );
}
