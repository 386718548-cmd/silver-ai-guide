import { defineConfig, loadEnv } from "vite";
import uni from "@dcloudio/vite-plugin-uni";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  return {
    plugins: [uni()],
    define: {
      'import.meta.env.VITE_QWEN_API_KEY': JSON.stringify(env.VITE_QWEN_API_KEY || ''),
      'import.meta.env.VITE_XUNFEI_APP_ID': JSON.stringify(env.VITE_XUNFEI_APP_ID || ''),
      'import.meta.env.VITE_XUNFEI_API_KEY': JSON.stringify(env.VITE_XUNFEI_API_KEY || ''),
      'import.meta.env.VITE_XUNFEI_API_SECRET': JSON.stringify(env.VITE_XUNFEI_API_SECRET || ''),
    },
  }
});
