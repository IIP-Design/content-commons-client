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

  const bureauOfficesOptions = bureaus.map( bureau => ( {
    key: bureau.name,
    display_name: bureau.name,
  } ) );

  return (
    <FilterMenuItem
      selected={ selected }
      className="clamped"
      filter="Bureaus & Offices"
      name="bureausOffices"
      options={ bureauOfficesOptions }
      formItem="checkbox"
    />
  );
};

BureausOfficesSubmenu.propTypes = {
  selected: PropTypes.array,
};

export default BureausOfficesSubmenu;
