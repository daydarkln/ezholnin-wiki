import Fuse from 'fuse.js'
import { knowledgeArticles, type KnowledgeArticle } from '../data/knowledge'

export type SearchResult = KnowledgeArticle & { score: number }

export function normalizeSearchQuery(value: string): string {
  return value
    .toLocaleLowerCase('ru-RU')
    .replaceAll('ё', 'е')
    .replace(/[^a-zа-я0-9@._-]+/gi, ' ')
    .trim()
    .replace(/\s+/g, ' ')
}

const searchIndex = new Fuse(knowledgeArticles, {
  includeScore: true,
  threshold: 0.38,
  ignoreLocation: true,
  minMatchCharLength: 2,
  keys: [
    { name: 'title', weight: 0.42 },
    { name: 'aliases', weight: 0.25 },
    { name: 'tags', weight: 0.18 },
    { name: 'summary', weight: 0.1 },
    { name: 'intro', weight: 0.05 },
  ],
})

export function searchKnowledge(query: string): SearchResult[] {
  const normalizedQuery = normalizeSearchQuery(query)

  if (normalizedQuery.length < 2) {
    return []
  }

  return searchIndex.search(normalizedQuery).map(({ item, score }) => ({ ...item, score: score ?? 1 }))
}
