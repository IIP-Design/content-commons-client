import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useApolloClient } from '@apollo/react-hooks';
import { Form } from 'semantic-ui-react';
import FilterMenuItem from 'components/FilterMenu/FilterMenuItem';
import VisuallyHidden from 'components/VisuallyHidden/VisuallyHidden';
import { COUNTRIES_REGIONS_QUERY } from 'lib/graphql/queries/document';
import { getCount } from 'lib/utils';
import './FilterMenuCountries.scss';

const FilterMenuCountries = props => {
  const [searchedCountry, setSearchedCountry] = useState( '' );

  useEffect( () => {
    setSearchedCountry( '' );
  }, [props.selected] );

  const client = useApolloClient();
  const { countries } = client.readQuery( {
    query: COUNTRIES_REGIONS_QUERY,
  } );

  if ( !countries || !getCount( countries ) ) return null;

  const getMenuOptions = () => countries.reduce( ( acc, country ) => {
    const displayName = `${country.name} (${country.abbr})`;
    const searchTerm = searchedCountry.toLowerCase().trim();

    if ( displayName.toLowerCase().includes( searchTerm ) ) {
      acc.push( {
        display_name: displayName,
        key: country.name,
      } );
    }

    return acc;
  }, [] );

  const handleChange = ( e, { value } ) => {
    setSearchedCountry( value );
  };

  return (
    <FilterMenuItem
      className="subfilter subfilter--countries"
      filter="Countries & Areas"
      name="countries"
      selected={ props.selected }
      options={ getMenuOptions() }
      formItem="checkbox"
      searchInput={ (
        // <div style={ { margin: 0, padding: '0.5em 1em' } }>
        <div>
          <VisuallyHidden>
            {/* eslint-disable jsx-a11y/label-has-associated-control */}
            <label htmlFor="filter-countries">Search countries</label>
          </VisuallyHidden>
          <Form.Input
            id="filter-countries"
            placeholder="Search countries"
            name="countries"
            icon="search"
            iconPosition="right"
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
