---
layout: page
title: 归档
sidebar: false
aside: false
---

<script setup lang="ts">
import { data as archives } from './.vitepress/data/archive.data'
import ArchivePage from './.vitepress/components/ArchivePage.vue'
</script>

<ArchivePage :articles="archives" />
