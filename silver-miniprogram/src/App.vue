<script setup lang="ts">
import { onLaunch, onShow, onHide, onError } from "@dcloudio/uni-app"
import { useThemeStore } from './stores/themeStore'

const themeStore = useThemeStore()

onLaunch(() => {
  console.log("App Launch")
  themeStore.loadTheme()
})

onShow(() => {
  console.log("App Show")
})

onHide(() => {
  console.log("App Hide")
})

onError((err) => {
  console.error("[App] 全局错误:", err)
})
</script>

<style>
/* 全局样式 */
page {
  background-color: #f5f5f5;
  font-family: -apple-system, BlinkMacSystemFont, 'PingFang SC', 'Helvetica Neue', sans-serif;
}

button {
  background: transparent;
  border: none;
  padding: 0;
  margin: 0;
  line-height: 1;
}

button::after {
  border: none;
}
</style>
