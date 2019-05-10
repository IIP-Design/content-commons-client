/**
 *
 * SupportFileTypeList
 *
 */

import React, {
  Fragment, useState, useEffect, useContext
} from 'react';
import PropTypes from 'prop-types';
import { Checkbox, Button } from 'semantic-ui-react';

import { connect } from 'react-redux';
import { getFileExt } from 'lib/utils';

import IconPopup from 'components/popups/IconPopup/IconPopup';
import EditSupportFiles from 'components/admin/projects/ProjectEdit/EditSupportFiles/EditSupportFiles';
import EditSupportFilesContent from 'components/admin/projects/ProjectEdit/EditSupportFilesContent/EditSupportFilesContent';
import SupportItem from 'components/admin/projects/ProjectEdit/SupportItem/SupportItem';

import { ProjectContext } from 'pages/admin/project';

const SupportFileTypeList = props => {
  const [isEditing, setIsEditing] = useState( false );
  const [supFiles, setSupFiles] = useState( [] );
  const [hasImages, setHasImages] = useState( false );

  const data = useContext( ProjectContext );
  const supportFiles = data.supportFiles || [];
  const thumbnails = data.thumbnails || [];

  const { config } = props;

  const getFilesForNewproject = () => {
    const { files } = props;
    const { extensions } = config;

    return files.filter( file => extensions.includes( getFileExt( file.fileObject.name ) ) );
  };

  const getFilesForExisitingProject = () => {
    const { extensions } = config;
    const files = [...supportFiles, ...thumbnails];
    return files.filter( file => extensions.includes( getFileExt( file.filename ) ) );
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
  projectId: PropTypes.string,
  /* eslint-disable-next-line react/no-unused-prop-types */
  fileType: PropTypes.string,
  files: PropTypes.array, // from redux
};

const mapStateToProps = state => ( {
  files: state.files
} );


export default connect( mapStateToProps )( SupportFileTypeList );
