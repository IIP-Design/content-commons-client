import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import VisuallyHidden from 'components/VisuallyHidden/VisuallyHidden';
import { Form } from 'semantic-ui-react';
import { Query } from 'react-apollo';
import gql from 'graphql-tag';
import sortBy from 'lodash/sortBy';
import { addEmptyOption } from 'lib/utils';

const VIDEO_USE_QUERY = gql`
  query VIDEO_USE_QUERY {
    videoUses {
      id
      name
    }
  }
`;

const IMAGE_USE_QUERY = gql`
  query IMAGE_USE_QUERY {
    imageUses {
      id
      name
    }
  }
`;

const DOCUMENT_USE_QUERY = gql`
  query DocumentUses {
    documentUses {
      id
      name
    }
  }
`;

const areEqual = ( prevProps, nextProps ) => prevProps.value === nextProps.value;

const UseDropdown = props => {
  let query;
  switch ( props.type.toLowerCase() ) {
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

  return (
    <Query query={ query }>
      { ( { data, loading, error } ) => {
        if ( error ) return `Error! ${error.message}`;

        let options = [];

        if ( data ) {
          const { videoUses, imageUses, documentUses } = data;
          const uses = videoUses || imageUses || documentUses;
          if ( uses ) { // checks for uses in the event we have neither video or image
            options = sortBy( uses, use => use.name ).map( u => ( { key: u.id, text: u.name, value: u.id } ) );
          }
        }

        addEmptyOption( options );

        return (
          <Fragment>
            { !props.label && (

              <VisuallyHidden>
                <label htmlFor={ props.id }>
                  { `${props.id} use` }
                </label>
              </VisuallyHidden>
            ) }

            <Form.Dropdown
              id={ props.id }
              name={ props.name }
              options={ options }
              placeholder="–"
              loading={ loading }
              fluid
              selection
              { ...props }
            />
          </Fragment>
        );
      } }
    </Query>
  );
};

UseDropdown.defaultProps = {
  id: '',
  name: 'use'
};

UseDropdown.propTypes = {
  id: PropTypes.string,
  label: PropTypes.string,
  name: PropTypes.string,
  type: PropTypes.string
};

export default React.memo( UseDropdown, areEqual );

export { VIDEO_USE_QUERY };
export { IMAGE_USE_QUERY };
export { DOCUMENT_USE_QUERY };
