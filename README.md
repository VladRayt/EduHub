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
