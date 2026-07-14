<script setup lang="ts">
import type { ArchiveArticle } from '../data/archive-loader.mts'

const props = withDefaults(defineProps<{
  articles?: ArchiveArticle[]
}>(), {
  articles: () => []
})
</script>

<template>
  <main class="archive-page">
    <header class="archive-header">
      <h1>归档</h1>
    </header>

    <div class="archive-timeline">
      <a v-for="item in props.articles" :key="item.url" class="archive-item" :href="item.url">
        <time class="archive-date" :datetime="item.createdAt">{{ item.createdAt }}</time>
        <span class="archive-title" :style="item.titleColor ? { color: item.titleColor } : undefined">
          {{ item.title }}
        </span>
      </a>
    </div>
  </main>
</template>

<style scoped>
.archive-page {
  max-width: 860px;
  margin: 0 auto;
  padding: 48px 24px 72px;
}

.archive-header {
  margin-bottom: 32px;
}

.archive-header h1 {
  margin: 0;
  color: var(--vp-c-text-1);
  font-size: 34px;
  font-weight: 800;
  line-height: 1.25;
  letter-spacing: 0;
}

.archive-timeline {
  display: grid;
  gap: 0;
  border-left: 2px solid var(--vp-c-divider);
}

.archive-item {
  position: relative;
  display: grid;
  grid-template-columns: 132px minmax(0, 1fr);
  gap: 18px;
  padding: 14px 0 14px 24px;
  color: inherit;
  text-decoration: none;
}

.archive-item::before {
  position: absolute;
  top: 24px;
  left: -7px;
  width: 12px;
  height: 12px;
  border: 2px solid var(--vp-c-brand-1);
  border-radius: 50%;
  background: var(--vp-c-bg);
  content: "";
}

.archive-item:hover {
  text-decoration: none;
}

.archive-item:hover .archive-title {
  color: var(--vp-c-brand-1);
}

.archive-date {
  color: var(--vp-c-text-3);
  font-size: 13px;
  font-weight: 600;
  line-height: 1.8;
}

.archive-title {
  min-width: 0;
  color: var(--vp-c-text-1);
  font-size: 16px;
  font-weight: 700;
  line-height: 1.8;
  transition: color 0.2s ease;
}

@media (max-width: 640px) {
  .archive-page {
    padding: 32px 18px 56px;
  }

  .archive-item {
    grid-template-columns: 1fr;
    gap: 2px;
  }
}
</style>
