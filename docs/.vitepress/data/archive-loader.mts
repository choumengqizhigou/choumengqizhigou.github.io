import { createContentLoader } from 'vitepress'

// 归档文章只从 frontmatter 读取标题和创建时间，正文保持为文章自身内容。
interface ArchiveFrontmatter {
  title?: string
  createdAt?: unknown
  titleColor?: unknown
}

export interface ArchiveArticle {
  title: string
  createdAt: string
  titleColor: string
  url: string
}

function getTitleFromUrl(url: string) {
  const filename = decodeURIComponent(url.split('/').filter(Boolean).pop() ?? '')

  return filename.replace(/\.html$/, '')
}

function getTimeValue(createdAt: string) {
  const time = new Date(createdAt).getTime()

  return Number.isNaN(time) ? 0 : time
}

function formatDate(value: unknown) {
  if (!value) return ''

  if (value instanceof Date) {
    return value.toISOString().slice(0, 10)
  }

  return String(value)
}

function formatColor(value: unknown) {
  return value ? String(value) : ''
}

// 扫描 docs/articles/archive 下的 markdown，归档页和首页最新文章入口共用这份数据。
export const archiveLoader = createContentLoader('articles/archive/*.md', {
  includeSrc: true,
  transform(rawArticles) {
    return rawArticles
      .map(({ url, frontmatter, src }) => {
        const meta = frontmatter as ArchiveFrontmatter

        return {
          title: meta.title ?? getTitleFromUrl(url),
          createdAt: formatDate(meta.createdAt),
          titleColor: formatColor(meta.titleColor),
          url
        }
      })
      .sort((a, b) => getTimeValue(b.createdAt) - getTimeValue(a.createdAt))
  }
})
