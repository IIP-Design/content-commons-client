import React from 'react';
import PropTypes from 'prop-types';
import { Query } from 'react-apollo';
import gql from 'graphql-tag';
import ApolloError from 'components/errors/ApolloError';
import { formatBytes, getCount } from 'lib/utils';

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

// const PackageDetailsPopup = props => (
//   <Query query={ PACKAGE_DOCUMENTS_QUERY } variables={ { id: props.id } }>
//     {
//       ( { loading, error, data } ) => {
//         if ( loading ) return <p>Loading....</p>;
//         if ( error ) return <ApolloError error={ error } />;
//         if ( !data.package ) return null;

//         const { documents } = data.package;

//         return (
//           <ul>
//             { documents.map( doc => <li>{ doc.filename }</li> ) }
//           </ul>
//         );
//       }
//     }
//   </Query>
// );

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
