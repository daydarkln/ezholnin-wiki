const COUNTER_ID = 109215687
const CONSENT_KEY = 'ezholnin-wiki:analytics-consent'

type MetrikaFunction = ((...args: unknown[]) => void) & { a?: unknown[][]; l?: number }

declare global {
  interface Window {
    ym?: MetrikaFunction
  }
}

export function hasAnalyticsConsent(): boolean {
  return window.localStorage.getItem(CONSENT_KEY) === 'accepted'
}

export function setAnalyticsConsent(value: 'accepted' | 'rejected'): void {
  window.localStorage.setItem(CONSENT_KEY, value)
}

export function initializeAnalytics(): void {
  if (!hasAnalyticsConsent() || window.ym) return

  const queue: MetrikaFunction = (...args) => {
    queue.a = queue.a ?? []
    queue.a.push(args)
  }

  queue.l = Date.now()
  window.ym = queue
  window.ym(COUNTER_ID, 'init', {
    clickmap: true,
    trackLinks: true,
    accurateTrackBounce: true,
    url: window.location.href,
  })

  const script = document.createElement('script')
  script.async = true
  script.src = `https://mc.yandex.ru/metrika/tag.js?id=${COUNTER_ID}`
  document.head.append(script)
}

export function trackGoal(goal: string): void {
  if (hasAnalyticsConsent()) {
    window.ym?.(COUNTER_ID, 'reachGoal', goal)
  }
}

export function makeTelegramShareLink(text: string, url = window.location.href): string {
  return `https://t.me/share/url?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text)}`
}
