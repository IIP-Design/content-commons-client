import React from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'next/router';
import downloadIcon from 'static/icons/icon_download.svg';
import shareIcon from 'static/icons/icon_share.svg';
import ModalItem from '../modals/ModalItem';
import ModalLangDropdown from '../modals/ModalLangDropdown/ModalLangDropdown';
import ModalContentMeta from '../modals/ModalContentMeta/ModalContentMeta';
import ModalDescription from '../modals/ModalDescription/ModalDescription';
import ModalPostMeta from '../modals/ModalPostMeta/ModalPostMeta';
import ModalPostTags from '../modals/ModalPostTags/ModalPostTags';

const Document = props => {
  const { item } = props;
  const {
    id,
    published,
    modified,
    author,
    owner,
    link,
    title,
    content: { rawText },
    logo,
    thumbnail,
    language,
    languages,
    document,
    categories,
    type,
  } = item;

  return (
    <ModalItem headline={ title }>
      <ModalContentMeta type={ type } dateUpdated={ modified } transcript="" />
      <ModalDescription description={ rawText } />
      <ModalPostMeta author={ author } logo={ logo } source={ owner } datePublished={ published } />
      <ModalPostTags tags={ categories } />
    </ModalItem>
  );
};

Document.propTypes = {
  item: PropTypes.shape( {
    id: PropTypes.string,
    published: PropTypes.string,
    modified: PropTypes.string,
    author: PropTypes.string,
    owner: PropTypes.string,
    link: PropTypes.string,
    title: PropTypes.string,
    content: PropTypes.object,
    logo: PropTypes.string,
    thumbnail: PropTypes.string,
    language: PropTypes.string,
    languages: PropTypes.array,
    document: PropTypes.string,
    categories: PropTypes.array,
    type: PropTypes.string,
  } ),
};

export default Document;
