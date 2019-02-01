import React from 'react';
import PropTypes from 'prop-types';
import { List } from 'semantic-ui-react';
import ClipboardCopy from '../ClipboardCopy';
import { stringifyQueryString } from '../../lib/browser';
import ShareButton from './ShareButton';

import './Share.scss';

const Share = props => {
  const {
    id, site, language, title, link, type
  } = props;

  const queryStr = stringifyQueryString( { id, site, language } );
  const directLink = ( type === 'video' ) ? `${window.location.protocol}//${window.location.host}/video?${queryStr}` : link;
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
