import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { updateUrl } from 'lib/browser';

import { Button } from 'semantic-ui-react';
import 'styles/tooltip.scss';

import downloadIcon from 'static/icons/icon_download.svg';
import shareIcon from 'static/icons/icon_share.svg';

import InternalUseDisplay from 'components/InternalUseDisplay/InternalUseDisplay';
import Share from '../Share/Share';
import PopupTrigger from '../popups/PopupTrigger';
import Popup from '../popups/Popup';

import ModalItem from '../modals/ModalItem';
import ModalLangDropdown from '../modals/ModalLangDropdown/ModalLangDropdown';
import ModalDescription from '../modals/ModalDescription/ModalDescription';
import ModalPostMeta from '../modals/ModalPostMeta/ModalPostMeta';
import ModalPostTags from '../modals/ModalPostTags/ModalPostTags';


const Document = props => {
  const { item } = props;
  const {
    id,
    published,
    owner,
    site,
    title,
    content: { rawText },
    logo,
    language,
    documentUrl,
    documentUse,
    categories,
    type,
  } = item;

  useEffect( () => {
    updateUrl( `/document?id=${id}&site=${site}&language=${language.locale}` );
  }, [] );

  return (
    <ModalItem headline={ title }>
      <div className="modal_options">
        <div className="modal_options_left">
          <ModalLangDropdown item={ item } selected={ language.display_name } />
        </div>
        <div>
          <InternalUseDisplay />
          <PopupTrigger
            toolTip="Share video"
            icon={ { img: shareIcon, dim: 20 } }
            show
            content={ (
              <Popup title="Copy the link to share internally.">
                <Share
                  link=""
                  id={ id }
                  site={ site }
                  title={ title }
                  language={ language.locale }
                  type={ type }
                />
              </Popup>
            ) }
          />
          <Button className="trigger" tooltip="Not For Public Distribution">
            <a
              href={ documentUrl }
              className="trigger"
              download
              target="_blank"
              rel="noopener noreferrer"
            >
              <img
                src={ downloadIcon }
                width={ 18 }
                height={ 18 }
                alt="Not For Public Distribution"
              />
            </a>
          </Button>
        </div>
      </div>

      <ModalDescription description={ rawText } />
      <ModalPostMeta
        type={ type }
        logo={ logo }
        source={ owner }
        datePublished={ published }
        releaseType={ documentUse }
      />
      <ModalPostTags tags={ categories } />

      <InternalUseDisplay expanded />
    </ModalItem>
  );
};

Document.propTypes = {
  item: PropTypes.shape( {
    id: PropTypes.number,
    published: PropTypes.string,
    author: PropTypes.string,
    owner: PropTypes.string,
    site: PropTypes.string,
    link: PropTypes.string,
    title: PropTypes.string,
    content: PropTypes.object,
    logo: PropTypes.string,
    thumbnail: PropTypes.string,
    language: PropTypes.object,
    documentUrl: PropTypes.string,
    documentUse: PropTypes.string,
    categories: PropTypes.array,
    type: PropTypes.string,
  } ),
};

export default Document;
