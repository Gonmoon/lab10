# Belpost Subscriptions (Fullstack пример)

- `server/` — backend на Node.js + Express + Mongoose (MongoDB)
- `client/` — frontend на React + Redux + React Router + Axios

## Быстрый старт

1. Запустите MongoDB локально (например, `mongodb://127.0.0.1:27017`).
2. Настройте и запустите backend:

```bash
cd server
npm install
cp .env.example .env
npm run seed
npm run dev
```

3. Запустите frontend:

```bash
cd client
npm install
npm run dev
```

4. Откройте браузер и перейдите по адресу, который покажет Vite (обычно `http://localhost:5173`).

Backend по умолчанию слушает `http://localhost:5000`, REST API доступно по пути `/api`.
