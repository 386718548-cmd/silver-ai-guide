/// <reference types="vite/client" />

declare module '*.vue' {
  import { DefineComponent } from 'vue'
  // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/ban-types
  const component: DefineComponent<{}, {}, any>
  export default component
}

interface ImportMetaEnv {
  readonly VITE_XUNFEI_APP_ID: string
  readonly VITE_XUNFEI_API_KEY: string
  readonly VITE_XUNFEI_API_SECRET: string
  readonly VITE_TENCENT_SECRET_ID: string
  readonly VITE_TENCENT_SECRET_KEY: string
  readonly VITE_DASHSCOPE_API_KEY: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
