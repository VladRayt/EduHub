import createMiddleware from 'next-intl/middleware';
import { type NextRequest, NextResponse } from 'next/server';

import { getServerClient } from '@/requests/trpc/server';
import { cookiesStore } from '@/store/cookies.store';

const PUBLIC_FILE = /\.(.*)$/;

const authRoutes = [
  '/(ua|en)/sign-in',
  '/(ua|en)/sign-up',
  '/(ua|en)/restore-password',
  '/(ua|en)/verification-code',
  '/(ua|en)/forgot-password',
];

function isPathnameMatchingRoute(pathname: string) {
  return authRoutes.some((route) => new RegExp(`^${route}$`).test(pathname));
}

const intlMiddleware = createMiddleware({
  locales: ['en', 'ua'],
  defaultLocale: 'en',
});

export default async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  if (
    pathname.startsWith('/_next') || // exclude Next.js internals
    pathname.startsWith('/api') || //  exclude all API routes
    pathname.startsWith('/static') || // exclude static files
    PUBLIC_FILE.test(pathname) // exclude all files in the public folder
  ) {
    return intlMiddleware(request);
  }
  const serverClient = getServerClient();
  const userId = cookiesStore().getItem('userId');
  const locale = pathname.includes('en') ? 'en' : 'ua';
  const pathNameIncludes = isPathnameMatchingRoute(pathname);
  try {
    const { data } = await serverClient.user.validateToken.query({
      id: userId,
    });
    if (data) {
      return pathNameIncludes
        ? NextResponse.redirect(new URL('/' + locale + '/home', request.url))
        : intlMiddleware(request);
    }
    return pathNameIncludes
      ? intlMiddleware(request)
      : NextResponse.redirect(new URL('/' + locale + '/sign-in', request.url));
  } catch (error) {
    return pathNameIncludes
      ? intlMiddleware(request)
      : NextResponse.redirect(new URL('/' + locale + '/sign-in', request.url));
  }
}

export const config = {
  matcher: ['/', '/(ua|en)/:path*'],
};
