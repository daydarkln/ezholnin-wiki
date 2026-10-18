# Wiki Егора Жолнина

Статическая база знаний для клиентов, заказывающих лендинг. Публикуется независимо от основного сайта на `wiki.ezholnin.ru`.

## Локальный запуск

```bash
corepack enable
yarn install --frozen-lockfile
yarn dev
```

## Проверка

```bash
yarn verify
yarn test:e2e
```

## Деплой

Push в `main` запускает GitHub Actions. Перед первым релизом добавьте в репозиторий секреты `WIKI_DEPLOY_SSH_KEY` и `WIKI_DEPLOY_KNOWN_HOSTS`.

Деплой создаёт статический release в `/srv/www/sites/wiki`, выпускает сертификат для `wiki.ezholnin.ru` и переключает Nginx на новый release.
