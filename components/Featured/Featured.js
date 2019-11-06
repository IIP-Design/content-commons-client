import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import sortBy from 'lodash/sortBy';
import { createStructuredSelector } from 'reselect';
import { v4 } from 'uuid';
import {
  makeFeatured,
  makeFeaturedLoading,
  makeFeaturedError
} from './selectors';

import Recents from './Recents/Recents';
import Priorities from './Priorities/Priorities';

class Featured extends Component {
  render() {
    const sorted = sortBy( this.props.data, 'order' );
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
  }
}

Featured.propTypes = {
  data: PropTypes.array,
  featured: PropTypes.object,
  loading: PropTypes.bool,
  error: PropTypes.bool
};

const mapStateToProps = () => createStructuredSelector( {
  featured: makeFeatured(),
  loading: makeFeaturedLoading(),
  error: makeFeaturedError()
} );

export { Featured }; // For test purposes
export default connect( mapStateToProps )( Featured );
