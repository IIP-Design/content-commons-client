import { useEffect, useState } from 'react';
import { Loader } from 'semantic-ui-react';
import PropTypes from 'prop-types';
import { useMutation, useQuery } from '@apollo/client';
import { useRouter } from 'next/router';

import ActionButtons from 'components/admin/ActionButtons/ActionButtons';
import ActionHeadline from 'components/admin/ActionHeadline/ActionHeadline';
import ApolloError from 'components/errors/ApolloError';
import ButtonPublish from 'components/admin/ButtonPublish/ButtonPublish';
import Notification from 'components/Notification/Notification';
import PlaybookDetailsFormContainer from 'components/admin/PlaybookEdit/PlaybookDetailsFormContainer/PlaybookDetailsFormContainer';
import PlaybookResources from 'components/admin/PlaybookEdit/PlaybookResources/PlaybookResources';
import ButtonLink from 'components/admin/ButtonLink/ButtonLink';
import ProjectHeader from 'components/admin/ProjectHeader/ProjectHeader';
import TextEditor from 'components/admin/TextEditor/TextEditor';

import useIsDirty from 'lib/hooks/useIsDirty';
import usePublish from 'lib/hooks/usePublish';
import {
  DELETE_PLAYBOOK_MUTATION,
  PLAYBOOK_QUERY,
  PUBLISH_PLAYBOOK_MUTATION,
  UNPUBLISH_PLAYBOOK_MUTATION,
  UPDATE_PLAYBOOK_MUTATION,
  UPDATE_PLAYBOOK_STATUS_MUTATION,
} from 'lib/graphql/queries/playbook';

import styles from './PlaybookEdit.module.scss';

