import { Elysia } from 'elysia';

import { createContext } from '@/config/trpc';
import { cors } from '@elysiajs/cors';
import { trpc } from '@elysiajs/trpc';
import { appRouter } from '@/routes';

const app = new Elysia()
  .use(cors())
  .get('/', () => 'Hello Elysia')
  .use(
    trpc(appRouter, {
      createContext,
      endpoint: '/trpc',
    })
  )
  .listen(5000);

console.log(`🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`);
