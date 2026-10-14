import { createContext, useContext } from 'react';
import type { Locale, PolicyData } from '../domain/types';

/** Cómo pinta el editor sus variables. `labels`: qué dato es. `values`: qué
    dato saldrá impreso con la póliza en curso. Mismo documento, dos lecturas. */
export type ChipMode = 'labels' | 'values';

export interface DisplayContextValue {
  locale: Locale;
  mode: ChipMode;
  data: PolicyData;
}

export const DisplayContext = createContext<DisplayContextValue>({ locale: 'es', mode: 'labels', data: {} });

export const useDisplay = () => useContext(DisplayContext);
