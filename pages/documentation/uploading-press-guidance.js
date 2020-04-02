import React from 'react';
import PropTypes from 'prop-types';
import config from 'config';

import DocumentationMenu from 'components/DocumentationMenu/DocumentationMenu';
import MarkdownPage from 'components/MarkdownPage';
import withCachedFetch from 'hocs/withCachedFetch/withCachedFetch';

const UploadingGuidance = props => {
  const { data, error } = props;

  return (
    <MarkdownPage
      pageTitle="Content Commons Documentation"
      pageSubTitle="Click on the links below for how-to guides on each subject. Please use Google Chrome for the best experience."
      data={ data }
      error={ error }
    >
      <DocumentationMenu />
    </MarkdownPage>
  );
};

UploadingGuidance.propTypes = {
  data: PropTypes.string,
  error: PropTypes.oneOfType( [PropTypes.number, PropTypes.bool] )
};

export default withCachedFetch( UploadingGuidance, config.UPLOADINGGUIDANCEDOC_URL );
