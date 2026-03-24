import type { DialectId } from '../types/theme-dialect';

const APP_ID = import.meta.env.VITE_XUNFEI_APP_ID as string | undefined;
const API_KEY = import.meta.env.VITE_XUNFEI_API_KEY as string | undefined;
const API_SECRET = import.meta.env.VITE_XUNFEI_API_SECRET as string | undefined;

export function isXunfeiConfigured(): boolean {
  return !!(APP_ID && API_KEY && API_SECRET);
}

/** 方言到讯飞语音识别的语言参数映射 */
const dialectToIATParams: Record<DialectId, { lang: string; accent?: string }> = {
  mandarin: { lang: 'zh_cn', accent: 'xiaoyan' },
  cantonese: { lang: 'zh_cn', accent: ' cantonese' },
  hokkien: { lang: 'zh_cn', accent: 'taiwanese' },
  sichuan: { lang: 'zh_cn', accent: 'sichuan' },
  shanghainese: { lang: 'zh_cn', accent: 'shanghai' },
  northeastern: { lang: 'zh_cn', accent: 'dongbei' },
};

/** 生成讯飞 IAT WebSocket 鉴权 URL */
async function buildAuthUrl(): Promise<string> {
  const host = 'iat-api.xfyun.cn';
  const path = '/v2/iat';
  const date = new Date().toUTCString();

  const signatureOrigin = `host: ${host}\ndate: ${date}\nGET ${path} HTTP/1.1`;

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

/** 讯飞语音识别引擎 */
export class XunfeiIATEngine {
  private ws: WebSocket | null = null;

  async recognize(
    audioBlob: Blob,
    dialect: DialectId,
    onResult: (text: string) => void,
    onError: (error: string) => void
  ): Promise<void> {
    if (!isXunfeiConfigured()) {
      onError('语音服务未配置');
      return;
    }

    const params = dialectToIATParams[dialect] || dialectToIATParams.mandarin;

    return new Promise<void>((resolve, reject) => {
      let resultText = '';
      let isFinal = false;

      buildAuthUrl()
        .then((url) => {
          this.ws = new WebSocket(url);

          this.ws.onopen = () => {
            // 发送音频数据
            const reader = new FileReader();
            reader.onload = () => {
              const base64Data = (reader.result as string).split(',')[1];
              const payload = {
                common: { app_id: APP_ID },
                business: {
                  lang: params.lang,
                  accent: params.accent,
                  domain: 'iat',
                  engine_type: 'sms16k',
                  aue: 'raw',
                  sample_rate: '16000',
                  nuni: 1,
                },
                data: {
                  status: 2,
                  format: 'audio/wav',
                  audio: base64Data,
                },
              };
              this.ws!.send(JSON.stringify(payload));
            };
            reader.readAsDataURL(audioBlob);
          };

          this.ws.onmessage = (event) => {
            try {
              const data = JSON.parse(event.data as string);
              if (data.code !== 0) {
                onError(`识别错误: ${data.message}`);
                this.cleanup();
                resolve();
                return;
              }
              if (data.data?.result?.ws) {
                const words = data.data.result.ws
                  .map((w: { cw: { w: string }[] }) =>
                    w.cw.map((c: { w: string }) => c.w).join('')
                  )
                  .join('');
                resultText += words;

                if (data.data.result.status === 2) {
                  isFinal = true;
                  onResult(resultText);
                  this.cleanup();
                  resolve();
                } else {
                  onResult(resultText);
                }
              }
            } catch (err) {
              console.error('解析响应失败', err);
            }
          };

          this.ws.onerror = () => {
            onError('语音识别连接失败');
            this.cleanup();
            resolve();
          };

          this.ws.onclose = () => {
            if (!isFinal && resultText) {
              onResult(resultText);
            }
            resolve();
          };
        })
        .catch((err) => {
          onError('连接失败: ' + err.message);
          resolve();
        });
    });
  }

  private cleanup() {
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
  }

  stop(): void {
    this.cleanup();
  }
}
