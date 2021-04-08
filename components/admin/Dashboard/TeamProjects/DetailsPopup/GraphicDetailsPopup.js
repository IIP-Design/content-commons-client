import React, { useContext, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useQuery } from '@apollo/client';

import ApolloError from 'components/errors/ApolloError';
import { formatBytes } from 'lib/utils';
import { DashboardContext } from 'context/dashboardContext';

const GraphicDetailsPopup = ( { id } ) => {
  const { dispatch, state } = useContext( DashboardContext );

  /**
   * Get count of projects from GraphQL
   */
  const fileData = useQuery( state.queries.files, {
    variables: { id },
    fetchPolicy: 'cache-and-network',
  } );

  useEffect( () => {
    const { data, error, loading } = fileData;

    const images = data?.graphicProject?.images ? data.graphicProject.images : [];

    // Save project count in context
    dispatch( { type: 'UPDATE_FILES', payload: { files: images, error, loading } } );
  }, [fileData] );

  const files = state?.files?.files ? state.files.files : [];
  const filesError = state?.files?.error ? state.files.error : null;
  const filesLoading = state?.files?.loading ? state.files.loading : false;

  if ( filesLoading ) return <div className="details-files"><p>Loading....</p></div>;

  if ( filesError ) return <ApolloError error={ filesError } />;

  if ( files.length ) {
    return (
      <div className="details-files">
        <ul>
          { files.map( file => {
            if ( !file ) return null;
            const {
              id: fileId,
              filename,
              filetype,
              filesize,
              language: { displayName },
            } = file;

            return (
              <li key={ fileId }>
                { filename && filename }
                { '  |  ' }
                { filetype && filetype }
                { '  |  ' }
                { `${displayName} ${formatBytes( filesize )}` }
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
  id: PropTypes.string,
};

export default GraphicDetailsPopup;
