import React, { Fragment, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { updateUrl } from 'lib/browser';
import { displayDOSLogo } from 'lib/sourceLogoUtils';

import downloadIcon from 'static/icons/icon_download.svg';
import shareIcon from 'static/icons/icon_share.svg';

import Notification from 'components/Notification/Notification';
import Share from 'components/Share/Share';

import DownloadItem from 'components/download/DownloadItem/DownloadItem';
import GraphicFiles from './Download/GraphicFiles';
import EditableFiles from './Download/EditableFiles';
import OtherFiles from './Download/OtherFiles';
import Help from './Download/Help';

import PopupTrigger from 'components/popups/PopupTrigger';
import Popup from 'components/popups/Popup';
import Popover from 'components/popups/Popover/Popover';
import TabLayout from 'components/TabLayout/TabLayout';

import ModalItem from 'components/modals/ModalItem';
import ModalLangDropdown from '../modals/ModalLangDropdown/ModalLangDropdown';
import ModalImage from '../modals/ModalImage/ModalImage';
import ModalContentMeta from '../modals/ModalContentMeta/ModalContentMeta';
import ModalDescription from 'components/modals/ModalDescription/ModalDescription';
import ModalPostMeta from 'components/modals/ModalPostMeta/ModalPostMeta';
import ModalPostTags from 'components/modals/ModalPostTags/ModalPostTags';

import './GraphicProject.scss';

/* eslint-disable-next-line import/no-unresolved */
import tempSrcUrl from 'components/download/DownloadItem/graphicPlaceHolderImg.png';

const GraphicProject = props => {
  const router = useRouter();
  const { isAdminPreview, displayAsModal, item } = props;

  const {
    id,
    site,
    type,
    projectType,
    published,
    modified,
    owner,
    desc,
    copyright,
    images,
    supportFiles,
    categories
  } = item;

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
    srcUrl,
    alt
  } = selectedUnit;

  useEffect( () => {
    if ( !displayAsModal ) {
      updateUrl( `/graphic?id=${id}&site=${site}&language=${selectedUnitLanguage.locale}` );
    }
  }, [selectedUnit] );

  // Images by language
  const selectedUnitImages = images.filter( img => img.language.display_name === selectedUnitLanguage.display_name );
  // Editable support files by language
  const selectedUnitSupportFiles = supportFiles
    .filter( file => file.editable === true )
    .filter( file => file.language.display_name === selectedUnitLanguage.display_name );
  // Non-editable files by language
  const selectedUnitOtherFiles = supportFiles
    .filter( file => file.editable !== true )
    .filter( file => file.language.display_name === selectedUnitLanguage.display_name );

  return (
    <ModalItem
      headline={ title }
      textDirection={ selectedUnitLanguage.text_direction }
      lang={ selectedUnitLanguage.language_code }
      className="graphic-project"
    >
      <div className="modal_options">
        <div className="modal_options_left">
          <ModalLangDropdown
            item={ item }
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
              tabs={ [
                {
                  title: 'Graphic Files',
                  content: (
                    <DownloadItem
                      instructions={ `Download the graphic files in ${selectedUnitLanguage.display_name}. This download option is best for uploading this graphic to web pages and social media.` }
                    >
                      { selectedUnitImages.map( img => <GraphicFiles key={ img.srcUrl } file={ img } /> ) }
                    </DownloadItem>
                  )
                },
                {
                  title: 'Editable Files',
                  content: (
                    <DownloadItem
                      instructions={ (
                        <Fragment>
                          <p>
                            By downloading these editable files you agree to the
                            <Link href="/about"><a>Terms of Use</a></Link>
                          </p>
                          <p>
                            <strong>
                              Credit for this photo must be used: &copy;
                              {' '}
                              { `${copyright}` }
                            </strong>
                          </p>
                        </Fragment>
                      ) }
                    >
                      { selectedUnitSupportFiles
                        .map( file => <EditableFiles key={ file.srcUrl } file={ file } /> )}
                    </DownloadItem>
                  )
                },
                {
                  title: 'Other',
                  content: (
                    <DownloadItem
                      instructions={ (
                        <p>
                          By downloading these editable files you agree to the
                          <Link href="/about"><a>Terms of Use</a></Link>
                        </p>
                      ) }
                    >
                      { selectedUnitOtherFiles.map( file => <OtherFiles key={ file.srcUrl } file={ file } /> ) }
                    </DownloadItem>
                  )
                },
                {
                  title: 'Help',
                  content: <Help />
                }
              ] }
            />
          </Popover>
        </div>
      </div>
      {/* TO DO: Update thumbnail to use srcUrl */}
      <ModalImage thumbnail={ tempSrcUrl } thumbnailMeta={ { alt } } />
      <ModalContentMeta type={ projectType } dateUpdated={ modified } />
      <ModalDescription description={ desc } />
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
    copyright: PropTypes.string,
    images: PropTypes.array,
    supportFiles: PropTypes.array,
    tags: PropTypes.array,
    categories: PropTypes.array
  } ),
  displayAsModal: PropTypes.bool,
  isAdminPreview: PropTypes.bool
};

export default GraphicProject;
