import { getRequestConfig } from 'next-intl/server';
import { notFound } from 'next/navigation';

// Can be imported from a shared config
const locales = ['en', 'ua'];

export default getRequestConfig(async ({ locale }) => {
  // Validate that the incoming `locale` parameter is valid
  if (!locales.includes(locale)) notFound();

  return {
    messages: (await import(`./messages/${locale}.json`)).default,
  };
});
