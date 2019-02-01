import React from 'react';
import { Breadcrumb } from 'semantic-ui-react';
import { withRouter } from 'next/router';
import Link from 'next/link';
import PropTypes from 'prop-types';
import './Breadcrumbs.scss';

const Breadcrumbs = props => {
  const { router } = props;

  const paths = ( router.pathname ).replace( '/admin', '' ).split( '/' ).slice( 1 ).filter( Boolean );

  let pathCounter = 0;
  return (
    <Breadcrumb size="mini">
      <Breadcrumb.Section>
        <Link href="/"><a>Content Commons</a></Link>
      </Breadcrumb.Section>
      { paths.map( ( pathname, i, arr ) => {
        pathCounter += 1;
        return (
          <span key={ pathCounter }>
            <Breadcrumb.Divider icon="right angle" />
            <Breadcrumb.Section active={ arr.length - 1 === i } className="pathname">{ pathname }</Breadcrumb.Section>
          </span>
        );
      } ) }
    </Breadcrumb>
  );
};

Breadcrumbs.propTypes = {
  router: PropTypes.object
};

export default withRouter( Breadcrumbs );
