import { describe, expect, it } from 'vitest'
import { getWizardResult } from '../../src/lib/domain-wizard'

describe('domain wizard', () => {
  it('returns two A records only for safe REG.RU context', () => {
    const result = getWizardResult({ hosting: 'mine', domain: 'registered', dns: 'reg-ru', email: 'no', cname: 'no' })
    expect(result?.kind).toBe('records')
    if (result?.kind === 'records') {
      expect(result.records).toEqual([
        { name: '@', type: 'A', value: 'IP, который пришлёт разработчик' },
        { name: 'www', type: 'A', value: 'IP, который пришлёт разработчик' },
      ])
    }
  })

  it('stops before changes when corporate email exists', () => {
    const result = getWizardResult({ hosting: 'mine', domain: 'registered', dns: 'reg-ru', email: 'yes' })
    expect(result?.kind).toBe('contact')
  })

  it('sends external hosting to its provider', () => {
    expect(getWizardResult({ hosting: 'external' })?.kind).toBe('external-hosting')
  })
})
