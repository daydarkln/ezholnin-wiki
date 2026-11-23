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

test('opens a CRM subpage from the guide and finds it through search', async ({ page }) => {
  await page.goto('/#integrations')
  await page.locator('#integrations').getByRole('link', { name: 'Как подключить сайт к CRM' }).click()
  const guides = page.getByRole('region', { name: 'Инструкции по CRM' })
  await expect(guides.locator('.linked-articles').getByRole('link')).toHaveCount(4)
  await guides.getByRole('link', { name: /Как подключить Битрикс24/ }).click()
  await expect(page).toHaveURL(/\/articles\/crm\/bitrix24\/?$/)
  await expect(page.getByRole('heading', { level: 1, name: 'Как подключить Битрикс24' })).toBeVisible()
  await page.getByRole('navigation', { name: 'Хлебные крошки' }).getByRole('link', { name: 'Как подключить сайт к CRM' }).click()
  await expect(guides).toBeVisible()

  await page.goto('/')
  await page.getByRole('searchbox', { name: 'Поиск по вики' }).fill('1с crm')
  const result = page.locator('[data-search-results]').getByRole('link', { name: /Как подключить 1С:CRM/ })
  await expect(result).toHaveAttribute('href', '/articles/crm/1c-crm')
})

test('opens article headings by fragment and keeps them below the mobile header', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 })
  await page.goto('/articles/yandex-metrika')
  const headings = page.getByRole('article').getByRole('heading')
  const permalinks = await headings.evaluateAll((elements) =>
    elements.map((heading) => ({ id: heading.id, href: heading.querySelector('a')?.getAttribute('href') })),
  )
  expect(new Set(permalinks.map(({ id }) => id)).size).toBe(permalinks.length)
  for (const { id, href } of permalinks) {
    expect(id).toBeTruthy()
    expect(href).toBe(`#${id}`)
  }

  const section = headings.filter({ hasText: '3. Проверьте счётчик и цель' })
  const fragment = '#3-проверьте-счётчик-и-цель'
  await section.getByRole('link').click()
  expect(decodeURIComponent(new URL(page.url()).hash)).toBe(fragment)

  await page.goto('/')
  await page.goto(`/articles/yandex-metrika${fragment}`)
  await expect(section).toHaveJSProperty('id', fragment.slice(1))
  await expect.poll(async () => {
    const header = await page.locator('.site-header').boundingBox()
    const heading = await section.boundingBox()
    return Boolean(header && heading && heading.y >= header.y + header.height && heading.y < 140)
  }).toBe(true)
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

test('places the desktop questionnaire below the heading', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 })
  await page.goto('/#domain-wizard')
  const title = page.getByRole('heading', { name: 'Подключить свой домен' })
  const card = page.locator('.wizard-card')
  await expect(title).toBeVisible()
  await expect(card).toBeVisible()
  const height = await title.evaluate((element) => element.getBoundingClientRect().height)
  const [titleBox, cardBox] = await Promise.all([title.boundingBox(), card.boundingBox()])
  expect(height).toBeLessThan(60)
  expect(cardBox!.y).toBeGreaterThan(titleBox!.y + titleBox!.height)
  expect(cardBox!.width).toBeGreaterThan(700)
})

test('groups wizard result actions as buttons', async ({ page }) => {
  await page.goto('/#domain-wizard')
  await page.getByRole('button', { name: 'На сервере разработчика — 500 ₽/мес.' }).click()
  await page.getByRole('button', { name: 'Нет, ещё не купил' }).click()
  const actions = page.locator('[data-wizard-actions]')
  await expect(actions.getByRole('link', { name: 'Как купить домен' })).toBeVisible()
  await expect(actions.getByRole('button', { name: 'Начать заново' })).toBeVisible()
  await expect(actions.getByRole('button', { name: 'Начать заново' })).toHaveClass(/button-secondary/)
})

test('builds Telegram share links instead of submitting data', async ({ page }) => {
  await page.goto('/articles/reg-ru-dns')
  const href = await page.locator('[data-contact-link]').getAttribute('href')
  expect(href).toMatch(/^https:\/\/t\.me\/share\/url\?/) 
})
