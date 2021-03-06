import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useApolloClient } from '@apollo/client';
import { Form } from 'semantic-ui-react';
import FilterMenuItem from 'components/FilterMenu/FilterMenuItem';
import VisuallyHidden from 'components/VisuallyHidden/VisuallyHidden';
import { COUNTRIES_REGIONS_QUERY } from 'lib/graphql/queries/document';
import { getCount } from 'lib/utils';

const FilterMenuCountries = props => {
  const [searchedCountry, setSearchedCountry] = useState( '' );

  useEffect( () => {
    setSearchedCountry( '' );
  }, [props.selected] );

  const client = useApolloClient();
  const res = client.readQuery( {
    query: COUNTRIES_REGIONS_QUERY,
  } );

  // query is not yet available in cache, return
  if ( !res ) return null;

  const { countries } = res;

  // query is available in cache but has no entries, return
  if ( !countries || !getCount( countries ) ) return null;

  const getMenuOptions = () => (
    countries.reduce( ( acc, country ) => {
      const displayName = `${country.name} (${country.abbr})`;
      const searchTerm = searchedCountry.toLowerCase().trim();

      if ( displayName.toLowerCase().includes( searchTerm ) ) {
        acc.push( {
          display_name: displayName,
          key: country.name,
        } );
      }

      return acc;
    }, [] )
  );

  const handleChange = ( e, { value } ) => {
    setSearchedCountry( value );
  };

  return (
    <FilterMenuItem
      className="clamped"
      filter="Country"
      name="countries"
      selected={ props.selected }
      options={ getMenuOptions() }
      formItem="checkbox"
      searchInput={ (
        <div style={ { margin: 0, padding: '0.5em 1em' } }>
          <VisuallyHidden>
            { /* eslint-disable-next-line jsx-a11y/label-has-associated-control */ }
            <label htmlFor="filter-countries">Search countries</label>
          </VisuallyHidden>
          <Form.Input
            id="filter-countries"
            placeholder="Search countries"
            name="countries"
            icon="search"
            iconPosition="left"
            value={ searchedCountry }
            onChange={ handleChange }
          />
        </div>
      ) }
    />
  );
};

FilterMenuCountries.propTypes = {
  selected: PropTypes.array,
};

export default FilterMenuCountries;
