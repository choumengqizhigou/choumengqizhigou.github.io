<script setup>
import DefaultTheme from 'vitepress/theme'
import Footer from './Footer.vue'
</script>

<template>
    <DefaultTheme.Layout>
        <template #layout-bottom>
            <Footer />
        </template>
    </DefaultTheme.Layout>
</template>