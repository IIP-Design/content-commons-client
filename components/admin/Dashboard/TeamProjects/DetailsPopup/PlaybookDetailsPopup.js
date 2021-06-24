import PropTypes from 'prop-types';
import { useQuery } from '@apollo/client';

import ApolloError from 'components/errors/ApolloError';

import { PLAYBOOK_FILES_QUERY } from 'lib/graphql/queries/playbook';

const PlaybookDetailsPopup = ( { id } ) => {
  const { loading, error, data } = useQuery( PLAYBOOK_FILES_QUERY, {
    variables: { id },
  } );

  if ( loading ) return <p>Loading....</p>;
  if ( error ) return <ApolloError error={ error } />;

  const { supportFiles } = data.playbook;

  return (
    <div className="details-files">
      <ul>
        { !supportFiles.length && <li>There are no files associated with this project.</li> }
        { supportFiles.map( file => <li key={ file.id }>{ file.filename }</li> ) }
      </ul>
    </div>
  );
};

PlaybookDetailsPopup.propTypes = {
  id: PropTypes.string,
};

export default PlaybookDetailsPopup;
