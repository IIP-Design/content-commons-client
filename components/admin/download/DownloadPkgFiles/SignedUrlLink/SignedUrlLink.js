import React from 'react';
import PropTypes from 'prop-types';
import { Item } from 'semantic-ui-react';

import downloadIcon from 'static/icons/icon_download.svg';
import useSignedUrl from 'lib/hooks/useSignedUrl';

const SignedUrlLink = ( { file, isPreview } ) => {
  const { id, filename, url } = file;
  const { signedUrl } = useSignedUrl( url );

  return (
    <Item.Group key={ `fs_${id}` } className={ `download-item${isPreview ? ' preview' : ''}` }>
      <Item
        as={ isPreview ? 'span' : 'a' }
        href={ isPreview ? null : signedUrl }
        download={ isPreview ? null : filename }
      >
        <Item.Image
          alt="download icon"
          className="download-icon"
          size="mini"
          src={ downloadIcon }
        />
        <Item.Content>
          <Item.Header className="download-header">
            { 'Download ' }
            <span style={ { fontWeight: 'normal' } }>{filename}</span>
          </Item.Header>
          <span className="item_hover">
            { `Download ${filename}` }
            { isPreview
                && (
                  <span className="preview-text">
                    The link will be active after publishing.
                  </span>
                ) }
          </span>
        </Item.Content>
      </Item>
    </Item.Group>
  );
};

SignedUrlLink.propTypes = {
  file: PropTypes.object,
  isPreview: PropTypes.bool,
};

export default SignedUrlLink;

