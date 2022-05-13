import { createContext, useContext, useCallback } from 'react';
import { useRouter } from 'next/router';

// Esto es bueno para aplicaciones no tan grandes
import es from '../translations/es.json';

const I18NContext = createContext();

const languages = { es };

export function I18nProvider({ children }) {
  // Vamos a conocer en que idioma estamos
  const { locale } = useRouter();

  // Callback: no era tan necesario, aunque lo pondremos por rendimiento y evitar problemas futuros.
  // useCallback es para memorizar una función y useEffect es para ejecutar código renderizado en un componente
  // El useMemo solo sería para valores, por ejemplo, filtrar un array de 10 mil elementos. El useMemo podría simular useCallback
  const t = useCallback(
    (key, ...args) => {
      let translation = languages[locale][key];
      if (args.length === 0) return translation;
      args.forEach((value, index) => {
        translation = translation.replace(`\${${index + 1}}`, value);
      });

      return translation;
    },
    [locale]
  );

  return <I18NContext.Provider value={{ t }}>{children}</I18NContext.Provider>;
}

export function useI18N() {
  const context = useContext(I18NContext);
  if (context === undefined) {
    throw new Error('useI18N must be used within a I18NProvider');
  }
  return context;
}
