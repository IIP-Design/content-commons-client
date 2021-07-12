import propTypes from 'prop-types';
import { useRouter } from 'next/router';
import DOMPurify from 'isomorphic-dompurify';

import DownloadItemContent from 'components/download/DownloadItem/DownloadItemContent';
import Popover from 'components/popups/Popover/Popover';
import Share from 'components/Share/Share';
import TexturedSection from 'components/TexturedSection/TexturedSection';

import { formatBytes, formatDateTime, getColloquialFiletype, maybeGetUrlToProdS3 } from 'lib/utils';
import { getBadgeStyle, getDateTimeArgs } from './Playbook.controller';
import useInitialStatus from 'lib/hooks/useInitialStatus';
import cautionIcon from 'static/icons/icon_caution.svg';
import shareIconWhite from 'static/icons/icon_share_white.svg';

import styles from './Playbook.module.scss';

const desc = 'This Playbook is for use by U.S. diplomatic missions and senior State Department officials.\nPlease treat this document as you would Daily Press Guidance.';

const Playbook = ( { item } ) => {
  const router = useRouter();
  const isAdminPreview = router.asPath.startsWith( '/admin' );

  const dates = {
    updated: item?.modified || item?.updatedAt,
    published: item?.published || item?.publishedAt,
    initialPublished: item?.initialPublished || item?.initialPublishedAt,
  };

  const { isNeverPublished, isInitialPublish, isSavedUpdate } = useInitialStatus( dates );

  const dateString = isInitialPublish ? dates.published : dates.updated;
  const { dateArgs, timeArgs } = getDateTimeArgs( dateString );

  // If the item has never been published or is the initial published version, show "Published".
  // If previewing and item with unpublished changes to the initial publish show "Updated".
  const showPublished = isAdminPreview
    ? isNeverPublished || ( isInitialPublish && !isSavedUpdate )
    : isNeverPublished || isInitialPublish;

  return (
    <div className={ `${styles.container} ${!item?.policy?.name ? styles['no-policy'] : ''} ${isAdminPreview ? styles.admin : ''}` }>
      { isAdminPreview && (
        <div className={ styles.preview }>
          <img src={ cautionIcon } alt="" height="18" width="18" />
          <p>This is a preview of how your Playbook will appear on Content Commons</p>
        </div>
      ) }
      <header className={ styles.header }>
        <div className={ styles['header-contents'] }>
          <button className={ styles.back } type="button" onClick={ () => router.back() }>
            <span>❮</span>{ /* eslint-disable-line */ }
            back
          </button>
        </div>
        <h1 className={ styles.title }>{ item?.title }</h1>
        { dates.updated && (
          <p>
            { showPublished ? 'Published: ' : 'Updated: ' }
            { isNeverPublished
              ? '(date will appear here)'
              : (
                <time dateTime={ dateString }>
                  { `${formatDateTime( dateArgs )} at ${formatDateTime( timeArgs )} (Washington, DC)` }
                </time>
              ) }
          </p>
        ) }
        <div className={ styles['header-contents'] }>
          <Popover
            id={ `${item?.id}_playbook-share` }
            className="playbook-project__popover playbook-project__popover--share"
            trigger={ <img src={ shareIconWhite } style={ { width: '20px', height: '20px' } } alt="share icon" /> }
            expandFromRight
            toolTip="Share playbook"
          >
            <div className="popup_share">
              <h2 className="ui header" style={ { textAlign: 'left' } }>Share this playbook.</h2>
              <Share
                id={ item?.id }
                isPreview={ isAdminPreview }
                type="playbook"
                { ...( isAdminPreview
                  ? { link: 'The direct link to the playbook will appear here.' }
                  : null ) }
              />
            </div>
          </Popover>
        </div>
      </header>
      { item?.policy?.name && (
        <div className={ styles['policy-container'] }>
          <span
            className={ styles.policy }
            style={ getBadgeStyle( item?.policy?.theme ) }
          >
            { item.policy.name }
          </span>
        </div>
      ) }
      <TexturedSection description={ desc } narrow>
        <div
          className={ styles.content }
          dangerouslySetInnerHTML={ { __html: DOMPurify.sanitize( item?.content?.html || '' ) } } // eslint-disable-line react/no-danger
        />
      </TexturedSection>
      { item?.supportFiles && item?.supportFiles?.length > 0 && (
        <div className={ styles['resources-container'] }>
          <h3 className={ styles['resources-title'] }>Additional Resources</h3>
          <div className={ styles['resources-content'] }>
            <h4 className={ styles['resources-attachment-title'] }>Downloadable attachments.</h4>
            <small className={ styles['resources-instructions'] }>
              <em>Download the attached files related to this Playbook.</em>
            </small>
            <ul className={ styles['resources-list'] }>
              { item.supportFiles.map( file => (
                <li key={ file.filename }>
                  <DownloadItemContent
                    hoverText={ `Download ${file.filename}` }
                    isAdminPreview={ isAdminPreview }
                    srcUrl={ maybeGetUrlToProdS3( file.url ) }
                    downloadFilename={ file.filename }
                  >
                    <div className="item-content">
                      <p className="item-content__title">
                        <strong>
                          { `Download "${file.filename}"` }
                        </strong>
                      </p>
                      { file.filetype && (
                        <p className="item-content__meta">{ `File type: ${getColloquialFiletype( file.filetype )}` }</p>
                      ) }
                      { file.filesize && (
                        <p className="item-content__meta">{ `File size: ${formatBytes( file.filesize )}` }</p>
                      ) }
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
