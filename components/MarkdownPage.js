import React from 'react';
import PropTypes from 'prop-types';
import ReactMarkdown from 'react-markdown';
import Error from 'next/error';
import 'styles/static-page.scss';

const MarkdownPage = props => {
  const {
    data, error, pageTitle, pageSubTitle, children
  } = props;

  if ( error ) {
    return <Error statusCode={ error } />;
  }

  return (
    <div className="static_page">
      <h1>{ pageTitle }
        { pageSubTitle && <div className="sub header">{ pageSubTitle }</div> }
      </h1>
      { children }
      <ReactMarkdown source={ data } />
    </div>
  );
};

MarkdownPage.propTypes = {
  pageTitle: PropTypes.string,
  pageSubTitle: PropTypes.string,
  children: PropTypes.element,
  data: PropTypes.string,
  error: PropTypes.oneOfType( [PropTypes.number, PropTypes.bool] )
};

export default MarkdownPage;
