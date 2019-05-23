/**
 *
 * SupportFileTypeList
 *
 */

import React, {
  Fragment, useState, useEffect
} from 'react';
import PropTypes from 'prop-types';
import { Checkbox, Button } from 'semantic-ui-react';

import { connect } from 'react-redux';
import { compose, graphql } from 'react-apollo';
import { getFileExt } from 'lib/utils';
import isEmpty from 'lodash/isEmpty';

import IconPopup from 'components/popups/IconPopup/IconPopup';
import EditSupportFiles from 'components/admin/projects/ProjectEdit/EditSupportFiles/EditSupportFiles';
import EditSupportFilesContent from 'components/admin/projects/ProjectEdit/EditSupportFilesContent/EditSupportFilesContent';
import SupportItem from 'components/admin/projects/ProjectEdit/SupportItem/SupportItem';

import { VIDEO_PROJECT_FILES_QUERY } from 'lib/graphql/queries/video';

const SupportFileTypeList = props => {
  const { projectId, config: { types } } = props;
  const type = types[props.type];
  const {
    headline, popupMsg, checkBoxLabel, checkBoxName, iconMsg, iconSize, iconType, protectImages,
  } = type;

  const [isEditing, setIsEditing] = useState( false );
  const [hasImages, setHasImages] = useState( false );

  const getFilesForNewProject = filesToUpload => {
    const { extensions } = type;
    return filesToUpload.filter( file => extensions.includes( getFileExt( file.input.name ) ) );
  };

  const getFilesForExisitingProject = files => {
    const { extensions } = type;
    return files.filter( file => extensions.includes( getFileExt( file.filename ) ) );
  };

  const fetchFiles = data => {
    const { filesToUpload } = props;

    if ( !isEmpty( data ) && data.projectFiles ) {
      const { supportFiles, thumbnails } = data.projectFiles;
      const files = [...supportFiles, ...thumbnails];
      return getFilesForExisitingProject( files );
    }

    if ( filesToUpload ) {
      return getFilesForNewProject( filesToUpload );
    }

    return [];
  };

  const [supFiles, setSupFiles] = useState( [] );

  const checkForImages = () => supFiles.some( file => {
    let filetype = file.filetype || file.input.type;
    filetype = filetype || '';
    return filetype.includes( 'image' );
  } );

  useEffect( () => {
    setSupFiles( fetchFiles( props.data ) );
  }, [] );

  useEffect( () => {
    setHasImages( checkForImages() );
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
              )
            }
          </Fragment>
          )
        }
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
          />
          <IconPopup
            message={ iconMsg }
            iconSize={ iconSize }
            iconType={ iconType }
            popupSize="mini"
          />
        </Fragment>
        )
      }
    </Fragment>
  );
};


SupportFileTypeList.propTypes = {
  config: PropTypes.object.isRequired,
  projectId: PropTypes.string,
  type: PropTypes.string,
  data: PropTypes.object,
  /* eslint-disable-next-line react/no-unused-prop-types */
  fileType: PropTypes.string,
  filesToUpload: PropTypes.array, // from redux
};

const mapStateToProps = state => ( {
  filesToUpload: state.upload.filesToUpload
} );


export default compose(
  connect( mapStateToProps, null ),
  graphql( VIDEO_PROJECT_FILES_QUERY, {
    partialRefetch: true,
    options: props => ( {
      variables: {
        id: props.projectId
      }
    } ),
    skip: props => !props.projectId
  } )
)( SupportFileTypeList );
