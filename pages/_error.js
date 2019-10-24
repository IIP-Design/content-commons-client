import React from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'next/router';
import NotFound404 from 'components/errors/NotFound404/NotFound404';

class Error extends React.Component {
  static getInitialProps( { res, err } ) {
    // eslint-disable-next-line  no-nested-ternary
    const statusCode = res ? res.statusCode : err ? err.statusCode : null;
    return { statusCode };
  }

  renderServerError = statusCode => {
    if ( statusCode === 404 ) {
      return <NotFound404 />;
    }
    return <p>{ `An error ${statusCode} occurred on the server` }</p>;
  }

  renderClientError = () => <p> An error occurred on client</p>

  render() {
    const styleObj = {
      textAlign: 'center',
      margin: '180px auto 120px auto'
    };

    const { statusCode } = this.props;

    return (
      <section style={ styleObj }>
        <h1>Oops</h1>
        <h4 className="confirm_subtext">This usually isn't a common occurrence.</h4>
        { statusCode
          ? this.renderServerError( statusCode )
          : this.renderClientError() }
      </section>
    );
  }
}

Error.propTypes = {
  statusCode: PropTypes.number
};

export default withRouter( Error );
