# Fullstack додаток

Повнофункціональний додаток, що складається з мобільної частини (React Native Expo), веб-частини (React), серверної частини (Elysia) та бази даних PostgreSQL з ORM Prisma.

## 🏗️ Архітектура проекту

```
project/
├── mobile/          # React Native Expo додаток
├── web/            # React веб-додаток
├── server/         # Elysia API сервер
└── README.md       # Цей файл
```

## 📋 Передумови

Перед запуском проекту переконайтеся, що у вас встановлено:

- [Node.js](https://nodejs.org/) (версія 18 або вище)
- [PostgreSQL](https://www.postgresql.org/) (версія 13 або вище)
- [Git](https://git-scm.com/)
- [Expo CLI](https://docs.expo.dev/get-started/installation/) для мобільної частини

```bash
# Встановлення Expo CLI глобально
npm install -g @expo/cli
```

## 🚀 Швидкий старт

### 1. Клонування репозиторію

```bash
git clone <your-repository-url>
cd <project-name>
```

### 2. Налаштування бази даних

Створіть PostgreSQL базу даних:

```sql
CREATE DATABASE your_database_name;
CREATE USER your_username WITH PASSWORD 'your_password';
GRANT ALL PRIVILEGES ON DATABASE your_database_name TO your_username;
```

### 3. Налаштування серверної частини

```bash
cd server
npm install

# Створіть файл .env на основі .env.example
cp .env.example .env
```

Відредагуйте файл `.env`:

```env
# Database
DATABASE_URL="postgresql://your_username:your_password@localhost:5432/your_database_name"

# Server
PORT=3001
NODE_ENV=development

# JWT Secret (згенеруйте безпечний ключ)
JWT_SECRET=your_jwt_secret_key

# CORS
CORS_ORIGIN=http://localhost:3000
```

Виконайте міграції Prisma:

```bash
# Генерація Prisma клієнта
npx prisma generate

# Запуск міграцій
npx prisma db push

# (Опціонально) Заповнення бази тестовими даними
npx prisma db seed
```

Запустіть сервер:

```bash
npm run dev
```

Сервер буде доступний за адресою: `http://localhost:3001`

### 4. Налаштування веб-частини

У новому терміналі:

```bash
cd web
npm install

# Створіть файл .env на основі .env.example
cp .env.example .env
```

Відредагуйте файл `.env`:

```env
REACT_APP_API_URL=http://localhost:3001
REACT_APP_NODE_ENV=development
```

Запустіть веб-додаток:

```bash
npm start
```

Веб-додаток буде доступний за адресою: `http://localhost:3000`

### 5. Налаштування мобільної частини

У новому терміналі:

```bash
cd mobile
npm install

# Створіть файл .env на основі .env.example
cp .env.example .env
```

Відредагуйте файл `.env`:

```env
EXPO_PUBLIC_API_URL=http://localhost:3001
EXPO_PUBLIC_NODE_ENV=development
```

Запустіть мобільний додаток:

```bash
# Для розробки
npx expo start

# Для конкретної платформи
npx expo start --ios
npx expo start --android
```

## 📱 Запуск мобільного додатку

### iOS (тільки на macOS)

```bash
cd mobile
npx expo run:ios
```

### Android

```bash
cd mobile
npx expo run:android
```

### Expo Go

1. Встановіть [Expo Go](https://expo.dev/client) на свій телефон
2. Запустіть `npx expo start` у папці `mobile`
3. Відскануйте QR-код за допомогою Expo Go

## 🛠️ Корисні команди

### Серверна частина (Elysia + Prisma)

```bash
cd server

# Розробка з hot reload
npm run dev

# Призма команди
npx prisma studio          # Відкрити Prisma Studio
npx prisma generate         # Згенерувати клієнт
npx prisma db push          # Застосувати зміни схеми
npx prisma db pull          # Витягти схему з БД
npx prisma migrate dev      # Створити міграцію
npx prisma migrate reset    # Скинути БД та міграції

# Білд для продакшену
npm run build
npm start
```

### Веб-частина (React)

```bash
cd web

# Розробка
npm start

# Білд для продакшену
npm run build

# Тестування
npm test

# Аналіз бандлу
npm run analyze
```

### Мобільна частина (React Native Expo)

```bash
cd mobile

# Розробка
npx expo start

# Білд для продакшену
npx expo build:ios
npx expo build:android

# Очистити кеш
npx expo start --clear

# Оновити залежності
npx expo install --fix
```

## 🔧 Структура проекту

### Серверна частина (`/server`)

```
server/
├── src/
│   ├── controllers/     # Контролери для обробки запитів
│   ├── middlewares/     # Проміжні обробники
│   ├── routes/         # Маршрути API
│   ├── services/       # Бізнес-логіка
│   ├── utils/          # Допоміжні функції
│   └── index.ts        # Точка входу
├── prisma/
│   ├── schema.prisma   # Схема бази даних
│   └── migrations/     # Міграції
├── .env.example
└── package.json
```

### Веб-частина (`/web`)

```
web/
├── src/
│   ├── components/     # React компоненти
│   ├── pages/         # Сторінки додатку
│   ├── hooks/         # Власні хуки
│   ├── services/      # API сервіси
│   ├── utils/         # Допоміжні функції
│   └── App.tsx        # Головний компонент
├── public/
├── .env.example
└── package.json
```

### Мобільна частина (`/mobile`)

```
mobile/
├── src/
│   ├── components/     # React Native компоненти
│   ├── screens/       # Екрани додатку
│   ├── navigation/    # Навігація
│   ├── services/      # API сервіси
│   ├── hooks/         # Власні хуки
│   └── utils/         # Допоміжні функції
├── assets/
├── .env.example
├── app.json
└── package.json
```

## 🌐 API Endpoints

Основні ендпоінти API (доступні за адресою `http://localhost:3001`):

```
GET    /api/health      # Перевірка стану сервера
POST   /api/auth/login  # Авторизація
POST   /api/auth/register # Реєстрація
GET    /api/users       # Список користувачів
```

Повну документацію API можна переглянути за адресою: `http://localhost:3001/swagger`

## 🚨 Вирішення проблем

### Проблеми з базою даних

```bash
# Якщо Prisma не може підключитися
npx prisma db push --force-reset

# Перевірка підключення
npx prisma db pull
```

### Проблеми з портами

Якщо порти зайняті, змініть їх у відповідних `.env` файлах:

- Сервер: змініть `PORT` у `server/.env`
- Веб: змініть порт у `web/package.json` скрипті `start`

### Проблеми з CORS

Переконайтеся, що `CORS_ORIGIN` у `server/.env` відповідає адресі вашого клієнта.

## 📝 Розгортання

### Heroku

1. Підготуйте додаток для Heroku
2. Налаштуйте змінні середовища
3. Розгорніть кожну частину окремо

### Vercel (для веб-частини)

```bash
cd web
npx vercel --prod
```

### EAS Build (для мобільної частини)

```bash
cd mobile
npx eas build --platform all
```

## 🤝 Внесок у проект

1. Форкніть репозиторій
2. Створіть гілку для нової функції (`git checkout -b feature/AmazingFeature`)
3. Зробіть коміт змін (`git commit -m 'Add some AmazingFeature'`)
4. Відправте зміни (`git push origin feature/AmazingFeature`)
5. Створіть Pull Request

## 📄 Ліцензія

Цей проект розповсюджується під ліцензією MIT. Дивіться файл `LICENSE` для детальної інформації.

## 📞 Підтримка

Якщо у вас виникли питання або проблеми:

1. Перевірте розділ "Вирішення проблем"
2. Створіть issue в репозиторії
3. Напишіть на email: your-email@example.com

---

**Щасливого кодування! 🚀**
