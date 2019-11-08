import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { Form, Button } from 'semantic-ui-react';
import ButtonAddFiles from 'components/ButtonAddFiles/ButtonAddFiles';

const PackageType = props => {
  useEffect( () => {
    props.updateModalClassname( 'upload_modal project-type-active' );
    return () => props.updateModalClassname( 'upload_modal' );
  }, [] );

  const { closeModal } = props;
  return (
    <Form>
      <Form.Input label="Name" required />
      <Form.Input label="Type" required />
      <div className="upload_actions">
        <Button
          type="button"
          onClick={ closeModal }
          className="secondary alternative"
        >
          Cancel
        </Button>
        <ButtonAddFiles accept={ [] } onChange={ () => {} } multiple>Add Files</ButtonAddFiles>
      </div>
    </Form>
  );
};

PackageType.propTypes = {
  closeModal: PropTypes.func,
  updateModalClassname: PropTypes.func,
};

export default PackageType;
