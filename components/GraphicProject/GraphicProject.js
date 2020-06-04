import React, { Fragment, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { updateUrl } from 'lib/browser';
import { displayDOSLogo } from 'lib/sourceLogoUtils';
import { getPreviewNotificationStyles } from 'lib/utils';
import { useAuth } from 'context/authContext';
import { normalizeGraphicProjectByAPI } from './utils';

import downloadIcon from 'static/icons/icon_download.svg';
import shareIcon from 'static/icons/icon_share.svg';

import Notification from 'components/Notification/Notification';
import Popover from 'components/popups/Popover/Popover';
import TabLayout from 'components/TabLayout/TabLayout';
import DownloadItem from 'components/download/DownloadItem/DownloadItem';
import Share from 'components/Share/Share';
import GraphicFiles from './Download/GraphicFiles';
import GenericFiles from './Download/GenericFiles';
import Help from './Download/Help';

import ModalItem from 'components/modals/ModalItem';
import ModalLangDropdown from '../modals/ModalLangDropdown/ModalLangDropdown';
import ModalImage from '../modals/ModalImage/ModalImage';
import ModalContentMeta from '../modals/ModalContentMeta/ModalContentMeta';
import ModalDescription from 'components/modals/ModalDescription/ModalDescription';
import ModalPostMeta from 'components/modals/ModalPostMeta/ModalPostMeta';
import ModalPostTags from 'components/modals/ModalPostTags/ModalPostTags';

import './GraphicProject.scss';

// import tempSrcUrl from 'components/download/DownloadItem/graphicPlaceholderImg.png';

const GraphicProject = ( {
  displayAsModal,
  isAdminPreview,
  item,
  useGraphQl,
} ) => {
  const { user } = useAuth();
  const router = useRouter();

  const normalizedGraphicData = normalizeGraphicProjectByAPI( { file: item, useGraphQl } );

  const {
    id,
    site,
    type,
    projectType,
    published,
    modified,
    owner,
    desc,
    descInternal,
    copyright,
    images,
    supportFiles,
    categories,
  } = normalizedGraphicData;

  // Use Twitter graphics as default for display otherwise whatever graphic image is available
  const filterGraphicImgs = () => {
    const containsTwitterImgs = images.some( img => img.social === 'Twitter' );

    if ( containsTwitterImgs ) {
      return images.filter( img => img.social === 'Twitter' );
    }

    return images;
  };
  const graphicUnits = filterGraphicImgs();

  // Set default unit to English lang version if available
  // unless path is for specific lang or no english version
  const setDefaultSelectedUnit = () => {
    // If displaying as page then check query language
    if ( !displayAsModal ) {
      const { language } = router.query;

      return graphicUnits.find( unit => unit.language.locale === language );
    }

    const englishUnit = graphicUnits.find( unit => unit.language.display_name === 'English' );

    if ( englishUnit ) return englishUnit;

    return graphicUnits[0];
  };

  // Selected Unit State
  const [selectedUnit, setSelectedUnit] = useState( setDefaultSelectedUnit() );

  // Update selected unit on language change
  const handleLanguageChange = lang => {
    if ( lang !== selectedUnit.language.display_name ) {
      setSelectedUnit( graphicUnits.filter( unit => unit.language.display_name === lang )[0] );
    }
  };

  const {
    title,
    language: selectedUnitLanguage,
    alt,
  } = selectedUnit;

  useEffect( () => {
    // If page display, update url path
    if ( !displayAsModal ) {
      updateUrl( `/graphic?id=${id}&site=${site}&language=${selectedUnitLanguage.locale}` );
    }
  }, [selectedUnit] );

  // Image files by language
  const selectedUnitImages = images.filter( img => img.language.display_name === selectedUnitLanguage.display_name );

  // Editable support files by language
  const editableFileTypes = [
    '.psd', '.ai', '.eps', '.ae', '.jpg', '.jpeg', '.png',
  ];
  const selectedUnitSupportFiles = supportFiles
    .filter( file => {
      const { filename } = file;
      const fileType = filename.slice( filename.lastIndexOf( '.' ) );

      return editableFileTypes.includes( fileType );
    } )
    .filter( file => file.language.display_name === selectedUnitLanguage.display_name );

  // Non-editable files by language
  const selectedUnitOtherFiles = supportFiles
    .filter( file => {
      const { filename } = file;
      const fileType = filename.slice( filename.lastIndexOf( '.' ) );

      return !editableFileTypes.includes( fileType );
    } )
    .filter( file => file.language.display_name === selectedUnitLanguage.display_name );

  const copyrightMsg = copyright === 'COPYRIGHT'
    ? 'Copyright terms outlined in internal description'
    : '';

  const tabs = [
    {
      title: 'Graphic Files',
      content: (
        <DownloadItem
          instructions={ `Download the graphic files in ${selectedUnitLanguage.display_name}. This download option is best for uploading this graphic to web pages and social media.` }
        >
          { !selectedUnitImages.length
            && <p className="download-item__noContent">There are no graphic files available for download at this time.</p>}
          { selectedUnitImages.map(
            img => <GraphicFiles key={ img.srcUrl } file={ img } isAdminPreview={ isAdminPreview } />
          ) }
        </DownloadItem>
      ),
    },
    {
      title: 'Editable Files',
      content: (
        <DownloadItem
          instructions={ (
            <Fragment>
              <p>
                By downloading these editable files you agree to the
                { ' ' }
                <Link href="/about"><a>Terms of Use</a></Link>
              </p>
              { copyrightMsg && <p><strong>{ copyrightMsg }</strong></p> }
            </Fragment>
          ) }
        >
          { !selectedUnitSupportFiles.length
            && <p className="download-item__noContent">There are no editable files available for download at this time.</p>}
          { selectedUnitSupportFiles.map(
            file => <GenericFiles key={ file.id } file={ file } isAdminPreview={ isAdminPreview } />
          ) }
        </DownloadItem>
      ),
    },
    {
      title: 'Other',
      content: (
        <DownloadItem
          instructions={ (
            <p>
              By downloading these files you agree to the
              { ' ' }
              <Link href="/about"><a>Terms of Use</a></Link>
            </p>
          ) }
        >
          { !selectedUnitOtherFiles.length
            && <p className="download-item__noContent">There are no other files available for download at this time.</p>}
          { selectedUnitOtherFiles.map(
            file => <GenericFiles key={ file.id } file={ file } isAdminPreview={ isAdminPreview } />
          ) }
        </DownloadItem>
      ),
    },
    {
      title: 'Help',
      content: <Help />,
    },
  ];

  const authFilterTabs = () => {
    if ( user ) {
      return tabs;
    }

    return tabs.filter( tab => tab.title !== 'Editable Files' );
  };

  return (
    <ModalItem
      className={ isAdminPreview ? 'graphic-project adminPreview' : 'graphic-project' }
      headline={ title }
      lang={ selectedUnitLanguage.language_code }
      textDirection={ selectedUnitLanguage.text_direction }
    >
      { isAdminPreview && (
        <Notification
          el="p"
          show
          customStyles={ getPreviewNotificationStyles() }
          msg="This is a preview of your graphics project on Content Commons."
        />
      ) }
      <div className="modal_options">
        <div className="modal_options_left">
          <ModalLangDropdown
            item={ normalizedGraphicData }
            selected={ selectedUnitLanguage.display_name }
            handleLanguageChange={ handleLanguageChange }
          />
        </div>
        <div className="trigger-container">
          <Popover
            id={ `${id}_graphic-share` }
            className="graphic-project__popover graphic-project__popover--share"
            trigger={ <img src={ shareIcon } style={ { width: '20px', height: '20px' } } alt="share icon" /> }
            expandFromRight
            toolTip="Share graphic"
          >
            <div className="popup_share">
              <h2 className="ui header">Share this graphic.</h2>
              <Share
                id={ id }
                site={ site }
                title={ title }
                language={ selectedUnitLanguage.locale }
                type={ type }
                isPreview={ isAdminPreview }
                { ...( isAdminPreview
                  ? { link: 'The direct link to the package will appear here.' }
                  : null
                ) }
              />
            </div>
          </Popover>

          <Popover
            id={ `${id}_graphic-download` }
            className="graphic-project__popover graphic-project__popover--download"
            trigger={ <img src={ downloadIcon } style={ { width: '20px', height: '20px' } } alt="download icon" /> }
            expandFromRight
            toolTip="Download graphic"
          >
            <TabLayout
              headline="Download this graphic."
              tabs={ authFilterTabs() }
            />
          </Popover>
        </div>
      </div>

      { selectedUnit?.srcUrl
        && (
          <ModalImage
            thumbnail={ selectedUnit.srcUrl }
            thumbnailMeta={ {
              alt: alt || title || selectedUnit?.filename || '',
            } }
          />
        ) }

      <ModalContentMeta
        type={ `${projectType.toLowerCase().replace( '_', ' ' )} graphic` }
        dateUpdated={ modified }
      />

      <ModalDescription description={ desc } />

      { user
        && (
          <section className="graphic-project__content">
            <p className="graphic-project__content__title">Internal Description:</p>
            { descInternal }
          </section>
        ) }

      <section className="graphic-project__content">
        <p className="graphic-project__content__title">Alt (Alternative) Text:</p>
        { alt }
      </section>

      <ModalPostMeta
        logo={ displayDOSLogo( owner ) }
        source={ owner }
        datePublished={ published }
      />
      <ModalPostTags tags={ categories } />
    </ModalItem>
  );
};

GraphicProject.propTypes = {
  item: PropTypes.shape( {
    id: PropTypes.string,
    site: PropTypes.string,
    type: PropTypes.string,
    projectType: PropTypes.string,
    published: PropTypes.string,
    modified: PropTypes.string,
    visibility: PropTypes.string,
    owner: PropTypes.string,
    alt: PropTypes.string,
    desc: PropTypes.string,
    descInternal: PropTypes.string,
    copyright: PropTypes.string,
    images: PropTypes.array,
    supportFiles: PropTypes.array,
    categories: PropTypes.array,
  } ),
  displayAsModal: PropTypes.bool,
  isAdminPreview: PropTypes.bool,
  useGraphQl: PropTypes.bool,
};

export default GraphicProject;
