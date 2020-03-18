import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { useQuery } from '@apollo/react-hooks';
import { Form, Loader } from 'semantic-ui-react';
import ApolloError from 'components/errors/ApolloError';
import FilterMenuItem from 'components/FilterMenu/FilterMenuItem';
import VisuallyHidden from 'components/VisuallyHidden/VisuallyHidden';
import { COUNTRIES_REGIONS_QUERY } from 'lib/graphql/queries/document';
import { getCount } from 'lib/utils';

// const areEqual = ( prevProps, nextProps ) => prevProps.value === nextProps.value;

const FilterMenuCountries = props => {
  const { loading, error, data } = useQuery( COUNTRIES_REGIONS_QUERY );
  const [searchedCountry, setSearchedCountry] = useState( '' );

  if ( error ) return <ApolloError error={ error } />;
  if ( loading ) {
    return (
      <div style={ { display: 'flex', alignItems: 'center', marginTop: '0.625rem' } }>
        <Loader
          active
          inline
          size="mini"
          style={ { marginRight: '0.25rem' } }
        />
        <span style={ { color: '#112e51', fontSize: '0.888888889rem' } }>Loading...</span>
      </div>
    );
  }
  if ( !data ) return null;

  const getMenuOptions = () => {
    if ( getCount( data.countries ) ) {
      return data.countries.reduce( ( acc, country ) => {
        const name = country.name.toLowerCase();
        const searchTerm = searchedCountry.toLowerCase();

        if ( name.includes( searchTerm ) ) {
          acc.push( {
            // count: 0,
            display_name: country.name,
            key: country.name
          } );
        }
        return acc;
      }, [] );
    }
    return [];
  };

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
            <label htmlFor="filter-countries">Search countries</label>
          </VisuallyHidden>
          <Form.Input
            id="filter-countries"
            placeholder="Search countries"
            name="countries"
            icon="search"
            value={ searchedCountry }
            onChange={ handleChange }
          />
        </div>
      ) }
    />
  );
};

FilterMenuCountries.propTypes = {
  selected: PropTypes.array
};

// export default React.memo( FilterMenuCountries, areEqual );
export default FilterMenuCountries;
