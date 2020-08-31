/**
 *
 * FileDataForm
 *
 */
import React, { useContext, useState, useEffect } from 'react';
import propTypes from 'prop-types';
import { graphql } from 'react-apollo';
import compose from 'lodash.flowright';
import { connect } from 'react-redux';
import * as actions from 'lib/redux/actions/projectUpdate';
import { Confirm, Form, Grid } from 'semantic-ui-react';
import { withFormik } from 'formik';

import ApolloError from 'components/errors/ApolloError';
import ConfirmModalContent from 'components/admin/ConfirmModalContent/ConfirmModalContent';
import LanguageDropdown, { LANGUAGE_BY_NAME_QUERY } from 'components/admin/dropdowns/LanguageDropdown/LanguageDropdown';
import Loader from 'components/admin/ProjectEdit/EditVideoModal/Loader/Loader';
import QualityDropdown from 'components/admin/dropdowns/QualityDropdown/QualityDropdown';
import UseDropdown, { VIDEO_USE_QUERY } from 'components/admin/dropdowns/UseDropdown/UseDropdown';
import VideoBurnedInStatusDropdown from 'components/admin/dropdowns/VideoBurnedInStatusDropdown/VideoBurnedInStatusDropdown';
import { EditSingleProjectItemContext } from 'components/admin/ProjectEdit/EditSingleProjectItem/EditSingleProjectItem';
import { formatBytes, formatDate, secondsToHMS } from 'lib/utils';

// eslint-disable-next-line import/no-cycle
import { VIDEO_UNIT_QUERY } from 'components/admin/ProjectEdit/EditVideoModal/ModalSections/FileSection/FileSection';
import { UPDATE_VIDEO_PROJECT_MUTATION } from 'lib/graphql/queries/video';
import {
  VIDEO_PROJECT_QUERY, VIDEO_FILE_QUERY, VIDEO_FILE_LANG_MUTATION, VIDEO_UNIT_CONNECT_FILE_MUTATION,
  VIDEO_UNIT_DISCONNECT_FILE_MUTATION, VIDEO_FILE_SUBTITLES_MUTATION, VIDEO_FILE_USE_MUTATION,
  VIDEO_FILE_QUALITY_MUTATION, VIDEO_FILE_CREATE_STREAM_MUTATION, VIDEO_FILE_UPDATE_STREAM_MUTATION,
  VIDEO_FILE_DELETE_STREAM_MUTATION, VIDEO_FILE_DELETE_MUTATION,
} from './FileDataFormQueries';
import './FileDataForm.scss';

