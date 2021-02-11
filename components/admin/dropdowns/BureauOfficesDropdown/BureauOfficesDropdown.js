import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import VisuallyHidden from 'components/VisuallyHidden/VisuallyHidden';
import { Form } from 'semantic-ui-react';
import { Query } from 'react-apollo';
import sortBy from 'lodash/sortBy';
import gql from 'graphql-tag';

import '../dropdown.scss';

const BUREAU_OFFICES_QUERY = gql`
  query BUREAU_OFFICES_QUERY {
    bureaus {
      id
      name
      abbr
      offices {
        id
        name
        abbr
      }
    }
  }
`;


const areEqual = ( prevProps, nextProps ) => prevProps.value === nextProps.value;

const BureauOfficesDropdown = props => (
  <Query query={ BUREAU_OFFICES_QUERY }>
    { ( { data, loading, error } ) => {
      if ( error ) return `Error! ${error.message}`;

      let options = [];

      if ( data && data.bureaus ) {
        options = sortBy( data.bureaus, bureau => bureau.name ).map( bureau => ( {
          key: bureau.id,
          text: `${bureau.name} (${bureau.abbr})`,
          value: bureau.id,
        } ) );
      }

      return (
        <Fragment>
          { !props.label && (

            <VisuallyHidden>
              <label htmlFor={ props.id }>
                { `${props.id} bureaus` }
              </label>
            </VisuallyHidden>
          ) }

          <Form.Dropdown
            id={ props.id }
            name="bureaus"
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


BureauOfficesDropdown.defaultProps = {
  id: '',
};

BureauOfficesDropdown.propTypes = {
  id: PropTypes.string,
  label: PropTypes.string,
};

export default React.memo( BureauOfficesDropdown, areEqual );
export { BUREAU_OFFICES_QUERY };
