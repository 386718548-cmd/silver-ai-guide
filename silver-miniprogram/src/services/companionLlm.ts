import type { CompanionMessage, UserProfile } from '../types/index'

// 通义千问 API 配置 — 使用 OpenAI 兼容接口
const QWEN_API_URL = 'https://dashscope.aliyuncs.com/compatible-mode/v1/chat/completions'
const QWEN_API_KEY = import.meta.env.VITE_QWEN_API_KEY || 'sk-0b9e3155785d409f81ec64e11e8275e0'

// 负面情绪关键词
const NEGATIVE_KEYWORDS = [
  '孤独', '寂寞', '难过', '伤心', '痛苦', '不舒服', '难受', '烦恼',
  '烦躁', '焦虑', '害怕', '恐惧', '绝望', '无助', '想哭', '哭了',
  '不开心', '不高兴', '郁闷', '压抑', '失落', '沮丧', '悲伤',
]

type TimeOfDay = 'morning' | 'afternoon' | 'evening'

function getTimeOfDay(): TimeOfDay {
  const hour = new Date().getHours()
  if (hour >= 5 && hour < 12) return 'morning'
  if (hour >= 12 && hour < 18) return 'afternoon'
  return 'evening'
}

function buildSystemPrompt(timeOfDay: TimeOfDay, userProfile?: UserProfile): string {
  const timeMap: Record<TimeOfDay, string> = {
    morning: '早晨',
    afternoon: '下午',
    evening: '晚上',
  }
  const topicsHint = userProfile?.preferredTopics?.length
    ? `\n用户常聊的话题：${userProfile.preferredTopics.join('、')}`
    : ''

  return `你是"银龄"，一位耐心、温暖、懂得倾听的老年关怀助手。
你的说话风格：
- 语气亲切，像邻居家的晚辈
- 主动关心用户的日常状态
- 回复简短（不超过200字），避免生硬的功能性语言
- 遇到用户表达孤独、难过时，给予情感支持，并建议联系家人
- 遇到用户描述身体严重不适时，建议就医并提示可使用紧急救助功能
当前时间段：${timeMap[timeOfDay]}${topicsHint}`
}

async function chat(messages: CompanionMessage[], userProfile?: UserProfile): Promise<string> {
  // 无 API Key 时使用 Mock
  if (!QWEN_API_KEY) {
    return mockChat(messages)
  }

  const timeOfDay = getTimeOfDay()
  const systemPrompt = buildSystemPrompt(timeOfDay, userProfile)

  const apiMessages = [
    { role: 'system', content: systemPrompt },
    ...messages.map(m => ({ role: m.role, content: m.content })),
  ]

  try {
    const response = await new Promise<string>((resolve, reject) => {
      uni.request({
        url: QWEN_API_URL,
        method: 'POST',
        header: {
          'Authorization': `Bearer ${QWEN_API_KEY}`,
          'Content-Type': 'application/json',
        },
        data: {
          model: 'qwen-turbo',
          messages: apiMessages,
          max_tokens: 300,
          temperature: 0.8,
        },
        success: (res: any) => {
          const text = res.data?.choices?.[0]?.message?.content
          if (text) {
            resolve(text.length > 200 ? text.slice(0, 200) : text)
          } else {
            reject(new Error('空响应'))
          }
        },
        fail: (err: any) => reject(err),
      })
    })
    return response
  } catch {
    return '网络不稳定，请稍后再试'
  }
}

async function generateGreeting(timeOfDay?: TimeOfDay): Promise<string> {
  const tod = timeOfDay ?? getTimeOfDay()
  const greetings: Record<TimeOfDay, string[]> = {
    morning: ['早上好！今天感觉怎么样？', '早安！新的一天，身体还好吗？', '早上好，今天有什么想聊的吗？'],
    afternoon: ['下午好！午休了吗？', '下午好，今天过得怎么样？', '下午好！有什么想说的吗？'],
    evening: ['晚上好！今天辛苦了，身体还好吗？', '晚上好，今天过得开心吗？', '晚上好！有什么想聊的吗？'],
  }
  const list = greetings[tod]
  return list[Math.floor(Math.random() * list.length)]
}

function detectNegativeEmotion(text: string): boolean {
  return NEGATIVE_KEYWORDS.some(kw => text.includes(kw))
}

// Mock 回复（无 API Key 时使用）
function mockChat(messages: CompanionMessage[]): string {
  const last = messages[messages.length - 1]?.content ?? ''

  if (detectNegativeEmotion(last)) {
    return '听到您这样说，我很心疼。您不是一个人，家人和我都在您身边。要不要联系一下家人聊聊？'
  }

  // 根据话题内容给出对应回复
  if (last.includes('故事')) {
    const stories = [
      '好的，我来讲一个小故事。从前有位老爷爷，每天清晨都去公园打太极，认识了很多好朋友，大家一起聊天、下棋，日子过得特别充实。您平时喜欢什么活动呢？',
      '从前有个村子里住着一位百岁老人，大家都问他长寿的秘诀，他笑着说：心宽、少愁、多走路。您觉得这个秘诀怎么样？',
    ]
    return stories[Math.floor(Math.random() * stories.length)]
  }

  if (last.includes('今天') || last.includes('聊聊')) {
    const today = [
      '今天天气怎么样？您有没有出去走走？适当散步对身体很好呢。',
      '今天过得怎么样？有没有吃好饭、休息好？',
      '今天有什么让您开心的事情吗？跟我说说吧！',
    ]
    return today[Math.floor(Math.random() * today.length)]
  }

  if (last.includes('健康') || last.includes('知识')) {
    const health = [
      '分享一个小知识：每天喝够8杯水，对肾脏和皮肤都很好。您平时喝水够吗？',
      '老年人要特别注意补钙，多晒太阳、多喝牛奶，能预防骨质疏松。您有这个习惯吗？',
      '饭后散步20分钟，有助于消化，还能控制血糖。这个习惯很适合老年朋友哦！',
    ]
    return health[Math.floor(Math.random() * health.length)]
  }

  if (last.includes('家人') || last.includes('想念')) {
    return '想念家人是很正常的，家人也一定很挂念您。要不要给他们打个电话或者发条消息？有时候一句"我很好"就能让家人放心很多。'
  }

  // 通用回复
  const general = [
    '您说得很有道理，我很高兴听您分享。能再多说一些吗？',
    '是啊，生活中有很多美好的事情值得珍惜。您最近有什么让您高兴的事吗？',
    '您今天精神不错嘛！有什么开心的事情吗？',
    '保重身体最重要，您平时注意休息了吗？',
    '听您说话，我感觉您是个很有生活智慧的人。能跟我多聊聊吗？',
    '您说的让我很受启发。您年轻的时候有什么有趣的经历吗？',
  ]
  return general[Math.floor(Math.random() * general.length)]
}

export const companionLlmService = {
  chat,
  generateGreeting,
  detectNegativeEmotion,
  getTimeOfDay,
}
