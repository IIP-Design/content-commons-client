import React, { useState } from 'react';
import PropTypes from 'prop-types';
// import dynamic from 'next/dynamic';
import { Modal } from 'semantic-ui-react';
import PressPackageItem from 'components/admin/PackagePreview/PressPackageItem/PressPackageItem';

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

const PackageItemPreview = ( { file, type } ) => {
  const [isOpen, setIsOpen] = useState( false );

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
        <p>{ file.title }</p>
      </Modal.Content>
    </Modal>
  );
};

PackageItemPreview.propTypes = {
  file: PropTypes.object,
  type: PropTypes.string
};

export default PackageItemPreview;
