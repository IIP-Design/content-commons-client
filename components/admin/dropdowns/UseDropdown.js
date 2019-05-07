import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import VisuallyHidden from 'components/VisuallyHidden/VisuallyHidden';
import { Form } from 'semantic-ui-react';
import { Query } from 'react-apollo';
import gql from 'graphql-tag';
import sortBy from 'lodash/sortBy';

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

const UseDropdown = props => (
  <Query query={ props.type === 'video' ? VIDEO_USE_QUERY : IMAGE_USE_QUERY }>
    { ( { data, loading, error } ) => {
      if ( error ) return `Error! ${error.message}`;

      let options = [];

      if ( data ) {
        const { videoUses, imageUses } = data;
        const uses = videoUses || imageUses;
        if ( uses ) { // checks for uses in the event we have neither video or image
          options = sortBy( uses, use => use.name ).map( u => ( { key: u.id, text: u.name, value: u.id } ) );
        }
      }

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
            name="use"
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

UseDropdown.defaultProps = {
  id: ''
};

UseDropdown.propTypes = {
  id: PropTypes.string,
  label: PropTypes.string,
  type: PropTypes.string
};

export default UseDropdown;
export { VIDEO_USE_QUERY };
export { IMAGE_USE_QUERY };
