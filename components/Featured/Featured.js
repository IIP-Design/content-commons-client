import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import sortBy from 'lodash/sortBy';
import { createStructuredSelector } from 'reselect';
import { v4 } from 'uuid';
import {
  makeFeatured,
  makeFeaturedLoading,
  makeFeaturedError,
  makeAuthentication
} from './selectors';

import Packages from './Packages/Packages';
import Recents from './Recents/Recents';
import Priorities from './Priorities/Priorities';

const Featured = ( { data, authentication } ) => {
  const sorted = sortBy( data, 'order' );
  const featuredComponents = [];

  sorted.forEach( d => {
    const { component, props } = d;
    switch ( component ) {
      case 'priorities':
        featuredComponents.push( <Priorities key={ v4() } { ...props } /> );
        break;
      case 'recents':
        featuredComponents.push( <Recents key={ v4() } { ...props } /> );
        break;
      case 'packages':
        if ( authentication.isLoggedIn ) {
          featuredComponents.push( <Packages key={ v4() } { ...props } /> );
        }
        break;
      default:
        break;
    }
  } );

  if ( !featuredComponents.length ) return <div />;
  return (
    <div className="featured">
      { featuredComponents }
    </div>
  );
};

Featured.propTypes = {
  data: PropTypes.array,
  featured: PropTypes.object,
  loading: PropTypes.bool,
  error: PropTypes.bool,
  authentication: PropTypes.object,
};

const mapStateToProps = () => createStructuredSelector( {
  featured: makeFeatured(),
  loading: makeFeaturedLoading(),
  error: makeFeaturedError(),
  authentication: makeAuthentication(),
} );

export const FeaturedUnconnected = Featured; // For test purposes // 1/2/20 - resolves import/no-named-as-default lint error
export default connect( mapStateToProps )( Featured );
