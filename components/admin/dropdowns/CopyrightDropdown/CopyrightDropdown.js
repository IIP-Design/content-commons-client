import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { Form } from 'semantic-ui-react';
import { Query } from 'react-apollo';
import gql from 'graphql-tag';
import VisuallyHidden from 'components/VisuallyHidden/VisuallyHidden';

import '../dropdown.scss';

const COPYRIGHT_QUERY = gql`
  query COPYRIGHT_QUERY {
    __type(name: "Copyright"){
     enumValues {
       name
     }
    }
  }
`;

const areEqual = ( prevProps, nextProps ) => prevProps.value === nextProps.value;

const CopyrightDropdown = props => (
  <Query query={ COPYRIGHT_QUERY }>
    { ( { data, loading, error } ) => {
      if ( error ) return `Error! ${error.message}`;

      let options = [];

      if ( data?.__type?.enumValues ) {
        options = data.__type.enumValues.map( obj => {
          const text = obj.name === 'COPYRIGHT'
            ? 'Copyright terms outlined in internal description'
            : 'No copyright beyond provided watermark attribution';

          return {
            key: obj.name,
            text,
            value: obj.name
          };
        } );
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

CopyrightDropdown.defaultProps = {
  id: ''
};

CopyrightDropdown.propTypes = {
  id: PropTypes.string,
  label: PropTypes.string
};

export default React.memo( CopyrightDropdown, areEqual );
export { COPYRIGHT_QUERY };
