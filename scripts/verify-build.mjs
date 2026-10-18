import assert from 'node:assert/strict'
import { readdir, readFile } from 'node:fs/promises'
import { join, resolve } from 'node:path'

const dist = resolve('dist')
const homepage = await readFile(join(dist, 'index.html'), 'utf8')
const articleDirectories = await readdir(join(dist, 'articles'), { withFileTypes: true })
const articleCount = articleDirectories.filter((entry) => entry.isDirectory()).length
const sitemap = await readFile(join(dist, 'sitemap.xml'), 'utf8')
const robots = await readFile(join(dist, 'robots.txt'), 'utf8')

assert.match(homepage, /<title>Вики о разработке лендинга \| Егор Жолнин<\/title>/)
assert.match(homepage, /<link rel="canonical" href="https:\/\/wiki\.ezholnin\.ru\//)
assert.ok(articleCount >= 10, 'expected static article pages')
assert.match(sitemap, /https:\/\/wiki\.ezholnin\.ru\/articles\/reg-ru-dns/)
assert.match(robots, /Sitemap: https:\/\/wiki\.ezholnin\.ru\/sitemap\.xml/)
assert.doesNotMatch(homepage, /141\.105\.70\.232/)

const dnsArticle = await readFile(join(dist, 'articles', 'reg-ru-dns', 'index.html'), 'utf8')
assert.match(dnsArticle, /IP, который пришлёт разработчик/)
assert.doesNotMatch(dnsArticle, /141\.105\.70\.232/)

console.log(`Verified wiki build: ${articleCount} static articles.`)
