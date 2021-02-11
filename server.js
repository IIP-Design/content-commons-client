/* eslint-disable no-console */
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


    server.get( '*', ( req, res ) => handle( req, res ) );
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