const FileDataForm = ( {
  cleanUseQuery,
  deleteVideoFileMutation,
  englishLanguageQuery,
  fileCount,
  language,
  languageVideoFileMutation,
  qualityVideoFileMutation,
  setFieldValue,
  streamCreateVideoFileMutation,
  streamDeleteVideoFileMutation,
  streamUpdateVideoFileMutation,
  updateVideoProjectMutation,
  useVideoFileMutation,
  values,
  videoBurnedInStatusVideoFileMutation,
  videoFileQuery,
  videoProjectQuery,
  videoUnitConnectFileMutation,
  videoUnitDisconnectFileMutation,
  selectedProject,
  projectUpdated,
} ) => {
  const {
    selectedFile, selectedUnit, setSelectedFile, setShowNotification, startTimeout, updateSelectedUnit,
  } = useContext( EditSingleProjectItemContext );

  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState( false );
  const [langId, setLangId] = useState( null );

  const { project } = videoProjectQuery;
  const units = project && project.units ? project.units : [];

  const cleanUseId = cleanUseQuery?.videoUses?.[0]?.id || '';
  const englishId = englishLanguageQuery?.languages?.[0]?.id || '';

  const growl = () => {
    // Update projectUpdate Redux state
    projectUpdated( selectedProject, true );

    setShowNotification( true );
    startTimeout();
  };

  const changeLanguage = ( value, id ) => {
    // Get array of units and the language they are in
    const unitsByLang = units.map( unit => ( { unitId: unit.id, langId: unit.language.id } ) );
    const newUnit = unitsByLang.filter( unit => unit.langId === value );

    if ( value && value !== language.id ) {
      // Update file language
      languageVideoFileMutation( {
        variables: {
          id,
          language: value,
        },
        onCompleted: videoUnitDisconnectFileMutation( { // Disconnect File from old language unit
          variables: {
            id: selectedUnit,
            fileId: id,
          },
          update: cache => {
            try {
              const cachedData = cache.readQuery( {
                query: VIDEO_UNIT_QUERY,
                variables: { id: selectedUnit },
              } );

              const newFiles = cachedData.unit.files.filter( newFile => newFile.id !== id );

              cachedData.unit.files = newFiles;

              cache.writeQuery( {
                query: VIDEO_UNIT_QUERY,
                data: { unit: cachedData.unit },
              } );
            } catch ( error ) {
              console.log( error );
            }
          },
          onCompleted: videoUnitConnectFileMutation( { // Connect file to new unit
            variables: {
              id: newUnit[0].unitId,
              fileId: id,
            },
            onCompleted: updateSelectedUnit( newUnit[0].unitId, id ), // Switch view to the new unit
          } ),
        } ),
      } );
      growl();
    }
  };

  // Runs the changeLanguage mutations whenever the language state is updated
  useEffect( () => {
    changeLanguage( langId, selectedFile );
  }, [langId] );

  const { file, error, loading } = videoFileQuery;

  if ( error ) {
    return <ApolloError error={ error } />;
  }

  if ( !file || loading ) return <Loader height="330px" text="Loading the file data..." />;

  // Iterates through an array of units to return an array of locales (one for each unit)
  const getLocales = arr => {
    const locales = Array.isArray( arr ) && arr.length > 0
      ? arr.map( unit => unit.language.locale )
      : [];

    return locales;
  };

  // Runs GraphQl mutation and updates the cache after a dropdown selection
  const handleDropdownSave = ( e, { name, value } ) => {
    let mutation;

    if ( name === 'quality' ) {
      mutation = qualityVideoFileMutation;
    } else if ( name === 'use' ) {
      mutation = useVideoFileMutation;
    } else if ( name === 'videoBurnedInStatus' ) {
      mutation = videoBurnedInStatusVideoFileMutation;
    }

    mutation( {
      variables: {
        id: selectedFile,
        [name]: value,
      },
      update: cache => {
        try {
          const cachedData = cache.readQuery( {
            query: VIDEO_FILE_QUERY,
            variables: { id: selectedFile },
          } );

          if ( name === 'use' ) {
            cachedData.file.use.id = value;
            if ( value === cleanUseId ) {
              setLangId( englishId );
              videoBurnedInStatusVideoFileMutation( {
                variables: {
                  id: selectedFile,
                  videoBurnedInStatus: 'CLEAN',
                },
              } );
            }
          } else {
            cachedData.file[name] = value;
          }

          cache.writeQuery( {
            query: VIDEO_FILE_QUERY,
            data: { file: cachedData.file },
          } );
        } catch ( error ) {
          console.log( error );
        }
      },
    } );
    growl();
  };

  // Update video url form fields on change
  const handleStreamsInputChange = ( e, { name, value } ) => setFieldValue( name, value );

  // Updates file's stream object
  // Only allows for one stream per site
  const updateStreams = e => {
    const { name } = e.target;
    const url = values[name];

    const streams = file && file.stream ? file.stream.map( item => item.site ) : [];

    if ( streams.includes( name ) ) {
      const filtered = file.stream.filter( item => item.site === name );
      const streamId = filtered[0].id;

      if ( url === '' ) {
        streamDeleteVideoFileMutation( {
          variables: {
            id: selectedFile,
            streamId,
          },
        } );
      } else {
        streamUpdateVideoFileMutation( {
          variables: {
            id: selectedFile,
            streamId,
            url,
          },
        } );
      }
    } else if ( url !== '' ) {
      streamCreateVideoFileMutation( {
        variables: {
          id: selectedFile,
          site: name,
          url,
        },
      } );
    }

    growl();
    videoFileQuery.refetch();
  };

  // Sets language to local state on language switch
  // required to prevent changeLanguage() from closing over the previous selectedFile value
  const handleLanguageChange = value => setLangId( value );

  // Show delete confirmation modal
  const displayConfirmDelete = () => setDeleteConfirmOpen( true );

  // Close delete confirmation modal if cancel selected
  const handleDeleteCancel = () => setDeleteConfirmOpen( false );

  // Delete file if deletion is confirmed
  // TODO: also delete out file from S3 and vimeo
  const handleDeleteConfirm = () => {
    deleteVideoFileMutation( {
      variables: { id: selectedFile },
      update: cache => {
        try {
          const cachedData = cache.readQuery( {
            query: VIDEO_UNIT_QUERY,
            variables: { id: selectedUnit },
          } );

          const newFiles = cachedData.unit.files.filter( newFile => newFile.id !== selectedFile );

          cachedData.unit.files = newFiles;

          cache.writeQuery( {
            query: VIDEO_UNIT_QUERY,
            data: { unit: cachedData.unit },
          } );

          const cachedProjectData = cache.readQuery( {
            query: VIDEO_PROJECT_QUERY,
            variables: { id: selectedProject },
          } );

          // update project to trigger display of Publish Changes button
          updateVideoProjectMutation( {
            variables: {
              data: {
                projectTitle: cachedProjectData.project.projectTitle,
              },
              where: { id: selectedProject },
            },
          } );

          console.log( `Deleted video: ${selectedFile}` );

          const newSelectedFile = cachedData.unit.files && cachedData.unit.files[0] && cachedData.unit.files[0].id
            ? cachedData.unit.files[0].id
            : '';

          setSelectedFile( newSelectedFile );
        } catch ( error ) {
          console.log( error );
        }
      },
    } );
    setDeleteConfirmOpen( false );
  };

  const width = file.dimensions && file.dimensions.width ? file.dimensions.width : '';
  const height = file.dimensions && file.dimensions.height ? file.dimensions.height : '';
  const dimensions = width && height ? `Dimensions: ${width} x ${height}` : '';

  return (
    <Form className="edit-video__form video-file-form">
      <Grid stackable>
        <Grid.Row>
          <Grid.Column className="video-file-form-col-1" mobile={ 16 } computer={ 8 }>
            <div className="file_meta">
              <span className="file_meta_content file_meta_content--filetype" lang={ language?.languageCode || 'en' }>
                { file.filename }
              </span>
              { file.filesize && (
                <span className="file_meta_content file_meta_content--filesize">
                  { `Filesize: ${formatBytes( file.filesize )}` }
                </span>
              ) }
              { dimensions && (
                <span className="file_meta_content file_meta_content--dimensions">
                  { dimensions }
                </span>
              ) }
              <span className="file_meta_content file_meta_content--uploaded">
                { `Uploaded: ${formatDate( file.createdAt )}` }
              </span>
              { file.duration && (
                <span className="file_meta_content file_meta_content--duration">
                  { `Duration: ${secondsToHMS( file.duration )}` }
                </span>
              ) }
              { fileCount && fileCount > 1 && (
                <span className="delete-file-link" onClick={ displayConfirmDelete } onKeyUp={ displayConfirmDelete } role="button" tabIndex={ 0 }>
                  Delete file from project
                </span>
              ) }
            </div>

            <Confirm
              className="delete"
              open={ deleteConfirmOpen }
              content={ (
                <ConfirmModalContent
                  className="delete_confirm delete_confirm--video"
                  headline="Are you sure you want to delete this video?"
                >
                  <p>This video will be permanently removed from the Content Commons and any other projects or collections it appears on.</p>
                </ConfirmModalContent>
              ) }
              onCancel={ handleDeleteCancel }
              onConfirm={ handleDeleteConfirm }
              cancelButton="No, take me back"
              confirmButton="Yes, delete forever"
            />

            <div className="video-links">
              <Form.Input
                id="video-youtube"
                label="YouTube URL"
                name="youtube"
                onBlur={ updateStreams }
                onChange={ handleStreamsInputChange }
                value={ values.youtube }
              />

              <Form.Input
                id="video-vimeo"
                label="Vimeo URL"
                name="vimeo"
                onBlur={ updateStreams }
                onChange={ handleStreamsInputChange }
                readOnly
                style={ { opacity: '0.45' } }
                value={ values.vimeo }
              />
            </div>
          </Grid.Column>

          <Grid.Column mobile={ 16 } computer={ 8 }>
            <LanguageDropdown
              id="video-language"
              locales={ getLocales( units ) }
              label="Language"
              onChange={ ( e, { value } ) => handleLanguageChange( value ) }
              required
              value={ values.use === cleanUseId ? englishId : values.language }
              disabled={ values.use === cleanUseId }
            />

            <UseDropdown
              id="video-use"
              label="Video Type"
              name="use"
              onChange={ handleDropdownSave }
              required
              type="video"
              value={ values.use }
            />

            <VideoBurnedInStatusDropdown
              id="video-subtitles"
              label="On-Screen Text"
              name="videoBurnedInStatus"
              onChange={ handleDropdownSave }
              required
              type="video"
              value={ values.use === cleanUseId ? 'CLEAN' : values.videoBurnedInStatus }
              disabled={ values.use === cleanUseId }
            />

            <QualityDropdown
              id="video-quality"
              label="Video Quality"
              name="quality"
              onChange={ handleDropdownSave }
              required
              infotip="Web: small - for social sharing, Broadcast: large - ambassador videos"
              type="video"
              value={ values.quality }
            />

          </Grid.Column>
        </Grid.Row>
      </Grid>
    </Form>
  );
};

