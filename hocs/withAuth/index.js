import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

/**
 * Checks for authentication and if not reidrects to login page
 *
 * @param {React component} WrappedComponent Protected component
 */
const withAuth = ( WrappedComponent ) => {
  class HOC extends Component {
    // Our component just got rendered
    componentDidMount() {
      this.shouldNavigateAway();
    }

    // Our component just got updated
    componentDidUpdate() {
      this.shouldNavigateAway();
    }

    shouldNavigateAway() {
      if ( !this.props.authenticated ) {
        this.props.history.push( '/login' );
      }
    }

    render() {
      return (
        <WrappedComponent { ...this.props } /> );
    }
  }

  HOC.propTypes = {
    authenticated: PropTypes.object,
    history: PropTypes.object
  };

  const mapStateToProps = state => ( {
    authenticated: state.auth.authenticated
  } );

  return connect( mapStateToProps )( HOC );
};

export default withAuth;
