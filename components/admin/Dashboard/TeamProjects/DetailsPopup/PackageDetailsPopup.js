import React from 'react';
import PropTypes from 'prop-types';
import { useQuery } from '@apollo/react-hooks';
import gql from 'graphql-tag';
import ApolloError from 'components/errors/ApolloError';

import { packageDocsMock } from './packageDocsMock';

const PACKAGE_DOCUMENTS_QUERY = gql`
  query PackageDocumentsQuery( $id: ID! ) {
    package( id: $id ) {
      id
      documents {
        id
        filename      
      }
    }
  }
`;

// const PackageDetailsPopup = props => {
//   const { loading, error, data } = useQuery( PACKAGE_DOCUMENTS_QUERY, {
//     variables: { id: props.id }
//   } );

//   if ( loading ) return <p>Loading....</p>;
//   if ( error ) return <ApolloError error={ error } />;

//   const { documents } = data.package;
//   if ( !documents.length ) return null;

//   return (
//     <div className="details-files">
//       <ul>
//         { documents.map( doc => (
//           <li key={ doc.id }>{ doc.filename }</li>
//         ) ) }
//       </ul>
//     </div>
//   );
// };

const PackageDetailsPopup = props => {
  const documents = packageDocsMock.result.data;
  return (
    <div className="details-files">
      <ul>
        { documents.map( doc => (
          <li key={ doc.id }>{ doc.filename }</li>
        ) ) }
      </ul>
    </div>
  );
};

PackageDetailsPopup.propTypes = {

};

export default PackageDetailsPopup;
