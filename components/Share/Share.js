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
    id, site, language, title, link, type
  } = props;

  const queryStr = ( type === 'video' )
    ? stringifyQueryString( { id, site, language } )
    : stringifyQueryString( { id, site } );
  let directLink = link;
  if ( type === 'video' ) directLink = `${window.location.protocol}//${window.location.host}/video?${queryStr}`;
  if ( contentRegExp( link ) && type === 'post' ) {
    directLink = `${window.location.protocol}//${window.location.host}/article?${queryStr}`;
  }
  const facebookURL = `https://www.facebook.com/sharer/sharer.php?u=${link}`;
  const tweet = `https://twitter.com/home?status=${title} ${link}`;

  return (
    <div>
      { link && (
        <List className="share_list">
          <ShareButton url={ facebookURL } icon="facebook f" label="Share on Facebook" />
          <ShareButton url={ tweet } icon="twitter" label="Share on Twitter" />
        </List>
      ) }
      <ClipboardCopy label="Direct Link" copyItem={ directLink } />
    </div>
  );
};

Share.propTypes = {
  id: PropTypes.number,
  site: PropTypes.string,
  language: PropTypes.string,
  link: PropTypes.string,
  title: PropTypes.string,
  type: PropTypes.string
};

export default Share;
