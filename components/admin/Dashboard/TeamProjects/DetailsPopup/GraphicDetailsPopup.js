import React, { useContext, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useQuery } from '@apollo/react-hooks';

import ApolloError from 'components/errors/ApolloError';
import { formatBytes, getS3Url } from 'lib/utils';
import { DashboardContext } from 'context/dashboardContext';

const GraphicDetailsPopup = ( { id } ) => {
  const { dispatch, state } = useContext( DashboardContext );

  /**
   * Get count of projects from GraphQL
   */
  const fileData = useQuery( state.queries.files, {
    variables: { id },
    fetchPolicy: 'cache-and-network'
  } );

  useEffect( () => {
    const { data, error, loading } = fileData;

    const supportFiles = data?.graphicProject?.supportFiles ? data.graphicProject.supportFiles : [];

    // Save project count in context
    dispatch( { type: 'UPDATE_FILES', payload: { files: { supportFiles, error, loading } } } );
  }, [fileData] );

  const files = state?.files?.files ? state.files.files : [];
  const filesError = state?.files?.error ? state.files.error : null;
  const filesLoading = state?.files?.loading ? state.files.loading : false;

  if ( filesLoading ) return 'Loading....';
  if ( filesError ) return <ApolloError error={ filesError } />;

  if ( files.length ) {
    return (
      <div>
        <p>Files:</p>
        <ul>
          { files.map( file => {
            if ( !file ) return null;
            const {
              id: fileId,
              url,
              filetype,
              filesize,
              language: { displayName },
              use
            } = file;

            return (
              <li key={ fileId }>
                { use && use.name }
                {' | '}
                <a href={ getS3Url( url ) }>{ filetype }</a>
                {' | '}
                <a href={ getS3Url( url ) }>
                  { `${displayName} ${formatBytes( filesize )}` }
                </a>
              </li>
            );
          } ) }
        </ul>
      </div>
    );
  }

  return <p>There are no supporting Graphic project files.</p>;
};

GraphicDetailsPopup.propTypes = {
  id: PropTypes.string
};

export default GraphicDetailsPopup;
