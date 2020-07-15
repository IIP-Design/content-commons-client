import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { useQuery } from 'react-apollo';
import { Form } from 'semantic-ui-react';
import gql from 'graphql-tag';
import VisuallyHidden from 'components/VisuallyHidden/VisuallyHidden';
import { addEmptyOption } from 'lib/utils';

const VIDEO_BURNED_IN_STATUS_QUERY = gql`
  query VIDEO_BURNED_IN_STATUS_QUERY {
    __type(name: "VideoBurnedInStatus"){
     enumValues {
       name
     }
    }
  }
`;

const areEqual = ( prevProps, nextProps ) => prevProps.value === nextProps.value;

const VideoBurnedInStatusDropdown = ( { id, label, ...rest } ) => {
  const { data, loading, error } = useQuery( VIDEO_BURNED_IN_STATUS_QUERY );

  if ( error ) return `Error! ${error.message}`;

  let options = [];

  if ( data && data.__type && data.__type.enumValues ) {
    options = data.__type.enumValues
      // currently not using CAPTIONED
      .filter( enumValue => enumValue.name !== 'CAPTIONED' )
      .map( ( { name } ) => ( {
        key: name,
        text: name === 'SUBTITLED' ? 'Yes' : 'No',
        value: name,
      } ) );
  }

  addEmptyOption( options );

  return (
    <Fragment>
      { !label && (
        <VisuallyHidden>
          <label htmlFor={ id }>on-screen text</label>
        </VisuallyHidden>
      ) }

      <Form.Dropdown
        id={ id }
        { ...( label && { label } ) }
        name="videoBurnedInStatus"
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


VideoBurnedInStatusDropdown.defaultProps = {
  id: '',
};

VideoBurnedInStatusDropdown.propTypes = {
  id: PropTypes.string,
  label: PropTypes.string,
};

export default React.memo( VideoBurnedInStatusDropdown, areEqual );
export { VIDEO_BURNED_IN_STATUS_QUERY };
