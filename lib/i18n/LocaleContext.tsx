'use client';
import { createContext, useContext } from 'react';
import { DEFAULT_LOCALE, type Locale } from './config';
import { getUi, type Ui } from './ui';

/* El idioma lo fija la ruta y baja por contexto para que los componentes de
   cliente —catálogo, chips, drawer— no tengan que recibirlo como prop en cada
   nivel. Por defecto, español: si algo se monta fuera del proveedor, se lee
   como hasta ahora. */
const Ctx = createContext<Locale>(DEFAULT_LOCALE);

export function LocaleProvider({ locale, children }: { locale: Locale; children: React.ReactNode }) {
  return <Ctx.Provider value={locale}>{children}</Ctx.Provider>;
}

export const useLocale = (): Locale => useContext(Ctx);
export const useUi = (): Ui => getUi(useContext(Ctx));
