---
layout: page
title: 系列B
sidebar: false
aside: false
---

<script setup lang="ts">
import { data as articles } from './.vitepress/data/articles-seriesb.data'
import HomePage from './.vitepress/components/HomePage.vue'
</script>

<HomePage :articles="articles" />
