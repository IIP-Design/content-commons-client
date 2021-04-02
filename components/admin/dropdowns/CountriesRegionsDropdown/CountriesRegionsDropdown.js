import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import VisuallyHidden from 'components/VisuallyHidden/VisuallyHidden';
import { Form } from 'semantic-ui-react';
import { Query } from '@apollo/client/react/components';
import sortBy from 'lodash/sortBy';
import { COUNTRIES_REGIONS_QUERY } from 'lib/graphql/queries/document';
import '../dropdown.scss';

const areEqual = ( prevProps, nextProps ) => prevProps.value === nextProps.value;

const CountriesRegionsDropdown = props => (
  <Query query={ COUNTRIES_REGIONS_QUERY }>
    { ( { data, loading, error } ) => {
      if ( error ) return `Error! ${error.message}`;

      let options = [];

      if ( data && data.countries ) {
        options = sortBy( data.countries, country => country.name ).map( country => ( {
          key: country.id,
          text: `${country.name} (${country.abbr})`,
          value: country.id,
        } ) );
      }

      return (
        <Fragment>
          { !props.label && (

            <VisuallyHidden>
              <label htmlFor={ props.id }>
                { `${props.id} countries` }
              </label>
            </VisuallyHidden>
          ) }

          <Form.Dropdown
            id={ props.id }
            name="countries"
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


CountriesRegionsDropdown.defaultProps = {
  id: '',
};

CountriesRegionsDropdown.propTypes = {
  id: PropTypes.string,
  label: PropTypes.string,
};

export default React.memo( CountriesRegionsDropdown, areEqual );
export { COUNTRIES_REGIONS_QUERY };