FileDataForm.propTypes = {
  cleanUseQuery: propTypes.object,
  deleteVideoFileMutation: propTypes.func,
  englishLanguageQuery: propTypes.object,
  fileCount: propTypes.number,
  language: propTypes.object,
  languageVideoFileMutation: propTypes.func,
  qualityVideoFileMutation: propTypes.func,
  setFieldValue: propTypes.func,
  streamCreateVideoFileMutation: propTypes.func,
  streamDeleteVideoFileMutation: propTypes.func,
  streamUpdateVideoFileMutation: propTypes.func,
  updateVideoProjectMutation: propTypes.func,
  useVideoFileMutation: propTypes.func,
  values: propTypes.object,
  videoBurnedInStatusVideoFileMutation: propTypes.func,
  videoFileQuery: propTypes.object,
  videoUnitConnectFileMutation: propTypes.func,
  videoUnitDisconnectFileMutation: propTypes.func,
  videoProjectQuery: propTypes.object,
  selectedProject: propTypes.string,
  projectUpdated: propTypes.func,
};

export default compose(
  connect( null, actions ),
  graphql( LANGUAGE_BY_NAME_QUERY, {
    name: 'englishLanguageQuery',
    options: () => ( {
      variables: { displayName: 'English' },
    } ),
  } ),
  graphql( UPDATE_VIDEO_PROJECT_MUTATION, { name: 'updateVideoProjectMutation' } ),
  graphql( VIDEO_FILE_DELETE_MUTATION, { name: 'deleteVideoFileMutation' } ),
  graphql( VIDEO_FILE_DELETE_STREAM_MUTATION, { name: 'streamDeleteVideoFileMutation' } ),
  graphql( VIDEO_FILE_UPDATE_STREAM_MUTATION, { name: 'streamUpdateVideoFileMutation' } ),
  graphql( VIDEO_FILE_CREATE_STREAM_MUTATION, { name: 'streamCreateVideoFileMutation' } ),
  graphql( VIDEO_FILE_QUALITY_MUTATION, { name: 'qualityVideoFileMutation' } ),
  graphql( VIDEO_FILE_USE_MUTATION, { name: 'useVideoFileMutation' } ),
  graphql( VIDEO_FILE_SUBTITLES_MUTATION, { name: 'videoBurnedInStatusVideoFileMutation' } ),
  graphql( VIDEO_UNIT_DISCONNECT_FILE_MUTATION, { name: 'videoUnitDisconnectFileMutation' } ),
  graphql( VIDEO_UNIT_CONNECT_FILE_MUTATION, { name: 'videoUnitConnectFileMutation' } ),
  graphql( VIDEO_FILE_LANG_MUTATION, { name: 'languageVideoFileMutation' } ),
  graphql( VIDEO_FILE_QUERY, {
    name: 'videoFileQuery',
    options: props => ( {
      variables: { id: props.selectedFile },
    } ),
  } ),
  graphql( VIDEO_PROJECT_QUERY, {
    name: 'videoProjectQuery',
    options: props => ( {
      variables: { id: props.selectedProject },
    } ),
  } ),
  graphql( VIDEO_USE_QUERY, {
    name: 'cleanUseQuery',
    options: () => ( {
      variables: { where: { name: 'Clean' } },
    } ),
  } ),
  withFormik( {
    mapPropsToValues: props => {
      const file = props.videoFileQuery && props.videoFileQuery.file ? props.videoFileQuery.file : {};
      const use = file && file.use && file.use.id ? file.use.id : '';
      const lang = file && file.language && file.language.id ? file.language.id : '';

      // Check for and retrieve an existing stream url by site name
      const getStreamUrl = ( streams, site ) => {
        let link = '';

        if ( streams && streams.length > 0 ) {
          streams.forEach( stream => {
            if ( stream.site === site ) {
              link = stream.url;
            }
          } );
        }

        return link;
      };

      return {
        language: lang,
        quality: file.quality || '',
        use,
        videoBurnedInStatus: file.videoBurnedInStatus || '',
        vimeo: getStreamUrl( file.stream, 'vimeo' ),
        youtube: getStreamUrl( file.stream, 'youtube' ),
      };
    },
    enableReinitialize: true,
  } ),
)( FileDataForm );
