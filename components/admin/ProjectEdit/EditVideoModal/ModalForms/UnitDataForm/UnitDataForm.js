/**
 *
 * UnitDataForm
 *
 */
import React, { useContext } from 'react';
import propTypes from 'prop-types';
import { graphql } from '@apollo/client/react/hoc';
import compose from 'lodash.flowright';
import { connect } from 'react-redux';
import * as actions from 'lib/redux/actions/projectUpdate';
import { Embed, Form, Grid } from 'semantic-ui-react';
import { withFormik } from 'formik';

import { EditSingleProjectItemContext } from 'components/admin/ProjectEdit/EditSingleProjectItem/EditSingleProjectItem';
import {
  getStreamData, getVimeoId, getYouTubeId,
} from 'lib/utils';
import Loader from 'components/admin/ProjectEdit/EditVideoModal/Loader/Loader';
import TagDropdown from 'components/admin/dropdowns/TagDropdown/TagDropdown';
import { VIDEO_UNIT_ADD_TAG_MUTATION, VIDEO_PROJECT_UNITS_QUERY } from 'lib/graphql/queries/video';
import {
  VIDEO_UNIT_QUERY,
  VIDEO_FILE_QUERY,
  VIDEO_UNIT_TITLE_MUTATION,
  VIDEO_UNIT_DESC_MUTATION,
  VIDEO_UNIT_REMOVE_TAG_MUTATION,
} from './UnitDataFormQueries';

const UnitDataForm = ( {
  descPublicVideoUnitMutation,
  projectId,
  setFieldValue,
  tagsAddVideoUnitMutation,
  tagsRemoveVideoUnitMutation,
  titleVideoUnitMutation,
  unitId,
  values,
  videoFileQuery,
  videoUnitQuery,
  projectUpdated,
} ) => {
  const { loading, unit } = videoUnitQuery;
  const { file } = videoFileQuery;
  const {
    setShowNotification, startTimeout,
  } = useContext(
    EditSingleProjectItemContext,
  );

  if ( !unit || loading ) return <Loader height="340px" text="Loading the video data..." />;

  const updateUnit = e => {
    const { name, value } = e.target;
    let mutation;

    if ( name === 'descPublic' ) {
      mutation = descPublicVideoUnitMutation;
    } else if ( name === 'title' ) {
      mutation = titleVideoUnitMutation;
    }

    mutation( {
      variables: {
        id: unitId,
        [name]: value,
      },
      update: cache => {
        try {
          const cachedData = cache.readQuery( {
            query: VIDEO_UNIT_QUERY,
            variables: { id: unitId },
          } );

          cachedData.unit[name] = value;
          cache.writeQuery( {
            query: VIDEO_UNIT_QUERY,
            data: { unit: cachedData.unit },
          } );
        } catch ( error ) {
          console.log( error );
        }

        try {
          const cachedProjectData = cache.readQuery( {
            query: VIDEO_PROJECT_UNITS_QUERY,
            variables: { id: projectId },
          } );

          const newUnits = cachedProjectData.projectUnits.units.map( u => {
            if ( u.id === unitId ) {
              u[name] = value;
            }

            return u;
          } );

          cachedProjectData.projectUnits.units = newUnits;

          cache.writeQuery( {
            query: VIDEO_PROJECT_UNITS_QUERY,
            data: { projectUnits: cachedProjectData.projectUnits },
          } );
        } catch ( error ) {
          console.log( error );
        }
      },
    } );

    // Update projectUpdate Redux state
    projectUpdated( projectId, true );

    setShowNotification( true );
    startTimeout();
  };

  const updateTags = newTags => {
    const { tags } = unit;

    const currentTags = tags.map( tag => tag.id );
    const removed = currentTags.filter( item => newTags.indexOf( item ) === -1 );
    const added = newTags.filter( item => currentTags.indexOf( item ) === -1 );

    // Converts the array of tag ids into an array of tag objects as expected by Apollo
    const newTagsArr = newTags.map( newTag => ( { id: newTag, __typename: 'Tag' } ) );

    const runTagMutation = ( arr, mutation ) => {
      arr.map( tag => (
        mutation( {
          variables: {
            id: unitId,
            tagId: tag,
          },
          update: cache => {
            try {
              const cachedData = cache.readQuery( {
                query: VIDEO_UNIT_QUERY,
                variables: { id: unitId },
              } );

              cachedData.unit.tags = newTagsArr;
              cache.writeQuery( {
                query: VIDEO_UNIT_QUERY,
                data: { unit: cachedData.unit },
              } );
            } catch ( error ) {
              console.log( error );
            }
          },
        } )
      ) );
    };

    if ( added.length > 0 ) {
      runTagMutation( added, tagsAddVideoUnitMutation );
    }

    if ( removed.length > 0 ) {
      runTagMutation( removed, tagsRemoveVideoUnitMutation );
    }

    // Update projectUpdate Redux state
    projectUpdated( projectId, true );

    setShowNotification( true );
    startTimeout();
  };

  const handleOnChange = ( e, { name, value } ) => {
    setFieldValue( name, value );
  };

  const handleDropdownSelection = ( e, { value } ) => updateTags( value );

  const lang = `in ${unit.language.displayName}` || '';

  let youTubeUrl = '';
  let vimeoUrl = '';

  if ( file && file.stream ) {
    youTubeUrl = getStreamData( file.stream, 'youtube', 'url' );
    vimeoUrl = getStreamData( file.stream, 'vimeo', 'url' );
  }

  let thumbnailUrl = '';
  let thumbnailAlt = '';

  if ( unit.thumbnails && unit.thumbnails.length ) {
    thumbnailUrl = unit.thumbnails[0].image.signedUrl;
    thumbnailAlt = unit.thumbnails[0].image.alt || '';
  }

  return (
    <Form className="edit-video__form video-unit-data">
      <Grid stackable className="aligned">
        <Grid.Row>
          <Grid.Column mobile={ 16 } computer={ 9 }>
            { ( vimeoUrl ) && (
              <Embed
                autoplay={ false }
                id={ getVimeoId( vimeoUrl ) }
                placeholder={ thumbnailUrl }
                source="vimeo"
              />
            ) }
            { !vimeoUrl && youTubeUrl && (
              <Embed
                autoplay={ false }
                id={ getYouTubeId( youTubeUrl ) }
                placeholder={ thumbnailUrl }
                source="youtube"
              />
            ) }
            { ( !youTubeUrl && !vimeoUrl ) && (
              <figure className="modal_thumbnail overlay">
                <img className="overlay-image" src={ thumbnailUrl } alt={ thumbnailAlt } />
              </figure>
            ) }
          </Grid.Column>
          <Grid.Column mobile={ 16 } computer={ 7 }>
            <Form.Input
              className={ unit.language.textDirection === 'RTL' ? 'rtl' : 'ltr' }
              id="video-title"
              label={ `Video Title ${lang}` }
              name="title"
              onBlur={ updateUnit }
              onChange={ handleOnChange }
              value={ values.title }
            />

            <Form.TextArea
              className={ unit.language.textDirection === 'RTL' ? 'rtl' : 'ltr' }
              id="video-description"
              label={ `Public Description ${lang}` }
              name="descPublic"
              onBlur={ updateUnit }
              onChange={ handleOnChange }
              value={ values.descPublic }
            />

            <TagDropdown
              onChange={ handleDropdownSelection }
              id="video-tags"
              label={ `Additional Keywords ${lang}` }
              locale={ unit.language.locale }
              name="tags"
              value={ values.tags }
            />

          </Grid.Column>
        </Grid.Row>
      </Grid>
    </Form>
  );
};

