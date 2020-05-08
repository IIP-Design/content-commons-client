import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import VisuallyHidden from 'components/VisuallyHidden/VisuallyHidden';
import { Form } from 'semantic-ui-react';
import { Query } from 'react-apollo';
import sortBy from 'lodash/sortBy';
import gql from 'graphql-tag';

import '../dropdown.scss';

const GRAPHIC_STYLES_QUERY = gql `
  query GRAPHIC_STYLES_QUERY {
    graphicStyles {
      id
      name
    }
  }
`;


const areEqual = ( prevProps, nextProps ) => prevProps.value === nextProps.value;

const GraphicStyleDropdown = props => (
  <Query query={ GRAPHIC_STYLES_QUERY }>
    { ( { data, loading, error } ) => {
      if ( error ) return `Error! ${error.message}`;

      let options = [];

      if ( data && data.graphicStyles ) {
        options = sortBy( data.graphicStyles, style => style.name ).map( style => ( {
          key: style.id,
          text: style.name,
          value: style.id
        } ) );
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
            name="style"
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


GraphicStyleDropdown.defaultProps = {
  id: ''
};

GraphicStyleDropdown.propTypes = {
  id: PropTypes.string,
  label: PropTypes.string
};

export default React.memo( GraphicStyleDropdown, areEqual );
export { GRAPHIC_STYLES_QUERY };
