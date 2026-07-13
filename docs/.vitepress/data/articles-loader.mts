import { existsSync, readFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { createContentLoader } from 'vitepress'

// 单篇文章里只允许少量 frontmatter 覆盖展示文案，类别/系列信息来自集合根目录配置。
interface ArticleFrontmatter {
  title?: string
  summary?: string
}

// categories.json 维护类别 ID、名称和颜色，首页类别排序直接使用 ID。
interface CategoryMeta {
  id: number
  name: string
  color?: string
}

// series.json 维护系列卡片的展示标题、摘要、所属类别 ID、排序和创建时间。
interface SeriesMeta {
  title?: string
  categoryId?: number
  order?: number
  createdAt?: string
  summary?: string
  progress?: number
}

// 首页卡片里展示的单篇文章摘要数据。
interface Article {
  title: string
  summary: string
  order: number
  url: string
}

// 一个系列对应一个系列文件夹，里面可以包含多篇 markdown 文章。
interface Series {
  title: string
  summary: string
  progress: number
  order: number
  createdAt: string
  url: string
  articles: Article[]
}

// 首页最终消费的数据结构：类别 -> 系列 -> 文章。
export interface Category {
  name: string
  color: string
  order: number
  series: Series[]
}

const dataDir = dirname(fileURLToPath(import.meta.url))

// 读取可选 JSON 配置，缺失时返回默认值，避免新目录必须立刻补配置。
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

// VitePress loader 给的是 URL，这里还原出 collection/series/article。
function getPathParts(url: string) {
  return url.split('/').filter(Boolean).map((part) => decodeURIComponent(part))
}

// 文章没有 frontmatter.title 时，优先取第一个一级标题。
function getTitleFromSource(source = '') {
  return source.match(/^#\s+(.+)$/m)?.[1]
}

// 文章没有 frontmatter.summary 时，取正文第一个普通段落作为摘要。
function getFirstParagraph(source = '') {
  return source
    .replace(/^---[\s\S]*?---\s*/, '')
    .split(/\r?\n/)
    .map((line) => line.trim())
    .find((line) => line && !line.startsWith('#') && !line.startsWith('```')) ?? ''
}

function createCategoryMap(categories: CategoryMeta[]) {
  return new Map(categories.map((category) => [category.id, category]))
}

// URL 文件名是标题的最后兜底来源。
function getTitleFromUrl(url: string) {
  return parseOrderedName(getPathParts(url).pop()?.replace(/\.html$/, '') ?? '').name
}

// 系列卡片点击后跳到该系列第一篇文章。
function getSeriesUrl(series: Series) {
  return series.articles.find((article) => article.url.endsWith('/'))?.url ?? series.articles[0]?.url ?? series.url
}

// 为指定集合创建 VitePress 数据加载器，例如 seriesa 或 seriesb。
export function createArticlesLoader(collection: string) {
  const collectionDir = join(dataDir, '../../articles', collection)
  const categories = readJson<CategoryMeta[]>(join(collectionDir, 'categories.json'), [])
  const categoryById = createCategoryMap(categories)
  const seriesMeta = readJson<Record<string, SeriesMeta>>(join(collectionDir, 'series.json'), {})

  return createContentLoader(`articles/${collection}/*/*.md`, {
    includeSrc: true,
    transform(rawArticles) {
      const categoryMap = new Map<string, Category>()
      const seriesMap = new Map<string, Series>()

      // 第一次遍历文章：按目录拆出系列、文章，再通过 series.json 找到所属类别。
      rawArticles.forEach(({ url, frontmatter, src }) => {
        const meta = frontmatter as ArticleFrontmatter
        const [, , seriesFolder = '未命名系列', articleFile = ''] = getPathParts(url)
        const parsedSeries = parseOrderedName(seriesFolder)
        const parsedArticle = parseOrderedName(articleFile.replace(/\.html$/, ''))
        const seriesInfo = seriesMeta[parsedSeries.name] ?? {}
        const categoryInfo = categoryById.get(seriesInfo.categoryId ?? 0)
        const categoryName = categoryInfo?.name ?? '未分类'
        const category = categoryMap.get(categoryName) ?? {
          name: categoryName,
          color: categoryInfo?.color ?? '#409EFF',
          order: categoryInfo?.id ?? Number.MAX_SAFE_INTEGER,
          series: []
        }
        const seriesKey = `${categoryName}/${parsedSeries.name}`
        const series = seriesMap.get(seriesKey) ?? {
          title: seriesInfo.title ?? parsedSeries.name,
          summary: seriesInfo.summary ?? '',
          progress: seriesInfo.progress ?? 0,
          order: seriesInfo.order ?? parsedSeries.order,
          createdAt: seriesInfo.createdAt ?? '',
          url,
          articles: []
        }

        series.articles.push({
          title: meta.title ?? getTitleFromSource(src) ?? getTitleFromUrl(url),
          summary: meta.summary ?? getFirstParagraph(src),
          order: parsedArticle.order,
          url
        })

        categoryMap.set(categoryName, category)
        seriesMap.set(seriesKey, series)
      })

      // 第二次整理系列：排序文章、计算系列入口，并挂回所属类别。
      seriesMap.forEach((series, key) => {
        const categoryName = key.split('/')[0]
        const category = categoryMap.get(categoryName)

        if (!category || !series.articles.length) return

        series.articles.sort((a, b) => a.order - b.order)
        series.url = getSeriesUrl(series)
        category.series.push(series)
      })

      // 输出前过滤空类别，并按类别/系列的目录序号稳定排序。
      return Array.from(categoryMap.values())
        .map((category) => ({
          ...category,
          series: category.series.sort((a, b) => a.order - b.order)
        }))
        .filter((category) => category.series.length > 0)
        .sort((a, b) => a.order - b.order)
    }
  })
}
