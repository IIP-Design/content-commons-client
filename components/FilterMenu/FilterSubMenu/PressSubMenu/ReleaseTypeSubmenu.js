import React from 'react';
import PropTypes from 'prop-types';
import { useApolloClient } from '@apollo/react-hooks';
import { DOCUMENT_USE_QUERY } from 'lib/graphql/queries/document';
import { getCount } from 'lib/utils';
import FilterMenuItem from 'components/FilterMenu/FilterMenuItem';

const ReleaseTypeSubmenu = ( { selected } ) => {
  const client = useApolloClient();
  const { documentUses } = client.readQuery( {
    query: DOCUMENT_USE_QUERY,
  } );

  if ( !documentUses || !getCount( documentUses ) ) return null;

  const releaseTypeOptions = documentUses.map( use => ( {
    key: use.name,
    display_name: use.name,
  } ) );

  return (
    <FilterMenuItem
      className="subfilter"
      selected={ selected }
      filter="Release Type"
      name="documentUses"
      options={ releaseTypeOptions }
      formItem="checkbox"
    />
  );
};

ReleaseTypeSubmenu.propTypes = {
  selected: PropTypes.array,
};

export default ReleaseTypeSubmenu;
