import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import sortBy from 'lodash/sortBy';
import { Card } from 'semantic-ui-react';

import DownloadPkgFiles from 'components/admin/download/DownloadPkgFiles/DownloadPkgFiles';
import MetaTerms from 'components/admin/MetaTerms/MetaTerms';
import ModalItem from 'components/modals/ModalItem/ModalItem';
import Notification from 'components/Notification/Notification';
import PackageItem from './PackageItem/PackageItem';
import Share from 'components/Share/Share';
import VisuallyHidden from 'components/VisuallyHidden/VisuallyHidden';

import Popover from 'components/popups/Popover/Popover';
import DownloadItem from 'components/download/DownloadItem/DownloadItem';
import TabLayout from 'components/TabLayout/TabLayout';

import downloadIcon from 'static/icons/icon_download.svg';
import shareIcon from 'static/icons/icon_share.svg';

import {
  normalizeDocumentItemByAPI, getDateTimeTerms,
} from './utils';
import { updateUrl } from 'lib/browser';
import {
  getCount,
  getPluralStringOrNot,
  getPreviewNotificationStyles,
  parseToParagraphs,
} from 'lib/utils';
import Linkify from 'react-linkify';

import './Package.scss';

const Package = props => {
  const {
    displayAsModal, isAdminPreview, useGraphQl,
  } = props;

  const {
    id,
    published,
    modified,
    type,
    title,
    desc,
    site,
    documents,
  } = props.item;

  useEffect( () => {
    if ( !displayAsModal ) {
      updateUrl( `/package?id=${id}&site=${site}&language=en-us` );
    }
  }, [] );

  const getSortedDocuments = array => {
    if ( getCount( array ) === 0 ) {
      return array;
    }

    const primarySortKey = useGraphQl ? 'use.name' : 'use';
    const secondarySortKey = 'filename';

    return sortBy( array, [primarySortKey, secondarySortKey] );
  };

  const getCollatedDocuments = () => {
    /**
     * Collate in this order:
     * 1. Releases, 2. Guidances, 3. Transcripts, 4. Other
     */
    const releases = [];
    const guidances = [];
    const transcripts = [];
    const otherDocs = [];

    documents.forEach( doc => {
      const documentUse = useGraphQl ? doc.use.name : doc.use;

      switch ( documentUse ) {
        case 'Statement':
        case 'Travel Alert':
        case 'Travel Warning':
        case 'Fact Sheet':
        case 'Media Note':
        case 'Readout':
        case 'Notice to the Press':
        case 'Taken Questions':
          releases.push( doc );
          break;

        case 'Press Guidance':
          guidances.push( doc );
          break;

        case 'Interview':
        case 'On-the-record Briefing':
        case 'Remarks':
        case 'Background Briefing':
        case 'Speeches':
        case 'Department Press Briefing':
          transcripts.push( doc );
          break;

        default:
          otherDocs.push( doc );
          break;
      }
    } );

    return [
      ...getSortedDocuments( releases ),
      ...getSortedDocuments( guidances ),
      ...getSortedDocuments( transcripts ),
      ...getSortedDocuments( otherDocs ),
    ];
  };

  const collatedDocuments = getCollatedDocuments();

  return (
    <ModalItem
      className={ isAdminPreview ? 'package package--preview' : 'package' }
      headline={ title }
      textDirection="LTR" // use LTR since pkg have no lang field
    >
      {isAdminPreview && (
        <Notification
          el="p"
          show
          customStyles={ getPreviewNotificationStyles() }
          msg="This is a preview of your package on Content Commons."
        />
      )}
      <MetaTerms
        className="date-time"
        unitId={ id }
        terms={ getDateTimeTerms( published, modified, 'LT, l' ) }
      />

      <div className="modal_options">
        <div className="trigger-container">
          <Popover
            id={ `${id}_package-share` }
            className="package-project__popover package-project__popover--share"
            trigger={ <img src={ shareIcon } style={ { width: '20px', height: '20px' } } alt="share icon" /> }
            expandFromRight
            toolTip="Share package"
          >
            <div className="popup_share">
              <h2 className="ui header">Share this package.</h2>
              <Share
                id={ id }
                isPreview={ isAdminPreview }
                language="en-us" // use en since pkg have no lang field
                link="The direct link to the package will appear here."
                site={ site }
                title={ title }
                type="package"
              />
            </div>
          </Popover>
          <Popover
            toolTip={ getPluralStringOrNot( documents, 'Download file' ) }
            id={ `${id}_package-download` }
            className="package-project__popover package-project__popover--download"
            trigger={ (
              <img
                src={ downloadIcon }
                style={ { width: '18px', height: '18px' } }
                alt="download icon"
              />
            ) }
            expandFromRight
          >
            <TabLayout
              headline={ getPluralStringOrNot( documents, 'Package File' ) }
              tabs={ [
                {
                  title: getPluralStringOrNot( documents, 'Document' ),
                  content: (
                    <DownloadItem
                      instructions={
                        documents.length > 1
                          ? 'Download full press guidance package as zip file or individual Word documents.'
                          : getPluralStringOrNot( documents, 'Download Package File' )
                      }
                    >
                      <DownloadPkgFiles
                        id={ id }
                        title={ title }
                        files={ documents }
                        isPreview={ isAdminPreview }
                      />
                    </DownloadItem>
                  ),
                },
              ] }
            />
          </Popover>
          <span className="file-count">
            {' '}
            {`(${getCount( documents )})`}
            <VisuallyHidden> documents in this package</VisuallyHidden>
          </span>
        </div>
      </div>

      {desc && (
        <div className="package-description-container">
          <div className="package-description">
            <div className="header">Background</div>
            <div>
              <Linkify>{parseToParagraphs( desc )}</Linkify>
            </div>
          </div>
        </div>
      )}

      <div className="package-items">
        <Card.Group>
          {getCount( documents )
            ? collatedDocuments.map( file => (
              <PackageItem
                key={ file.id }
                file={ normalizeDocumentItemByAPI( { file, useGraphQl } ) }
                type={ type }
                isAdminPreview={ isAdminPreview }
              />
            ) )
            : 'There are no files associated with this package.'}
        </Card.Group>
      </div>
    </ModalItem>
  );
};

Package.propTypes = {
  displayAsModal: PropTypes.bool,
  isAdminPreview: PropTypes.bool,
  useGraphQl: PropTypes.bool,
  item: PropTypes.object,
};

export default Package;
