import React, { useState } from 'react';
import PropTypes from 'prop-types';
// import dynamic from 'next/dynamic';
import { Modal } from 'semantic-ui-react';

import Document from 'components/Document/Document';
import PressPackageItem from 'components/admin/PackagePreview/PressPackageItem/PressPackageItem';

import DosSeal from 'static/images/dos_seal.svg';

import { getCount, getTransformedLangTaxArray } from 'lib/utils';

import './PackageItemPreview.scss';

/**
 * dynamic import results in
 * `Uncaught TypeError: node.contains is not a function`
 */
// const PressPackageItem = dynamic(
//   () => import(
//     /* webpackChunkName: "pressPackageItem" */
//     'components/admin/PackagePreview/PressPackageItem/PressPackageItem'
//   )
// );

const PackageItemPreview = props => {
  const [isOpen, setIsOpen] = useState( false );

  const { file, team, type } = props;
  const {
    publishedAt, language, title, content, tags, url
  } = file;

  const handleOpen = () => setIsOpen( true );
  const handleClose = () => setIsOpen( false );

  const getNormalizedItem = () => ( {
    // id,
    published: publishedAt || '',
    author: '',
    owner: team.name || '',
    site: '',
    link: 'The direct link to the package will appear here.',
    title,
    content: content || {},
    logo: DosSeal || '',
    thumbnail: '',
    language: language || {},
    documentUrl: url || '',
    documentUse: file.use.name || '',
    tags: getTransformedLangTaxArray( tags ) || [],
    type: 'document',
  } );

  const getTriggerComponent = () => {
    switch ( type ) {
      case 'DAILY_GUIDANCE':
        return PressPackageItem;
      // case 'SOME_FUTURE_TYPE':
      //   return FutureTriggerComponent;
      default:
        return PressPackageItem;
    }
  };

  const TriggerComponent = getTriggerComponent();

  return (
    <Modal
      open={ isOpen }
      onOpen={ handleOpen }
      onClose={ handleClose }
      trigger={ <TriggerComponent file={ file } handleClick={ handleOpen } /> }
      closeIcon
    >
      <Modal.Content>
        <Document item={ getNormalizedItem() } isAdminPreview />
      </Modal.Content>
    </Modal>
  );
};

PackageItemPreview.propTypes = {
  file: PropTypes.object,
  team: PropTypes.object,
  type: PropTypes.string
};

export default PackageItemPreview;