const PlaybookEdit = ( { id: playbookId } ) => {
  const router = useRouter();

  const {
    loading, error: queryError, data, startPolling, stopPolling,
  } = useQuery( PLAYBOOK_QUERY, {
    partialRefetch: true,
    variables: { id: playbookId },
    displayName: 'playbookQuery',
  } );

  const [deletePlaybook] = useMutation( DELETE_PLAYBOOK_MUTATION );
  const [publishPlaybook] = useMutation( PUBLISH_PLAYBOOK_MUTATION );
  const [unpublishPlaybook] = useMutation( UNPUBLISH_PLAYBOOK_MUTATION );
  const [updatePlaybookStatus] = useMutation( UPDATE_PLAYBOOK_STATUS_MUTATION );
  const [updatePlaybook] = useMutation( UPDATE_PLAYBOOK_MUTATION );

  const [publishOperation, setPublishOperation] = useState( '' );
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState( false );
  const [error, setError] = useState( {} );
  const [isFormValid, setIsFormValid] = useState( true );

  const [notification, setNotification] = useState( {
    notificationMessage: '',
    showNotification: false,
  } );

  const {
    publishing,
    publishError,
    executePublishOperation,
    handleStatusChange,
  } = usePublish(
    startPolling,
    stopPolling,
    updatePlaybookStatus,
  );

  useEffect( () => {
    if ( data?.playbook ) {
      handleStatusChange( data.playbook );
    }
  }, [data, handleStatusChange] );

  const isDirty = useIsDirty( data?.playbook );

  const updateNotification = msg => {
    setNotification( {
      notificationMessage: msg,
      showNotification: !!msg,
    } );
  };

  const deletePlaybookEnabled = () => (
    /**
     * disable delete playbook button if either there
     * is no playbook id OR playbook has been published
     */
    !playbookId || ( data?.playbook && !!data.playbook.publishedAt )
  );

  const handleExit = () => {
    router.push( { pathname: '/admin/dashboard' } );
  };

  const handleDeleteConfirm = async () => {
    const deletedPlaybookId = await deletePlaybook( {
      variables: { id: playbookId },
    } ).catch( err => { setError( err ); } );

    if ( deletedPlaybookId ) {
      handleExit();
    }
  };

  const handlePublish = async () => {
    setPublishOperation( 'publish' );
    executePublishOperation( playbookId, publishPlaybook );
  };

  const handlePublishChanges = async () => {
    setPublishOperation( 'publishChanges' );
    executePublishOperation( playbookId, publishPlaybook );
  };

  const handleUnPublish = async () => {
    setPublishOperation( 'unpublish' );
    executePublishOperation( playbookId, unpublishPlaybook );
  };

  const { showNotification, notificationMessage } = notification;

  if ( loading ) {
    return (
      <div
        style={ {
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '200px',
        } }
      >
        <Loader
          active
          inline="centered"
          style={ { marginBottom: '1em' } }
          content="Loading playbook details page..."
        />
      </div>
    );
  }

  const centeredStyles = {
    position: 'absolute',
    top: '9em',
    left: '50%',
    transform: 'translateX(-50%)',
  };

  if ( queryError ) {
    return (
      <div style={ centeredStyles }>
        <ApolloError error={ queryError } />
      </div>
    );
  }

  if ( !data?.playbook ) return null;

  const { playbook } = data;
  const isDisabled = !playbookId || !isFormValid;

  return (
    <div className={ styles.playbook }>
      <div className="header">
        <ProjectHeader icon="file" text="Package Details">
          <ActionButtons
            id={ playbookId }
            type="playbook"
            deleteConfirmOpen={ deleteConfirmOpen }
            setDeleteConfirmOpen={ setDeleteConfirmOpen }
            disabled={ {
              'delete': deletePlaybookEnabled(),
              save: isDisabled,
              preview: isDisabled,
              publishChanges: isDisabled,
              publish: playbook?.status !== 'DRAFT' || isDisabled,
            } }
            handle={ {
              deleteConfirm: handleDeleteConfirm,
              save: handleExit,
              publish: handlePublish,
              publishChanges: handlePublishChanges,
              unpublish: handleUnPublish,
            } }
            show={ {
              'delete': true,
              save: true,
              preview: true,
              publish: playbook?.status === 'DRAFT',
              publishChanges: playbook?.publishedAt && isDirty,
              unpublish: playbook?.status === 'PUBLISHED',
            } }
            loading={ {
              publish: publishing && publishOperation === 'publish',
              publishChanges: publishing && publishOperation === 'publishChanges',
              unpublish: publishing && publishOperation === 'unpublish',
            } }
          />
        </ProjectHeader>
      </div>

      <div style={ centeredStyles }>
        <ApolloError error={ error } />
        <ApolloError error={ publishError } />
      </div>

      { /* Form data saved notification */ }
      <Notification
        el="p"
        customStyles={ centeredStyles }
        show={ showNotification }
        msg={ notificationMessage }
      />

      <PlaybookDetailsFormContainer
        playbook={ playbook }
        updateNotification={ updateNotification }
        setIsFormValid={ setIsFormValid }
      />

      <TextEditor
        id={ playbookId }
        content={ playbook?.content || {} }
        query={ PLAYBOOK_QUERY }
        type={ playbook.type }
        updateMutation={ updatePlaybook }
        updateNotification={ updateNotification }
      />

      <PlaybookResources
        assetPath={ playbook.assetPath || '' }
        files={ playbook.supportFiles || [] }
        projectId={ playbookId }
        updateMutation={ updatePlaybook }
      />

      <div className={ styles.actions }>
        <ActionHeadline
          className="headline"
          type="package"
          published={ playbook && playbook.status === 'PUBLISHED' }
          updated={ isDirty }
        />

        <ButtonLink
          content="Preview"
          disabled={ isDisabled }
          url={ `/admin/package/playbook/preview/${playbookId}` }
        />

        <ButtonPublish
          handlePublish={ handlePublish }
          handleUnPublish={ handleUnPublish }
          status={ ( playbook && playbook.status ) || 'DRAFT' }
          updated={ isDirty }
          disabled={ isDisabled }
        />
      </div>
    </div>
  );
};

PlaybookEdit.propTypes = {
  id: PropTypes.string,
};

export default PlaybookEdit;
