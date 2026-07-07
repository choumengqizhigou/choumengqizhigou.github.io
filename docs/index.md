---
layout: page
title: 系列A
sidebar: false
aside: false
---

<script setup lang="ts">
import { data as articles } from './.vitepress/data/articles-seriesa.data'
import HomePage from './.vitepress/components/HomePage.vue'
</script>

<HomePage :articles="articles" />
