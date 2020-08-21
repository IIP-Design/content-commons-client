import React from 'react';
import PropTypes from 'prop-types';
import { useApolloClient } from '@apollo/react-hooks';
import { BUREAUS_OFFICES_QUERY } from 'lib/graphql/queries/document';
import { getCount } from 'lib/utils';
import FilterMenuItem from 'components/FilterMenu/FilterMenuItem';

const BureausOfficesSubmenu = ( { selected } ) => {
  const client = useApolloClient();
  const { bureaus } = client.readQuery( {
    query: BUREAUS_OFFICES_QUERY,
  } );

  if ( !bureaus || !getCount( bureaus ) ) return null;

  const bureausCollection = bureaus.map( bureau => ( {
    key: bureau.name,
    display_name: bureau.name,
  } ) );

  const officesCollection = bureaus
    .filter( bureau => bureau.offices.length > 0 )
    .reduce( ( offices, bureau ) => {
      const formatOffices = bureau.offices.map( office => ( {
        key: office.name,
        display_name: office.name,
      } ) );

      return [...offices, ...formatOffices];
    }, [] );

  const bureausOfficesOptions = [...bureausCollection, ...officesCollection];

  return (
    <FilterMenuItem
      className="subfilter"
      selected={ selected }
      filter="Bureaus & Offices"
      name="bureausOffices"
      options={ bureausOfficesOptions }
      formItem="checkbox"
    />
  );
};

BureausOfficesSubmenu.propTypes = {
  selected: PropTypes.array,
};

export default BureausOfficesSubmenu;
