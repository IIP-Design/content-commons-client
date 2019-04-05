import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { Dropdown } from 'semantic-ui-react';
import VisuallyHidden from 'components/VisuallyHidden/VisuallyHidden';
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

const UseDropdown = props => {
  const handleChange = ( e, data ) => {
    props.onChange( e, data, 'use' );
  };

  return (
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
          <Fragment>
            { /* eslint-disable jsx-a11y/label-has-for */ }
            <VisuallyHidden>
              <label htmlFor={ props.id }>
                { `${props.forFn} use` }
              </label>
            </VisuallyHidden>

            <Dropdown
              id={ props.id }
              onChange={ handleChange }
              options={ options }
              placeholder="–"
              value={ props.selected }
              // error={ !selectedLanguage }
              fluid
              required={ props.required }
              selection
              loading={ loading }
            />
          </Fragment>
        );
      } }
    </Query>

  );
};

UseDropdown.propTypes = {
  id: PropTypes.string,
  selected: PropTypes.string,
  onChange: PropTypes.func,
  forFn: PropTypes.string,
  required: PropTypes.bool,
  type: PropTypes.string
};

export default UseDropdown;
export { VIDEO_USE_QUERY };
export { IMAGE_USE_QUERY };
