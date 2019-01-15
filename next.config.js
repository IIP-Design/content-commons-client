const path = require( 'path' );
const withSass = require( '@zeit/next-sass' );
const withCss = require( '@zeit/next-css' );
require( 'dotenv' ).config();

module.exports = withSass( withCss( {
  publicRuntimeConfig: {
    REACT_APP_WEBSITE_NAME: process.env.REACT_APP_WEBSITE_NAME,
    REACT_APP_PUBLIC_API: process.env.REACT_APP_PUBLIC_API,
    REACT_APP_APOLLO_ENDPOINT: process.env.REACT_APP_APOLLO_ENDPOINT,
    REACT_APP_GOOGLE_CLIENT_ID: process.env.REACT_APP_GOOGLE_CLIENT_ID
  },
  serverRuntimeConfig: {},
  webpack ( config ) {
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

    config.resolve.alias = {
      components: path.join( __dirname, './components' ),
      lib: path.join( __dirname, './lib' ),
      hocs: path.join( __dirname, './hocs' ),
      static: path.join( __dirname, './static' ),
      styles: path.join( __dirname, './styles' )
    };

    return config;
  }
} ) );
