import PropTypes from 'prop-types';
import { useQuery } from '@apollo/client';
import { Loader } from 'semantic-ui-react';
import ApolloError from 'components/errors/ApolloError';
import Playbook from 'components/Playbook/Playbook';
import { PLAYBOOK_QUERY } from 'lib/graphql/queries/playbook';
import styles from './PlaybookPreview.module.scss';

const PlaybookPreview = ( { id, item: itemFromServer } ) => {
  const { data, error, loading } = useQuery( PLAYBOOK_QUERY, {
    variables: { id },
    skip: !!itemFromServer,
  } );

  if ( loading ) {
    return (
      <div className={ styles.loading }>
        <Loader
          active
          inline="centered"
          style={ { marginBottom: '1em' } }
          content="Loading Playbook preview..."
        />
      </div>
    );
  }

  if ( error ) return <ApolloError error={ error } />;
  if ( !itemFromServer && !data?.playbook ) {
    return <p className={ styles.unavailable }>Preview is unavailable.</p>;
  }

  return <Playbook item={ itemFromServer || data.playbook } />;
};

PlaybookPreview.propTypes = {
  id: PropTypes.string,
  item: PropTypes.object,
};

export default PlaybookPreview;