UnitDataForm.propTypes = {
  descPublicVideoUnitMutation: propTypes.func,
  projectId: propTypes.string,
  setFieldValue: propTypes.func,
  tagsAddVideoUnitMutation: propTypes.func,
  tagsRemoveVideoUnitMutation: propTypes.func,
  titleVideoUnitMutation: propTypes.func,
  unitId: propTypes.string,
  values: propTypes.object,
  videoFileQuery: propTypes.object,
  videoUnitQuery: propTypes.object,
  projectUpdated: propTypes.func, // redux
};


export default compose(
  connect( null, actions ),
  graphql( VIDEO_UNIT_REMOVE_TAG_MUTATION, { name: 'tagsRemoveVideoUnitMutation' } ),
  graphql( VIDEO_UNIT_ADD_TAG_MUTATION, { name: 'tagsAddVideoUnitMutation' } ),
  graphql( VIDEO_UNIT_DESC_MUTATION, { name: 'descPublicVideoUnitMutation' } ),
  graphql( VIDEO_UNIT_TITLE_MUTATION, { name: 'titleVideoUnitMutation' } ),
  graphql( VIDEO_FILE_QUERY, {
    name: 'videoFileQuery',
    options: props => ( {
      variables: { id: props.fileId },
    } ),
  } ),
  graphql( VIDEO_UNIT_QUERY, {
    name: 'videoUnitQuery',
    options: props => ( {
      variables: { unitId: props.unitId },
    } ),
  } ),
  withFormik( {
    mapPropsToValues: props => {
      const videoUnit = props.videoUnitQuery && props.videoUnitQuery.unit ? props.videoUnitQuery.unit : {};

      const tags = videoUnit.tags ? videoUnit.tags.map( tag => tag.id ) : [];

      return {
        descPublic: videoUnit.descPublic || '',
        tags,
        title: videoUnit.title || '',
      };
    },
    enableReinitialize: true,
  } ),
)( UnitDataForm );
