<script setup lang="ts">
const categories = [
  {
    name: '萌新报道',
    color: '#409EFF',
    series: [
      { title: '博客搭建手记', summary: '记录站点从零到上线的每一步。', progress: 28 },
      { title: '前端入门碎片', summary: 'HTML、CSS 和页面结构的基础笔记。', progress: 36 },
      { title: '开发环境整理', summary: '把常用工具和配置归到一处。', progress: 52 },
      { title: '阅读清单', summary: '适合新阶段反复翻看的资料。', progress: 18 }
    ]
  },
  {
    name: '渐入佳境',
    color: '#67C23A',
    series: [
      { title: 'Vue 组件练习', summary: '从状态、事件到组件拆分的练习集。', progress: 64 },
      { title: 'TypeScript 慢慢来', summary: '用更稳的类型约束日常代码。', progress: 41 },
      { title: '样式系统整理', summary: '颜色、间距、布局的常用套路。', progress: 58 },
      { title: 'VitePress 折腾记', summary: '主题、导航和文章组织方式。', progress: 47 },
      { title: '代码片段仓库', summary: '把顺手的小片段沉淀下来。', progress: 72 }
    ]
  },
  {
    name: '运用自如',
    color: '#E6A23C',
    series: [
      { title: '工程化日常', summary: '构建、格式化、脚本和发布流程。', progress: 68 },
      { title: '性能观察笔记', summary: '从加载、渲染到交互体验的复盘。', progress: 45 },
      { title: '接口联调记录', summary: '把前后端协作中的细节写清楚。', progress: 53 },
      { title: '组件库观察', summary: '拆解常见组件的设计和边界。', progress: 37 }
    ]
  },
  {
    name: '目无全牛',
    color: '#F56C6C',
    series: [
      { title: '源码阅读计划', summary: '从小模块开始读懂优秀项目。', progress: 22 },
      { title: '架构案例复盘', summary: '观察真实项目里的取舍。', progress: 31 },
      { title: '复杂交互拆解', summary: '把难做的界面拆成可维护的块。', progress: 26 },
      { title: '问题定位日志', summary: '记录那些绕了一圈才找到的答案。', progress: 49 }
    ]
  },
  {
    name: '难言精通',
    color: '#909399',
    series: [
      { title: '算法题慢刷', summary: '保持手感，也保持谦虚。', progress: 34 },
      { title: '浏览器机制', summary: '事件循环、渲染管线和缓存策略。', progress: 29 },
      { title: 'Node 小实验', summary: '脚本、服务和工具链相关尝试。', progress: 44 },
      { title: '安全意识补课', summary: '常见风险和日常防护笔记。', progress: 21 }
    ]
  },
  {
    name: '略懂略懂',
    color: '#6B4EAA',
    series: [
      { title: '设计灵感夹', summary: '收集界面、动效和排版参考。', progress: 62 },
      { title: '产品观察', summary: '记录让人觉得顺手的细节。', progress: 55 },
      { title: '写作练习', summary: '把技术表达写得更清楚一点。', progress: 38 },
      { title: '效率工具箱', summary: '那些真的留下来的工具。', progress: 71 }
    ]
  },
  {
    name: '还有一点',
    color: '#33CCFF',
    series: [
      { title: '杂谈备忘', summary: '一时放不进分类里的想法。', progress: 46 },
      { title: '踩坑索引', summary: '给未来的自己留几盏灯。', progress: 67 },
      { title: '灵感草稿', summary: '还没有成文，但值得留住。', progress: 24 },
      { title: '周回顾', summary: '复盘这一周真正推进的事情。', progress: 59 }
    ]
  },
  {
    name: '前十个游戏都是垃圾（Unity）',
    color: '#FFC90C',
    series: [
      { title: 'Unity 入坑路线', summary: '从场景、对象到脚本生命周期。', progress: 33 },
      { title: '小游戏原型集', summary: '用短周期验证玩法想法。', progress: 40 },
      { title: '角色控制器练习', summary: '移动、跳跃、镜头和手感调校。', progress: 27 },
      { title: '关卡灰盒记录', summary: '先把体验搭出来，再慢慢打磨。', progress: 19 },
      { title: '效果与音频', summary: '给游戏一点反馈和情绪。', progress: 23 }
    ]
  }
]

