import { defineConfig } from 'vitepress'
import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs'
import { dirname, join, relative } from 'node:path'
import { fileURLToPath } from 'node:url'

const docsDir = dirname(dirname(fileURLToPath(import.meta.url)))
const articlesDir = join(docsDir, 'articles')

// 文章中的本地图片、文件资源在构建时会统一指向这个 R2 域名。
//const articleImageBaseUrl = 'https://pub-e217c4a931aa408baaea98a28d47de0f.r2.dev'
const articleImageBaseUrl = 'https://files.choumengqizhigou.com'

// 旧文章里已经写成完整 URL 的 OSS 图片，也会在构建时迁移到 R2。
const legacyArticleImageHosts = new Set([
  'blog-image-group.oss-cn-shanghai.aliyuncs.com'
])

// series.json 里只关心系列展示名称；文章列表由文件系统动态扫描生成。
interface SeriesMeta {
  title?: string
}

// categories.json 里维护类别颜色，类别名称和顺序来自文件夹名。
interface CategoryMeta {
  color?: string
}

// 读取可选 JSON 配置；文件不存在时返回 fallback，方便目录逐步补配置。
function readJson<T>(path: string, fallback: T) {
  if (!existsSync(path)) return fallback

  return JSON.parse(readFileSync(path, 'utf-8')) as T
}

// 支持 "1、名称"、"1_名称"、"1-名称" 这类前缀排序命名。
function parseOrderedName(name: string) {
  const match = name.match(/^(\d+)[、._-]\s*(.+)$/)

  return {
    name: match?.[2] ?? name,
    order: match ? Number(match[1]) : Number.MAX_SAFE_INTEGER
  }
}

// 侧边栏系列标题允许注入一点 HTML，因此所有外部文本先做转义。
function escapeHtml(text: string) {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}

// 资源地址转换只应用到 articles 下的文章，避免影响站点普通页面和导航链接。
function isArticleMarkdown(env: unknown) {
  const relativePath = typeof env === 'object' && env !== null && 'relativePath' in env
    ? String((env as { relativePath?: unknown }).relativePath ?? '').replace(/\\/g, '/')
    : ''

  return relativePath.startsWith('articles/')
}

// 判断是否是带协议的地址，例如 https:、mailto:、data:。
function hasUrlProtocol(src: string) {
  return /^[a-z][a-z\d+.-]*:/i.test(src)
}

// 将文章图片地址改写到 R2：
// - images/xxx 或 /images/xxx -> R2/images/xxx
// - 旧 OSS 完整地址 -> R2/文件名
// - 其他外链保持原样
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

