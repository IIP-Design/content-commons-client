import React from 'react';
import PropTypes from 'prop-types';
import { List } from 'semantic-ui-react';
import { stringifyQueryString } from 'lib/browser';
import { contentRegExp } from 'lib/utils';
import ClipboardCopy from '../ClipboardCopy';
import ShareButton from './ShareButton';

import './Share.scss';

const Share = props => {
  const {
    id, isPreview, site, language, title, link, type
  } = props;

  const queryStr = ( type === 'video' )
    ? stringifyQueryString( { id, site, language } )
    : stringifyQueryString( { id, site } );
  let directLink = link;
  let shareLink = link;
  if ( type === 'video' ) directLink = `${window.location.protocol}//${window.location.host}/video?${queryStr}`;
  if ( contentRegExp( link ) && type === 'post' ) {
    directLink = `${window.location.protocol}//${window.location.host}/article?${queryStr}`;
    shareLink = directLink;
  }
  const facebookURL = `https://www.facebook.com/sharer/sharer.php?u=${shareLink}`;
  const tweet = `https://twitter.com/home?status=${title} ${shareLink}`;

  return (
    <div>
      { shareLink && (
        <List className="share_list">
          <ShareButton
            url={ facebookURL }
            icon="facebook f"
            label="Share on Facebook"
            isPreview={ isPreview }
          />
          <ShareButton
            url={ tweet }
            icon="twitter"
            label="Share on Twitter"
            isPreview={ isPreview }
          />
        </List>
      ) }
      <ClipboardCopy
        label="Direct Link"
        copyItem={ directLink }
        isPreview={ isPreview }
      />
    </div>
  );
};

Share.propTypes = {
  id: PropTypes.oneOfType( [
    PropTypes.number,
    PropTypes.string,
  ] ),
  isPreview: PropTypes.bool,
  site: PropTypes.string,
  language: PropTypes.string,
  link: PropTypes.string,
  title: PropTypes.string,
  type: PropTypes.string
};

export default Share;
