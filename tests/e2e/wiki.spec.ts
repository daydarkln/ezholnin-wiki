import { expect, test } from '@playwright/test'

test('finds an article from a practical search', async ({ page }) => {
  await page.goto('/')
  await page.getByPlaceholder('Например, как привязать сайт?').fill('рег ру ip')
  await expect(page.locator('[data-search-results]').getByRole('link', { name: /Как подключить домен REG.RU/ })).toBeVisible()
})

test('renders an article at its direct URL', async ({ page }) => {
  await page.goto('/articles/reg-ru-dns')
  await expect(page.getByRole('heading', { level: 1, name: 'Как подключить домен REG.RU к серверу' })).toBeVisible()
  await expect(page.getByText('IP, который пришлёт разработчик').first()).toBeVisible()
})

test('opens knowledge navigation on mobile', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 })
  await page.goto('/articles/reg-ru-dns')
  await page.getByTestId('mobile-tree').getByText('Разделы вики', { exact: true }).click()
  await expect(page.getByTestId('mobile-tree').getByRole('link', { name: 'Как купить домен' })).toBeVisible()
})

test('keeps DNS changes safe when corporate email exists', async ({ page }) => {
  await page.goto('/#domain-wizard')
  await page.getByRole('button', { name: 'На сервере разработчика — 500 ₽/мес.' }).click()
  await page.getByRole('button', { name: 'Да, домен куплен' }).click()
  await page.getByRole('button', { name: 'REG.RU' }).click()
  await page.getByRole('button', { name: 'Да' }).click()
  await expect(page.getByRole('heading', { name: 'Сначала проверим корпоративную почту' })).toBeVisible()
})

test('keeps the desktop wizard title on one line', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 })
  await page.goto('/#domain-wizard')
  const title = page.getByRole('heading', { name: 'Подключить свой домен' })
  await expect(title).toBeVisible()
  const height = await title.evaluate((element) => element.getBoundingClientRect().height)
  expect(height).toBeLessThan(60)
})

test('builds Telegram share links instead of submitting data', async ({ page }) => {
  await page.goto('/articles/reg-ru-dns')
  const href = await page.locator('[data-contact-link]').getAttribute('href')
  expect(href).toMatch(/^https:\/\/t\.me\/share\/url\?/) 
})
