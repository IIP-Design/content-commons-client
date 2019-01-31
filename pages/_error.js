import React from 'react';
import PropTypes from 'prop-types';

export default class Error extends React.Component {
  static getInitialProps( { res, err } ) {
    // eslint-disable-next-line  no-nested-ternary
    const statusCode = res ? res.statusCode : err ? err.statusCode : null;
    return { statusCode };
  }

  render() {
    const styleObj = {
      width: '500px',
      textAlign: 'center',
      margin: '180px auto 120px auto'
    };

    return (
      <div style={ styleObj }>
        <h1>Oops</h1>
        <p>
          { this.props.statusCode
            ? `An error ${this.props.statusCode} occurred on server`
            : 'An error occurred on client' }
        </p>
      </div>
    );
  }
}

Error.propTypes = {
  statusCode: PropTypes.number
};
