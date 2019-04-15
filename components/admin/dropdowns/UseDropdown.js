import React from 'react';
import PropTypes from 'prop-types';
import { Dropdown } from 'semantic-ui-react';
import { Query } from 'react-apollo';
import gql from 'graphql-tag';

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
          options = uses.map( u => ( { key: u.id, text: u.name, value: u.id } ) );
        }
      }

      return (
        <Dropdown
          id={ props.id }
          name="use"
          onChange={ props.onChange }
          options={ options }
          placeholder="–"
          value={ props.selected }
          // error={ !selectedLanguage }
          fluid
          selection
          loading={ loading }
        />
      );
    } }
  </Query>

);

UseDropdown.propTypes = {
  id: PropTypes.string,
  selected: PropTypes.string,
  onChange: PropTypes.func,
  type: PropTypes.string
};

export default UseDropdown;
export { VIDEO_USE_QUERY };
export { IMAGE_USE_QUERY };