const profile = {
  name: '丑萌气质狗',
  title: '个人博客 / 学习记录',
  description:
    '这里会慢慢整理技术笔记、项目复盘、游戏开发练习和一些零散想法。先把路标搭起来，再一点点把内容补满。',
  stats: [
    { label: '分类', value: categories.length },
    {
      label: '系列',
      value: categories.reduce((total, category) => total + category.series.length, 0)
    },
    { label: '状态', value: '更新中' }
  ]
}
</script>

<template>
  <main class="home-page">
    <section class="series-area" aria-label="文章类别和系列">
      <div class="home-heading">
        <p class="eyebrow">BLOG ROADMAP</p>
        <h1>文章分类与系列进度</h1>
        <p>把学习、实践和复盘拆成可以持续推进的主题，每个系列都留一个清晰的进度位置。</p>
      </div>

      <div class="category-list">
        <section
          v-for="category in categories"
          :key="category.name"
          class="category-block"
          :style="{ '--category-color': category.color }"
        >
          <div class="category-header">
            <div class="category-title">
              <span class="category-mark" aria-hidden="true"></span>
              <h2>{{ category.name }}</h2>
            </div>
            <span class="series-count">{{ category.series.length }} 个系列</span>
          </div>

          <div class="series-grid">
            <article
              v-for="item in category.series"
              :key="item.title"
              class="series-card"
            >
              <div class="series-card-header">
                <h3>{{ item.title }}</h3>
                <span>{{ item.progress }}%</span>
              </div>
              <p>{{ item.summary }}</p>
              <div class="progress-track" :aria-label="`${item.title} 进度 ${item.progress}%`">
                <span :style="{ width: `${item.progress}%` }"></span>
              </div>
            </article>
          </div>
        </section>
      </div>
    </section>

    <aside class="profile-panel" aria-label="个人信息">
      <div class="avatar" aria-hidden="true">
        <span>丑萌</span>
      </div>
      <div class="profile-copy">
        <p class="profile-kicker">ABOUT ME</p>
        <h2>{{ profile.name }}</h2>
        <p class="profile-title">{{ profile.title }}</p>
        <p class="profile-description">{{ profile.description }}</p>
      </div>
      <dl class="profile-stats">
        <div v-for="item in profile.stats" :key="item.label">
          <dt>{{ item.label }}</dt>
          <dd>{{ item.value }}</dd>
        </div>
      </dl>
    </aside>
  </main>
</template>

<style scoped>
.home-page {
  display: grid;
  grid-template-columns: minmax(0, 1fr) 320px;
  gap: 32px;
  max-width: 1280px;
  margin: 0 auto;
  padding: 48px 24px 72px;
}

.series-area {
  min-width: 0;
}

.home-heading {
  max-width: 760px;
  margin-bottom: 36px;
}

.eyebrow,
.profile-kicker {
  margin: 0 0 10px;
  color: var(--vp-c-brand-1);
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0;
}

.home-heading h1 {
  margin: 0;
  color: var(--vp-c-text-1);
  font-size: 42px;
  line-height: 1.15;
  letter-spacing: 0;
}

.home-heading p:last-child {
  margin: 16px 0 0;
  color: var(--vp-c-text-2);
  font-size: 16px;
  line-height: 1.8;
}

.category-list {
  display: grid;
  gap: 34px;
}

.category-block {
  min-width: 0;
}

.category-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  margin-bottom: 14px;
  padding-bottom: 12px;
  border-bottom: 1px solid color-mix(in srgb, var(--category-color) 32%, var(--vp-c-divider));
}

.category-title {
  display: flex;
  align-items: center;
  min-width: 0;
  gap: 10px;
}

.category-mark {
  width: 12px;
  height: 12px;
  flex: 0 0 auto;
  border-radius: 50%;
  background: var(--category-color);
  box-shadow: 0 0 0 5px color-mix(in srgb, var(--category-color) 16%, transparent);
}

.category-title h2 {
  overflow-wrap: anywhere;
  margin: 0;
  color: var(--category-color);
  font-size: 22px;
  line-height: 1.35;
  letter-spacing: 0;
}

.series-count {
  flex: 0 0 auto;
  color: var(--vp-c-text-2);
  font-size: 13px;
}

.series-grid {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 14px;
}

