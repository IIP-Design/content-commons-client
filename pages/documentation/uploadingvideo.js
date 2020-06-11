import React from 'react';
import PropTypes from 'prop-types';
import config from 'config';

import DocumentationMenu from 'components/DocumentationMenu/DocumentationMenu';
import MarkdownPage from 'components/PageTypes/MarkdownPage';
import withCachedFetch from 'hocs/withCachedFetch/withCachedFetch';

const UploadingVideo = ( { data, error } ) => (
  <MarkdownPage
    pageTitle="Content Commons Documentation"
    pageSubTitle="Click on the links below for how-to guides on each subject. Please use Google Chrome for the best experience."
    data={ data }
    error={ error }
  >
    <DocumentationMenu />
  </MarkdownPage>
);

UploadingVideo.propTypes = {
  data: PropTypes.string,
  error: PropTypes.oneOfType( [PropTypes.number, PropTypes.bool] ),
};

export default withCachedFetch( UploadingVideo, config.UPLOADINGDOC_URL );
