import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import VisuallyHidden from 'components/VisuallyHidden/VisuallyHidden';
import { Form } from 'semantic-ui-react';
import { Query } from 'react-apollo';
import gql from 'graphql-tag';

const VISIBILITY_QUERY = gql`
  query VISIBILITY_QUERY {
    __type(name: "Visibility"){
     enumValues {
       name
     }
    }
  }
 `;

const areEqual = ( prevProps, nextProps ) => prevProps.value === nextProps.value;

const VisibilityDropdown = props => (
  <Query query={ VISIBILITY_QUERY }>
    { ( { data, loading, error } ) => {
      if ( error ) return `Error! ${error.message}`;

      let options = [];

      if ( data && data.__type && data.__type.enumValues ) {
        options = data.__type.enumValues
          .map( enumValue => {
            const text = enumValue.name === 'PUBLIC'
              ? 'Public (displayed on Content Commons)'
              : 'Internal (Department of State only)';

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
                { `${props.id} visibilty` }
              </label>
            </VisuallyHidden>
          ) }

          <Form.Dropdown
            id={ props.id }
            name="visibility"
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

VisibilityDropdown.defaultProps = {
  id: ''
};

VisibilityDropdown.propTypes = {
  id: PropTypes.string,
  label: PropTypes.string
};

export default React.memo( VisibilityDropdown, areEqual );
export { VISIBILITY_QUERY };
