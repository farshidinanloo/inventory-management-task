import '@/styles/globals.css';
import { AppProps } from '@/types';

export default function App({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />;
}

