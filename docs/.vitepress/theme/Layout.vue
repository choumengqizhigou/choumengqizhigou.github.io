<script setup>
import DefaultTheme from 'vitepress/theme'
import { computed } from 'vue'
import { useData } from 'vitepress'
import Footer from './Footer.vue'
import Giscus from "./components/Giscus.vue";

const { page, frontmatter } = useData()

const isArchiveArticle = computed(() => page.value.relativePath.startsWith('articles/archive/'))
const isSeriesArticle = computed(() => /^articles\/series[ab]\//i.test(page.value.relativePath))
const archiveCreatedAt = computed(() => {
    const createdAt = frontmatter.value.createdAt

    return createdAt instanceof Date
        ? createdAt.toISOString().slice(0, 10)
        : String(createdAt ?? '')
})
const archiveTitleColor = computed(() => String(frontmatter.value.tilteColor ?? frontmatter.value.titleColor ?? ''))
</script>

<template>
    <DefaultTheme.Layout>
        <template #doc-before>
            <header v-if="isArchiveArticle" class="archive-article-header">
                <h1 :style="archiveTitleColor ? { color: archiveTitleColor } : undefined">{{ frontmatter.title }}</h1>
                <time v-if="archiveCreatedAt" :datetime="archiveCreatedAt">{{ archiveCreatedAt }}</time>
            </header>
            <header v-else-if="isSeriesArticle" class="series-article-header">
                <h1>{{ frontmatter.title }}</h1>
            </header>
        </template>

        <template #doc-after>
            <Giscus />
        </template>

        <template #layout-bottom>
            <Footer />
        </template>
    </DefaultTheme.Layout>
</template>
