import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useRouter } from 'next/router';
import { updateUrl } from 'lib/browser';
import { displayDOSLogo } from 'lib/sourceLogoUtils';

import downloadIcon from 'static/icons/icon_download.svg';
import shareIcon from 'static/icons/icon_share.svg';

import Notification from 'components/Notification/Notification';
import Share from 'components/Share/Share';
import DownloadHelp from './DownloadHelp';

import PopupTrigger from 'components/popups/PopupTrigger';
import PopupTabbed from '../popups/PopupTabbed';
import Popup from 'components/popups/Popup';

import ModalItem from 'components/modals/ModalItem';
import ModalLangDropdown from '../modals/ModalLangDropdown/ModalLangDropdown';
import ModalImage from '../modals/ModalImage/ModalImage';
import ModalContentMeta from '../modals/ModalContentMeta/ModalContentMeta';
import ModalDescription from 'components/modals/ModalDescription/ModalDescription';
import ModalPostMeta from 'components/modals/ModalPostMeta/ModalPostMeta';
import ModalPostTags from 'components/modals/ModalPostTags/ModalPostTags';

/* eslint-disable-next-line import/no-unresolved */
import tempSrcUrl from './graphicPlaceHolderImg.png';

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

  const [graphicUnits, setGraphicUnits] = useState( filterGraphicImgs() );

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

  const [selectedUnit, setSelectedUnit] = useState( setDefaultSelectedUnit() );

  // Update selected unit on language change
  const handleLanguageChange = lang => {
    if ( lang !== selectedUnit.language.display_name ) {
      setSelectedUnit( graphicUnits.filter( unit => unit.language.display_name === lang )[0] );
    }
  };

  const {
    title,
    language: graphicLanguage,
    srcUrl,
    alt
  } = selectedUnit;

  useEffect( () => {
    if ( !displayAsModal ) {
      updateUrl( `/graphic?id=${id}&site=${site}&language=${graphicLanguage.locale}` );
    }
  }, [selectedUnit] );

  const DownloadElement = isAdminPreview ? 'span' : 'a';

  return (
    <ModalItem
      headline={ title }
      textDirection={ graphicLanguage.text_direction }
      lang={ graphicLanguage.language_code }
    >
      <div className="modal_options">
        <div className="modal_options_left">
          <ModalLangDropdown
            item={ item }
            selected={ graphicLanguage.display_name }
            handleLanguageChange={ handleLanguageChange }
          />
        </div>
        <div className="trigger-container">
          <PopupTrigger
            toolTip="Share graphic"
            icon={ { img: shareIcon, dim: 20 } }
            show
            content={ (
              <Popup title="Share this graphic.">
                <Share
                  id={ id }
                  site={ site }
                  title={ title }
                  language={ graphicLanguage.locale }
                  type={ type }
                />
              </Popup>
            ) }
          />
          <PopupTrigger
            toolTip="Download graphic"
            icon={ { img: downloadIcon, dim: 18 } }
            position="right"
            show
            content={ (
              <PopupTabbed
                title="Download this graphic."
                panes={ [
                  {
                    title: 'Graphic Files',
                    component: <p>Graphic Files</p>
                  },
                  {
                    title: 'Editable Files',
                    component: <p>Editable Files</p>
                  },
                  {
                    title: 'Other',
                    component: <p>Other Files</p>
                  },
                  { title: 'Help', component: <DownloadHelp /> }
                ] }
              />
            ) }
          />
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
