/**
 *
 * SupportFileTypeList
 *
 */

import React, { Fragment, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Checkbox, Button } from 'semantic-ui-react';

import { connect } from 'react-redux';
import gql from 'graphql-tag';
import { compose, graphql } from 'react-apollo';
import { getFileExt } from 'lib/utils';

import IconPopup from 'components/popups/IconPopup/IconPopup';
import EditSupportFiles from 'components/admin/projects/ProjectEdit/EditSupportFiles/EditSupportFiles';
import EditSupportFilesContent from 'components/admin/projects/ProjectEdit/EditSupportFilesContent/EditSupportFilesContent';
import SupportItem from 'components/admin/projects/ProjectEdit/SupportItem/SupportItem';

const VIDEO_PROJECT_QUERY = gql`
  query VIDEO_PROJECT_QUERY($id: ID!) {
    video: videoProject(id: $id) { 
      supportFiles {
        id
        filename
        filetype
        filesize
        language {
          id
          displayName
        }
      } 
      thumbnails {
        id
        filename
        filetype
        filesize
        language {
          id
          displayName
        }
      } 
    }
  }
`;

const SupportFileTypeList = props => {
  const [isEditing, setIsEditing] = useState( false );
  const [supFiles, setSupFiles] = useState( [] );
  const [hasImages, setHasImages] = useState( false );

  const { config } = props;

  const getFilesForNewproject = () => {
    const { files } = props;
    const { extensions } = config;

    return files.filter( file => extensions.includes( getFileExt( file.fileObject.name ) ) );
  };

  const getFilesForExisitingProject = () => {
    const { project } = props;
    const { extensions } = config;

    if ( project && project.video ) {
      const { supportFiles, thumbnails } = project.video;
      const files = [...supportFiles, ...thumbnails];
      return files.filter( file => extensions.includes( getFileExt( file.filename ) ) );
    }
    return []; // reset to empty array in the event the query throws an error
  };

  useEffect( () => {
    setSupFiles( props.projectId ? getFilesForExisitingProject : getFilesForNewproject );
  }, [] );


  useEffect( () => {
    const has = supFiles.some( file => {
      let filetype = file.filetype || file.fileObject.type;
      filetype = filetype || '';
      return filetype.includes( 'image' );
    } );

    setHasImages( has );
  }, [supFiles] );


  const toggleEditModal = () => (
    setIsEditing( !isEditing )
  );

  const renderSupportItem = item => {
    const { fileType } = props;

    return (
      <SupportItem
        key={ `${fileType}-${item.id}` }
        item={ item }
      />
    );
  };

  const {
    headline, popupMsg, checkBoxLabel, checkBoxName, iconMsg, iconSize, iconType, protectImages,
  } = config;

  const { projectId } = props;

  return (
    <Fragment>
      <h3>{ `${headline} ` }
        <IconPopup
          message={ popupMsg }
          iconSize="small"
          iconType="info circle"
          popupSize="mini"
        />
        { projectId
            && (
            <Fragment>
              { !!supFiles.length // verify has upload completed
                  && (
                  <EditSupportFiles
                    triggerProps={ {
                      className: 'btn--edit',
                      content: 'Edit',
                      size: 'small',
                      basic: true,
                      onClick: toggleEditModal
                    } }
                    contentProps={ {
                      // fileType,
                      // projectId,
                      closeEditModal: toggleEditModal
                    } }
                    modalTrigger={ Button }
                    modalContent={ EditSupportFilesContent }
                    options={ {
                      closeIcon: true,
                      onClose: toggleEditModal,
                      open: isEditing
                    } }
                  />
                  ) }
            </Fragment>
            ) }
      </h3>
      <ul>
        { supFiles.length
          ? supFiles.map( renderSupportItem )
          : 'No files available'
        }
      </ul>

      { hasImages
        && (
          <Fragment>
            <Checkbox
              id="protect-images"
              label={ (
                /* eslint-disable jsx-a11y/label-has-for */
                <label htmlFor="protect-images">
                  { checkBoxLabel }
                </label>
              ) }
              name={ checkBoxName }
              type="checkbox"
              checked={ protectImages }
              // onChange={ handleChange }
            />
            <IconPopup
              message={ iconMsg }
              iconSize={ iconSize }
              iconType={ iconType }
              popupSize="mini"
            />
          </Fragment>
        ) }
    </Fragment>
  );
};

SupportFileTypeList.propTypes = {
  config: PropTypes.object.isRequired,
  project: PropTypes.object,
  projectId: PropTypes.string,
  /* eslint-disable-next-line react/no-unused-prop-types */
  fileType: PropTypes.string,
  files: PropTypes.array, // from redux
};

const mapStateToProps = state => ( {
  files: state.files
} );

export default compose(
  connect( mapStateToProps ),
  graphql( VIDEO_PROJECT_QUERY, {
    name: 'project',
    skip: props => !props.projectId,
    options: props => ( {
      variables: {
        id: props.projectId
      },
    } )
  } )
)( SupportFileTypeList );
