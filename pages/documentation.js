import React, { useState } from 'react';
import PropTypes from 'prop-types';
import config from 'config';
import withCachedFetch from 'hocs/withCachedFetch/withCachedFetch';
import MarkdownPage from 'components/MarkdownPage';
import DocumentationSidebar from '../components/DocumentationSidebar/DocumentationSidebar';


const Documentation = props => {
  const [url, setURL] = useState( 'DOWNLOADINGDOC_URL' );

  const { data, error } = props;
  return (
    <div>
      <MarkdownPage
        pageTitle="Content Commons Documentation"
        pageSubTitle="Click on the links below for how-to guides on each subject. Please use Google Chrome for the best experience."
        data={ data }
        error={ error }
      >
        <DocumentationSidebar setURL={ setURL } />
      </MarkdownPage>
    </div>
  );
};

Documentation.propTypes = {
  data: PropTypes.string,
  error: PropTypes.oneOfType( [PropTypes.number, PropTypes.bool] )
};

export default withCachedFetch( Documentation, config.DOWNLOADINGDOC_URL );
