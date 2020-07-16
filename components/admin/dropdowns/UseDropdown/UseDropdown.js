import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { useQuery } from 'react-apollo';
import { Form } from 'semantic-ui-react';
import gql from 'graphql-tag';
import VisuallyHidden from 'components/VisuallyHidden/VisuallyHidden';
import { addEmptyOption } from 'lib/utils';

const VIDEO_USE_QUERY = gql`
  query VIDEO_USE_QUERY {
    videoUses(orderBy: name_ASC) {
      id
      name
    }
  }
`;

const IMAGE_USE_QUERY = gql`
  query IMAGE_USE_QUERY {
    imageUses(orderBy: name_ASC) {
      id
      name
    }
  }
`;

const DOCUMENT_USE_QUERY = gql`
  query DocumentUses {
    documentUses(orderBy: name_ASC) {
      id
      name
    }
  }
`;

const areEqual = ( prevProps, nextProps ) => prevProps.value === nextProps.value;

const UseDropdown = ( {
  id,
  label,
  name,
  type,
  ...rest
} ) => {
  let query;

  switch ( type.toLowerCase() ) {
    case 'video':
      query = VIDEO_USE_QUERY;
      break;
    case 'document':
      query = DOCUMENT_USE_QUERY;
      break;
    default:
      query = IMAGE_USE_QUERY;
      break;
  }

  const { data, loading, error } = useQuery( query );

  if ( error ) return `Error! ${error.message}`;

  let options = [];

  if ( data ) {
    const { videoUses, imageUses, documentUses } = data;
    const uses = videoUses || imageUses || documentUses;

    if ( uses ) { // checks for uses in the event we have neither video or image
      options = uses.map( u => ( { key: u.id, text: u.name, value: u.id } ) );
    }
  }

  addEmptyOption( options );

  return (
    <Fragment>
      { !label && (
        <VisuallyHidden>
          <label htmlFor={ id }>
            { `${type} use` }
          </label>
        </VisuallyHidden>
      ) }

      <Form.Dropdown
        id={ id }
        { ...( label && { label } ) }
        name={ name }
        options={ options }
        placeholder="–"
        loading={ loading }
        fluid
        selection
        { ...rest }
      />
    </Fragment>
  );
};

UseDropdown.defaultProps = {
  id: '',
  name: 'use',
};

UseDropdown.propTypes = {
  id: PropTypes.string,
  label: PropTypes.string,
  name: PropTypes.string,
  type: PropTypes.string,
};

export default React.memo( UseDropdown, areEqual );

export { VIDEO_USE_QUERY };
export { IMAGE_USE_QUERY };
export { DOCUMENT_USE_QUERY };
