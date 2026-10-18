import { describe, expect, it } from 'vitest'
import { knowledgeArticles, knowledgeCategories } from '../../src/data/knowledge'

describe('knowledge graph', () => {
  it('uses unique IDs and slugs', () => {
    expect(new Set(knowledgeArticles.map((article) => article.id)).size).toBe(knowledgeArticles.length)
    expect(new Set(knowledgeArticles.map((article) => article.slug)).size).toBe(knowledgeArticles.length)
  })

  it('only links to real articles and categories', () => {
    const ids = new Set(knowledgeArticles.map((article) => article.id))
    const categoryIds = new Set(knowledgeCategories.map((category) => category.id))

    knowledgeArticles.forEach((article) => {
      expect(categoryIds.has(article.categoryId)).toBe(true)
      expect(article.relatedIds.every((id) => ids.has(id))).toBe(true)
      expect(article.nextIds.every((id) => ids.has(id))).toBe(true)
      expect(article.updatedAt).toMatch(/^\d{4}-\d{2}-\d{2}$/)
    })
  })

  it('never publishes production IP addresses', () => {
    expect(JSON.stringify(knowledgeArticles)).not.toMatch(/\b\d{1,3}(?:\.\d{1,3}){3}\b/)
  })
})
