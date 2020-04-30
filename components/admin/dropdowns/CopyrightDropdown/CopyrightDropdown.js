import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import VisuallyHidden from 'components/VisuallyHidden/VisuallyHidden';
import { Form } from 'semantic-ui-react';
import sortBy from 'lodash/sortBy';

import '../dropdown.scss';

export const data = [
  {
    id: 'jrzmg9415cxhhg5f89ke',
    name: 'Copyright terms outlined in internal description',
    value: 'Copyright terms outlined in internal description'
  },
  {
    id: 'm2luyv4bowv18a6lvmwr',
    name: 'No copyright beyond provided watermark attribution',
    value: 'No copyright beyond provided watermark attribution'
  }
];

const areEqual = ( prevProps, nextProps ) => prevProps.value === nextProps.value;

const CopyrightDropdown = props => {
  let options = [];

  if ( data ) {
    options = sortBy( data, obj => obj.name ).map( obj => ( {
      key: obj.id,
      text: obj.name,
      value: obj.name
    } ) );
  }

  return (
    <Fragment>
      { !props.label && (

        <VisuallyHidden>
          <label htmlFor={ props.id }>
            { `${props.id} graphic styles` }
          </label>
        </VisuallyHidden>
      ) }

      <Form.Dropdown
        id={ props.id }
        name="copyright"
        options={ options }
        placeholder="–"
        fluid
        selection
        { ...props }
      />
    </Fragment>
  );
};


CopyrightDropdown.defaultProps = {
  id: ''
};

CopyrightDropdown.propTypes = {
  id: PropTypes.string,
  label: PropTypes.string
};

export default React.memo( CopyrightDropdown, areEqual );
