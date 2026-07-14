<script setup lang="ts">
import type { ArchiveArticle } from '../data/archive-loader.mts'
import type { Category } from '../data/articles-loader.mts'

const props = withDefaults(defineProps<{
  articles?: Category[]
  latestArchive?: ArchiveArticle
}>(), {
  articles: () => []
})

// const profile = {
//   name: '丑萌气质狗',
//   title: '个人博客 / 学习记录',
//   description:
//     '博客暂时不提供评论功能，如有任何疑问或建议，欢迎通过上述方式联系，非常感谢！',
//   stats: [
//     { label: '分类', value: props.articles.length },
//     {
//       label: '系列',
//       value: props.articles.reduce((total, category) => total + category.series.length, 0)
//     },
//     { label: '状态', value: '更新中' }
//   ]
// }
</script>

<template>
  <main class="home-page">
    <section class="series-area" aria-label="文章分类和列表">
      <!-- <div class="home-heading">
        <p class="eyebrow">BLOG ROADMAP</p>
        <h1>文章分类与系列进度</h1>
        <p>把学习、实践和复盘拆成可以持续推进的主题，每个系列都留一个清晰的进度位置。</p>
      </div> -->

      <a v-if="props.latestArchive" class="latest-archive" :href="props.latestArchive.url">
        <span class="latest-archive-title"
          :style="props.latestArchive.titleColor ? { color: props.latestArchive.titleColor } : undefined">
          {{ props.latestArchive.title }}
        </span>
        <time v-if="props.latestArchive.createdAt" class="latest-archive-date"
          :datetime="props.latestArchive.createdAt">
          {{ props.latestArchive.createdAt }}
        </time>
      </a>

      <div class="category-list">
        <section v-for="category in props.articles" :key="category.name" class="category-block"
          :style="{ '--category-color': category.color }">
          <div class="category-header">
            <div class="category-title">
              <!-- <span class="category-mark" aria-hidden="true"></span> -->
              <h2>{{ category.name }}</h2>
            </div>
            <span class="series-count">{{ category.series.length }} 个系列</span>
          </div>

          <div class="series-grid">
            <a v-for="item in category.series" :key="item.title" class="series-card" :href="item.url">
              <div class="series-card-title">
                <h3 :title="item.title">{{ item.title }}</h3>
              </div>
              <div class="series-card-body">
                <p class="series-summary" :title="item.summary">{{ item.summary }}</p>
                <p class="series-meta">
                  <span>{{ item.articles.length }} 篇文章</span>
                  <span v-if="item.createdAt">{{ item.createdAt }}</span>
                </p>
              </div>
            </a>
          </div>
        </section>
      </div>
    </section>

    <aside class="profile-panel" aria-label="个人信息">
      <!-- <div class="avatar" aria-hidden="true">
        <span>丑萌</span>
      </div> -->
      <div>
        <img class="avatar" src="/avatar.jpg" alt="头像" />
      </div>
      <div class="profile-copy">
        <p class="profile-description">接下来2-3个月什么事情都不做，一定要把所有文章都补充完整。努力完善中。。。</p>
        <p class="profile-description"> --2026.7.10（发薪日）</p>
        <!-- <p class="profile-description">{{ profile.description }}</p> -->
      </div>
      <!-- <dl class="profile-stats">
        <div v-for="item in profile.stats" :key="item.label">
          <dt>{{ item.label }}</dt>
          <dd>{{ item.value }}</dd>
        </div>
      </dl> -->
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

.latest-archive {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  min-width: 0;
  margin-bottom: 24px;
  padding: 10px 0;
  border-bottom: 1px solid var(--vp-c-divider);
  color: inherit;
  text-decoration: none;
}

.latest-archive:hover {
  text-decoration: none;
}

.latest-archive:hover .latest-archive-title {
  color: var(--vp-c-brand-1);
}

.latest-archive-title {
  min-width: 0;
  overflow: hidden;
  color: var(--vp-c-text-1);
  font-size: 15px;
  font-weight: 700;
  line-height: 1.5;
  text-overflow: ellipsis;
  white-space: nowrap;
  transition: color 0.2s ease;
}

.latest-archive-date {
  flex: 0 0 auto;
  color: var(--vp-c-text-3);
  font-size: 13px;
  font-weight: 600;
  line-height: 1.5;
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
  font-size: 28px;
  font-weight: bold;
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
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 14px;
}

.series-card {
  display: flex;
  height: 188px;
  min-width: 0;
  flex-direction: column;
  overflow: hidden;
  border: 1px solid color-mix(in srgb, var(--category-color) 28%, var(--vp-c-divider));
  border-radius: 8px;
  background: #fff;
  color: inherit;
  text-decoration: none;
  transition:
    border-color 0.2s ease,
    transform 0.2s ease;
}

.series-card:hover {
  border-color: var(--category-color);
  text-decoration: none;
  transform: translateY(-2px);
}

.series-card-title {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 108px;
  flex: 0 0 108px;
  padding: 16px 10px;
  background: var(--category-color);
  text-align: center;
}

.series-card h3 {
  display: -webkit-box;
  overflow: hidden;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  margin: 0;
  color: #fff;
  font-size: 20px;
  font-weight: bold;
  line-height: 1.4;
  letter-spacing: 0;
  overflow-wrap: break-word;
  word-break: normal;
}

.series-card-body {
  display: flex;
  height: 80px;
  flex: 0 0 80px;
  flex-direction: column;
  gap: 5px;
  padding: 5px 10px;
  background: #fff;
}

.series-summary {
  display: -webkit-box;
  overflow: hidden;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  flex: 0 0 auto;
  margin: 0;
  color: var(--vp-c-text-2);
  font-size: 14px;
  font-weight: 400;
  line-height: 1.7;
  overflow-wrap: break-word;
  word-break: normal;
}

.series-card .series-meta {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  flex: 0 0 auto;
  overflow: hidden;
  margin: 0;
  color: var(--category-color);
  font-size: 12px;
  font-weight: 700;
  line-height: 1.5;
}

.series-card .series-meta span {
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.profile-panel {
  position: sticky;
  top: 88px;
  align-self: start;
  padding: 24px;
  /* border: 1px solid var(--vp-c-divider);
  border-radius: 8px; */
  /* background: var(--vp-c-bg-soft); */
}

.avatar {
  display: grid;
  width: 100px;
  height: 100px;
  margin: 0 auto 20px;
  /* place-items: center;
  border: 4px solid var(--vp-c-bg); */
  border-radius: 50%;
  /* background:
    radial-gradient(circle at 32% 24%, rgba(255, 255, 255, 0.72), transparent 0 18%, transparent 19%),
    conic-gradient(from 145deg, #409eff, #67c23a, #ffc90c, #f56c6c, #6b4eaa, #409eff); */
  /* box-shadow: 0 16px 34px rgba(0, 0, 0, 0.13); */
}

/* .avatar span {
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
} */

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
