import { existsSync, readFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { createContentLoader } from 'vitepress'

// 单篇文章里只允许少量 frontmatter 覆盖展示文案，类别/系列信息来自目录配置。
interface ArticleFrontmatter {
  title?: string
  summary?: string
}

// categories.json 目前只维护颜色，类别名称和排序来自文件夹名。
interface CategoryMeta {
  color?: string
}

// series.json 维护系列卡片的展示标题和摘要。
interface SeriesMeta {
  title?: string
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

// 当目录没有数字前缀时，使用 JSON 配置里的键顺序作为兜底排序。
function createFallbackOrder(source: Record<string, unknown>) {
  return new Map(Object.keys(source).map((name, index) => [name, index + 1]))
}

// 支持 "1、名称"、"1_名称"、"1-名称" 这类前缀排序命名。
function parseOrderedName(name: string) {
  const match = name.match(/^(\d+)[、._-]\s*(.+)$/)

  return {
    name: match?.[2] ?? name,
    order: match ? Number(match[1]) : Number.MAX_SAFE_INTEGER
  }
}

// VitePress loader 给的是 URL，这里还原出 collection/category/series/article。
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
  const categoryMeta = readJson<Record<string, CategoryMeta>>(join(collectionDir, 'categories.json'), {})
  const categoryFallbackOrder = createFallbackOrder(categoryMeta)
  const seriesMetaCache = new Map<string, Record<string, SeriesMeta>>()

  // series.json 按类别缓存，避免同一个类别下多篇文章重复读取文件。
  function getSeriesMeta(categoryFolder: string) {
    const cached = seriesMetaCache.get(categoryFolder)
    if (cached) return cached

    const meta = readJson<Record<string, SeriesMeta>>(join(collectionDir, categoryFolder, 'series.json'), {})
    seriesMetaCache.set(categoryFolder, meta)

    return meta
  }

  return createContentLoader(`articles/${collection}/*/*/*.md`, {
    includeSrc: true,
    transform(rawArticles) {
      const categoryMap = new Map<string, Category>()
      const seriesMap = new Map<string, Series>()

      // 第一次遍历文章：按目录拆出类别、系列、文章，并先聚合到 Map。
      rawArticles.forEach(({ url, frontmatter, src }) => {
        const meta = frontmatter as ArticleFrontmatter
        const [, , categoryFolder = '未分类', seriesFolder = '未命名系列', articleFile = ''] = getPathParts(url)
        const parsedCategory = parseOrderedName(categoryFolder)
        const parsedSeries = parseOrderedName(seriesFolder)
        const parsedArticle = parseOrderedName(articleFile.replace(/\.html$/, ''))
        const categoryName = parsedCategory.name
        const categoryInfo = categoryMeta[categoryName] ?? {}
        const seriesMeta = getSeriesMeta(categoryFolder)
        const seriesInfo = seriesMeta[parsedSeries.name] ?? {}
        const category = categoryMap.get(categoryName) ?? {
          name: categoryName,
          color: categoryInfo.color ?? '#409EFF',
          order: parsedCategory.order === Number.MAX_SAFE_INTEGER
            ? categoryFallbackOrder.get(categoryName) ?? parsedCategory.order
            : parsedCategory.order,
          series: []
        }
        const seriesKey = `${categoryName}/${parsedSeries.name}`
        const seriesFallbackOrder = createFallbackOrder(seriesMeta)
        const series = seriesMap.get(seriesKey) ?? {
          title: seriesInfo.title ?? parsedSeries.name,
          summary: seriesInfo.summary ?? '',
          progress: seriesInfo.progress ?? 0,
          order: parsedSeries.order === Number.MAX_SAFE_INTEGER
            ? seriesFallbackOrder.get(parsedSeries.name) ?? parsedSeries.order
            : parsedSeries.order,
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
