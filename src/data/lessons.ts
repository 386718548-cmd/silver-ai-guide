export interface Lesson {
  id: string;
  title: string;
  category: "入门" | "工具" | "安全" | "健康";
  difficulty: 1 | 2 | 3;
  content: string; // 支持 Markdown 或 HTML
  image?: string;
}

export const lessons: Lesson[] = [
  {
    id: "1",
    title: "什么是 AI？",
    category: "入门",
    difficulty: 1,
    content: `<h2>🤖 AI 很简单，就是很聪明的机器</h2>
<p>AI（人工智能）可以理解成：<b>很聪明的“工具”</b>。它能听懂、看懂、回答问题，像助手一样帮您做事。</p>
<h3>生活里的 AI 例子</h3>
<ul>
  <li>📱 人脸解锁：AI 认识您的脸</li>
  <li>🎵 推荐歌曲：AI 猜您喜欢什么</li>
  <li>💬 语音转文字：AI 听懂您说的话</li>
</ul>
<p><b>记住一句话：</b>AI 是工具，不是要取代您；用得好，生活更轻松。</p>`,
  },
  {
    id: "2",
    title: "您的第一个 AI 助手",
    category: "工具",
    difficulty: 1,
    content: `<h2>🗣️ 认识语音助手</h2>
<p>语音助手就是您对着手机说话，它就能回答您，像和朋友聊天一样。</p>
<h3>🎤 三步开启语音模式</h3>
<ol>
  <li>打开微信，找到【发现】菜单</li>
  <li>点击【小程序】</li>
  <li>搜索【AI 助手】或【语音助手】</li>
</ol>
<h3>可以问的问题</h3>
<ul>
  <li>“今天天气怎么样？”</li>
  <li>“怎么做红烧肉？”</li>
  <li>“降压药和柚子能一起吃吗？”</li>
</ul>
<p style="color:#b91c1c;font-weight:800;">⚠️ AI 不是医生：身体不舒服要去医院，紧急情况立刻拨打 120。</p>`,
  },
  {
    id: "3",
    title: "微信里的 AI 功能",
    category: "工具",
    difficulty: 2,
    content: `<h2>📱 微信也能变聪明</h2>
<p>您不需要下载新软件，微信里就有 AI 功能。</p>
<h3>1. 语音转文字</h3>
<p>按住说话太麻烦？点击输入框旁边的<b>🎤图标</b>，说话自动变文字。</p>
<h3>2. 翻译功能</h3>
<p>收到外文消息？长按消息，选择<b>「翻译」</b>，立刻看懂。</p>
<h3>3. 搜一搜</h3>
<p>顶部搜索框，直接问“怎么做红烧肉”，AI 会给您步骤。</p>`,
  },
  {
    id: "4",
    title: "AI 健康助手",
    category: "健康",
    difficulty: 2,
    content: `<h2>🏥 您的随身健康顾问</h2>
<p>身体不舒服，先问 AI，再去医院。</p>
<h3>✅ 可以问：</h3>
<ul>
  <li>"高血压能吃柚子吗？"</li>
  <li>"这个药一天吃几次？"</li>
  <li>"膝盖疼是什么原因？"</li>
</ul>
<h3>⚠️ 注意：</h3>
<p>AI 的建议仅供参考，<b>确诊一定要去医院</b>。</p>`,
  },
  {
    id: "5",
    title: "防诈骗特别篇",
    category: "安全",
    difficulty: 3,
    content: `<h2>🚨 紧急提醒：AI 换脸诈骗</h2>
<p>现在骗子能用 AI 模仿子女的脸和视频通话。</p>
<h3>🛡️ 如何识别？</h3>
<ol>
  <li>让对方<b>摸鼻子</b>或<b>遮挡脸部</b>，AI 通常会露馅</li>
  <li>问一个<b>只有家里人才知道</b>的问题</li>
  <li><b>挂断后回拨</b>原电话号码确认</li>
</ol>
<p style="color:red; font-weight:bold; font-size:24px;">只要提到钱，必须电话核实！</p>`,
  },
];
