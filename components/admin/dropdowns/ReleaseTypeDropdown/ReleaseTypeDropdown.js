import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { Form } from 'semantic-ui-react';
import VisuallyHidden from 'components/VisuallyHidden/VisuallyHidden';
import { addEmptyOption } from 'lib/utils';
import '../dropdown.scss';

const ReleaseTypeDropdown = props => {
  const { releaseTypes, id, onChange } = props;
  const options = releaseTypes.map( type => ( { key: type, text: type, value: type } ) );
  addEmptyOption( options );

  return (
    <Fragment>
      <VisuallyHidden>
        <label htmlFor={ id }>Select Release Type For Document</label>
      </VisuallyHidden>
      <Form.Dropdown
        id={ id }
        options={ options }
        fluid
        selection
        placeholder="-"
        onChange={ onChange }
      />
    </Fragment>
  );
};

ReleaseTypeDropdown.propTypes = {
  releaseTypes: PropTypes.array,
  id: PropTypes.string,
  onChange: PropTypes.func,
};

export default ReleaseTypeDropdown;
