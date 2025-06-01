Fullstack додаток
Повнофункціональний додаток, що складається з мобільної частини (React Native Expo), веб-частини (React), серверної частини (Elysia) та бази даних PostgreSQL з ORM Prisma.
🏗️ Архітектура проекту
project/
├── mobile/          # React Native Expo додаток
├── web/            # React веб-додаток
├── server/         # Elysia API сервер
└── README.md       # Цей файл
📋 Передумови
Перед запуском проекту переконайтеся, що у вас встановлено:

Node.js (версія 18 або вище)
PostgreSQL (версія 13 або вище)
Git
Expo CLI для мобільної частини

bash# Встановлення Expo CLI глобально
npm install -g @expo/cli
🚀 Швидкий старт
1. Клонування репозиторію
bashgit clone <your-repository-url>
cd <project-name>
2. Налаштування бази даних
Створіть PostgreSQL базу даних:
sqlCREATE DATABASE your_database_name;
CREATE USER your_username WITH PASSWORD 'your_password';
GRANT ALL PRIVILEGES ON DATABASE your_database_name TO your_username;
3. Налаштування серверної частини
bashcd server
npm install

# Створіть файл .env на основі .env.example
cp .env.example .env
Відредагуйте файл .env:
env# Database
DATABASE_URL="postgresql://your_username:your_password@localhost:5432/your_database_name"

# Server
PORT=3001
NODE_ENV=development

# JWT Secret (згенеруйте безпечний ключ)
JWT_SECRET=your_jwt_secret_key

# CORS
CORS_ORIGIN=http://localhost:3000
Виконайте міграції Prisma:
bash# Генерація Prisma клієнта
npx prisma generate

# Запуск міграцій
npx prisma db push

# (Опціонально) Заповнення бази тестовими даними
npx prisma db seed
Запустіть сервер:
bashnpm run dev
Сервер буде доступний за адресою: http://localhost:3001
4. Налаштування веб-частини
У новому терміналі:
bashcd web
npm install

# Створіть файл .env на основі .env.example
cp .env.example .env
Відредагуйте файл .env:
envREACT_APP_API_URL=http://localhost:3001
REACT_APP_NODE_ENV=development
Запустіть веб-додаток:
bashnpm start
Веб-додаток буде доступний за адресою: http://localhost:3000
5. Налаштування мобільної частини
У новому терміналі:
bashcd mobile
npm install

# Створіть файл .env на основі .env.example
cp .env.example .env
Відредагуйте файл .env:
envEXPO_PUBLIC_API_URL=http://localhost:3001
EXPO_PUBLIC_NODE_ENV=development
Запустіть мобільний додаток:
bash# Для розробки
npx expo start

# Для конкретної платформи
npx expo start --ios
npx expo start --android
📱 Запуск мобільного додатку
iOS (тільки на macOS)
bashcd mobile
npx expo run:ios
Android
bashcd mobile
npx expo run:android
Expo Go

Встановіть Expo Go на свій телефон
Запустіть npx expo start у папці mobile
Відскануйте QR-код за допомогою Expo Go
