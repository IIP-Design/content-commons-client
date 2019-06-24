import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'next/router';
import { Breadcrumb } from 'semantic-ui-react';
import './Breadcrumbs.scss';

const Breadcrumbs = props => {
  const { router } = props;
  let { pathname } = router;
  const paths = [];

  pathname
    .split( '/' )
    .slice( 1 )
    .filter( path => path !== 'admin' )
    .forEach( path => {
      if ( path === 'upload' ) {
        return paths.push( 'upload content' );
      }

      if ( path === 'project' ) {
        if ( router.query.action === 'edit' ) {
          return paths.push( 'edit project' );
        }
        if ( router.query.action === 'review' ) {
          pathname = `${router.pathname}/${router.query.content}/${router.query.id}/edit`;
          return paths.push( 'edit project', 'review project' );
        }
      }
      return paths.push( path );
    } );

  return (
    <Breadcrumb>
      <Breadcrumb.Section>
        <a href="/">Content Commons</a>
      </Breadcrumb.Section>
      { pathname.includes( 'project' ) && (
        <Fragment>
          <Breadcrumb.Divider icon="right angle" />
          <Breadcrumb.Section>
            <a href="/admin/upload">Upload Content</a>
          </Breadcrumb.Section>
        </Fragment>
      ) }
      { paths.map( ( path, i, arr ) => (
        <span key={ path }>
          <Breadcrumb.Divider icon="right angle" />
          <Breadcrumb.Section
            active={ arr.length - 1 === i }
            className="pathname"
          >
            { arr.length - 1 === i ? `${path}` : <a href={ pathname }>{ path }</a> }
          </Breadcrumb.Section>
        </span>
      ) ) }
    </Breadcrumb>
  );
};

Breadcrumbs.propTypes = {
  router: PropTypes.object
};

export default withRouter( Breadcrumbs );
