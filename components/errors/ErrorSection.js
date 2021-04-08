import propTypes from 'prop-types';

import NotFound404 from 'components/errors/NotFound404/NotFound404';

const styleObj = {
  textAlign: 'center',
  margin: '180px auto 120px auto',
};

const ErrorSection = ( { statusCode, title } ) => (
  <section style={ styleObj }>
    <h1>{ title || 'Oops' }</h1>
    <h4 className="confirm_subtext">This usually isn&apos;t a common occurrence.</h4>
    { statusCode && statusCode === 404 && <NotFound404 /> }
    { statusCode && statusCode !== 404 && <p>{ `An error ${statusCode} occurred on the server` }</p> }
    { !statusCode && ( <p>An error occurred on client</p> ) }
  </section>
);

ErrorSection.propTypes = {
  statusCode: propTypes.number,
  title: propTypes.string,
};

export default ErrorSection;
