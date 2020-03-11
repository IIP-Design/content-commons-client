import React from 'react';
import PropTypes from 'prop-types';
import { useQuery } from '@apollo/react-hooks';
import { Loader } from 'semantic-ui-react';
import ApolloError from 'components/errors/ApolloError';
import FilterMenuItem from 'components/FilterMenu/FilterMenuItem';
import { COUNTRIES_REGIONS_QUERY } from 'lib/graphql/queries/document';

const areEqual = ( prevProps, nextProps ) => prevProps.value === nextProps.value;

const FilterMenuCountries = props => {
  const { loading, error, data } = useQuery( COUNTRIES_REGIONS_QUERY );

  if ( error ) return <ApolloError error={ error } />;
  if ( loading ) {
    return (
      <Loader
        active
        inline
        size="tiny"
        content="Loading..."
      />
    );
  }
  if ( !data ) return null;

  const countries = data.countries.map( country => ( {
    // count: 0,
    display_name: country.name,
    key: country.name
  } ) );

  return (
    <FilterMenuItem
      className="clamped"
      filter="Country"
      name="country"
      selected={ props.selected }
      options={ countries }
      formItem="checkbox"
    />
  );
};

FilterMenuCountries.propTypes = {
  selected: PropTypes.array
};

export default React.memo( FilterMenuCountries, areEqual );
