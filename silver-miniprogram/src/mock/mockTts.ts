import { ref } from 'vue'
import type { TtsService } from '../types/services'

const isPlayingRef = ref(false)
let playTimer: ReturnType<typeof setTimeout> | null = null

export const mockTtsService: TtsService = {
  async speak(text: string, speed = 0.8): Promise<void> {
    if (isPlayingRef.value) {
      mockTtsService.stop()
    }
    isPlayingRef.value = true
    // 模拟播放时长：字数 * 200ms / speed
    const duration = Math.min((text.length * 200) / speed, 10000)
    return new Promise(resolve => {
      playTimer = setTimeout(() => {
        isPlayingRef.value = false
        playTimer = null
        resolve()
      }, duration)
    })
  },

  stop(): void {
    if (playTimer) {
      clearTimeout(playTimer)
      playTimer = null
    }
    isPlayingRef.value = false
  },

  get isPlaying(): boolean {
    return isPlayingRef.value
  },
}
