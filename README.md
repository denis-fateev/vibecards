# Nika

Персональное приложение для запоминания слов и карточек (React + Vite + IndexedDB).

## Разработка

```bash
npm install
npm run dev
```

## GitHub Pages

Да, **GitHub Pages подходит**: сайт отдаётся по HTTPS, этого достаточно для PWA и service worker на iOS.

1. В репозитории: **Settings → Pages → Build and deployment → Source: GitHub Actions** (не «Deploy from a branch»).
2. Запушьте в ветку `main` — workflow `.github/workflows/deploy-pages.yml` соберёт проект и опубликует `dist`.

Если при пуше в Deployments появляются **два** деплоя (`Deploy to GitHub Pages` и `pages-build-deployment`), источник Pages всё ещё привязан к ветке. Переключите Source на **GitHub Actions** — останется только ваш workflow; иначе `pages-build-deployment` публикует корень репозитория без сборки Vite и сайт уходит в 404.
3. URL проекта: `https://<user>.github.io/<имя-репозитория>/` (для репозитория `quizlet2` — `https://<user>.github.io/quizlet2/`).

Базовый путь берётся из имени репозитория (`VITE_BASE_PATH`). Локальная проверка production-сборки с тем же путём:

```bash
VITE_BASE_PATH=/quizlet2/ npm run build
npm run preview
```

Если репозиторий опубликован как **user/org site** с корня (`username.github.io` без подпапки), задайте при сборке `VITE_BASE_PATH=/`.

### PWA на iPhone

1. Откройте опубликованный URL в **Safari**.
2. **Поделиться → На экран «Домой»**.
3. Запускайте с иконки — приложение откроется в standalone-режиме. Данные остаются в IndexedDB на устройстве.