// 将文章里的 /files 或 files 下载链接改写到 R2，普通站内链接不处理。
function toArticleFileUrl(href: string) {
  const trimmedHref = href.trim()

  if (!trimmedHref || trimmedHref.startsWith('#') || trimmedHref.startsWith(articleImageBaseUrl)) {
    return href
  }

  if (hasUrlProtocol(trimmedHref)) {
    return href
  }

  const filePath = trimmedHref.replace(/^\.?\//, '')

  return filePath.startsWith('files/')
    ? `${articleImageBaseUrl}/${filePath}`
    : href
}

// 把 markdown 文件路径转成 VitePress 路由；index.md 会折叠成目录路径。
function getRouteLink(path: string) {
  const normalized = relative(docsDir, path).replace(/\\/g, '/').replace(/\.md$/, '')

  return normalized.endsWith('/index')
    ? `/${normalized.slice(0, -'/index'.length)}/`
    : `/${normalized}`
}

// 读取目录并按文件夹名前缀序号排序。
function getDirectories(path: string) {
  if (!existsSync(path)) return []

  return readdirSync(path)
    .map((name) => ({ name, path: join(path, name), ...parseOrderedName(name) }))
    .filter((item) => statSync(item.path).isDirectory())
    .sort((a, b) => a.order - b.order)
}

// 读取当前系列下的 markdown 文件；侧边栏文本使用文件名本身，保留序号。
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

// 根据 docs/articles/<集合>/<类别>/<系列>/*.md 动态生成文章页左侧菜单。
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
  description: "丑萌气质狗CHOUMENGQIZHIGOU.COM-丑萌气质狗的个人博客，努力成为编程知识分享的一股清流，打造一个舒适、自由的个人社区，做好教育、教程的规划，记录个人成长的的所思所想，让自己在后续达到到某一阶段时都有迹可循，可供参考。博客内容范围包括但不限于：编程、知识、教育、教程、心得、感悟。技术包括但不限于:编译原理,操作系统,图形学,C#,CSharp,Unity,.NET,.NET Framework,DotNet,Winform,WPF,Direct3D,C,C++！",
  cleanUrls: true,
  head: [
    // favicon
    ['link', { rel: 'icon', href: '/favicon.ico' }]
  ],
  markdown: {
    config(md) {
      const defaultImageRule = md.renderer.rules.image
      const defaultLinkOpenRule = md.renderer.rules.link_open

      // 渲染 markdown 图片前，先把文章图片地址统一改写到 R2。
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

      // 渲染 markdown 链接前，只把文章里的 files 下载链接统一改写到 R2。
      md.renderer.rules.link_open = (tokens, idx, options, env, self) => {
        if (isArticleMarkdown(env)) {
          const token = tokens[idx]
          const href = token.attrGet('href')

          if (href) {
            token.attrSet('href', toArticleFileUrl(href))
          }
        }

        return defaultLinkOpenRule
          ? defaultLinkOpenRule(tokens, idx, options, env, self)
          : self.renderToken(tokens, idx, options)
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
      // { icon: 'github', link: 'https://github.com/choumengqizhigou' },
      {
        icon: {
          svg: '<svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24"><path fill="currentColor" d="M12 .297c-6.63 0-12 5.373-12 12c0 5.303 3.438 9.8 8.205 11.385c.6.113.82-.258.82-.577c0-.285-.01-1.04-.015-2.04c-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729c1.205.084 1.838 1.236 1.838 1.236c1.07 1.835 2.809 1.305 3.495.998c.108-.776.417-1.305.76-1.605c-2.665-.3-5.466-1.332-5.466-5.93c0-1.31.465-2.38 1.235-3.22c-.135-.303-.54-1.523.105-3.176c0 0 1.005-.322 3.3 1.23c.96-.267 1.98-.399 3-.405c1.02.006 2.04.138 3 .405c2.28-1.552 3.285-1.23 3.285-1.23c.645 1.653.24 2.873.12 3.176c.765.84 1.23 1.91 1.23 3.22c0 4.61-2.805 5.625-5.475 5.92c.42.36.81 1.096.81 2.22c0 1.606-.015 2.896-.015 3.286c0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/></svg>'
        },
        link: 'https://github.com/choumengqizhigou'
      },
      {
        icon: {
          svg: '<svg xmlns="<svg xmlns="http://www.w3.org/2000/svg"  viewBox="0 0 512 512"><path fill="#00AEEC" d="M202.667 261.333v32a26.666 26.666 0 0 1-45.523 18.856a26.67 26.67 0 0 1-7.811-18.856v-32a26.667 26.667 0 0 1 53.334 0m266.666-58.666v170.666A74.667 74.667 0 0 1 394.667 448H117.333a74.67 74.67 0 0 1-74.666-74.667V202.667A74.67 74.67 0 0 1 117.333 128h32l-24.106-23.893A26.551 26.551 0 0 1 144 58.784a26.55 26.55 0 0 1 18.773 7.776L224.427 128h64l61.653-61.44a26.55 26.55 0 1 1 37.547 37.547L362.667 128h32a74.67 74.67 0 0 1 74.666 74.667m-53.333 0a21.335 21.335 0 0 0-21.333-21.334H117.333A21.333 21.333 0 0 0 96 202.667v170.666a21.335 21.335 0 0 0 21.333 21.334h277.334A21.333 21.333 0 0 0 416 373.333zm-80 32a26.666 26.666 0 0 0-26.667 26.666v32a26.666 26.666 0 0 0 45.523 18.856a26.67 26.67 0 0 0 7.811-18.856v-32A26.667 26.667 0 0 0 336 234.667" /></svg>'
        },
        link: 'https://space.bilibili.com/90189489'
      },
    ],

    // footer: {
    //   message: 'Released under the MIT License.',
    //   copyright: 'Copyright © 2026-present 丑萌气质狗'
    // }
  }
})
