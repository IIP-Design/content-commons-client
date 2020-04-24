import React from 'react';
import PropTypes from 'prop-types';
import { useQuery } from '@apollo/react-hooks';
import { Loader } from 'semantic-ui-react';
import ApolloError from 'components/errors/ApolloError';
import { GRAPHIC_PROJECT_QUERY } from 'lib/graphql/queries/graphic';

const GraphicEdit = props => {
  const { id: projectId } = props;

  const {
    loading, error, data
  } = useQuery( GRAPHIC_PROJECT_QUERY, {
    partialRefetch: true,
    variables: { id: projectId },
    displayName: 'GraphicProjectQuery',
    skip: !projectId
  } );

  const centeredStyles = {
    position: 'absolute',
    top: '9em',
    left: '50%',
    transform: 'translateX(-50%)'
  };

  if ( loading ) {
    return (
      <div
        style={ {
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '200px'
        } }
      >
        <Loader
          active
          inline="centered"
          style={ { marginBottom: '1em' } }
          content="Loading project details page..."
        />
      </div>
    );
  }

  if ( error ) {
    return (
      <div style={ centeredStyles }>
        <ApolloError error={ error } />
      </div>
    );
  }

  if ( !data ) return null;

  return (
    <p>
      GraphicEdit Page
      { projectId }
    </p>
  );
};

GraphicEdit.propTypes = {
  id: PropTypes.string
};

export default GraphicEdit;
