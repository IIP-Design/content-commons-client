import { useState } from 'react';

function useToggleModal( ) {
  const [modalOpen, setModalOpen] = useState( false );

  const handleOpenModel = () => {
    setModalOpen( true );
  };

  /**
   * Called from within edit modal to reset 'modalOpen' state to false
   * If we do not reset then the state will never change and the modal
   * will not reopen
   */
  const handleCloseModal = () => {
    setModalOpen( false );
  };

  return {
    modalOpen,
    handleOpenModel,
    handleCloseModal,
  };
}


export default useToggleModal;
