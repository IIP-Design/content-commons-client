import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import VisuallyHidden from 'components/VisuallyHidden/VisuallyHidden';
import { Form } from 'semantic-ui-react';
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
        <Fragment>
          { !props.label && (

            <VisuallyHidden>
              <label htmlFor={ props.id }>
                { `${props.id} project visibilty` }
              </label>
            </VisuallyHidden>
          ) }

          <Form.Dropdown
            id={ props.id }
            name="projectVisibility"
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

ProjectVisibilityDropdown.defaultProps = {
  id: ''
};

ProjectVisibilityDropdown.propTypes = {
  id: PropTypes.string,
  label: PropTypes.string
};

export default ProjectVisibilityDropdown;
export { PROJECT_VISIBILITY_QUERY };
