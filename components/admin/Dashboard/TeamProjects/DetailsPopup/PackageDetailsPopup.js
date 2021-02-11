import React from 'react';
import PropTypes from 'prop-types';
import { useQuery } from '@apollo/react-hooks';
import ApolloError from 'components/errors/ApolloError';
import { PACKAGE_FILES_QUERY } from 'lib/graphql/queries/package';


const PackageDetailsPopup = ( { id } ) => {
  const { loading, error, data } = useQuery( PACKAGE_FILES_QUERY, {
    variables: { id },
  } );

  if ( loading ) return <p>Loading....</p>;
  if ( error ) return <ApolloError error={ error } />;

  const { documents } = data.pkg;

  return (
    <div className="details-files">
      <ul>
        { !documents.length && <li>There are no files associated with this project.</li> }
        { documents.map( doc => <li key={ doc.id }>{ doc.filename }</li> ) }
      </ul>
    </div>
  );
};

PackageDetailsPopup.propTypes = {
  id: PropTypes.string,
};

export default PackageDetailsPopup;
