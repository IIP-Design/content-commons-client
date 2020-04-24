import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useRouter } from 'next/router';
import { useQuery } from '@apollo/react-hooks';
import { Loader } from 'semantic-ui-react';
import ActionButtons from 'components/admin/ActionButtons/ActionButtons';
import ApolloError from 'components/errors/ApolloError';
import ProjectHeader from 'components/admin/ProjectHeader/ProjectHeader';
import { GRAPHIC_PROJECT_QUERY } from 'lib/graphql/queries/graphic';

const GraphicEdit = props => {
  const { id: projectId } = props;
  const router = useRouter();

  const {
    loading, error: queryError, data
  } = useQuery( GRAPHIC_PROJECT_QUERY, {
    partialRefetch: true,
    variables: { id: projectId },
    displayName: 'GraphicProjectQuery',
    skip: !projectId
  } );

  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState( false );
  const [disableBtns, setDisableBtns] = useState( false );

  useEffect( () => {
    if ( data.graphicProject ) {
      const { images } = data.graphicProject;

      if ( !images.length ) {
        setDisableBtns( true );
      }
    }
  }, [] );

  const deleteProjectEnabled = () => (
    /**
     * disable delete project button if either there
     * is no project id OR project has been published
     */
    !projectId || ( data?.graphicProject && !!data.graphicProject.publishedAt )
  );

  const handleExit = () => {
    router.push( { pathname: '/admin/dashboard' } );
  };

  const handleDeleteConfirm = async () => {
    console.log( `delete project ${projectId}` );

    return null;
    // const deletedProjectId = await deleteProject( {
    //   variables: { id: projectId }
    // } ).catch( err => { setError( err ); } );

    // if ( deletedProjectId ) {
    //   handleExit();
    // }
  };

  const handlePublish = async () => {
    console.log( `publish project ${projectId}` );

    return null;
    // setPublishOperation( 'publish' );
    // executePublishOperation( projectId, publishProject );
  };

  const handlePublishChanges = async () => {
    console.log( `publishChanges for project ${projectId}` );

    return null;
    // setPublishOperation( 'publishChanges' );
    // executePublishOperation( projectId, publishProject );
  };

  const handleUnPublish = async () => {
    console.log( `unpublish project ${projectId}` );

    return null;
    // setPublishOperation( 'unpublish' );
    // executePublishOperation( projectId, unPublishProject );
  };

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

  if ( queryError ) {
    return (
      <div style={ centeredStyles }>
        <ApolloError error={ queryError } />
      </div>
    );
  }

  if ( !data ) return null;

  return (
    <div className="edit-project">
      <div className="edit-project__header">
        <ProjectHeader icon="images outline" text="Project Details">
          <ActionButtons
            deleteConfirmOpen={ deleteConfirmOpen }
            setDeleteConfirmOpen={ setDeleteConfirmOpen }
            disabled={ {
              delete: deleteProjectEnabled(),
              save: !projectId || disableBtns,
              preview: !projectId || disableBtns,
              publish: !projectId || disableBtns,
              publishChanges: !projectId || disableBtns
            } }
            handle={ {
              deleteConfirm: handleDeleteConfirm,
              save: handleExit,
              publish: handlePublish,
              publishChanges: handlePublishChanges,
              unpublish: handleUnPublish
            } }
            show={ {
              delete: true,
              save: true,
              preview: true,
              publish: true, // temp
              unpublish: false // temp
            } }
            loading={ {
              publish: false, // temp
              publishChanges: false, // temp
              unpublish: false // temp
            } }
          />
        </ProjectHeader>
      </div>
    </div>
  );
};

GraphicEdit.propTypes = {
  id: PropTypes.string
};

export default GraphicEdit;
