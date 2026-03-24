import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { ThemeId, ThemeConfig } from '../types/index'
import { getStorage, setStorage, STORAGE_KEYS } from '../utils/storage'

export const THEME_CONFIGS: ThemeConfig[] = [
  {
    id: 'nature',
    name: '自然草本风',
    vars: {
      '--theme-primary': '#4CAF50',
      '--theme-bg': '#F1F8E9',
      '--theme-text': '#1B5E20',
      '--theme-card': '#FFFFFF',
      '--theme-accent': '#8BC34A',
    },
  },
  {
    id: 'traditional',
    name: '中华传统风',
    vars: {
      '--theme-primary': '#C0392B',
      '--theme-bg': '#F7F3EB',
      '--theme-text': '#1a1a1a',
      '--theme-card': '#fff9f0',
      '--theme-accent': '#E74C3C',
    },
  },
  {
    id: 'modern',
    name: '现代简约风',
    vars: {
      '--theme-primary': '#2196F3',
      '--theme-bg': '#FAFAFA',
      '--theme-text': '#212121',
      '--theme-card': '#FFFFFF',
      '--theme-accent': '#03A9F4',
    },
  },
  {
    id: 'ink',
    name: '水墨养生风',
    vars: {
      '--theme-primary': '#5D4037',
      '--theme-bg': '#EFEBE9',
      '--theme-text': '#1a1a1a',
      '--theme-card': '#fff9f0',
      '--theme-accent': '#795548',
    },
  },
]

export const useThemeStore = defineStore('theme', () => {
  const currentTheme = ref<ThemeId>('ink')

  const themeVars = computed(() => {
    const config = THEME_CONFIGS.find(t => t.id === currentTheme.value)
    return config?.vars ?? THEME_CONFIGS[3].vars
  })

  function applyTheme(id: ThemeId): void {
    currentTheme.value = id
    setStorage(STORAGE_KEYS.SILVER_THEME, id)
  }

  function loadTheme(): void {
    const saved = getStorage<ThemeId>(STORAGE_KEYS.SILVER_THEME)
    const validIds: ThemeId[] = ['nature', 'traditional', 'modern', 'ink']
    const id: ThemeId = saved && validIds.includes(saved) ? saved : 'ink'
    applyTheme(id)
  }

  return {
    currentTheme,
    themeVars,
    applyTheme,
    loadTheme,
  }
})