.series-card {
  display: flex;
  min-height: 172px;
  min-width: 0;
  flex-direction: column;
  justify-content: space-between;
  padding: 16px;
  border: 1px solid color-mix(in srgb, var(--category-color) 28%, var(--vp-c-divider));
  border-top: 4px solid var(--category-color);
  border-radius: 8px;
  background:
    linear-gradient(
      180deg,
      color-mix(in srgb, var(--category-color) 10%, transparent),
      transparent 54px
    ),
    var(--vp-c-bg-soft);
}

.series-card-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 12px;
}

.series-card h3 {
  overflow-wrap: anywhere;
  margin: 0;
  color: var(--vp-c-text-1);
  font-size: 16px;
  line-height: 1.45;
  letter-spacing: 0;
}

.series-card-header span {
  flex: 0 0 auto;
  color: var(--category-color);
  font-size: 13px;
  font-weight: 700;
}

.series-card p {
  overflow-wrap: anywhere;
  margin: 12px 0 18px;
  color: var(--vp-c-text-2);
  font-size: 13px;
  line-height: 1.7;
}

.progress-track {
  overflow: hidden;
  height: 8px;
  border-radius: 999px;
  background: color-mix(in srgb, var(--category-color) 16%, var(--vp-c-bg));
}

.progress-track span {
  display: block;
  height: 100%;
  border-radius: inherit;
  background: var(--category-color);
}

.profile-panel {
  position: sticky;
  top: 88px;
  align-self: start;
  padding: 24px;
  border: 1px solid var(--vp-c-divider);
  border-radius: 8px;
  background: var(--vp-c-bg-soft);
}

.avatar {
  display: grid;
  width: 132px;
  height: 132px;
  margin: 0 auto 22px;
  place-items: center;
  border: 4px solid var(--vp-c-bg);
  border-radius: 50%;
  background:
    radial-gradient(circle at 32% 24%, rgba(255, 255, 255, 0.72), transparent 0 18%, transparent 19%),
    conic-gradient(from 145deg, #409eff, #67c23a, #ffc90c, #f56c6c, #6b4eaa, #409eff);
  box-shadow: 0 16px 34px rgba(0, 0, 0, 0.13);
}

.avatar span {
  display: grid;
  width: 82px;
  height: 82px;
  place-items: center;
  border-radius: 50%;
  background: color-mix(in srgb, var(--vp-c-bg) 88%, transparent);
  color: var(--vp-c-text-1);
  font-size: 20px;
  font-weight: 800;
  letter-spacing: 0;
}

.profile-copy {
  text-align: center;
}

.profile-copy h2 {
  margin: 0;
  color: var(--vp-c-text-1);
  font-size: 26px;
  line-height: 1.25;
  letter-spacing: 0;
}

.profile-title {
  margin: 8px 0 0;
  color: var(--vp-c-brand-1);
  font-size: 14px;
  font-weight: 700;
}

.profile-description {
  margin: 16px 0 0;
  color: var(--vp-c-text-2);
  font-size: 14px;
  line-height: 1.8;
  text-align: left;
}

.profile-stats {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 8px;
  margin: 22px 0 0;
}

.profile-stats div {
  min-width: 0;
  padding: 12px 8px;
  border-radius: 8px;
  background: var(--vp-c-bg);
  text-align: center;
}

.profile-stats dt {
  margin: 0;
  color: var(--vp-c-text-3);
  font-size: 12px;
}

.profile-stats dd {
  overflow-wrap: anywhere;
  margin: 5px 0 0;
  color: var(--vp-c-text-1);
  font-size: 15px;
  font-weight: 800;
}

@media (max-width: 1120px) {
  .home-page {
    grid-template-columns: 1fr;
  }

  .profile-panel {
    position: static;
    display: grid;
    grid-template-columns: auto minmax(0, 1fr);
    gap: 22px;
    align-items: center;
  }

  .avatar {
    margin: 0;
  }

  .profile-copy {
    text-align: left;
  }

  .profile-stats {
    grid-column: 1 / -1;
  }
}

@media (max-width: 960px) {
  .series-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (max-width: 640px) {
  .home-page {
    padding: 32px 18px 56px;
  }

  .home-heading h1 {
    font-size: 32px;
  }

  .category-header,
  .profile-panel {
    align-items: flex-start;
  }

  .category-header {
    flex-direction: column;
  }

  .series-grid,
  .profile-panel,
  .profile-stats {
    grid-template-columns: 1fr;
  }

  .profile-copy {
    text-align: center;
  }

  .profile-description {
    text-align: left;
  }

  .avatar {
    margin: 0 auto;
  }
}
</style>
