import { useState } from 'react';
import { I18nProvider } from 'context/i18n';
import '../styles/globals.css';
import Loader from 'components/Loader';
import Router from 'next/router';

function MyApp({ Component, pageProps }) {
  const [loading, setLoading] = useState(false);

  Router.events.on('routeChangeStart', () => setLoading(true));
  Router.events.on('routeChangeComplete', () => setLoading(false));

  return (
    <I18nProvider>
      {loading && <Loader />}
      <Component {...pageProps} />
    </I18nProvider>
  );
}

export default MyApp;
