/**
 *
 * SupportFileTypeList
 *
 */

import React, {
  Fragment, useState, useEffect
} from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { compose, graphql } from 'react-apollo';
import { getFileExt } from 'lib/utils';
import isEmpty from 'lodash/isEmpty';
import sortBy from 'lodash/sortBy';

import IconPopup from 'components/popups/IconPopup/IconPopup';
import { VIDEO_PROJECT_FILES_QUERY } from 'lib/graphql/queries/video';
import SupportItem from '../SupportItem/SupportItem';

import EditSupportFiles from '../EditSupportFiles/EditSupportFiles';

const SupportFileTypeList = props => {
  const {
    projectId, save, config: { types }
  } = props;

  const type = types[props.type];

  const {
    headline, popupMsg
  } = type;

  const handleSave = async ( files, filesToRemove ) => {
    await save( files, filesToRemove );

    return props.data.refetch();
  };

  const getFilesForNewProject = filesToUpload => {
    const { extensions } = type;
    return filesToUpload.filter( file => extensions.includes( getFileExt( file.input.name ) ) );
  };

  const getFilesForExistingProject = files => {
    const { extensions } = type;
    return files.filter( file => extensions.includes( getFileExt( file.filename ) ) );
  };

  const getNoFilesMessage = ( hl = 'files' ) => ( projectId ? `Click the 'Edit' link to add ${hl.toLowerCase()}` : 'No file to upload' );

  const fetchFiles = data => {
    const { filesToUpload } = props;

    if ( !isEmpty( data ) && data.projectFiles ) {
      const { supportFiles, thumbnails } = data.projectFiles;
      const files = [...supportFiles, ...thumbnails];
      return getFilesForExistingProject( files );
    }

    if ( filesToUpload ) {
      return getFilesForNewProject( filesToUpload );
    }

    return [];
  };

  const [supFiles, setSupFiles] = useState( [] );

  useEffect( () => {
    setSupFiles( fetchFiles( props.data ) );
  }, [props.data] );


  const renderSupportItem = item => {
    const { type: fileType } = props;

    return (
      <SupportItem
        key={ `${fileType}-${item.id}` }
        item={ item }
      />
    );
  };

  return (
    <Fragment>
      <h3>{ `${headline}` }
        <IconPopup
          message={ popupMsg }
          iconSize="small"
          iconType="info circle"
          popupSize="mini"
        />
        { projectId
          && (
            <EditSupportFiles
              supportFiles={ supFiles }
              extensions={ type.extensions }
              save={ handleSave }
            />
          )
        }
      </h3>
      <ul>
        { supFiles.length
          ? sortBy( supFiles, file => file.language.displayName ).map( renderSupportItem )
          : ( <li style={ { fontSize: '0.875em' } }>{ getNoFilesMessage( headline ) }</li> )
        }
      </ul>
    </Fragment>
  );
};


SupportFileTypeList.propTypes = {
  config: PropTypes.object.isRequired,
  projectId: PropTypes.string,
  type: PropTypes.string,
  data: PropTypes.object,
  save: PropTypes.func,
  filesToUpload: PropTypes.array, // from redux
};

const mapStateToProps = state => ( {
  filesToUpload: state.upload.filesToUpload
} );

// todo: video specific code needs to be removed
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

// export unconnected component to test in isolation
export { SupportFileTypeList };
