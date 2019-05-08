const withSass = require( '@zeit/next-sass' );
require( 'dotenv' ).config();

module.exports = withSass( {
  publicRuntimeConfig: {
    REACT_APP_WEBSITE_NAME: process.env.REACT_APP_WEBSITE_NAME,
    REACT_APP_PUBLIC_API: process.env.REACT_APP_PUBLIC_API,
    REACT_APP_APOLLO_ENDPOINT: process.env.REACT_APP_APOLLO_ENDPOINT,
    REACT_APP_GOOGLE_API_KEY: process.env.REACT_APP_GOOGLE_API_KEY,
    REACT_APP_GOOGLE_CLIENT_ID: process.env.REACT_APP_GOOGLE_CLIENT_ID,
    REACT_APP_VIMEO_TOKEN: process.env.REACT_APP_VIMEO_TOKEN,
    REACT_APP_AWS_S3_PUBLISHER_UPLOAD_BUCKET: process.env.REACT_APP_AWS_S3_PUBLISHER_UPLOAD_BUCKET
  },
  serverRuntimeConfig: {},
  webpack ( config ) {
    config.module.rules.push(
      {
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
      }
    );

    return config;
  }
} );
