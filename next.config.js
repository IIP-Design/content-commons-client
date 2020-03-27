const withSass = require( '@zeit/next-sass' );

const withBundleAnalyzer = require( '@next/bundle-analyzer' )( {
  enabled: process.env.ANALYZE === 'true'
} );

const FilterWarningsPlugin = require( 'webpack-filter-warnings-plugin' );
require( 'dotenv' ).config();

module.exports = withBundleAnalyzer(
  withSass( {
    publicRuntimeConfig: {
      REACT_APP_WEBSITE_NAME: process.env.REACT_APP_WEBSITE_NAME,
      REACT_APP_PUBLIC_API: process.env.REACT_APP_PUBLIC_API,
      REACT_APP_APOLLO_ENDPOINT: process.env.REACT_APP_APOLLO_ENDPOINT,
      REACT_APP_APOLLO_SUBSCRIPTIONS_ENDPOINT: process.env.REACT_APP_APOLLO_SUBSCRIPTIONS_ENDPOINT,
      REACT_APP_GOOGLE_CLIENT_ID: process.env.REACT_APP_GOOGLE_CLIENT_ID,
      REACT_APP_VIMEO_TOKEN: process.env.REACT_APP_VIMEO_TOKEN,
      REACT_APP_YOUTUBE_API_KEY: process.env.REACT_APP_YOUTUBE_API_KEY,
      REACT_APP_AWS_S3_AUTHORING_BUCKET:
        process.env.REACT_APP_AWS_S3_AUTHORING_BUCKET,
      REACT_APP_AWS_S3_PRODUCTION_BUCKET:
        process.env.REACT_APP_AWS_S3_PRODUCTION_BUCKET,
      REACT_APP_SINGLE_ARTICLE_MODULE:
        process.env.REACT_APP_SINGLE_ARTICLE_MODULE,
      REACT_APP_CDP_MODULES_URL: process.env.REACT_APP_CDP_MODULES_URL,
      REACT_APP_GOOGLE_ANALYTICS_ID: process.env.REACT_APP_GOOGLE_ANALYTICS_ID
    },
    serverRuntimeConfig: {},
    poweredByHeader: false,
    webpack( config ) {
      config.plugins.push(
        new FilterWarningsPlugin( {
          exclude: /mini-css-extract-plugin[^]*Conflicting order between:/
        } )
      );
      config.module.rules.push( {
        test: /\.(png|svg|jpg|eot|otf|ttf|woff|woff2)$/,
        use: {
          loader: 'url-loader',
          options: {
            limit: 100000,
            publicPath: './',
            outputPath: 'static/css',
            name: '[name].[ext]'
          }
        }
      } );

      return config;
    }
  } )
);
