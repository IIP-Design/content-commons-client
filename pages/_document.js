import Document, {
  Html, Head, Main, NextScript,
} from 'next/document';

import getConfig from 'next/config';

const {
  publicRuntimeConfig: {
    REACT_APP_GOOGLE_ANALYTICS_ID,
  },
} = getConfig();

class MyDocument extends Document {
  static async getInitialProps( ctx ) {
    const initialProps = await Document.getInitialProps( ctx );

    return { ...initialProps };
  }

  render() {
    return (
      <Html lang="en-us">
        <Head />
        <body>
          <noscript>
            <iframe
              src={ `https://www.googletagmanager.com/ns.html?id=GTM-NTQJVZD&gtm_auth=${REACT_APP_GOOGLE_ANALYTICS_ID}&gtm_cookies_win=x` }
              height="0"
              width="0"
              style={ { display: 'none', visibility: 'hidden' } }
              title="Google Analytics"
            />
          </noscript>
          <a className="skip-to-content" href="#content">Skip to main content</a>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default MyDocument;
