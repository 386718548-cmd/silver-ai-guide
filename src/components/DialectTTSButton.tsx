import { useDialectTTS } from '../hooks/useDialectTTS';

interface DialectTTSButtonProps {
  text: string;
}

export function DialectTTSButton({ text }: DialectTTSButtonProps) {
  const { status, statusMessage, speak, stop } = useDialectTTS();

  const isBusy = status === 'loading' || status === 'speaking';

  const buttonLabel = () => {
    switch (status) {
      case 'loading':
        return statusMessage || '正在连接语音服务...';
      case 'speaking':
        return statusMessage || '正在朗读...';
      case 'error':
        return statusMessage || '语音服务暂时不可用';
      default:
        return '🔊 朗读';
    }
  };

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
      <button
        onClick={() => (isBusy ? stop() : speak(text))}
        disabled={status === 'error'}
        style={{
          minHeight: '44px',
          minWidth: '44px',
          padding: '10px 20px',
          fontSize: '20px',
          fontWeight: 700,
          borderRadius: '12px',
          border: '2px solid var(--color-primary)',
          background: isBusy ? 'var(--color-muted)' : 'var(--color-primary)',
          color: isBusy ? 'var(--color-text)' : 'var(--color-primary-contrast)',
          cursor: status === 'error' ? 'not-allowed' : 'pointer',
          transition: 'background 0.2s',
        }}
        aria-label={isBusy ? '停止朗读' : '开始朗读'}
      >
        {isBusy ? `⏹ ${buttonLabel()}` : buttonLabel()}
      </button>

      {status === 'error' && (
        <button
          onClick={() => speak(text)}
          style={{
            minHeight: '44px',
            padding: '10px 16px',
            fontSize: '18px',
            borderRadius: '12px',
            border: '2px solid var(--color-border)',
            background: 'white',
            color: 'var(--color-text)',
            cursor: 'pointer',
          }}
        >
          重试
        </button>
      )}
    </div>
  );
}
