import './style.css';

import i18n, { initLocale } from '@locales/i18n';
import React, { Suspense } from 'react';
import { I18nextProvider } from 'react-i18next';
import './tailwind.css';

export default function LayoutDefault({ children }: { children: React.ReactNode }) {
  initLocale();
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <I18nextProvider i18n={i18n}>{children}</I18nextProvider>
    </Suspense>
  );
  // return <I18nextProvider i18n={i18n}>{children}</I18nextProvider>;
  // return children;
}
