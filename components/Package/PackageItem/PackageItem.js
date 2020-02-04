import React, { useState } from 'react';
import PropTypes from 'prop-types';
// import dynamic from 'next/dynamic';
import { Modal } from 'semantic-ui-react';
import { getCount } from 'lib/utils';
import Document from 'components/Document/Document';
import PressPackageItem from '../PressPackageItem/PressPackageItem';
import './PackageItem.scss';

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

const PackageItem = props => {
  const [isOpen, setIsOpen] = useState( false );

  const { file, type, isAdminPreview } = props;

  if ( !file || !getCount( file ) ) return null;

  const handleOpen = () => setIsOpen( true );
  const handleClose = () => setIsOpen( false );

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
        <Document item={ file } displayAsModal isAdminPreview={ isAdminPreview } />
      </Modal.Content>
    </Modal>
  );
};

PackageItem.propTypes = {
  file: PropTypes.object,
  type: PropTypes.string,
  isAdminPreview: PropTypes.bool
};

export default PackageItem;
