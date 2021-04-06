/* eslint-disable no-console */
const newrelic = require( 'newrelic' );
const express = require( 'express' );
const next = require( 'next' );

const dev = process.env.NODE_ENV !== 'production';
const app = next( { dev } );
const handle = app.getRequestHandler();

app.prepare()
  .then( () => {
    const server = express();

    /**
     * Create clean url on client (this is needed so server side understands url)
     * <Link as="video/123/edit" href="project?content=video&id=234&action=edit">
     * action param is optional
     */
    server.get( '/admin/project/:content/:id/:action?', ( req, res ) => {
      const { id, content, action } = req.params;

      const actualPage = '/admin/project';
      const queryParams = { id, content, action };

      app.render( req, res, actualPage, queryParams );
    } );

    /**
     * Add the optional param code to login path to handle
     * the redirect from Cognito. If this is not added, the
     * added 'code' param will cause route to fail with 4040
     */
    server.get( '/login/:code?', ( req, res ) => {
      const { code } = req.params;

      const actualPage = '/login';
      const queryParams = { code };

      app.render( req, res, actualPage, queryParams );
    } );

    /**
     * Add new relic transaction name to server side
     */
    server.get( '*', ( req, res ) => {
      try {
        const baseURL = `${req.protocol}://${req.headers.host}/`;
        const parsedUrl = new URL( req.url, baseURL );
        const { pathname } = parsedUrl;

        // Transaction Name: (w/o this new relic shows "/*" for all transaction)
        // https://docs.newrelic.com/docs/agents/nodejs-agent/api-guides/guide-using-nodejs-agent-api
        newrelic.setTransactionName( pathname );
      } catch ( err ) {
        console.log( err );
      }

      return handle( req, res );
    } );

    const port = process.env.PORT || 3000;

    server.listen( port, err => {
      if ( err ) throw err;
      console.log( `> Ready on http://localhost:${port}` );
    } );
  } )

  .catch( ex => {
    console.error( ex.stack );
    process.exit( 1 ); // eslint-disable-line node/no-process-exit
  } );
