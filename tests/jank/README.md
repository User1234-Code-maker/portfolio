# Замеры «дёрганья» при скролле на телефоне

Сначала собрать и запустить сайт: `npm run build && VITE_BASE=/ npx vite preview --port 4173`

- `node tests/jank/measure.cjs` — меняет высоту окна посреди скролла (как прячется панель в Telegram/Chrome) и смотрит, сдвинулись ли элементы. Норма: `resizeJumpPx: 0`.
- `node tests/jank/stress.cjs` — процессор медленнее в 4 раза, свайпы пальцем + прячется панель. Норма: CLS < 0.01, «уплыл заголовок» 0, «откаты назад» 0.
- `node tests/jank/touch.cjs` — листается ли страница с первого свайпа.

Скрипты ищут Chrome в `/usr/bin/google-chrome`; на Маке поправь `executablePath` или убери его.
