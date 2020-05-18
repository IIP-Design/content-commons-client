import React from 'react';
import PropTypes from 'prop-types';
import { Item } from 'semantic-ui-react';

import useSignedUrl from 'lib/hooks/useSignedUrl';

import downloadIcon from 'static/icons/icon_download.svg';

const DownloadItem = ( { children, download, header, hover, url } ) => {
  const { signedUrl } = useSignedUrl( url );

  return (
    <Item.Group className="download-item">
      <Item as="a" href={ signedUrl } download={ download }>
        <Item.Image size="mini" src={ downloadIcon } className="download-icon" />
        <Item.Content>
          <Item.Header className="download-header">{ header }</Item.Header>
          { children }
          <span className="item_hover">{ hover }</span>
        </Item.Content>
      </Item>
    </Item.Group>
  );
};

DownloadItem.propTypes = {
  children: PropTypes.node,
  download: PropTypes.string,
  header: PropTypes.oneOfType( [
    PropTypes.array,
    PropTypes.string,
  ] ),
  hover: PropTypes.string,
  url: PropTypes.string,
};

export default DownloadItem;
