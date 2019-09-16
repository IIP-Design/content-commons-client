import React from 'react';
import PropTypes from 'prop-types';
import config from 'config';

import DocumentationSidebar from 'components/DocumentationSidebar/DocumentationSidebar';
import MarkdownPage from 'components/MarkdownPage';
import withCachedFetch from 'hocs/withCachedFetch/withCachedFetch';

const Embed = props => {
  const { data, error } = props;

  return (
    <MarkdownPage
      pageTitle="Content Commons Download"
      pageSubTitle="Click on the links below for how-to guides on each subject. Please use Google Chrome for the best experience."
      data={ data }
      error={ error }
    >
      <DocumentationSidebar />
    </MarkdownPage>
  );
};

Embed.propTypes = {
  data: PropTypes.string,
  error: PropTypes.oneOfType( [PropTypes.number, PropTypes.bool] )
};

export default withCachedFetch( Embed, config.EMBEDDINGDOC_URL );
