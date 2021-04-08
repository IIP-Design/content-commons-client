const withStyles = require( '@webdeb/next-styles' );

const withBundleAnalyzer = require( '@next/bundle-analyzer' )( {
  enabled: process.env.ANALYZE === 'true',
} );

require( 'dotenv' ).config();

/**
 * Next 9.3 now has built in css/scss module support. However, using the native
 * support requires that all global style sheets be imported in the _app file and NOT
 * within each component file. Using the 'withStyles' library allows the continued use
 * of global styles within each components and modules as we incrementally move to using
 * modules as a matter of course.
 */

module.exports = withBundleAnalyzer(
  withStyles( {
    publicRuntimeConfig: {
      REACT_APP_WEBSITE_NAME: process.env.REACT_APP_WEBSITE_NAME,
      REACT_APP_PUBLIC_API: process.env.REACT_APP_PUBLIC_API,
      REACT_APP_APOLLO_ENDPOINT: process.env.REACT_APP_APOLLO_ENDPOINT,
      REACT_APP_APOLLO_SUBSCRIPTIONS_ENDPOINT: process.env.REACT_APP_APOLLO_SUBSCRIPTIONS_ENDPOINT,
      REACT_APP_GOOGLE_CLIENT_ID: process.env.REACT_APP_GOOGLE_CLIENT_ID,
      REACT_APP_VIMEO_TOKEN: process.env.REACT_APP_VIMEO_TOKEN,
      REACT_APP_YOUTUBE_API_KEY: process.env.REACT_APP_YOUTUBE_API_KEY,
      REACT_APP_AWS_S3_AUTHORING_BUCKET: process.env.REACT_APP_AWS_S3_AUTHORING_BUCKET,
      REACT_APP_AWS_S3_PRODUCTION_BUCKET: process.env.REACT_APP_AWS_S3_PRODUCTION_BUCKET,
      REACT_APP_SINGLE_ARTICLE_MODULE: process.env.REACT_APP_SINGLE_ARTICLE_MODULE,
      REACT_APP_CDP_MODULES_URL: process.env.REACT_APP_CDP_MODULES_URL,
      REACT_APP_GOOGLE_ANALYTICS_ID: process.env.REACT_APP_GOOGLE_ANALYTICS_ID,
      REACT_APP_AWS_COGNITO_REGION: process.env.REACT_APP_AWS_COGNITO_REGION,
      REACT_APP_AWS_COGNITO_USER_POOLS_ID: process.env.REACT_APP_AWS_COGNITO_USER_POOLS_ID,
      REACT_APP_AWS_COGNITO_IDENTITY_POOL_ID: process.env.REACT_APP_AWS_COGNITO_IDENTITY_POOL_ID,
      REACT_APP_AWS_COGNITO_USER_POOL_WEB_CLIENT_ID:
        process.env.REACT_APP_AWS_COGNITO_USER_POOL_WEB_CLIENT_ID,
      REACT_APP_AWS_COGNITO_CLIENT_DOMAIN: process.env.REACT_APP_AWS_COGNITO_CLIENT_DOMAIN,
      REACT_APP_AWS_COGNITO_CLIENT_REDIRECT_SIGNIN:
        process.env.REACT_APP_AWS_COGNITO_CLIENT_REDIRECT_SIGNIN,
      REACT_APP_AWS_COGNITO_CLIENT_REDIRECT_SIGNOUT:
        process.env.REACT_APP_AWS_COGNITO_CLIENT_REDIRECT_SIGNOUT,
      REACT_APP_AWS_COGNITO_OKTA_PROVIDER_NAME:
        process.env.REACT_APP_AWS_COGNITO_OKTA_PROVIDER_NAME,
      REACT_APP_UI_CONFIG: process.env.REACT_APP_UI_CONFIG,
    },
    serverRuntimeConfig: {},
    poweredByHeader: false,
    sass: true,
    modules: true,
    miniCssExtractOptions: {
      ignoreOrder: true,
    },
    webpack( config ) {
      config.module.rules.push( {
        test: /\.(png|svg|jpg|eot|otf|ttf|woff|woff2)$/,
        use: {
          loader: 'url-loader',
          options: {
            esModule: false,
            limit: 100000,
            publicPath: './',
            outputPath: 'static/css',
            name: '[name].[ext]',
          },
        },
      } );

      return config;
    },
  } ),
);
