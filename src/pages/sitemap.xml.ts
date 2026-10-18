import type { APIRoute } from 'astro'
import { knowledgeArticles } from '../data/knowledge'

const origin = 'https://wiki.ezholnin.ru'

export const GET: APIRoute = () => {
  const urls = ['/', ...knowledgeArticles.map((article) => `/articles/${article.slug}`)]
  const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.map((path) => `  <url><loc>${new URL(path, origin).toString()}</loc></url>`).join('\n')}\n</urlset>\n`

  return new Response(xml, { headers: { 'Content-Type': 'application/xml; charset=utf-8' } })
}
