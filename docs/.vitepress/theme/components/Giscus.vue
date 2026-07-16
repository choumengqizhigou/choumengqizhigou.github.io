<script setup lang="ts">
import Giscus from "@giscus/vue";
import { useData, useRoute } from "vitepress";

const { isDark, frontmatter } = useData();
const route = useRoute();
</script>

<template>
    <Giscus v-if="frontmatter.comment !== false" repo="choumengqizhigou/choumengqizhigou.github.io"
        repoId="R_kgDORpAatQ" category="General" categoryId="DIC_kwDORpAatc4DBTIX" mapping="specific"
        :term="frontmatter.giscus" reactionsEnabled="1" emitMetadata="0" inputPosition="top" lang="zh-CN" loading="lazy"
        :theme="isDark ? 'dark' : 'light'" :key="route.path" />
</template>