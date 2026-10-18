export type WizardContext = {
  hosting?: 'mine' | 'external'
  domain?: 'registered' | 'not-registered'
  dns?: 'reg-ru' | 'other' | 'unknown'
  email?: 'yes' | 'no' | 'unknown'
  cname?: 'yes' | 'no' | 'unknown'
}

export type WizardResult =
  | { kind: 'need-domain'; title: string; description: string; articleSlug: string }
  | { kind: 'external-hosting'; title: string; description: string }
  | { kind: 'contact'; title: string; description: string }
  | { kind: 'records'; title: string; description: string; records: Array<{ name: string; type: string; value: string }> }

export function getWizardResult(context: WizardContext): WizardResult | null {
  if (!context.hosting) return null

  if (context.hosting === 'external') {
    return {
      kind: 'external-hosting',
      title: 'Нужны данные от выбранного хостинга',
      description: 'Запросите у провайдера инструкцию по подключению домена и его актуальные DNS-записи. Не используйте универсальные значения из чужих инструкций.',
    }
  }

  if (!context.domain || context.domain === 'not-registered') {
    return {
      kind: 'need-domain',
      title: 'Сначала зарегистрируйте домен',
      description: 'Оформите домен на свой аккаунт, сохраните доступ и вернитесь к подключению после покупки.',
      articleSlug: 'buy-domain',
    }
  }

  if (context.dns === 'other' || context.dns === 'unknown') {
    return {
      kind: 'contact',
      title: 'Нужна безопасная проверка DNS',
      description: 'Не меняйте DNS-серверы самостоятельно. Пришлите скриншот текущих записей или название провайдера — сначала нужно понять, где управляется зона.',
    }
  }

  if (context.email === 'yes' || context.email === 'unknown') {
    return {
      kind: 'contact',
      title: 'Сначала проверим корпоративную почту',
      description: 'На домене могут быть MX и TXT-записи для почты. Не удаляйте и не заменяйте их: пришлите скриншот DNS-зоны разработчику.',
    }
  }

  if (context.cname === 'yes' || context.cname === 'unknown') {
    return {
      kind: 'contact',
      title: 'Проверим запись для www',
      description: 'Для одного имени нельзя одновременно использовать CNAME и A-запись. Не меняйте запись вслепую — сначала покажите её разработчику.',
    }
  }

  if (context.dns === 'reg-ru' && context.email === 'no' && context.cname === 'no') {
    return {
      kind: 'records',
      title: 'Можно добавить две A-записи',
      description: 'В REG.RU откройте «Ресурсные записи», добавьте или обновите эти записи и затем сообщите разработчику о завершении.',
      records: [
        { name: '@', type: 'A', value: 'IP, который пришлёт разработчик' },
        { name: 'www', type: 'A', value: 'IP, который пришлёт разработчик' },
      ],
    }
  }

  return null
}
