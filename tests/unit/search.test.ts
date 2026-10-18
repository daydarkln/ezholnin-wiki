import { describe, expect, it } from 'vitest'
import { normalizeSearchQuery, searchKnowledge } from '../../src/lib/search'

describe('knowledge search', () => {
  it('normalizes whitespace and Russian ё', () => {
    expect(normalizeSearchQuery('  Всё   о Ёлке! ')).toBe('все о елке')
  })

  it('finds REG.RU DNS guidance from a practical query', () => {
    expect(searchKnowledge('рег ру ip')[0]?.id).toBe('reg-ru-dns')
  })

  it('finds changes by a nontechnical phrase', () => {
    expect(searchKnowledge('поменять фотографии')[0]?.id).toBe('site-changes')
  })

  it('does not search one-character noise', () => {
    expect(searchKnowledge('я')).toEqual([])
  })
})
