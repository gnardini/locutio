import { initLocale } from '@locales/i18n';
import { modifyUrl } from 'vike/modifyUrl';
import { OnBeforeRenderSync } from 'vike/types';
import { extractLocale } from '../locales/extractLocale';

export const onBeforeRoute: OnBeforeRenderSync = (pageContext): ReturnType<OnBeforeRenderSync> => {
  const url = pageContext.urlParsed;

  const { urlPathnameWithoutLocale, locale } = extractLocale(url.pathname);
  // initLocale(locale);
  const urlLogical = modifyUrl(url.href, { pathname: urlPathnameWithoutLocale });

  return {
    pageContext: {
      // Make `locale` available as pageContext.locale
      locale,
      // Vike's router will use pageContext.urlLogical instead of pageContext.urlOriginal
      urlLogical,
    },
  };
};
