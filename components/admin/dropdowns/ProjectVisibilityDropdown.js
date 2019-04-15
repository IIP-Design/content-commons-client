import React from 'react';
import PropTypes from 'prop-types';
import { Dropdown } from 'semantic-ui-react';
import { Query } from 'react-apollo';
import gql from 'graphql-tag';

const PROJECT_VISIBILITY_QUERY = gql`
  query PROJECT_VISIBILITY_QUERY {
    __type(name: "ProjectVisibility"){
     enumValues {
       name
     }
    }
  }
 `;


const ProjectVisibilityDropdown = props => (
  <Query query={ PROJECT_VISIBILITY_QUERY }>
    { ( { data, loading, error } ) => {
      if ( error ) return `Error! ${error.message}`;

      let options = [];

      if ( data && data.__type && data.__type.enumValues ) {
        options = data.__type.enumValues
          .map( enumValue => {
            const text = enumValue.name === 'PUBLIC'
              ? 'Anyone can see this project'
              : 'Internal use only';

            return {
              key: enumValue.name,
              text,
              value: enumValue.name
            };
          } );
      }

      return (
        <Dropdown
          id={ props.id }
          name="projectVisibility"
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

ProjectVisibilityDropdown.propTypes = {
  id: PropTypes.string,
  selected: PropTypes.string,
  onChange: PropTypes.func
};

export default ProjectVisibilityDropdown;
export { PROJECT_VISIBILITY_QUERY };
