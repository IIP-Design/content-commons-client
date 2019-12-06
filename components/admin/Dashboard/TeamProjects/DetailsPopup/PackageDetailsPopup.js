import React from 'react';
import PropTypes from 'prop-types';
import { useQuery } from '@apollo/react-hooks';
import ApolloError from 'components/errors/ApolloError';
import { PACKAGE_DOCUMENTS_QUERY } from 'lib/graphql/queries/package';


const PackageDetailsPopup = props => {
  const { loading, error, data } = useQuery( PACKAGE_DOCUMENTS_QUERY, {
    variables: { id: props.id }
  } );

  if ( loading ) return <p>Loading....</p>;
  if ( error ) return <ApolloError error={ error } />;

  const { documents } = data.packageDocuments;

  return (
    <div className="details-files">
      <ul>
        { !documents.length && <li>There are no files associated with this project.</li> }
        { documents.map( doc => (
          <li key={ doc.id }>{ doc.filename }</li>
        ) ) }
      </ul>
    </div>
  );
};

PackageDetailsPopup.propTypes = {
  id: PropTypes.string,
};

export default PackageDetailsPopup;
