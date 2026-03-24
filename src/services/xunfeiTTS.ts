import type { DialectConfig } from '../types/theme-dialect';

const APP_ID = import.meta.env.VITE_XUNFEI_APP_ID as string | undefined;
const API_KEY = import.meta.env.VITE_XUNFEI_API_KEY as string | undefined;
const API_SECRET = import.meta.env.VITE_XUNFEI_API_SECRET as string | undefined;

export function isXunfeiConfigured(): boolean {
  return !!(APP_ID && API_KEY && API_SECRET);
}

/** 生成讯飞 TTS WebSocket 鉴权 URL（HMAC-SHA256） */
async function buildAuthUrl(vcn: string): Promise<string> {
  const host = 'tts-api.xfyun.cn';
  const path = '/v2/tts';
  const date = new Date().toUTCString();

  const signatureOrigin = `host: ${host}\ndate: ${date}\nGET ${path} HTTP/1.1`;

  // 使用 Web Crypto API 计算 HMAC-SHA256
  const encoder = new TextEncoder();
  const keyData = encoder.encode(API_SECRET!);
  const msgData = encoder.encode(signatureOrigin);

  const cryptoKey = await crypto.subtle.importKey(
    'raw',
    keyData,
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  );
  const signatureBuffer = await crypto.subtle.sign('HMAC', cryptoKey, msgData);
  const signatureBase64 = btoa(String.fromCharCode(...new Uint8Array(signatureBuffer)));

  const authorizationOrigin = `api_key="${API_KEY}", algorithm="hmac-sha256", headers="host date request-line", signature="${signatureBase64}"`;
  const authorization = btoa(authorizationOrigin);

  const params = new URLSearchParams({
    authorization,
    date,
    host,
  });

  return `wss://${host}${path}?${params.toString()}`;
}

export class XunfeiTTSEngine {
  private ws: WebSocket | null = null;
  private audioContext: AudioContext | null = null;
  private audioQueue: AudioBuffer[] = [];
  private isPlaying = false;
  private stopRequested = false;

  async speak(text: string, dialect: DialectConfig): Promise<void> {
    if (!isXunfeiConfigured()) {
      // API Key 未配置，直接 resolve
      return;
    }

    const vcn = dialect.xunfeiVcn ?? 'xiaoyan';

    return new Promise<void>((resolve, reject) => {
      let timeoutId: ReturnType<typeof setTimeout>;
      this.stopRequested = false;

      const cleanup = () => {
        clearTimeout(timeoutId);
        if (this.ws) {
          this.ws.close();
          this.ws = null;
        }
      };

      // 5 秒超时
      timeoutId = setTimeout(() => {
        cleanup();
        reject(new Error('TIMEOUT'));
      }, 5000);

      buildAuthUrl(vcn)
        .then((url) => {
          if (this.stopRequested) {
            clearTimeout(timeoutId);
            resolve();
            return;
          }

          this.ws = new WebSocket(url);
          this.audioContext = new AudioContext();
          this.audioQueue = [];
          this.isPlaying = false;

          this.ws.onopen = () => {
            clearTimeout(timeoutId);
            const payload = {
              common: { app_id: APP_ID },
              business: {
                aue: 'raw',
                auf: 'audio/L16;rate=16000',
                vcn,
                speed: 50,
                volume: 50,
                pitch: 50,
                tte: 'UTF8',
              },
              data: {
                status: 2,
                text: btoa(unescape(encodeURIComponent(text))),
              },
            };
            this.ws!.send(JSON.stringify(payload));
          };

          this.ws.onmessage = async (event) => {
            if (this.stopRequested) {
              cleanup();
              resolve();
              return;
            }
            try {
              const data = JSON.parse(event.data as string);
              if (data.code !== 0) {
                cleanup();
                reject(new Error(`XUNFEI_ERROR:${data.code}`));
                return;
              }
              if (data.data?.audio) {
                const audioData = atob(data.data.audio);
                const buffer = new ArrayBuffer(audioData.length);
                const view = new Uint8Array(buffer);
                for (let i = 0; i < audioData.length; i++) {
                  view[i] = audioData.charCodeAt(i);
                }
                await this.playPCM(buffer);
              }
              if (data.data?.status === 2) {
                cleanup();
                resolve();
              }
            } catch {
              cleanup();
              reject(new Error('PARSE_ERROR'));
            }
          };

          this.ws.onerror = () => {
            cleanup();
            reject(new Error('WS_ERROR'));
          };

          this.ws.onclose = () => {
            if (!this.stopRequested) {
              resolve();
            }
          };
        })
        .catch((err) => {
          clearTimeout(timeoutId);
          reject(err);
        });
    });
  }

  private async playPCM(buffer: ArrayBuffer): Promise<void> {
    if (!this.audioContext || this.stopRequested) return;
    try {
      // 将 PCM L16 16kHz 转为 AudioBuffer
      const pcm = new Int16Array(buffer);
      const audioBuffer = this.audioContext.createBuffer(1, pcm.length, 16000);
      const channelData = audioBuffer.getChannelData(0);
      for (let i = 0; i < pcm.length; i++) {
        channelData[i] = pcm[i] / 32768;
      }
      const source = this.audioContext.createBufferSource();
      source.buffer = audioBuffer;
      source.connect(this.audioContext.destination);
      source.start();
      await new Promise<void>((res) => {
        source.onended = () => res();
      });
    } catch {
      // 静默失败
    }
  }

  stop(): void {
    this.stopRequested = true;
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
    if (this.audioContext) {
      try {
        this.audioContext.close();
      } catch {
        // 静默失败
      }
      this.audioContext = null;
    }
  }
}
