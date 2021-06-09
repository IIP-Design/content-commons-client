import moment from 'moment';
import propTypes from 'prop-types';
import { useRouter } from 'next/router';

import DownloadItemContent from 'components/download/DownloadItem/DownloadItemContent';
import Popover from 'components/popups/Popover/Popover';
import Share from 'components/Share/Share';
import TexturedSection from 'components/TexturedSection/TexturedSection';

import { formatBytes } from 'lib/utils';
import cautionIcon from 'static/icons/icon_caution.svg';
import shareIconWhite from 'static/icons/icon_share_white.svg';

import styles from './Playbook.module.scss';

const desc = 'This Playbook is for use by U.S. diplomatic missions and senior State Department officials.\nPlease treat this document as you would Daily Press Guidance.';

const Playbook = ( { item } ) => {
  const router = useRouter();

  return (
    <div className={ styles.container }>
      { router.asPath.startsWith( '/admin' ) && (
        <div className={ styles.preview }>
          <img src={ cautionIcon } alt="" height="18" width="18" />
          <p>This is a preview of how your Playbook will appear on Content Commons</p>
        </div>
      ) }
      <header className={ styles.header }>
        <div className={ styles['header-contents'] }>
          <button className={ styles.back } type="button" onClick={ () => router.back() }>
            { '< back' }
          </button>
        </div>
        <h1 className={ styles.title }>{ item.title }</h1>
        { item.updatedAt && (
          <p>{ `Updated: ${moment( item.updatedAt ).format( 'MMMM DD, YYYY \\a\\t hh:mm A' )}` }</p>
        ) }
        <div className={ styles['header-contents'] }>
          <Popover
            id={ `${item.id}_playbook-share` }
            className="playbook-project__popover playbook-project__popover--share"
            trigger={ <img src={ shareIconWhite } style={ { width: '20px', height: '20px' } } alt="share icon" /> }
            expandFromRight
            toolTip="Share playbook"
          >
            <div className="popup_share">
              <h2 className="ui header" style={ { textAlign: 'left' } }>Share this playbook.</h2>
              <Share
                id={ item.id }
                type="playbook"
              />
            </div>
          </Popover>
        </div>
      </header>
      { item.policy && (
        <div className={ styles['policy-container'] }>
          <span
            className={ styles.policy }
            style={ { backgroundColor: item.policy.theme } }
          >
            { item.policy.name }
          </span>
        </div>
      ) }
      <TexturedSection description={ desc } narrow>
        <div
          className={ styles.content }
          dangerouslySetInnerHTML={ { __html: item.content.html } } // eslint-disable-line react/no-danger
        />
      </TexturedSection>
      { item.supportFiles && item.supportFiles.length && (
        <div className={ styles['resources-container'] }>
          <h3 className={ styles['resources-title'] }>Additional Resources</h3>
          <div className={ styles['resources-content'] }>
            <h4 className={ styles['resources-attachment-title'] }>Downloadable attachments.</h4>
            <small className={ styles['resources-instructions'] }>
              <em>Download the attached files related to this Playbook.</em>
            </small>
            <ul className={ styles['resources-list'] }>
              { item.supportFiles.map( file => (
                <li key={ file.id }>
                  <DownloadItemContent
                    hoverText={ `Download ${file.filename}` }
                    srcUrl={ file.url }
                    downloadFilename={ file.filename }
                  >
                    <div className="item-content">
                      <p className="item-content__title">
                        <strong>
                          { `Download "${file.filename}"` }
                        </strong>
                      </p>
                      <p className="item-content__meta">{ `File type: ${file.filetype}` }</p>
                      <p className="item-content__meta">{ `File size: ${formatBytes( file.filesize )}` }</p>
                    </div>
                  </DownloadItemContent>
                </li>
              ) ) }
            </ul>
          </div>
        </div>
      ) }
    </div>
  );
};

Playbook.propTypes = {
  item: propTypes.object,
};

export default Playbook;
