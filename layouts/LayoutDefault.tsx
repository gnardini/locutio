import './style.css';

import React from 'react';
import './tailwind.css';

export default function LayoutDefault({ children }: { children: React.ReactNode }) {
  // return <I18nextProvider i18n={i18n}>{children}</I18nextProvider>;
  return children;
}
