import { defineConfig } from 'vitepress'
import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs'
import { dirname, join, relative } from 'node:path'
import { fileURLToPath } from 'node:url'

const docsDir = dirname(dirname(fileURLToPath(import.meta.url)))
const articlesDir = join(docsDir, 'articles')
const articleImageBaseUrl = 'https://pub-e217c4a931aa408baaea98a28d47de0f.r2.dev'
const legacyArticleImageHosts = new Set([
  'blog-image-group.oss-cn-shanghai.aliyuncs.com'
])

interface SeriesMeta {
  title?: string
}

interface CategoryMeta {
  color?: string
}

function readJson<T>(path: string, fallback: T) {
  if (!existsSync(path)) return fallback

  return JSON.parse(readFileSync(path, 'utf-8')) as T
}

function parseOrderedName(name: string) {
  const match = name.match(/^(\d+)[、._-]\s*(.+)$/)

  return {
    name: match?.[2] ?? name,
    order: match ? Number(match[1]) : Number.MAX_SAFE_INTEGER
  }
}

function escapeHtml(text: string) {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}

function isArticleMarkdown(env: unknown) {
  const relativePath = typeof env === 'object' && env !== null && 'relativePath' in env
    ? String((env as { relativePath?: unknown }).relativePath ?? '').replace(/\\/g, '/')
    : ''

  return relativePath.startsWith('articles/')
}

function hasUrlProtocol(src: string) {
  return /^[a-z][a-z\d+.-]*:/i.test(src)
}

function toArticleImageUrl(src: string) {
  const trimmedSrc = src.trim()

  if (!trimmedSrc || trimmedSrc.startsWith('#') || trimmedSrc.startsWith(articleImageBaseUrl)) {
    return src
  }

  if (hasUrlProtocol(trimmedSrc)) {
    try {
      const url = new URL(trimmedSrc)

      if (!legacyArticleImageHosts.has(url.hostname)) {
        return src
      }

      const filename = url.pathname.split('/').filter(Boolean).pop()

      return filename
        ? `${articleImageBaseUrl}/${filename}${url.search}${url.hash}`
        : src
    } catch {
      return src
    }
  }

  const imagePath = trimmedSrc.replace(/^\.?\//, '')

  return `${articleImageBaseUrl}/${imagePath}`
}

function getRouteLink(path: string) {
  const normalized = relative(docsDir, path).replace(/\\/g, '/').replace(/\.md$/, '')

  return normalized.endsWith('/index')
    ? `/${normalized.slice(0, -'/index'.length)}/`
    : `/${normalized}`
}

function getDirectories(path: string) {
  if (!existsSync(path)) return []

  return readdirSync(path)
    .map((name) => ({ name, path: join(path, name), ...parseOrderedName(name) }))
    .filter((item) => statSync(item.path).isDirectory())
    .sort((a, b) => a.order - b.order)
}

function getMarkdownFiles(path: string) {
  return readdirSync(path)
    .filter((name) => name.endsWith('.md'))
    .map((name) => {
      const displayName = name.replace(/\.md$/, '')

      return {
        displayName,
        path: join(path, name),
        ...parseOrderedName(displayName)
      }
    })
    .sort((a, b) => a.order - b.order)
}

function buildSidebar() {
  const sidebar: Record<string, { text: string; items: { text: string; link: string }[] }[]> = {}

  getDirectories(articlesDir).forEach((collection) => {
    const categoryMeta = readJson<Record<string, CategoryMeta>>(join(collection.path, 'categories.json'), {})

    getDirectories(collection.path).forEach((category) => {
      const seriesMeta = readJson<Record<string, SeriesMeta>>(join(category.path, 'series.json'), {})
      const categoryName = parseOrderedName(category.name).name
      const categoryColor = categoryMeta[categoryName]?.color ?? '#0078d4'

      getDirectories(category.path).forEach((series) => {
        const seriesName = seriesMeta[series.name]?.title ?? series.name
        const articles = getMarkdownFiles(series.path)

        if (!articles.length) return

        const seriesRoute = getRouteLink(join(series.path, 'index.md'))
        sidebar[seriesRoute] = [
          {
            text: `<span class="series-sidebar-title" style="--series-color: ${escapeHtml(categoryColor)}">${escapeHtml(seriesName)}</span>`,
            items: articles.map((article) => ({
              text: article.displayName,
              link: getRouteLink(article.path)
            }))
          }
        ]
      })
    })
  })

  return sidebar
}

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "丑萌气质狗",
  description: "简单描述一下博客信息，后面还要进行修改的！",
  head: [
    ['link', { rel: 'icon', href: '/favicon.ico' }]
  ],
  markdown: {
    config(md) {
      const defaultImageRule = md.renderer.rules.image

      md.renderer.rules.image = (tokens, idx, options, env, self) => {
        if (isArticleMarkdown(env)) {
          const token = tokens[idx]
          const src = token.attrGet('src')

          if (src) {
            token.attrSet('src', toArticleImageUrl(src))
          }
        }

        return defaultImageRule(tokens, idx, options, env, self)
      }
    }
  },
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      { text: '系列A', link: '/' },
      { text: '系列B', link: '/indexB' },
      // { text: '关于', link: '/about' },
      // { text: 'Examples', link: '/markdown-examples' }
    ],

    sidebar: buildSidebar(),

    socialLinks: [
      { icon: 'github', link: 'https://github.com/choumengqizhigou' }
    ],

    footer: {
      message: 'Released under the MIT License.',
      copyright: 'Copyright © 2019-present Evan You'
    }
  }
})
