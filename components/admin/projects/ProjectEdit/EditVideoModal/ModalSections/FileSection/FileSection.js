/**
 *
 * FileSection
 *
 */
import React, { useContext } from 'react';
import gql from 'graphql-tag';
import { Icon } from 'semantic-ui-react';
import { Query } from 'react-apollo';

import FileSidebar from 'components/admin/projects/ProjectEdit/EditVideoModal/ModalSections/FileSidebar/FileSidebar';
import FileDataForm from 'components/admin/projects/ProjectEdit/EditVideoModal/ModalForms/FileDataForm/FileDataForm';
import Loader from 'components/admin/projects/ProjectEdit/EditVideoModal/Loader/Loader';
import { EditSingleProjectItemContext } from 'components/admin/projects/ProjectEdit/EditSingleProjectItem/EditSingleProjectItem';

import './FileSection.scss';

const VIDEO_UNIT_QUERY = gql`
  query VIDEO_UNIT_QUERY( $id: ID! ) {
    unit: videoUnit( id: $id ) {
      id
      files {
        id
      }
      language {
        id
        displayName
        locale
      }
    }
  } 
`;

const FileSection = () => {
  const {
    language, selectedFile, selectedProject, selectedUnit, setLanguage, setSelectedFile
  } = useContext( EditSingleProjectItemContext );

  return (
    <Query query={ VIDEO_UNIT_QUERY } variables={ { id: selectedUnit } }>
      { ( { loading, error, data } ) => {
        if ( error ) return 'Error!';
        if ( loading || !data ) return <Loader height="402px" text="Loading the file data..." />;

        const { unit } = data;
        const lang = unit && unit.language ? unit.language : { id: '', displayName: '', locale: '' };
        if ( lang && !language ) setLanguage( lang );

        const files = unit && unit.files ? unit.files : [];
        if ( Array.isArray( files ) && files.length === 0 ) {
          return (
            <div className="commons-loader-container" style={ { height: '402px' } }>
              <Icon color="red" name="exclamation triangle" size="large" />
              <p>No files in this unit...</p>
            </div>
          );
        }
        if ( files[0] && files[0].id && !selectedFile ) setSelectedFile( files[0].id );

        return (
          <section className="edit-file">
            <h4>Video Files</h4>
            <div className="edit-file-form-container">
              <FileSidebar />
              <FileDataForm
                fileCount={ files.length }
                language={ language }
                selectedFile={ selectedFile }
                selectedProject={ selectedProject }
              />
            </div>
          </section>
        );
      } }
    </Query>
  );
};

export default FileSection;
export { VIDEO_UNIT_QUERY };
