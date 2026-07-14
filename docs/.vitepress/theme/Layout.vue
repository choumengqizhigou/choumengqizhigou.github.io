<script setup>
import DefaultTheme from 'vitepress/theme'
import { computed } from 'vue'
import { useData } from 'vitepress'
import Footer from './Footer.vue'

const { page, frontmatter } = useData()

const isArchiveArticle = computed(() => page.value.relativePath.startsWith('articles/archive/'))
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
        </template>

        <template #layout-bottom>
            <Footer />
        </template>
    </DefaultTheme.Layout>
</template>
