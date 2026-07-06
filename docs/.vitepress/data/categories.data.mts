import { existsSync, readFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { createContentLoader } from 'vitepress'

interface ArticleFrontmatter {
  title?: string
  summary?: string
}

interface CategoryMeta {
  color?: string
}

interface SeriesMeta {
  title?: string
  summary?: string
  progress?: number
}

interface Article {
  title: string
  summary: string
  order: number
  url: string
}

interface Series {
  title: string
  summary: string
  progress: number
  order: number
  url: string
  articles: Article[]
}

export interface Category {
  name: string
  color: string
  order: number
  series: Series[]
}

const dataDir = dirname(fileURLToPath(import.meta.url))
const categoriesDir = join(dataDir, '../../categories')
const categoryMeta = readJson<Record<string, CategoryMeta>>(join(categoriesDir, 'categories.json'), {})
const categoryFallbackOrder = createFallbackOrder(categoryMeta)
const seriesMetaCache = new Map<string, Record<string, SeriesMeta>>()

function readJson<T>(path: string, fallback: T) {
  if (!existsSync(path)) return fallback

  return JSON.parse(readFileSync(path, 'utf-8')) as T
}

function createFallbackOrder(source: Record<string, unknown>) {
  return new Map(Object.keys(source).map((name, index) => [name, index + 1]))
}

function parseOrderedName(name: string) {
  const match = name.match(/^(\d+)[、._-]\s*(.+)$/)

  return {
    name: match?.[2] ?? name,
    order: match ? Number(match[1]) : Number.MAX_SAFE_INTEGER
  }
}

function getPathParts(url: string) {
  return url.split('/').filter(Boolean).map((part) => decodeURIComponent(part))
}

function getTitleFromSource(source = '') {
  return source.match(/^#\s+(.+)$/m)?.[1]
}

function getFirstParagraph(source = '') {
  return source
    .replace(/^---[\s\S]*?---\s*/, '')
    .split(/\r?\n/)
    .map((line) => line.trim())
    .find((line) => line && !line.startsWith('#') && !line.startsWith('```')) ?? ''
}

function getTitleFromUrl(url: string) {
  return parseOrderedName(getPathParts(url).pop()?.replace(/\.html$/, '') ?? '').name
}

function getSeriesMeta(categoryFolder: string) {
  const cached = seriesMetaCache.get(categoryFolder)
  if (cached) return cached

  const meta = readJson<Record<string, SeriesMeta>>(join(categoriesDir, categoryFolder, 'series.json'), {})
  seriesMetaCache.set(categoryFolder, meta)

  return meta
}

function getSeriesUrl(series: Series) {
  return series.articles.find((article) => article.url.endsWith('/'))?.url ?? series.articles[0]?.url ?? series.url
}

export default createContentLoader('categories/*/*/*.md', {
  includeSrc: true,
  transform(rawArticles) {
    const categoryMap = new Map<string, Category>()
    const seriesMap = new Map<string, Series>()

    rawArticles.forEach(({ url, frontmatter, src }) => {
      const meta = frontmatter as ArticleFrontmatter
      const [, categoryFolder = '未分类', seriesFolder = '未命名系列', articleFile = ''] = getPathParts(url)
      const parsedCategory = parseOrderedName(categoryFolder)
      const parsedSeries = parseOrderedName(seriesFolder)
      const parsedArticle = parseOrderedName(articleFile.replace(/\.html$/, ''))
      const categoryName = parsedCategory.name
      const categoryInfo = categoryMeta[categoryName] ?? {}
      const seriesInfo = getSeriesMeta(categoryFolder)[parsedSeries.name] ?? {}
      const category = categoryMap.get(categoryName) ?? {
        name: categoryName,
        color: categoryInfo.color ?? '#409EFF',
        order: parsedCategory.order === Number.MAX_SAFE_INTEGER
          ? categoryFallbackOrder.get(categoryName) ?? parsedCategory.order
          : parsedCategory.order,
        series: []
      }
      const seriesKey = `${categoryName}/${parsedSeries.name}`
      const seriesFallbackOrder = createFallbackOrder(getSeriesMeta(categoryFolder))
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

    seriesMap.forEach((series, key) => {
      const categoryName = key.split('/')[0]
      const category = categoryMap.get(categoryName)

      if (!category) return

      series.articles.sort((a, b) => a.order - b.order)
      series.url = getSeriesUrl(series)
      category.series.push(series)
    })

    return Array.from(categoryMap.values())
      .map((category) => ({
        ...category,
        series: category.series.sort((a, b) => a.order - b.order)
      }))
      .sort((a, b) => a.order - b.order)
  }
})
