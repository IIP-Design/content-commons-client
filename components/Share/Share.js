import React from 'react';
import PropTypes from 'prop-types';
import { List } from 'semantic-ui-react';

import { stringifyQueryString } from 'lib/browser';
import { contentRegExp, getVimeoId, getYouTubeId } from 'lib/utils';
import ClipboardCopy from '../ClipboardCopy';
import ShareButton from './ShareButton';

import './Share.scss';

const Share = ( {
  id,
  isPreview,
  language,
  link,
  site,
  title,
  type,
} ) => {
  const internalTypes = [
    'document', 'graphic', 'package', 'playbook',
  ];
  const internalOnly = internalTypes.some( t => t === type );
  const video = type === 'video';

  let queryStr;

  switch ( type ) {
    case 'post':
      queryStr = stringifyQueryString( { id, site } );
      break;
    case 'playbook':
      queryStr = null;
      break;
    default:
      queryStr = stringifyQueryString( { id, site, language } );
  }

  let directLink = link;
  let shareLink = link;

  // video, document, package types
  if ( !isPreview && type !== 'post' ) {
    let t;

    switch ( type ) {
      case 'package':
        t = 'package/guidance';
        break;
      case 'playbook':
        t = `package/playbook/${id}`;
        break;
      default:
        t = type;
    }

    directLink = `${window.location.protocol}//${window.location.host}/${t}${queryStr ? `?${queryStr}` : ''}`;

    if ( link?.includes( 'youtu' ) ) {
      shareLink = `https://youtu.be/${getYouTubeId( link )}`;
    } else if ( link?.includes( 'vimeo' ) ) {
      shareLink = `https://vimeo.com/${getVimeoId( link )}`;
    }
  }

  // post type
  if ( contentRegExp( link ) && type === 'post' ) {
    directLink = `${window.location.protocol}//${window.location.host}/article?${queryStr}`;
  }

  // post, document, package types
  if ( type !== 'video' ) {
    shareLink = directLink;
  }

  const facebookURL = `https://www.facebook.com/sharer/sharer.php?u=${shareLink}`;
  const tweet = `https://twitter.com/intent/tweet?text=${title}&url=${shareLink}`;

  const displaySocialBtns = shareLink && !internalOnly && !video;

  return (
    <div>
      { displaySocialBtns
        && (
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

Share.defaultProps = {
  isPreview: false,
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
  type: PropTypes.string,
};

export default Share;
