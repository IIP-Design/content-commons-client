import React, { Fragment, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { updateUrl } from 'lib/browser';
import { displayDOSLogo } from 'lib/sourceLogoUtils';
import { getCount, getFileExt, getPreviewNotificationStyles } from 'lib/utils';
import { useAuth } from 'context/authContext';
import {
  normalizeGraphicProjectByAPI,
  getGraphicImgsBySocial,
} from './utils';

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
    alt: projectAlt,
    projectType,
    published,
    modified,
    owner,
    title: projectTitle,
    desc,
    descInternal,
    copyright,
    images,
    supportFiles,
    categories,
  } = normalizedGraphicData;

  // Use Twitter graphics as default for display otherwise whatever graphic image is available
  const graphicUnits = getGraphicImgsBySocial( images, 'Twitter', useGraphQl );

  // Set default unit to English lang version if available
  // unless path is for specific lang or no english version
  const setDefaultSelectedUnit = () => {
    const qryLocale = router?.query?.language || '';
    const locale = displayAsModal ? 'en-us' : qryLocale;
    const languageUnit = graphicUnits.find( unit => unit.language.locale === locale );

    return languageUnit || graphicUnits[0];
  };

  // Selected Unit State
  const [selectedUnit, setSelectedUnit] = useState( setDefaultSelectedUnit() );

  // Update selected unit on language change
  const handleLanguageChange = lang => {
    if ( lang !== selectedUnit.language.display_name ) {
      const newSelection = images.find( unit => unit.language.display_name === lang );

      setSelectedUnit( newSelection );
    }
  };

  const {
    title,
    language: selectedUnitLanguage,
    alt: unitAlt,
    url: selectedUnitURL,
  } = selectedUnit;

  useEffect( () => {
    // If page display, update url path
    if ( !displayAsModal ) {
      updateUrl( `/graphic?id=${id}&site=${site}&language=${selectedUnitLanguage.locale}` );
    }
  }, [
    selectedUnit, displayAsModal, id, site, selectedUnitLanguage.locale,
  ] );

  // Image files by language
  const selectedUnitImages = images.filter( img => img.language.display_name === selectedUnitLanguage.display_name );

  const getSupportFiles = supportFileType => {
    const editableExtensions = [
      '.psd', '.ai', '.eps', '.ae', '.jpg', '.jpeg', '.png',
    ];
    const editableFiles = [];
    const additionalFiles = [];

    if ( getCount( supportFiles ) ) {
      supportFiles.forEach( file => {
        const extension = getFileExt( file.filename );

        const hasEditableExt = editableExtensions.includes( extension );

        if ( hasEditableExt ) {
          editableFiles.push( file );
        } else {
          additionalFiles.push( file );
        }
      } );
    }

    return supportFileType === 'editable' ? editableFiles : additionalFiles;
  };

  const selectedUnitSupportFiles = getSupportFiles( 'editable' );
  const selectedUnitOtherFiles = getSupportFiles( 'other' );

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
            img => <GraphicFiles key={ img.url } file={ img } isAdminPreview={ isAdminPreview } />,
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
                { 'By downloading these editable files you agree to the ' }
                <Link href="/about"><a>Terms of Use</a></Link>
              </p>
              { copyrightMsg && <p><strong>{ copyrightMsg }</strong></p> }
            </Fragment>
          ) }
        >
          { !selectedUnitSupportFiles.length
            && <p className="download-item__noContent">There are no editable files available for download at this time.</p>}
          { selectedUnitSupportFiles.map(
            file => <GenericFiles key={ file.url } file={ file } isAdminPreview={ isAdminPreview } />,
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
              { 'By downloading these files you agree to the ' }
              <Link href="/about"><a>Terms of Use</a></Link>
            </p>
          ) }
        >
          { !selectedUnitOtherFiles.length
            && <p className="download-item__noContent">There are no other files available for download at this time.</p>}
          { selectedUnitOtherFiles.map(
            file => <GenericFiles key={ file.url } file={ file } isAdminPreview={ isAdminPreview } />,
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

  const getAlt = () => unitAlt || projectAlt || projectTitle;

  return (
    <ModalItem
      className={ isAdminPreview ? 'graphic-project adminPreview' : 'graphic-project' }
      headline={ projectTitle }
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
            trigger={ (
              <img
                src={ shareIcon }
                style={ { width: '20px', height: '20px' } }
                alt="share icon"
              />
            ) }
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
                  ? { link: 'The direct link to the project will appear here.' }
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

      { selectedUnit?.url
        && (
          <ModalImage
            thumbnail={ selectedUnitURL }
            thumbnailMeta={ { alt: getAlt() } }
          />
        ) }

      <ModalContentMeta
        type={ `${projectType.toLowerCase().replace( '_', ' ' )} graphic` }
        dateUpdated={ modified }
      />

      <ModalDescription description={ desc } />

      { user && descInternal && (
        <section className="graphic-project__content internal-desc">
          <h2 className="graphic-project__content__title">
            Internal Description:
          </h2>
          <p>{ descInternal }</p>
        </section>
      ) }

      <section className="graphic-project__content alt">
        <h2 className="graphic-project__content__title">
          Alt (Alternative) Text:
        </h2>
        <p>{ getAlt() }</p>
      </section>

      <ModalPostMeta
        type={ projectType }
        logo={ displayDOSLogo( owner ) }
        source={ owner }
        datePublished={ published }
        textDirection={ selectedUnitLanguage.text_direction }
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
    desc: PropTypes.object,
    descInternal: PropTypes.object,
    copyright: PropTypes.string,
    images: PropTypes.array,
    supportFiles: PropTypes.array,
    categories: PropTypes.oneOfType( [PropTypes.array, PropTypes.string] ),
  } ),
  displayAsModal: PropTypes.bool,
  isAdminPreview: PropTypes.bool,
  useGraphQl: PropTypes.bool,
};

export default GraphicProject;
